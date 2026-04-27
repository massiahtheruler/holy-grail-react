const RAPIDAPI_HOST = "kickscrew-sneakers-data.p.rapidapi.com";
const DEFAULT_PRODUCT_ID = "7265091813571";
const DEFAULT_CURRENCY = "USD";
const DEFAULT_RAPIDAPI_KEY = "732b5f336bmshb2f878b725963c2p1df8eajsn8ca303dc62fd";

function redirectNewPage(path = "shop.html") {
    window.location.href = path;
}

function getRecommendationsElements() {
    return {
        section: document.querySelector("[data-recommendations]"),
        status: document.querySelector("[data-recommendations-status]"),
        output: document.querySelector("[data-recommendations-output]"),
        url: document.querySelector("[data-recommendations-url]")
    };
}

function setRecommendationsMessage(statusText, outputText = "") {
    const { status, output } = getRecommendationsElements();

    if (status) {
        status.textContent = statusText;
    }

    if (output) {
        output.textContent = outputText;
    }
}

function getStoredApiKey() {
    const params = new URLSearchParams(window.location.search);
    const queryKey = params.get("rapidapiKey") || params.get("apiKey");

    if (queryKey) {
        localStorage.setItem("rapidapiKey", queryKey);
        return queryKey;
    }

    return localStorage.getItem("rapidapiKey") || DEFAULT_RAPIDAPI_KEY;
}

function loadRecommendations() {
    const { section, url } = getRecommendationsElements();

    if (!section) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId") || DEFAULT_PRODUCT_ID;
    const currency = params.get("currency") || DEFAULT_CURRENCY;
    const apiKey = getStoredApiKey();
    const endpoint = new URL(`https://${RAPIDAPI_HOST}/product/recomendation`);

    endpoint.searchParams.set("productId", productId);
    endpoint.searchParams.set("currency", currency);

    if (url) {
        url.textContent = endpoint.toString();
    }

    if (!apiKey) {
        setRecommendationsMessage(
            "Missing RapidAPI key.",
            "Open shop.html with ?productId=7265091813571&rapidapiKey=732b5f336bmshb2f878b725963c2p1df8eajsn8ca303dc62fd so the fetch request can send the required header."
        );
        return;
    }

    setRecommendationsMessage("Loading recommendations...");

    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": RAPIDAPI_HOST,
            "Content-Type": "application/json"
        }
    };

    fetch(endpoint.toString(), options)
        .then(async (response) => {
            const result = await response.text();

            let parsedResult;

            try {
                parsedResult = JSON.parse(result);
            } catch {
                parsedResult = result;
            }

            if (!response.ok) {
                const message =
                    typeof parsedResult === "object" && parsedResult !== null
                        ? parsedResult.message || `Request failed with status ${response.status}`
                        : parsedResult || `Request failed with status ${response.status}`;

                throw new Error(message);
            }

            setRecommendationsMessage(
                `Loaded recommendations for product ${productId}.`,
                typeof parsedResult === "string"
                    ? parsedResult
                    : JSON.stringify(parsedResult, null, 2)
            );
        })
        .catch((error) => {
            const isInvalidKey = /api key/i.test(error.message);

            setRecommendationsMessage(
                isInvalidKey ? "RapidAPI rejected the current key." : "Unable to load recommendations.",
                `${error.message}\n\nThis request is now using the fetch template format. If you still see an API-key error, the key itself needs to be replaced with a fresh RapidAPI key.`
            );
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadRecommendations();
});
