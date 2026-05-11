const API_HOST = "kickscrew-sneakers-data.p.rapidapi.com";
const API_KEY = "732b5f336bmshb2f878b725963c2p1df8eajsn8ca303dc62fd";
const HITS_PER_PAGE = 16;
const SEARCH_PAGES_TO_LOAD = 3;

const searchInput = document.querySelector("[data-search-input]");
const resultsList = document.querySelector("[data-search-results]");
const countText = document.querySelector("[data-search-count]");
const pageText = document.querySelector("[data-search-page]");
const prevButton = document.querySelector("[data-search-prev]");
const nextButton = document.querySelector("[data-search-next]");
const modal = document.querySelector("[data-search-modal]");
const modalImage = document.querySelector("[data-search-modal-image]");
const modalTitle = document.querySelector("[data-search-modal-title]");
const modalSubtitle = document.querySelector("[data-search-modal-subtitle]");
const modalMeta = document.querySelector("[data-search-modal-meta]");
const modalCount = document.querySelector("[data-search-modal-count]");
const modalCardCount = document.querySelector("[data-search-modal-card-count]");
const contactModal = document.querySelector("[data-contact-modal]");

let currentQuery = "";
let currentPage = 1;
let results = [];
let imageIndexes = {};
let openModalIndex = -1;
let totalPages = 1;
const FEATURED_QUERIES = ["yeezy", "jordan", "dunk", "new balance"];

function showPageMotion() {
    document.body.classList.add("page-ready");
}

function makeLoadingCards(total = 8) {
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

function toggleContrast() {
    document.body.classList.toggle("dark-theme");
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function syncBodyScrollLock() {
    const searchOpen = modal?.classList.contains("modal--open");
    const contactOpen = contactModal?.classList.contains("contact-panel--open");
    document.body.classList.toggle("body--modal-open", Boolean(searchOpen || contactOpen));
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
    const images = [];

    if (item.featured_image) images.push(fixImageUrl(item.featured_image));
    if (item.preview_image?.src) images.push(fixImageUrl(item.preview_image.src));
    if (item.src) images.push(fixImageUrl(item.src));

    if (Array.isArray(item.images)) {
        for (const image of item.images) {
            if (typeof image === "string") images.push(fixImageUrl(image));
            if (image && typeof image === "object") images.push(fixImageUrl(image.src || image.url || image.image));
        }
    }

    if (Array.isArray(item.media)) {
        for (const image of item.media) {
            if (image && typeof image === "object") images.push(fixImageUrl(image.src || image.url || image.preview_image?.src));
        }
    }

    return [...new Set(images.filter(Boolean))];
}

function getName(item, index) {
    return item.name || item.productName || item.handle || item.slug || item.sku || item.title || `Result ${index + 1}`;
}

function getSubtitle(item) {
    if (typeof item.description === "string" && item.description.trim()) {
        return item.description.slice(0, 120);
    }

    return item.brand || item.vendor || item.sku || item.product_type || "";
}

function getMeta(item) {
    return item.sku || item.slug || item.handle || item.id || "";
}

function collectResults(data) {
    const found = [];

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

        if (getImages(value).length || value.name || value.title || value.productName) {
            found.push(value);
        }

        for (const key in value) {
            search(value[key]);
        }
    }

    search(data);
    return found.sort((a, b) => {
        const aImageCount = getImages(a).length;
        const bImageCount = getImages(b).length;
        const aHasCarousel = aImageCount > 1;
        const bHasCarousel = bImageCount > 1;

        if (aHasCarousel !== bHasCarousel) {
            return bHasCarousel - aHasCarousel;
        }

        return bImageCount - aImageCount;
    });
}

async function fetchSearchData(query, page = 1) {
    const url = `https://${API_HOST}/search/v2?query=${encodeURIComponent(query)}&hitsPerPage=${HITS_PER_PAGE}&page=${page}&sortBy=count&region=US&currency=USD`;
    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
            "Content-Type": "application/json"
        }
    };

    const response = await fetch(url, options);
    const text = await response.text();
    const data = JSON.parse(text);

    if (!response.ok) {
        throw new Error(data.message || "Search failed");
    }

    return data;
}

