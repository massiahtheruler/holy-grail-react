import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import FixedActions from "../components/FixedActions.jsx";
import ContactModal from "../components/ContactModal.jsx";
import ShoeModal from "../components/ShoeModal.jsx";
import {
  detectAudience,
  formatCurrency,
  getDemoPriceForItem,
} from "../lib/cartPricing.js";

const API_HOST = "kickscrew-sneakers-data.p.rapidapi.com";
const API_KEY = "732b5f336bmshb2f878b725963c2p1df8eajsn8ca303dc62fd";
const DEFAULT_PRODUCT_ID = "7265091813571";
const CURRENCY = "USD";
const MAX_CARDS = 50;
const RESULTS_PER_PAGE = 6;
const MIN_LOADING_MS = 500;
const SKELETON_COUNT = 6;

const fixImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("//")) return `https:${url}`;
  return url;
};

const getImages = (item) => {
  const images = [];

  if (item?.featured_image) images.push(fixImageUrl(item.featured_image));
  if (item?.preview_image?.src) images.push(fixImageUrl(item.preview_image.src));
  if (item?.src) images.push(fixImageUrl(item.src));

  if (Array.isArray(item?.images)) {
    for (const image of item.images) {
      if (typeof image === "string") images.push(fixImageUrl(image));
      if (image && typeof image === "object") {
        images.push(fixImageUrl(image.src || image.url || image.image));
      }
    }
  }

  if (Array.isArray(item?.media)) {
    for (const image of item.media) {
      if (image && typeof image === "object") {
        images.push(fixImageUrl(image.src || image.url || image.preview_image?.src));
      }
    }
  }

  return [...new Set(images.filter(Boolean))];
};

const getName = (item, index) => {
  return item?.name || item?.productName || item?.handle || item?.slug || item?.sku || item?.title || `Featured Item ${index + 1}`;
};

const getSizes = (item) => {
  if (Array.isArray(item?.sizes) && item.sizes.length) {
    return item.sizes.join(", ");
  }

  if (Array.isArray(item?.options)) {
    for (const option of item.options) {
      if (option && Array.isArray(option.values) && option.values.length) {
        return option.values.join(", ");
      }
    }
  }

  if (Array.isArray(item?.variants)) {
    const sizes = item.variants
      .map((variant) => variant.option1 || variant.size || variant.title)
      .filter(Boolean);

    if (sizes.length) {
      return [...new Set(sizes)].join(", ");
    }
  }

  if (typeof item?.size === "string" && item.size.trim()) {
    return item.size;
  }

  return "";
};

const getSubtitle = (item) => {
  return getSizes(item) || item?.brand || item?.vendor || item?.sku || "";
};

