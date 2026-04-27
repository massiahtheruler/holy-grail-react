const API_HOST = "kickscrew-sneakers-data.p.rapidapi.com";
const API_KEY = "732b5f336bmshb2f878b725963c2p1df8eajsn8ca303dc62fd";
const DEFAULT_PRODUCT_ID = "7265091813571";
const CURRENCY = "USD";
const MAX_CARDS = 50;

const shoeList = document.querySelector(".shoe-list");
const countText = document.querySelector("[data-shoe-count]");
const pageText = document.querySelector("[data-page-info]");
const prevButton = document.querySelector("[data-prev-page]");
const nextButton = document.querySelector("[data-next-page]");
const modal = document.querySelector("[data-shoe-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalSizes = document.querySelector("[data-modal-sizes]");
const modalMeta = document.querySelector("[data-modal-meta]");
const modalCount = document.querySelector("[data-modal-count]");
const modalCardCount = document.querySelector("[data-modal-card-count]");
const contactModal = document.querySelector("[data-contact-modal]");
let allCards = [];
let cards = [];
let currentPage = 1;
let cardImageIndexes = {};
let openModalIndex = -1;

function showPageMotion() {
    document.body.classList.add("page-ready");
}

function makeLoadingCards(total = 6) {
    return Array(total)
        .fill("")
        .map(() => `
            <div class="shoe shoe--loading">
                <div class="skeleton skeleton__image"></div>
                <div class="skeleton skeleton__line skeleton__line--title"></div>
                <div class="skeleton skeleton__line"></div>
            </div>
        `)
        .join("");
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function toggleContrast() {
    document.body.classList.toggle("dark-theme");
}

function syncBodyScrollLock() {
    const shopOpen = modal?.classList.contains("modal--open");
    const contactOpen = contactModal?.classList.contains("contact-panel--open");
    document.body.classList.toggle("body--modal-open", Boolean(shopOpen || contactOpen));
}

function toggleContactModal() {
    if (!contactModal) {
        return;
    }

    contactModal.classList.toggle("contact-panel--open");
    syncBodyScrollLock();
}

function closeContactModal() {
    if (!contactModal) {
        return;
    }

    contactModal.classList.remove("contact-panel--open");
    syncBodyScrollLock();
}

function contact(event) {
    event.preventDefault();

    const loading = contactModal?.querySelector(".modal__overlay--load");
    const success = contactModal?.querySelector(".modal__overlay--success");

    if (!window.emailjs) {
        alert("Email service is not loaded right now.");
        return;
    }

    success?.classList.remove("modal__overlay--visible");
    loading?.classList.add("modal__overlay--visible");

    window.emailjs.sendForm(
        "service_isnormh",
        "template_1s2j1el",
        event.target,
        "ZCV5aL5wDiIB1JwGY"
    ).then(() => {
        loading?.classList.remove("modal__overlay--visible");
        success?.classList.add("modal__overlay--visible");
    }).catch(() => {
        loading?.classList.remove("modal__overlay--visible");
        alert("The email service is temporarily unavailable.");
    });
}

function moveBackground(event) {
    const shapes = document.querySelectorAll(".shape");

    if (!shapes.length) {
        return;
    }

    const x = event.clientX / 20;
    const y = event.clientY / 20;

    for (let i = 0; i < shapes.length; i++) {
        const direction = i % 2 === 0 ? 1 : -1;
        shapes[i].style.transform = `translate(${x * direction}px, ${y * direction}px)`;
    }
}

function fixImageUrl(url) {
    if (!url || typeof url !== "string") {
        return "";
    }

    if (url.startsWith("//")) {
        return `https:${url}`;
    }

    return url;
}

function getImages(item) {
    const imageList = [];

    if (item.featured_image) {
        imageList.push(fixImageUrl(item.featured_image));
    }

    if (item.preview_image && item.preview_image.src) {
        imageList.push(fixImageUrl(item.preview_image.src));
    }

    if (item.src) {
        imageList.push(fixImageUrl(item.src));
    }

    if (Array.isArray(item.images)) {
        for (const image of item.images) {
            if (typeof image === "string") {
                imageList.push(fixImageUrl(image));
            }

            if (image && typeof image === "object") {
                imageList.push(fixImageUrl(image.src || image.url || image.image));
            }
        }
    }

    if (Array.isArray(item.media)) {
        for (const image of item.media) {
            if (image && typeof image === "object") {
                imageList.push(fixImageUrl(image.src || image.url || image.preview_image?.src));
            }
        }
    }

    return [...new Set(imageList.filter(Boolean))];
}

function getName(item, index) {
    return (
        item.name ||
        item.productName ||
        item.handle ||
        item.slug ||
        item.sku ||
        item.title ||
        `Featured Item ${index + 1}`
    );
}

function getSizes(item) {
    if (Array.isArray(item.sizes) && item.sizes.length) {
        return item.sizes.join(", ");
    }

    if (Array.isArray(item.options)) {
        for (const option of item.options) {
            if (option && Array.isArray(option.values) && option.values.length) {
                return option.values.join(", ");
            }
        }
    }

    if (Array.isArray(item.variants)) {
        const sizes = item.variants
            .map((variant) => variant.option1 || variant.size || variant.title)
            .filter(Boolean);

        if (sizes.length) {
            return [...new Set(sizes)].join(", ");
        }
    }

    if (typeof item.size === "string" && item.size.trim()) {
        return item.size;
    }

    return "";
}

function getMeta(item) {
    const lines = [];

    if (item.brand) lines.push(`Brand: ${item.brand}`);
    if (item.vendor) lines.push(`Vendor: ${item.vendor}`);
    if (item.sku) lines.push(`SKU: ${item.sku}`);
    if (item.id) lines.push(`ID: ${item.id}`);

    return lines.join(" | ");
}

function getAudienceText(item, index) {
    return [
        getName(item, index),
        getSizes(item),
        item.title,
        item.description,
        item.product_type,
        item.tags,
        item.category
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function cardMatchesAudience(item, index, filters) {
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
}

function getSelectedFilters() {
    return {
        men: document.querySelector('[data-filter="men"]')?.checked,
        women: document.querySelector('[data-filter="women"]')?.checked,
        kids: document.querySelector('[data-filter="kids"]')?.checked
    };
}

function updateAudienceFilters() {
    const filters = getSelectedFilters();

    cards = allCards.filter((item, index) => cardMatchesAudience(item, index, filters));
    currentPage = 1;
    renderCards();
}

function collectCards(data) {
    const foundItems = [];

    function search(value) {
        if (Array.isArray(value)) {
            for (const item of value) {
                search(item);
            }
            return;
        }

        if (!value || typeof value !== "object") {
            return;
        }

        if (getImages(value).length > 0) {
            foundItems.push(value);
        }

        for (const key in value) {
            search(value[key]);
        }
    }

    search(data);

    foundItems.sort((a, b) => getImages(b).length - getImages(a).length);
    return foundItems.slice(0, MAX_CARDS);
}

function getCardsPerPage() {
    if (window.innerWidth >= 1200) {
        return 12;
    }

    if (window.innerWidth >= 800) {
        return 9;
    }

    return 6;
}

function getCurrentCardImage(cardIndex) {
    const item = cards[cardIndex];
    const images = getImages(item);
    const imageIndex = cardImageIndexes[cardIndex] || 0;
    return images[imageIndex] || "";
}

function createCardHtml(item, cardIndex) {
    const images = getImages(item);
    const name = getName(item, cardIndex);
    const sizes = getSizes(item);
    const currentImage = getCurrentCardImage(cardIndex);
    const currentImageNumber = (cardImageIndexes[cardIndex] || 0) + 1;

    return `
        <div class="shoe shoe--clickable" onclick="openShopModal(${cardIndex})">
            <div class="shoe__images">
                <img class="shoe__img" src="${currentImage}" alt="${name}">
                ${images.length > 1 ? `
                    <div class="shoe__image-controls">
                        <button class="shoe__control-btn" type="button" onclick="changeImage(event, ${cardIndex}, -1)">Prev</button>
                        <span>${currentImageNumber} / ${images.length}</span>
                        <button class="shoe__control-btn" type="button" onclick="changeImage(event, ${cardIndex}, 1)">Next</button>
                    </div>
                ` : ""}
            </div>
            <div class="shoe__title">${name}</div>
            ${sizes ? `<p class="shoe__sizes">Sizes: ${sizes}</p>` : ""}
        </div>
    `;
}

function updatePageText() {
    const totalPages = Math.max(1, Math.ceil(cards.length / getCardsPerPage()));

    if (countText) {
        countText.textContent = cards.length;
    }

    if (pageText) {
        pageText.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    if (prevButton) {
        prevButton.disabled = currentPage === 1;
    }

    if (nextButton) {
        nextButton.disabled = currentPage === totalPages;
    }
}

function renderCards() {
    if (!shoeList) {
        return;
    }

    const cardsPerPage = getCardsPerPage();
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const currentCards = cards.slice(start, end);

    if (!currentCards.length) {
        shoeList.innerHTML = `<div class="shoe"><div class="shoe__title">No image cards found</div></div>`;
        updatePageText();
        return;
    }

    shoeList.innerHTML = currentCards
        .map((item, index) => createCardHtml(item, start + index))
        .join("");

    updatePageText();
}

function changeImage(event, cardIndex, changeAmount) {
    event.stopPropagation();

    const images = getImages(cards[cardIndex]);

    if (images.length < 2) {
        return;
    }

    let nextIndex = (cardImageIndexes[cardIndex] || 0) + changeAmount;

    if (nextIndex < 0) {
        nextIndex = images.length - 1;
    }

    if (nextIndex >= images.length) {
        nextIndex = 0;
    }

    cardImageIndexes[cardIndex] = nextIndex;
    renderCards();

    if (openModalIndex === cardIndex) {
        renderShopModal();
    }
}

function renderShopModal() {
    const item = cards[openModalIndex];

    if (!item) {
        return;
    }

    const images = getImages(item);
    const imageIndex = cardImageIndexes[openModalIndex] || 0;

    modalImage.src = images[imageIndex] || "";
    modalImage.alt = getName(item, openModalIndex);
    modalTitle.textContent = getName(item, openModalIndex);
    modalSizes.textContent = getSizes(item) ? `Sizes: ${getSizes(item)}` : "Sizes unavailable";
    modalMeta.textContent = getMeta(item) || "Recommendation entry with image data.";
    modalCount.textContent = `${imageIndex + 1} / ${images.length}`;
    if (modalCardCount) {
        modalCardCount.textContent = `${openModalIndex + 1} / ${cards.length}`;
    }
}

function openShopModal(cardIndex) {
    openModalIndex = cardIndex;
    renderShopModal();
    modal.classList.add("modal--open");
    syncBodyScrollLock();
}

function closeShopModal() {
    modal.classList.remove("modal--open");
    syncBodyScrollLock();
}

function changeShopModalImage(changeAmount) {
    if (openModalIndex === -1) {
        return;
    }

    const images = getImages(cards[openModalIndex]);

    if (images.length < 2) {
        return;
    }

    let nextIndex = (cardImageIndexes[openModalIndex] || 0) + changeAmount;

    if (nextIndex < 0) {
        nextIndex = images.length - 1;
    }

    if (nextIndex >= images.length) {
        nextIndex = 0;
    }

    cardImageIndexes[openModalIndex] = nextIndex;
    renderShopModal();
    renderCards();
}

function changeShopModalCard(changeAmount) {
    if (!cards.length) {
        return;
    }

    let nextIndex = openModalIndex + changeAmount;

    if (nextIndex < 0) {
        nextIndex = cards.length - 1;
    }

    if (nextIndex >= cards.length) {
        nextIndex = 0;
    }

    openModalIndex = nextIndex;
    renderShopModal();
}

async function renderShoes(productId = DEFAULT_PRODUCT_ID) {
    if (!shoeList) {
        return;
    }

    shoeList.innerHTML = makeLoadingCards(getCardsPerPage());

    const url = `https://${API_HOST}/product/recomendation?productId=${productId}&currency=${CURRENCY}`;
    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
            "Content-Type": "application/json"
        }
    };

    try {
        const response = await fetch(url, options);
        const text = await response.text();
        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.message || "Could not load recommendations");
        }

        allCards = collectCards(data);
        cards = allCards;
        currentPage = 1;
        cardImageIndexes = {};
        updateAudienceFilters();
    } catch (error) {
        shoeList.innerHTML = `<div class="shoe"><div class="shoe__title">Error</div><p class="shoe__sizes">${error.message}</p></div>`;
    }
}

function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderCards();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(cards.length / getCardsPerPage());

    if (currentPage < totalPages) {
        currentPage++;
        renderCards();
    }
}

window.scrollToTop = scrollToTop;
window.toggleContrast = toggleContrast;
window.toggleContactModal = toggleContactModal;
window.contact = contact;
window.closeContactModal = closeContactModal;
window.goToPreviousPage = goToPreviousPage;
window.goToNextPage = goToNextPage;
window.changeImage = changeImage;
window.openShopModal = openShopModal;
window.closeShopModal = closeShopModal;
window.changeShopModalImage = changeShopModalImage;
window.changeShopModalCard = changeShopModalCard;
window.updateAudienceFilters = updateAudienceFilters;

document.addEventListener("DOMContentLoaded", () => {
    showPageMotion();
    renderShoes();
});

document.addEventListener("mousemove", moveBackground);

window.addEventListener("resize", () => {
    const totalPages = Math.max(1, Math.ceil(cards.length / getCardsPerPage()));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    renderCards();
});