function makeCard(item, index) {
    const images = getImages(item);
    const currentImage = images[imageIndexes[index] || 0] || "";
    const name = getName(item, index);
    const subtitle = getSubtitle(item);
    const currentImageNumber = (imageIndexes[index] || 0) + 1;

    return `
        <div class="shoe shoe--clickable" onclick="openSearchModal(${index})">
            ${currentImage ? `<img class="shoe__img" src="${currentImage}" alt="${name}">` : ""}
            ${images.length > 1 ? `
                <div class="shoe__image-controls">
                    <button class="shoe__control-btn" type="button" onclick="changeSearchCardImage(event, ${index}, -1)">Prev</button>
                    <span>${currentImageNumber} / ${images.length}</span>
                    <button class="shoe__control-btn" type="button" onclick="changeSearchCardImage(event, ${index}, 1)">Next</button>
                </div>
            ` : ""}
            <div class="shoe__title">${name}</div>
            ${subtitle ? `<p class="shoe__sizes">${subtitle}</p>` : ""}
        </div>
    `;
}

function updatePageText() {
    totalPages = Math.max(1, Math.ceil(results.length / getResultsPerPage()));
    if (countText) countText.textContent = results.length;
    if (pageText) pageText.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevButton) prevButton.disabled = currentPage === 1;
    if (nextButton) nextButton.disabled = currentPage === totalPages;
}

function getResultsPerPage() {
    if (window.innerWidth >= 1200) {
        return 12;
    }

    if (window.innerWidth >= 800) {
        return 9;
    }

    return 6;
}

function renderResults() {
    if (!results.length) {
        resultsList.innerHTML = `<div class="shoe"><div class="shoe__title">No matches found</div><p class="shoe__sizes">Try a different word or a broader search.</p></div>`;
        updatePageText();
        return;
    }

    const resultsPerPage = getResultsPerPage();
    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const currentResults = results.slice(start, end);

    resultsList.innerHTML = currentResults
        .map((item, index) => makeCard(item, start + index))
        .join("");

    updatePageText();
}

function renderModal() {
    const item = results[openModalIndex];

    if (!item) {
        return;
    }

    const images = getImages(item);
    const imageIndex = imageIndexes[openModalIndex] || 0;

    modalImage.src = images[imageIndex] || "";
    modalImage.alt = getName(item, openModalIndex);
    modalTitle.textContent = getName(item, openModalIndex);
    modalSubtitle.textContent = getSubtitle(item) || "Search result from the API";
    modalMeta.textContent = getMeta(item);
    modalCount.textContent = `${imageIndex + 1} / ${images.length}`;
    if (modalCardCount) {
        modalCardCount.textContent = `${openModalIndex + 1} / ${results.length}`;
    }
}

function openSearchModal(index) {
    openModalIndex = index;
    renderModal();
    modal.classList.add("modal--open");
    syncBodyScrollLock();
}

function closeSearchModal() {
    modal.classList.remove("modal--open");
    syncBodyScrollLock();
}

function changeSearchModalImage(changeAmount) {
    const images = getImages(results[openModalIndex]);

    if (images.length < 2) {
        return;
    }

    let nextIndex = (imageIndexes[openModalIndex] || 0) + changeAmount;

    if (nextIndex < 0) nextIndex = images.length - 1;
    if (nextIndex >= images.length) nextIndex = 0;

    imageIndexes[openModalIndex] = nextIndex;
    renderModal();
    renderResults();
}

function changeSearchModalCard(changeAmount) {
    if (!results.length) {
        return;
    }

    let nextIndex = openModalIndex + changeAmount;

    if (nextIndex < 0) nextIndex = results.length - 1;
    if (nextIndex >= results.length) nextIndex = 0;

    openModalIndex = nextIndex;
    renderModal();
}

