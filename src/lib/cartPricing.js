const AUDIENCE_PRICES = {
  men: 210,
  women: 180,
  kids: 120,
};

const buildAudienceText = (item, index = 0) => {
  return [
    item?.name,
    item?.productName,
    item?.title,
    item?.description,
    item?.brand,
    item?.vendor,
    item?.sku,
    item?.product_type,
    item?.category,
    item?.handle,
    item?.slug,
    item?.subtitle,
    item?.size,
    item?.tags,
    index ? `result-${index}` : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

export const detectAudience = (item, index = 0) => {
  const text = buildAudienceText(item, index);

  if (
    text.includes("kids") ||
    text.includes("kid") ||
    text.includes("youth") ||
    text.includes("grade school") ||
    text.includes("gs") ||
    text.includes("preschool") ||
    text.includes("ps") ||
    text.includes("toddler") ||
    text.includes("td")
  ) {
    return "kids";
  }

  if (
    text.includes("women") ||
    text.includes("womens") ||
    text.includes("women's") ||
    text.includes("wmns")
  ) {
    return "women";
  }

  return "men";
};

export const getDemoPriceForAudience = (audience = "men") => {
  return AUDIENCE_PRICES[audience] ?? AUDIENCE_PRICES.men;
};

export const getDemoPriceForItem = (item, index = 0) => {
  return getDemoPriceForAudience(detectAudience(item, index));
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const normalizeCartItem = (item) => {
  const audience = item?.audience || detectAudience(item);
  const quantity = Math.max(1, Number(item?.quantity || 1));

  return {
    ...item,
    audience,
    quantity,
    price: getDemoPriceForAudience(audience),
  };
};
