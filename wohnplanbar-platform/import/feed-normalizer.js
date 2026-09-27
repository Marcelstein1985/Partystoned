/*
 WohnPlanbar feed normalizer
 Build-time/import helper. No credentials belong in this file.
*/
(function(root){
  function text(v){ return String(v == null ? "" : v).trim(); }
  function norm(v){ return text(v).toLowerCase().replace(/\s+/g," "); }
  function digits(v){ return text(v).replace(/\D/g,""); }
  function price(v){
    if(typeof v==="number") return Number.isFinite(v)?v:null;
    let s=text(v).replace(/\s/g,"").replace(/€/g,"");
    if(s.includes(",") && s.includes(".")) s=s.lastIndexOf(",")>s.lastIndexOf(".")?s.replace(/\./g,"").replace(",","."):s.replace(/,/g,"");
    else if(s.includes(",")) s=s.replace(",",".");
    const n=Number(s); return Number.isFinite(n)?n:null;
  }
  function boolStock(v){
    const s=norm(v);
    if(!s) return null;
    if(["1","true","yes","ja","in stock","instock","available","verfügbar","sofort lieferbar"].includes(s)) return "in_stock";
    if(["0","false","no","nein","out of stock","outofstock","nicht verfügbar","ausverkauft"].includes(s)) return "out_of_stock";
    return text(v);
  }
  function get(row, keys){
    for(const k of keys){ if(row && row[k] != null && text(row[k])!=="") return row[k]; }
    return null;
  }
  function normalizeRow(row, config={}){
    const f=config.fields||{};
    const pick=(name,defaults)=>get(row,[...(f[name]?[f[name]]:[]),...defaults]);
    const ean=digits(pick("ean",["ean","EAN","gtin","GTIN","barcode"]));
    const brand=text(pick("brand",["brand","Brand","manufacturer","merchant_product_brand"]));
    const model=text(pick("model",["model","Model","model_number","mpn","manufacturer_part_number"]));
    const sku=text(pick("sku",["sku","SKU","product_id","merchant_product_id","aw_product_id"]));
    return {
      merchantId: config.merchantId || "",
      merchantOfferId: text(pick("offerId",["offer_id","id","merchant_product_id","aw_product_id"])) || sku,
      ean: ean || null, brand: brand || null, model: model || null, sku: sku || null,
      title: text(pick("title",["title","product_name","name"])) || null,
      price: price(pick("price",["price","search_price","product_price","sale_price"])),
      currency: text(pick("currency",["currency","currency_code"])) || "EUR",
      availability: boolStock(pick("availability",["availability","stock","in_stock","stock_status"])),
      deeplink: text(pick("deeplink",["deeplink","aw_deep_link","product_url","url"])) || null,
      image: text(pick("image",["image","image_url","merchant_image_url","large_image"])) || null,
      source: config.source || "partner-feed",
      updatedAt: config.updatedAt || new Date().toISOString()
    };
  }
  function findProduct(products, item){
    if(item.ean){
      const e=products.find(p=>digits(p.ean)===item.ean || (Array.isArray(p.gtin)&&p.gtin.map(digits).includes(item.ean)));
      if(e) return {product:e,matchedBy:"ean"};
    }
    if(item.sku && item.merchantId){
      const s=products.find(p=>Array.isArray(p.externalIds)&&p.externalIds.some(x=>x.merchantId===item.merchantId&&text(x.sku)===item.sku));
      if(s) return {product:s,matchedBy:"merchant_sku"};
    }
    if(item.brand && item.model){
      const b=products.find(p=>norm(p.brand)===norm(item.brand) && (norm(p.model)===norm(item.model)||norm(p.sku)===norm(item.model)));
      if(b) return {product:b,matchedBy:"brand_model"};
    }
    return null;
  }
  function toOffer(item, match){
    if(!match || item.price==null || !item.deeplink) return null;
    return {
      id:["offer",item.merchantId,item.merchantOfferId||match.product.id].filter(Boolean).join("-").replace(/[^a-zA-Z0-9_-]+/g,"-").toLowerCase(),
      productId:match.product.id, merchantId:item.merchantId, price:item.price,
      currency:item.currency||"EUR", availability:item.availability, deeplink:item.deeplink,
      image:item.image||null, updatedAt:item.updatedAt, source:item.source, matchedBy:match.matchedBy, live:true
    };
  }
  function normalizeFeed(rows, products, config={}){
    const offers=[],unmatched=[],invalid=[];
    for(const row of rows||[]){
      const item=normalizeRow(row,config), match=findProduct(products||[],item);
      if(!match){ unmatched.push(item); continue; }
      const offer=toOffer(item,match);
      if(!offer){ invalid.push({...item,productId:match.product.id}); continue; }
      offers.push(offer);
    }
    const deduped=[...new Map(offers.map(o=>[o.id,o])).values()];
    return {offers:deduped,unmatched,invalid,stats:{rows:(rows||[]).length,offers:deduped.length,unmatched:unmatched.length,invalid:invalid.length}};
  }
  root.WPFeedNormalizer={normalizeRow,findProduct,toOffer,normalizeFeed};
})(typeof window!=="undefined"?window:globalThis);
