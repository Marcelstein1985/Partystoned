window.WP_PRODUCTS = [
  {
    id: "coffee-demo-001",
    category: "kaffeevollautomaten",
    brand: "Demo",
    model: "Beispielmodell",
    ean: null,
    sku: null,
    status: "demo",
    attributes: {},
    offers: []
  }
];

window.WP_CATEGORY_SCHEMAS = {
  kaffeevollautomaten: {
    matchFields: ["ean", "brand", "model"],
    attributes: ["coffee", "milk", "variety", "clean", "easy", "custom", "smart", "cold", "compact", "beans"]
  },
  lampen: {
    matchFields: ["ean", "brand", "model"],
    attributes: [
      "lampType", "room", "style", "lumens", "kelvinMin", "kelvinMax",
      "cri", "dimmable", "smart", "smartEcosystem", "socket",
      "ipRating", "energyClass", "widthMm", "heightMm", "depthMm"
    ]
  }
};
