import { useEffect } from "react";

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

const getName = (item, index = 0) => {
  return item?.name || item?.productName || item?.handle || item?.slug || item?.sku || item?.title || `Result ${index + 1}`;
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

const getMeta = (item) => {
  const lines = [];
  if (item?.brand) lines.push(`Brand: ${item.brand}`);
  if (item?.vendor) lines.push(`Vendor: ${item.vendor}`);
  if (item?.sku) lines.push(`SKU: ${item.sku}`);
  if (item?.id) lines.push(`ID: ${item.id}`);
  return lines.join(" | ");
};

const lockPageScroll = () => {
  const scrollY = window.scrollY;
  document.body.dataset.scrollLockY = String(scrollY);
  document.body.classList.add("body--modal-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
};

const unlockPageScroll = () => {
  const scrollY = Number(document.body.dataset.scrollLockY || "0");
  document.body.classList.remove("body--modal-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  delete document.body.dataset.scrollLockY;
  window.scrollTo(0, scrollY);
};

const ShoeModal = ({
  shoe,
  imageIndex,
  itemIndex = 0,
  itemCount = 1,
  onClose,
  onNextImage,
  onPrevImage,
  onNextItem,
  onPrevItem,
  onAddToCart,
}) => {
  useEffect(() => {
    if (!shoe) {
      return undefined;
    }

    lockPageScroll();

    return () => {
      unlockPageScroll();
    };
  }, [shoe]);

  const handleTiltMove = (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 6;

    card.style.transform = `perspective(1600px) rotateX(${rotateX.toFixed(
      2,
    )}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px) scale(1)`;
  };

  const resetTilt = (event) => {
    event.currentTarget.style.transform = "translateY(0) scale(1)";
  };

  if (!shoe) return null;

  const images = getImages(shoe);
  const safeIndex = images.length ? imageIndex % images.length : 0;
  const currentImage = images[safeIndex] || "";
  const title = getName(shoe);
  const sizes = getSizes(shoe);
  const meta = getMeta(shoe);

  return (
    <div className="modal shop-modal modal--open">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div
        className="modal__card"
        onMouseMove={handleTiltMove}
        onMouseLeave={resetTilt}
      >
        <div className="modal__top">
          <div className="modal__switch">
            <button className="modal__nav-btn" type="button" onClick={onPrevItem}>
              Prev Shoe
            </button>
            <span className="modal__card-count">{itemCount ? `${itemIndex + 1} / ${itemCount}` : "1 / 1"}</span>
            <button className="modal__nav-btn" type="button" onClick={onNextItem}>
              Next Shoe
            </button>
          </div>
          <button className="modal__close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <img className="modal__img" src={currentImage} alt={title} />

        <div className="modal__controls">
          <h2 className="modal__title">Angle</h2>
          <div className="modal__btns">
            <button type="button" onClick={onPrevImage}>
              Prev
            </button>
            <span>{images.length ? `${safeIndex + 1} / ${images.length}` : "0 / 0"}</span>
            <button type="button" onClick={onNextImage}>
              Next
            </button>
          </div>
        </div>

        <h2 className="modal__title">{title}</h2>
        <p className="modal__sizes">{sizes ? `Sizes: ${sizes}` : "Sizes unavailable"}</p>
        <p className="modal__meta">{meta || "Recommendation entry with image data."}</p>
        {onAddToCart && (
          <button className="modal__add" type="button" onClick={onAddToCart}>
            Add To Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ShoeModal;
