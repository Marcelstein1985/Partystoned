(function () {
  const products = Array.isArray(window.WP_PRODUCTS) ? window.WP_PRODUCTS : [];
  const partners = Array.isArray(window.WP_PARTNERS) ? window.WP_PARTNERS : [];
  const externalOffers = Array.isArray(window.WP_OFFERS) ? window.WP_OFFERS : [];

  function normalize(value) { return String(value || "").trim().toLowerCase(); }

  function findProduct({ ean, brand, model } = {}) {
    if (ean) {
      const byEan = products.find(p => p.ean && String(p.ean) === String(ean));
      if (byEan) return byEan;
    }
    const b = normalize(brand), m = normalize(model);
    return products.find(p => normalize(p.brand) === b && normalize(p.model) === m) || null;
  }

  function partnerFor(id) { return partners.find(p => p.id === id) || null; }

  function isUsableOffer(o) {
    return o && o.productId && o.live === true && o.deeplink &&
      Number.isFinite(Number(o.price)) && Number(o.price) >= 0;
  }

  function offersFor(productId) {
    const product = products.find(p => p.id === productId);
    const legacy = product && Array.isArray(product.offers)
      ? product.offers.map(o => ({...o, productId, live:o.live === true}))
      : [];
    return externalOffers.concat(legacy)
      .filter(o => o.productId === productId && isUsableOffer(o))
      .map(o => {
        const partner = partnerFor(o.merchantId);
        return {...o, merchant: o.merchant || (partner && partner.name) || o.merchantId || "Händler"};
      })
      .sort((a,b) => Number(a.price) - Number(b.price));
  }

  function bestOffer(productId) { return offersFor(productId)[0] || null; }

  window.WohnPlanbarData = { products, partners, offers: externalOffers, findProduct, partnerFor, offersFor, bestOffer };
})();
