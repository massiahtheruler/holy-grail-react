import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
const HITS_PER_PAGE = 16;
const RESULTS_PER_PAGE = 6;
const FEATURED_QUERIES = ["yeezy", "jordan", "dunk", "new balance"];
const MIN_LOADING_MS = 500;
const SKELETON_COUNT = 6;

const fixImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("//")) return `https:${url}`;
  return url;
};

const getImages = (item) => {
  const images = [];

  if (item.featured_image) images.push(fixImageUrl(item.featured_image));
  if (item.preview_image?.src) images.push(fixImageUrl(item.preview_image.src));
  if (item.src) images.push(fixImageUrl(item.src));

  if (Array.isArray(item.images)) {
    for (const image of item.images) {
      if (typeof image === "string") images.push(fixImageUrl(image));
      if (image && typeof image === "object") {
        images.push(fixImageUrl(image.src || image.url || image.image));
      }
    }
  }

  if (Array.isArray(item.media)) {
    for (const image of item.media) {
      if (image && typeof image === "object") {
        images.push(fixImageUrl(image.src || image.url || image.preview_image?.src));
      }
    }
  }

  return [...new Set(images.filter(Boolean))];
};

const getName = (item, index) => {
  return item.name || item.productName || item.handle || item.slug || item.sku || item.title || `Result ${index + 1}`;
};

const getSubtitle = (item) => {
  if (typeof item.description === "string" && item.description.trim()) {
    return item.description.slice(0, 120);
  }

  return item.brand || item.vendor || item.sku || item.product_type || "";
};

const collectResults = (data) => {
  const found = [];

  const search = (value) => {
    if (Array.isArray(value)) {
      for (const item of value) search(item);
      return;
    }

    if (!value || typeof value !== "object") return;

    if (getImages(value).length || value.name || value.title || value.productName) {
      found.push(value);
    }

    for (const key in value) {
      search(value[key]);
    }
  };

  search(data);
  return found;
};

const fetchSearchData = async (query, page = 1) => {
  const url = `https://${API_HOST}/search/v2?query=${encodeURIComponent(query)}&hitsPerPage=${HITS_PER_PAGE}&page=${page}&sortBy=count&region=US&currency=USD`;

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
    throw new Error(data.message || "Search failed");
  }

  return data;
};

const preventDefault = (event) => {
  event.preventDefault();
};

const wait = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const Search = ({ onThemeToggle, cartCount = 0, onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [selectedShoeIndex, setSelectedShoeIndex] = useState(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const submittedQuery = (searchParams.get("query") || "").trim();

  const totalPages = Math.max(1, Math.ceil(results.length / RESULTS_PER_PAGE));
  const pageStart = (currentPage - 1) * RESULTS_PER_PAGE;
  const currentResults = results.slice(pageStart, pageStart + RESULTS_PER_PAGE);

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

  const handleAddCardToCart = (item, index) => {
    if (!onAddToCart) return;
    onAddToCart(buildCartItem(item, index));
  };

  const handleAddCurrentShoeToCart = () => {
    if (!selectedShoe || selectedShoeIndex === -1 || !onAddToCart) return;
    onAddToCart(buildCartItem(selectedShoe, selectedShoeIndex));
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

  const runSearch = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cleanQuery = String(formData.get("query") || "").trim();

    if (!cleanQuery) {
      setSearchParams({});
      return;
    }

    setSearchParams({ query: cleanQuery });
  };

  const goToPreviousPage = () => {
    setCurrentPage((current) => Math.max(1, current - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((current) => Math.min(totalPages, current + 1));
  };

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      setError("");
      setCurrentPage(1);

      try {
        if (!submittedQuery) {
          const [responses] = await Promise.all([
            Promise.all(
              FEATURED_QUERIES.map((featuredQuery) =>
                fetchSearchData(featuredQuery, 1),
              ),
            ),
            wait(MIN_LOADING_MS),
          ]);
          const featuredResults = [];

          for (const response of responses) {
            const items = collectResults(response).slice(0, 6);
            featuredResults.push(...items);
          }

          setResults(featuredResults);
          return;
        }

        const [data] = await Promise.all([
          fetchSearchData(submittedQuery, 1),
          wait(MIN_LOADING_MS),
        ]);
        const foundResults = collectResults(data);
        setResults(foundResults);
      } catch (err) {
        setError(err.message || "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [submittedQuery]);

  return (
    <>
      <FixedActions onThemeClick={onThemeToggle} onContactClick={openContactModal} cartCount={cartCount} />

      <section id="search__header" className="page-section page-section--1">
        <div className="container header__container search__header--container">
          <div className="row header__row search__header--row">
            <figure className="search__header--banner">
              <img src="/assets/high-resolution-color-logo (3)-Photoroom.png" className="banner__side" alt="" />
              <img className="search__banner--img" src="/assets/new-design (2).png" alt="" />
              <img src="/assets/color-est-layout (1)-Photoroom.png" className="banner__side" alt="" />
            </figure>
          </div>
        </div>
      </section>

      <section className="search-page page-section page-section--2">
        <div className="container search__container">
          <div className="row search__row">
            <div className="search__hero">
              <img src="/assets/download (1).png" className="search__header" alt="" />
              <h1 className="search__title">Search Grails</h1>
            </div>

            <div className="search-page__form--spot">
              <div className="back__button-lo">
                <Link className="search-page__home" to="/">
                  Back Home
                </Link>
              </div>

              <form
                key={submittedQuery || "featured-search"}
                className="search-page__form"
                onSubmit={runSearch}
              >
                <input
                  id="grail__search"
                  className="grail__search"
                  type="search"
                  name="query"
                  defaultValue={submittedQuery}
                  placeholder="Search sneakers, brands, drops"
                />
                <button className="search_btn" type="submit">
                  Search
                </button>
              </form>
            </div>

            <p className="shoe__count">
              Showing <span>{results.length}</span> results
            </p>

            <div className="shoe__pages">
              <button type="button" onClick={goToPreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button type="button" onClick={goToNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>

            <div className="shoe-list">
              {loading &&
                Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <div key={`search-skeleton-${index}`} className="shoe shoe--loading">
                    <div className="skeleton skeleton__image"></div>
                    <div className="skeleton skeleton__line skeleton__line--title"></div>
                    <div className="skeleton skeleton__line"></div>
                    <div className="skeleton skeleton__line"></div>
                  </div>
                ))}
              {!loading && error && <p>{error}</p>}
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
                      <div className="shoe__title">{name}</div>
                    </button>
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
        aboutTitle="Search, Save The Feel"
        aboutContent={
          <>
            Stop the hunt. If it&apos;s worth having, it&apos;s already here. King Massiah&apos;s Holy Grails is the final destination for anyone tired of chasing <span className="line">goats</span>. My fault. Ahem. <b>GHOSTS</b> across a dozen different sites.
          </>
        }
        formText={<>Ask a question without leaving your search results.</>}
      />
    </>
  );
};

export default Search;