function changeSearchCardImage(event, index, changeAmount) {
    event.stopPropagation();

    const images = getImages(results[index]);

    if (images.length < 2) {
        return;
    }

    let nextIndex = (imageIndexes[index] || 0) + changeAmount;

    if (nextIndex < 0) nextIndex = images.length - 1;
    if (nextIndex >= images.length) nextIndex = 0;

    imageIndexes[index] = nextIndex;
    renderResults();
}

async function searchProducts(query, page = 1) {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
        loadFeaturedResults(page);
        return;
    }

    currentQuery = cleanQuery;
    currentPage = 1;
    totalPages = 1;
    imageIndexes = {};
    resultsList.innerHTML = makeLoadingCards(HITS_PER_PAGE);

    try {
        const responses = await Promise.all(
            Array.from({ length: SEARCH_PAGES_TO_LOAD }, (_, index) => fetchSearchData(cleanQuery, index + 1))
        );

        const allResults = [];

        for (const data of responses) {
            allResults.push(...collectResults(data));
        }

        results = allResults;
        currentPage = Math.min(page, Math.max(1, Math.ceil(results.length / getResultsPerPage())));
        renderResults();
    } catch (error) {
        resultsList.innerHTML = `<div class="shoe"><div class="shoe__title">Search error</div><p class="shoe__sizes">${error.message}</p></div>`;
        results = [];
        totalPages = 1;
        updatePageText();
    }
}

async function loadFeaturedResults(page = 1) {
    currentQuery = "";
    currentPage = 1;
    totalPages = 1;
    imageIndexes = {};
    resultsList.innerHTML = makeLoadingCards(HITS_PER_PAGE);

    try {
        const responses = await Promise.all(
            FEATURED_QUERIES.map((query) => fetchSearchData(query, 1))
        );

        const featuredResults = [];

        for (const response of responses) {
            const items = collectResults(response).slice(0, 6);
            featuredResults.push(...items);
        }

        results = featuredResults;
        currentPage = Math.min(page, Math.max(1, Math.ceil(results.length / getResultsPerPage())));
        renderResults();
    } catch (error) {
        resultsList.innerHTML = `<div class="shoe"><div class="shoe__title">Search for something</div><p class="shoe__sizes">Try Yeezy, Jordan, Nike, Dunk, or a colorway.</p></div>`;
        results = [];
        updatePageText();
    }
}

function runSearch(event) {
    event.preventDefault();

    const query = searchInput.value.trim();
    const url = new URL(window.location.href);
    url.searchParams.set("query", query);
    url.searchParams.set("page", "1");
    window.history.replaceState({}, "", url);
    searchProducts(query, 1);
}

function changeSearchPage(changeAmount) {
    const nextPage = currentPage + changeAmount;

    if (nextPage < 1 || nextPage > totalPages) {
        return;
    }

    currentPage = nextPage;
    const url = new URL(window.location.href);
    if (currentQuery) {
        url.searchParams.set("query", currentQuery);
    } else {
        url.searchParams.delete("query");
    }
    url.searchParams.set("page", String(nextPage));
    window.history.replaceState({}, "", url);
    renderResults();
}

window.runSearch = runSearch;
window.changeSearchPage = changeSearchPage;
window.scrollToTop = scrollToTop;
window.toggleContrast = toggleContrast;
window.toggleContactModal = toggleContactModal;
window.closeContactModal = closeContactModal;
window.contact = contact;
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.changeSearchModalImage = changeSearchModalImage;
window.changeSearchModalCard = changeSearchModalCard;
window.changeSearchCardImage = changeSearchCardImage;

document.addEventListener("DOMContentLoaded", () => {
    showPageMotion();
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query") || "";
    const page = Number(params.get("page")) || 1;

    if (searchInput) {
        searchInput.value = query;
    }

    searchProducts(query, page);
});

window.addEventListener("resize", () => {
    const nextTotalPages = Math.max(1, Math.ceil(results.length / getResultsPerPage()));

    if (currentPage > nextTotalPages) {
        currentPage = nextTotalPages;
    }

    renderResults();
});
