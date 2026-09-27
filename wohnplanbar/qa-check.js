#!/usr/bin/env node
const fs = require("fs");
const vm = require("vm");

const file = process.argv[2] || __dirname + "/index.html";
const html = fs.readFileSync(file, "utf8");
let errors = [];
let warnings = [];

function fail(msg){ errors.push(msg); }
function warn(msg){ warnings.push(msg); }
function count(re){ return (html.match(re) || []).length; }
function fnv1a(str){
  let h=0x811c9dc5;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}
  return h.toString(16).padStart(8,"0");
}

const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
const duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
if(duplicates.length) fail("Doppelte IDs: "+duplicates.join(", "));

const required=["landing","finder","results","quiz","next","back","homeBtn","resultHome","restart","bar","resultList","stepError","priorityError"];
for(const id of required){
  const n=ids.filter(x=>x===id).length;
  if(n!==1) fail("ID #"+id+" muss exakt einmal existieren (aktuell "+n+").");
}

const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
for(const [i,script] of scripts.entries()){
  try{ new vm.Script(script); }
  catch(e){ fail("JavaScript Syntaxfehler in Script "+(i+1)+": "+e.message); }
}

if(count(/class="[^"]*start-finder/g)<1) fail("Kein start-finder CTA gefunden.");
if(!html.includes('id="next"')) fail("Weiter-Button fehlt.");
if(!html.includes('id="back"')) fail("Zurück-Button fehlt.");

const productCount=count(/\{b:"/g);
if(productCount!==30) fail("Produktanzahl hat sich geändert: "+productCount+" statt Baseline 30.");

const fit=html.match(/function fit\(product, a\)\{[\s\S]*?return Math\.round\(\(num\/den\)\*100\);\n\}/)?.[0] || "";
if(!fit) fail("Scoring-Funktion fit() nicht gefunden.");
else {
  const hash="fnv1a-"+fnv1a(fit);
  if(hash!=="fnv1a-84782dc5") fail("Scoring-Logik verändert: "+hash+" statt Baseline fnv1a-84782dc5.");
}

if(/\.reveal\s*\{[^}]*opacity\s*:\s*0/i.test(html) && !/\.js\s+\.reveal/.test(html)){
  fail("Animation versteckt Inhalte standardmäßig. Progressive Enhancement-Regel verletzt.");
}
if(html.includes("IntersectionObserver") && !/IntersectionObserver["']?\s+in\s+window|typeof\s+IntersectionObserver/.test(html)){
  fail("IntersectionObserver ohne Feature-Fallback.");
}

if(!html.includes("safe-area-inset-top")) fail("iOS Safe-Area oben fehlt.");
if(!html.includes("safe-area-inset-bottom")) warn("iOS Safe-Area unten fehlt.");
if(!html.includes("scrollRestoration")) fail("Scroll-Restoration-Regel fehlt; Seite kann an alter Position starten.");
if(!/:focus-visible/.test(html)) fail("Sichtbare :focus-visible Styles fehlen.");

const imgs=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
imgs.forEach((tag,i)=>{
  if(!/\balt="/.test(tag)) fail("Bild "+(i+1)+" ohne alt-Text.");
  if(!/width=|height=|aspect-ratio/.test(tag) && !/hero-media|story-image/.test(html)) warn("Bild "+(i+1)+" ohne reservierte Geometrie.");
});
if(imgs.some(t=>/images\.unsplash\.com/.test(t))) warn("Externe Unsplash-Hotlinks vorhanden – nur für Prototyp akzeptabel.");

if(!html.includes('aria-live')) fail("aria-live für dynamische Fehlermeldungen/Status fehlt.");

console.log("WohnPlanbar QA");
console.log("==============");
warnings.forEach(x=>console.log("WARN:",x));
errors.forEach(x=>console.log("FAIL:",x));
if(errors.length){
  console.error("\nQA NICHT BESTANDEN: "+errors.length+" Fehler, "+warnings.length+" Warnungen.");
  process.exit(1);
}
console.log("\nQA BESTANDEN mit "+warnings.length+" Warnungen.");