const getAudienceText = (item, index) => {
  return [
    getName(item, index),
    getSizes(item),
    item?.title,
    item?.description,
    item?.product_type,
    item?.tags,
    item?.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const cardMatchesAudience = (item, index, filters) => {
  const text = getAudienceText(item, index);

  const isMen = text.includes(" men") || text.includes("mens") || text.includes("men's");
  const isWomen = text.includes("women") || text.includes("womens") || text.includes("women's") || text.includes("wmns");
  const isKids =
    text.includes("kids") ||
    text.includes("kid") ||
    text.includes("youth") ||
    text.includes("grade school") ||
    text.includes("gs") ||
    text.includes("preschool") ||
    text.includes("ps") ||
    text.includes("toddler") ||
    text.includes("td");

  if (!filters.men && !filters.women && !filters.kids) {
    return true;
  }

  if (filters.men && isMen) return true;
  if (filters.women && isWomen) return true;
  if (filters.kids && isKids) return true;

  return !isMen && !isWomen && !isKids;
};

const collectCards = (data) => {
  const foundItems = [];

  const search = (value) => {
    if (Array.isArray(value)) {
      for (const item of value) search(item);
      return;
    }

    if (!value || typeof value !== "object") return;

    if (getImages(value).length > 0) {
      foundItems.push(value);
    }

    for (const key in value) {
      search(value[key]);
    }
  };

  search(data);
  foundItems.sort((a, b) => getImages(b).length - getImages(a).length);
  return foundItems.slice(0, MAX_CARDS);
};

const fetchRecommendations = async (productId = DEFAULT_PRODUCT_ID) => {
  const url = `https://${API_HOST}/product/recomendation?productId=${productId}&currency=${CURRENCY}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": API_HOST,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  const data = JSON.parse(text);

  if (!response.ok) {
    throw new Error(data.message || "Could not load recommendations");
  }

  return data;
};

const preventDefault = (event) => {
  event.preventDefault();
};

const wait = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const Shop = ({ onThemeToggle, cartCount = 0, onAddToCart }) => {
  const navigate = useNavigate();
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [selectedShoeIndex, setSelectedShoeIndex] = useState(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [filters, setFilters] = useState({ men: true, women: true, kids: true });
  const [shopQuery, setShopQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const results = useMemo(() => {
    return allResults.filter((item, index) =>
      cardMatchesAudience(item, index, filters),
    );
  }, [allResults, filters]);

  const totalPages = Math.max(1, Math.ceil(results.length / RESULTS_PER_PAGE));
  const pageStart = (currentPage - 1) * RESULTS_PER_PAGE;
  const currentResults = results.slice(pageStart, pageStart + RESULTS_PER_PAGE);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError("");
      try {
        const [data] = await Promise.all([
          fetchRecommendations(),
          wait(MIN_LOADING_MS),
        ]);
        const cards = collectCards(data);
        setAllResults(cards);
      } catch (err) {
        setError(err.message || "Could not load recommendations");
        setAllResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const openContactModal = () => setIsContactOpen(true);
  const closeContactModal = () => setIsContactOpen(false);

  const openShoeModal = (shoe, index) => {
    setSelectedShoe(shoe);
    setSelectedShoeIndex(index);
    setSelectedImageIndex(0);
  };

  const closeShoeModal = () => {
    setSelectedShoe(null);
    setSelectedShoeIndex(-1);
    setSelectedImageIndex(0);
  };

  const buildCartItem = (item, index) => {
    return {
      key:
        item?.id ||
        item?.sku ||
        item?.handle ||
        item?.slug ||
        `${getName(item, index)}-${index}`,
      name: getName(item, index),
      subtitle: getSubtitle(item),
      image: getImages(item)[0] || "",
      audience: detectAudience(item, index),
      price: getDemoPriceForItem(item, index),
    };
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters((current) => ({ ...current, [name]: checked }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ men: false, women: false, kids: false });
    setCurrentPage(1);
  };

  const handleShopSearch = (event) => {
    event.preventDefault();
    const cleanQuery = shopQuery.trim();

    if (!cleanQuery) {
      navigate("/search");
      return;
    }

    navigate(`/search?query=${encodeURIComponent(cleanQuery)}`);
  };

  const handleAddCurrentShoeToCart = () => {
    if (!selectedShoe || selectedShoeIndex === -1 || !onAddToCart) return;
    onAddToCart(buildCartItem(selectedShoe, selectedShoeIndex));
  };

  const handleAddCardToCart = (item, index) => {
    if (!onAddToCart) return;
    onAddToCart(buildCartItem(item, index));
  };

  const showNextImage = () => {
    if (!selectedShoe) return;
    const total = getImages(selectedShoe).length;
    if (!total) return;
    setSelectedImageIndex((current) => (current + 1) % total);
  };

  const showPrevImage = () => {
    if (!selectedShoe) return;
    const total = getImages(selectedShoe).length;
    if (!total) return;
    setSelectedImageIndex((current) => (current - 1 + total) % total);
  };

  const showNextShoe = () => {
    if (!results.length || selectedShoeIndex === -1) return;
    const nextIndex = (selectedShoeIndex + 1) % results.length;
    setSelectedShoe(results[nextIndex]);
    setSelectedShoeIndex(nextIndex);
    setSelectedImageIndex(0);
  };

  const showPrevShoe = () => {
    if (!results.length || selectedShoeIndex === -1) return;
    const nextIndex = (selectedShoeIndex - 1 + results.length) % results.length;
    setSelectedShoe(results[nextIndex]);
    setSelectedShoeIndex(nextIndex);
    setSelectedImageIndex(0);
  };

  const goToPreviousPage = () => {
    setCurrentPage((current) => Math.max(1, current - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((current) => Math.min(totalPages, current + 1));
  };

  return (
    <>
      <FixedActions onThemeClick={onThemeToggle} onContactClick={openContactModal} cartCount={cartCount} />

      <section id="shop__header" className="page-section page-section--1">
        <div className="container header__container shop__header--container">
          <div className="row header__row shop__header--row">
            <figure className="shop__header--banner">
              <img src="/assets/high-resolution-color-logo (3)-Photoroom.png" className="banner__side" alt="" />
              <img className="shop__banner--img" src="/assets/new-design (2).png" alt="" />
              <img src="/assets/color-est-layout (1)-Photoroom.png" className="banner__side" alt="" />
            </figure>
          </div>
        </div>
      </section>

      <section className="recommendations page-section page-section--2">
        <div className="container recommendations__container">
          <div className="row recommendations__row">
            <div className="recommendations__hero">
              <div className="recommendations__media">
                <img src="/assets/clean-grid-zoom-background (1).png" className="shop__header" alt="" />
                <h1 className="shop__title">Recommendations</h1>
              </div>

              <div className="options shop__options">
                <Link to="/" className="shop__back-link">
                  ← Back
                </Link>

                <div className="shop__filters">
                  Show:
                  <label>
                    <input type="checkbox" name="men" checked={filters.men} onChange={handleFilterChange} />
                    Men
                  </label>
                  <label>
                    <input type="checkbox" name="women" checked={filters.women} onChange={handleFilterChange} />
                    Women
                  </label>
                  <label>
                    <input type="checkbox" name="kids" checked={filters.kids} onChange={handleFilterChange} />
                    Kids
                  </label>
                  <button type="button" className="shop__filters-clear" onClick={clearFilters}>
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <form className="grail__search-form shop__search-form" onSubmit={handleShopSearch}>
              <input
                type="search"
                name="query"
                className="grail__search home__search"
                placeholder="Search for a specific grail"
                value={shopQuery}
                onChange={(event) => setShopQuery(event.target.value)}
              />
              <button className="search_btn" type="submit">
                GO TO SEARCH
              </button>
            </form>

            <p className="shoe__count">
              Showing <span>{results.length}</span> recommendations
            </p>

            <div className="shoe__pages">
              <button type="button" onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button type="button" onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

            <div className="shoe-list">
              {loading &&
                Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <div key={`shop-skeleton-${index}`} className="shoe shoe--loading">
                    <div className="skeleton skeleton__image"></div>
                    <div className="skeleton skeleton__line skeleton__line--title"></div>
                    <div className="skeleton skeleton__line"></div>
                    <div className="skeleton skeleton__line"></div>
                  </div>
                ))}
              {!loading && error && <p>{error}</p>}
              {!loading && !error && !results.length && (
                <div className="shoe">
                  <div className="shoe__title">No recommendation cards found</div>
                  <p className="shoe__sizes">Try changing the audience filters or refresh the page.</p>
                </div>
              )}
              {!loading && !error && currentResults.map((item, index) => {
                const images = getImages(item);
                const absoluteIndex = pageStart + index;
                const name = getName(item, absoluteIndex);
                const subtitle = getSubtitle(item);
                const price = getDemoPriceForItem(item, absoluteIndex);

                return (
                  <article key={absoluteIndex} className="shoe shoe--card">
                    <button
                      className="shoe__open shoe--clickable"
                      type="button"
                      onClick={() => openShoeModal(item, absoluteIndex)}
                    >
                      {images[0] && <img className="shoe__img" src={images[0]} alt={name} />}
                    </button>
                    <div className="shoe__title">{name}</div>
                    {subtitle && <p className="shoe__sizes">{subtitle}</p>}
                    <div className="shoe__actions">
                      <span className="shoe__price">{formatCurrency(price)}</span>
                      <button
                        className="shoe__add"
                        type="button"
                        onClick={() => handleAddCardToCart(item, absoluteIndex)}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer
        sectionClass="page-section page-section--3"
        onContactClick={(event) => {
          preventDefault(event);
          openContactModal();
        }}
        cartCount={cartCount}
      />

      <ShoeModal
        shoe={selectedShoe}
        imageIndex={selectedImageIndex}
        itemIndex={selectedShoeIndex}
        itemCount={results.length}
        onClose={closeShoeModal}
        onNextImage={showNextImage}
        onPrevImage={showPrevImage}
        onNextItem={showNextShoe}
        onPrevItem={showPrevShoe}
        onAddToCart={handleAddCurrentShoeToCart}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={closeContactModal}
        aboutTitle="About This Grail Hunt"
        aboutContent={
          <>
            Holy Grail is the endgame for the authentic. We keep the supply chain moving for those who live the culture, not just follow it. We&apos;ve consolidated the deepest inventory of luxury footwear and streetwear so you can discover the heaviest hitters at prices that respect the hustle. Real talk, real heat. <b>Your GRAIL Ain&apos;t a FAIRYTALE</b>
          </>
        }
        formText={<>Ask a question without leaving the shop page.</>}
      />
    </>
  );
};

export default Shop;
