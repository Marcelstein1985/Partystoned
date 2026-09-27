(function () {
  const products = Array.isArray(window.WP_PRODUCTS) ? window.WP_PRODUCTS : [];
  const partners = Array.isArray(window.WP_PARTNERS) ? window.WP_PARTNERS : [];

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function findProduct({ ean, brand, model } = {}) {
    if (ean) {
      const byEan = products.find(p => p.ean && String(p.ean) === String(ean));
      if (byEan) return byEan;
    }
    const b = normalize(brand), m = normalize(model);
    return products.find(p => normalize(p.brand) === b && normalize(p.model) === m) || null;
  }

  function offersFor(productId) {
    const product = products.find(p => p.id === productId);
    return product && Array.isArray(product.offers) ? product.offers : [];
  }

  window.WohnPlanbarData = { products, partners, findProduct, offersFor };
})();
