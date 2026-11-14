/* Hello Skin (retail) – shared site script for the static preview.
   In WordPress each part maps to: Elementor Pro Theme Builder (header, footer, archive, single product),
   Elementor Pro WooCommerce widgets (Menu Cart, Cart, Checkout, My Account, Purchase Summary) and free WooCommerce. */
(function () {
"use strict";
const IMG = "img/";
const FREE = 2000;
const COUPONS = { HELLO10: { pct: 10, label: "HELLO10 (10% off)" } };
const RATES = [
  { id: "dhaka", label: "Inside Dhaka", cost: 60, note: "1–2 working days" },
  { id: "outside", label: "Outside Dhaka", cost: 120, note: "2–4 working days" }
];
const TOP = ["Face Care", "Sun Care", "Lip Care", "Hair Care", "Body Care", "Underarm & Personal Care"];
const SHORT = { "Face Care": "Face", "Sun Care": "Sunscreen", "Lip Care": "Lips", "Hair Care": "Hair", "Body Care": "Body", "Underarm & Personal Care": "Underarm" };
const DISTRICTS = ["Bagerhat","Bandarban","Barguna","Barishal","Bhola","Bogura","Brahmanbaria","Chandpur","Chapai Nawabganj","Chattogram","Chuadanga","Cox's Bazar","Cumilla","Dhaka","Dinajpur","Faridpur","Feni","Gaibandha","Gazipur","Gopalganj","Habiganj","Jamalpur","Jashore","Jhalokathi","Jhenaidah","Joypurhat","Khagrachhari","Khulna","Kishoreganj","Kurigram","Kushtia","Lakshmipur","Lalmonirhat","Madaripur","Magura","Manikganj","Meherpur","Moulvibazar","Munshiganj","Mymensingh","Naogaon","Narail","Narayanganj","Narsingdi","Natore","Netrokona","Nilphamari","Noakhali","Pabna","Panchagarh","Patuakhali","Pirojpur","Rajbari","Rajshahi","Rangamati","Rangpur","Satkhira","Shariatpur","Sherpur","Sirajganj","Sunamganj","Sylhet","Tangail","Thakurgaon"];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tk = n => "৳" + Math.round(n).toLocaleString("en-US");
const slugOf = s => s.toLowerCase().replace(/&/g, "").replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const hash = s => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; };
const qs = new URLSearchParams(location.search);
const NEW = new Set(["HS-DEC-003","HS-BW-001","HS-WC-005","HS-DK-017","HS-MIN-004","HS-DEC-002","HS-WC-002","HS-CAP-004","HS-DK-015","HS-MIN-005"]);
const BEST = new Set(PRODUCTS.filter(p => p.best).map(p => p.sku));
const P = PRODUCTS.map(p => { const [top, sub] = p.cat.split(" > "); const h = hash(p.sku);
  const d = [0,0,10,0,15,20,0,12,25,0][h % 10]; // example sale prices
  const compare = d ? Math.round(p.price / (1 - d / 100) / 10) * 10 : null;
  return { ...p, top, sub: sub || null, d: compare ? Math.round((1 - p.price / compare) * 100) : 0, compare, reviews: 24 + h % 210, rating: (4.3 + (h % 7) / 10).toFixed(1), isNew: NEW.has(p.sku) }; });
const by = Object.fromEntries(P.map(p => [p.sku, p]));
const BRANDS = [...new Set(P.map(p => p.brand))].sort((a, b) => P.filter(p => p.brand === b).length - P.filter(p => p.brand === a).length);
const subsOf = t => [...new Set(P.filter(p => p.top === t && p.sub).map(p => p.sub))];
const text = p => (p.name + " " + p.short + " " + p.cat).toLowerCase();
const CONCERNS = {
  FACE: [["Acne & Breakouts", /salicylic|acne|blemish|breakout|clear/], ["Pigmentation & Dark Spots", /kojic|arbutin|dark spot|pigment|niacinamide/], ["Dull Skin", /vitamin c|bright|glow|radiance|strobe/], ["Hydration", /hydra|moistur|hyaluronic|ceramide|water gel/], ["Sun Protection", /spf|sunscreen/], ["Oil Control", /matte|oil|mattif/]],
  BODY: [["Body Brightening", /bright|vitamin|aha/], ["Rough & Bumpy Skin", /exfoliat|aha|salicylic acid body/], ["Underarm Care", /underarm|roll-on/], ["Dark Lips", /lip/]],
  HAIR: [["Hair Fall", /hair ?fall|growth|roots|thicker|redensyl/], ["Frizzy Hair", /frizz|smooth|butter/], ["Dandruff & Scalp", /dandruff|scalp/]]
};
const INGS = [["Salicylic Acid", /salicylic/, "Unclogs pores and calms breakouts."], ["Niacinamide", /niacinamide/, "Evens tone and controls oil."], ["Vitamin C", /vitamin c/, "Brightens dull skin and fades spots."], ["Kojic Acid", /kojic/, "Targets stubborn pigmentation."], ["Alpha Arbutin", /arbutin/, "Fades dark spots gently."], ["Ceramides", /ceramide/, "Repairs the skin barrier."], ["Hyaluronic Acid", /hyaluronic/, "Holds moisture for plump skin."], ["AHA", /\baha/, "Exfoliates for smoother skin."]];
const matches = re => P.filter(p => re.test(text(p)));
/* Combo kits are their own WooCommerce products (simple product, regular + sale price). */
const COMBOS = {
  FACE: [["Clear Skin Routine", ["HS-DC-001","HS-DC-003","HS-DC-005"]], ["Bright & Even Duo", ["HS-MIN-002","HS-DK-014"]], ["Barrier Repair Kit", ["HS-DK-002","HS-DK-009","HS-DK-013"]]],
  BODY: [["Smooth Body Duo", ["HS-CAP-003","HS-CAP-001"]], ["Body Clear Set", ["HS-CAP-002","HS-WC-006"]], ["Lip Love Pair", ["HS-DC-007","HS-MIN-004"]]],
  HAIR: [["Frizz-Free Trio", ["HS-MTX-001","HS-MTX-002","HS-MTX-003"]], ["Hair Fall Rescue", ["HS-WC-003","HS-WC-005"]], ["Roots Ritual", ["HS-MIN-005","HS-BW-001"]]]
};
for (const g of Object.values(COMBOS)) for (const [n, ks] of g) {
  const ps = ks.map(k => by[k]); const sum = ps.reduce((a, p) => a + p.price, 0);
  by["KIT-" + slugOf(n)] = { sku: "KIT-" + slugOf(n), name: "Hello Skin " + n, title: n, brand: "Hello Skin kit", price: Math.round(sum * 0.9 / 10) * 10, compare: sum, imgs: [ps[0].imgs[0]], slug: ps[0].slug, kit: ks };
}
const bySku = by;
const purl = p => `product.html?p=${p.slug}`;
const curl = c => `shop.html?cat=${slugOf(c)}`;
const rev = p => p.reviews || 0;
const store = {
  get(k, d) { try { const v = localStorage.getItem("hs2-" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("hs2-" + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem("hs2-" + k); } catch (e) {} }
};

/* ---------------- cart state ---------------- */
let cart = store.get("cart", []).filter(i => by[i.sku]);
const saveCart = () => store.set("cart", cart);
const count = () => cart.reduce((a, i) => a + i.q, 0);
const subtotal = () => cart.reduce((a, i) => a + i.q * by[i.sku].price, 0);
function totals() {
  const sub = subtotal();
  const code = store.get("coupon", null);
  const disc = code && COUPONS[code] ? Math.round(sub * COUPONS[code].pct / 100) : 0;
  const free = sub >= FREE;
  let ship = store.get("ship", "dhaka");
  if (ship === "free" && !free) ship = "dhaka";
  const rate = ship === "free" ? 0 : (RATES.find(r => r.id === ship) || RATES[0]).cost;
  return { sub, code: disc ? code : null, disc, free, ship, rate, total: sub - disc + rate };
}
function add(sku, q = 1) {
  const it = cart.find(i => i.sku === sku);
  it ? it.q += q : cart.push({ sku, q });
  saveCart(); renderMini(true); openCart();
}
function setQ(sku, q) {
  const it = cart.find(i => i.sku === sku); if (!it) return;
  it.q = Math.max(0, Math.min(99, q | 0));
  if (!it.q) cart = cart.filter(i => i.sku !== sku);
  saveCart(); renderMini();
}

/* ---------------- shared chrome (Theme Builder header/footer) ---------------- */
const SV = {
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4"/><path d="M4 20.5c1.4-4 4.4-6 8-6s6.6 2 8 6"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12.5H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M3.5 11 12 4l8.5 7v9h-5.5v-6h-6v6H3.5z"/></svg>'
};
const IC = { orig: '<svg viewBox="0 0 24 24"><path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.3 7.5 9.5 4.3-1.2 7.5-5 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>', ship: '<svg viewBox="0 0 24 24"><path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/></svg>', cod: '<svg viewBox="0 0 24 24"><rect x="3" y="6.5" width="18" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.5"/></svg>', ret: '<svg viewBox="0 0 24 24"><path d="M4 9h11a5 5 0 0 1 0 10H8"/><path d="m8 5-4 4 4 4"/></svg>' };
function chrome() {
  const page = document.body.dataset.page, cat = qs.get("cat");
  $("#hdr").outerHTML = `
  <div class="strip"><div class="wrap"><span class="tick">Free delivery on orders over ${tk(FREE)} · Cash on delivery all over Bangladesh</span><div class="r"><a href="shipping-returns.html#faq">Help</a><a href="contact.html">Contact</a><a href="about.html">About</a></div></div></div>
  <header class="site">
    <div class="wrap hrow">
      <button class="menubtn" data-menu aria-label="Open menu">${SV.menu}</button>
      <a class="logo" href="index.html">Hello Skin <small>Beauty store</small></a>
      <form class="sbox" id="sform" role="search" action="shop.html"><label for="q" hidden>Search</label><input id="q" name="s" type="search" placeholder="Search products, brands, concerns" autocomplete="off" value="${esc(qs.get("s") || "")}"><button class="go" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/></svg></button><div class="sres" id="sres" hidden></div></form>
      <div class="hic">
        <a class="hide-m" href="my-account.html" aria-label="Account">${SV.user}<small>Account</small></a>
        <button data-cart aria-label="Open cart">${SV.bag}<small>Cart</small><span class="cnt" data-cnt hidden>0</span></button>
      </div>
    </div>
    <nav class="mega" aria-label="Categories"><div class="wrap">${TOP.map((t, ti) => { const subs = subsOf(t); const ps = P.filter(p => p.top === t); const feat = ps.find(p => BEST.has(p.sku) && p.imgs[0]) || ps.find(p => p.imgs[0]);
      const brands = [...new Set(ps.map(p => p.brand))]; const on = cat && (cat === slugOf(t) || subs.some(s => slugOf(s) === cat));
      return `<div class="mi"><a href="${curl(t)}" class="${on ? "on" : ""}">${esc(SHORT[t] === "Sunscreen" ? "Sun Care" : t.replace(" & Personal Care", ""))}</a><div class="panel" style="--c:2;${ti > 2 ? "left:auto;right:0" : ""}">
      <div><h4>${subs.length ? "Shop by type" : "Products"}</h4><ul>${subs.length ? subs.map(s => `<li><a href="${curl(s)}">${esc(s)}</a></li>`).join("") : ps.slice(0, 8).map(p => `<li><a href="${purl(p)}">${esc(p.title)}</a></li>`).join("")}<li><a href="${curl(t)}" style="color:var(--berry);font-weight:700">View all ${esc(t)}</a></li></ul></div>
      <div><h4>Brands</h4><ul>${brands.map(b => `<li><a href="shop.html?brand=${slugOf(b)}">${esc(b)}</a></li>`).join("")}</ul></div>
      <a class="feat" href="${purl(feat)}"><img src="${IMG + feat.imgs[0]}" alt=""><b>${esc(feat.title)}</b><span>${tk(feat.price)}</span></a></div></div>`; }).join("")}
      <div class="mi"><a href="shop.html?cat=new" class="${cat === "new" ? "on" : ""}">New in</a></div><div class="mi"><a href="shop.html?cat=best" class="${cat === "best" ? "on" : ""}">Bestsellers</a></div><a class="offer" href="shop.html?cat=offers">Offers</a></div></nav>
  </header>`;
  $("#ftr").outerHTML = `
  <footer><div class="wrap">
    <div class="fg">
      <div><a class="logo" href="index.html">Hello Skin</a><p style="font-size:13px;max-width:330px">Authentic skincare, sun care, hair and body care from The Derma Co, Minimalist, Dot &amp; Key, WishCare and more. Delivered across Bangladesh.</p>
        <ul style="margin-top:12px"><li><a href="https://www.facebook.com/profile.php?id=61578828301744" target="_blank" rel="noopener">Facebook</a></li></ul></div>
      <div><h4>Help</h4><ul><li><a href="shipping-returns.html">Shipping &amp; returns</a></li><li><a href="shipping-returns.html#faq">FAQ</a></li><li><a href="shipping-returns.html#privacy">Privacy policy</a></li><li><a href="shipping-returns.html#terms">Terms of service</a></li><li><a href="contact.html">Contact us</a></li><li><a href="about.html">About us</a></li></ul></div>
      <div><h4>Shop</h4><ul>${TOP.map(t => `<li><a href="${curl(t)}">${esc(t)}</a></li>`).join("")}<li><a href="shop.html?cat=offers">Offers</a></li></ul></div>
      <div><h4>Get 10% off your first order</h4><p style="font-size:13px;margin:0">New arrivals, restocks and offers. No spam.</p><form class="nl" id="nl"><label for="nle" hidden>Email</label><input id="nle" type="email" placeholder="Email address" required><button>Join</button></form><p id="nlm" style="font-size:12px;min-height:18px" aria-live="polite"></p></div>
    </div>
    <div class="fb"><span>© 2026 Hello Skin · Design preview</span><div class="pays"><span>Cash on delivery</span><span>Bank transfer</span></div></div>
  </div></footer>
  <div class="scrim" id="scrim"></div>
  <aside class="drawer" id="drawer" aria-label="Cart">
    <div class="dh"><h3>My cart <span id="dc" style="color:var(--muted);font-weight:400"></span></h3><button id="dclose" aria-label="Close cart" style="font-size:22px;width:36px;height:36px">×</button></div>
    <div class="ship"><b>Free delivery</b> on orders over ${tk(FREE)}</div>
    <div class="items" id="items"></div>
    <div class="df" id="df"></div>
  </aside>
  <nav class="mnav" id="mnav" aria-label="Menu"><div class="logo" style="margin-bottom:10px">Hello Skin</div>${TOP.map(t => `<details><summary>${esc(t)}</summary><a href="${curl(t)}">All ${esc(t)}</a>${subsOf(t).map(s => `<a href="${curl(s)}">${esc(s)}</a>`).join("")}</details>`).join("")}<details><summary>Brands</summary>${BRANDS.map(b => `<a href="shop.html?brand=${slugOf(b)}">${esc(b)}</a>`).join("")}</details><details open><summary>Featured</summary><a href="shop.html?cat=new">New in</a><a href="shop.html?cat=best">Bestsellers</a><a href="shop.html?cat=offers" style="color:var(--sale)">Offers</a></details><details open><summary>Help</summary><a href="my-account.html">My account</a><a href="shipping-returns.html">Shipping &amp; returns</a><a href="contact.html">Contact us</a><a href="about.html">About us</a></details></nav>
  <nav class="bnav" aria-label="Quick links">
    <a href="index.html">${SV.home}Home</a>
    <button data-menu>${SV.menu}Menu</button>
    <button data-cart>${SV.bag}Cart<span class="cnt" data-cnt hidden>0</span></button>
    <a href="my-account.html">${SV.user}Account</a>
  </nav>
  <div class="toast" id="toast" role="status"></div>`;

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-cart],[data-menu],#dclose,#scrim");
    if (t) { if (t.dataset.cart !== undefined) openCart(); else if (t.dataset.menu !== undefined) { $("#mnav").classList.add("on"); $("#scrim").classList.add("on"); } else closeAll(); }
    if (!e.target.closest(".sbox")) $("#sres").hidden = true;
  });
  $("#q").addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase(); const r = $("#sres"); if (q.length < 2) { r.hidden = true; return; }
    const res = P.filter(p => text(p).includes(q)).slice(0, 7); r.hidden = false;
    r.innerHTML = res.length ? res.map(p => `<a href="${purl(p)}">${p.imgs[0] ? `<img src="${IMG + p.imgs[0]}" alt="">` : ""}<span><b style="color:var(--berry);font-size:11px;text-transform:uppercase">${esc(p.brand)}</b><br>${esc(p.title)}</span><b style="margin-left:auto">${tk(p.price)}</b></a>`).join("") + `<a href="shop.html?s=${encodeURIComponent(q)}" style="justify-content:center;color:var(--berry);font-weight:700">See all results</a>` : `<p style="margin:10px;color:var(--muted)">No products match “${esc(q)}”.</p>`;
  });
  $("#nl").onsubmit = e => { e.preventDefault(); $("#nlm").textContent = "Thanks. In the live store this sends your 10% code."; e.target.reset(); };
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeAll(); $("#sres").hidden = true; } });
  renderMini();
}
function renderMini(bump) {
  const n = count(), sub = subtotal();
  $$("[data-cnt]").forEach(c => { c.textContent = n; c.hidden = !n; if (bump) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); } });
  $("#dc").textContent = n ? `(${n} item${n > 1 ? "s" : ""})` : "";
  $("#items").innerHTML = cart.length ? cart.map(i => { const p = by[i.sku]; return `<div class="it">${p.imgs[0] ? `<img src="${IMG + p.imgs[0]}" alt="">` : `<div class="ni"></div>`}
    <div><div class="v">${esc(p.brand)}</div><a class="t" href="${purl(p)}">${esc(p.title)}</a><div style="font-size:12px;color:var(--muted);margin-top:6px">${i.q} × ${tk(p.price)}</div></div>
    <div class="r"><span>${tk(p.price * i.q)}</span><button class="rm" data-rm="${p.sku}">Remove</button></div></div>`; }).join("")
    : `<div class="dempty"><b style="color:var(--ink);font-size:16px">Your cart is empty</b><span>Add your favourites and they'll show up here.</span><a class="btn" href="shop.html">Start shopping</a></div>`;
  $("#df").hidden = !cart.length;
  $("#df").innerHTML = `<div class="s"><span>Subtotal</span><span>${tk(sub)}</span></div><small>Delivery calculated at checkout. Cash on delivery available.</small><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><a class="btn line full" href="cart.html">View cart</a><a class="btn full" href="checkout.html">Checkout</a></div>`;
  document.dispatchEvent(new Event("cart:change"));
}
function openCart() { $("#drawer").classList.add("on"); $("#scrim").classList.add("on"); }
function closeAll() { $("#drawer")?.classList.remove("on"); $("#mnav")?.classList.remove("on"); $("#scrim")?.classList.remove("on"); }
let tt; function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2400); }

/* ---------------- product card (Loop Grid / Loop Carousel item) ---------------- */
function card(p) {
  const img = p.imgs[0] ? `<img src="${IMG + p.imgs[0]}" alt="${esc(p.name)}" loading="lazy">` : `<div class="noimg"><div>${esc(p.title)}<small>Photo needed</small></div></div>`;
  return `<article class="card"><a class="m" href="${purl(p)}" aria-label="${esc(p.name)}"><span class="tags">${p.compare ? `<span class="tg off">Sale</span>` : ""}</span>${img}</a>
  <div class="b"><span class="v">${esc(p.brand)}</span><a class="t" href="${purl(p)}">${esc(p.title)}</a>
  <span class="rv"><i>★★★★★</i>${p.rating} (${p.reviews})</span>
  <span class="pr"><b>${tk(p.price)}</b>${p.compare ? `<s>${tk(p.compare)}</s>` : ""}</span>
  <button class="add" data-add="${p.sku}">Add to cart</button></div></article>`;
}
const ARR = d => `<svg viewBox="0 0 24 24"><path d="${d === "l" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"}"/></svg>`;
const rail = (list, id) => `<div class="railw"><button class="rarr l" data-rail="${id}|-1" aria-label="Scroll left">${ARR("l")}</button><div class="rail" id="${id}">${list.map(card).join("")}</div><button class="rarr r" data-rail="${id}|1" aria-label="Scroll right">${ARR("r")}</button></div>`;
document.addEventListener("click", e => {
  const r = e.target.closest("[data-rail]"); if (!r) return;
  const [id, dir] = r.dataset.rail.split("|"); const el = document.getElementById(id); el.scrollBy({ left: +dir * el.clientWidth * .8, behavior: "smooth" });
});

/* ---------------- pages ---------------- */
const pages = {};

const SLIDES = [
  { k: "Sun season sale", h: "SPF 50 for every skin type", p: "Gel, fluid and tinted sunscreens from Dot & Key, Deconstruct, The Derma Co and WishCare.", bg: "#FDE9C9", to: curl("Sun Care"), s: ["HS-DK-014","HS-DK-013","HS-DC-006"] },
  { k: "Serum edit", h: "Fade spots. Find your glow.", p: "Vitamin C, niacinamide, kojic acid and alpha arbutin serums, from ৳650.", bg: "#EFE3F6", to: "shop.html?cat=serums-treatments", s: ["HS-MIN-002","HS-DC-004","HS-DEC-001"] },
  { k: "Hair care week", h: "Smooth, strong, salon-soft hair", p: "Matrix Mega Smooth, WishCare hair growth and Bodywise scalp care.", bg: "#FFE3D4", to: curl("Hair Care"), s: ["HS-MTX-001","HS-WC-005","HS-MTX-002"] }
];
const ROUTINE = ["HS-MIN-001","HS-MIN-002","HS-DK-006","HS-DK-014"];
const REVIEWS = [["Strawberry Dew Tinted Sunscreen","HS-DK-014"],["1% Salicylic Acid Gel Face Wash","HS-DC-001"],["Mega Smooth Shampoo","HS-MTX-001"]];
pages.home = v => {
  let slideI = 0, slideT, comboTab = "FACE", concernTab = "FACE";
  const combos = () => COMBOS[comboTab].map(([n, ks]) => { const ps = ks.map(k => by[k]); const kit = by["KIT-" + slugOf(n)];
    return `<div class="combo"><div class="cimgs">${ps.map((p, i) => `${i ? '<span class="plus">+</span>' : ""}<img src="${IMG + p.imgs[0]}" alt="">`).join("")}</div><div><span class="tg off" style="display:inline-block;margin-bottom:6px">Sale</span><h3>${n}</h3></div><ul>${ps.map(p => `<li><a href="${purl(p)}">${esc(p.brand)} ${esc(p.title)}</a></li>`).join("")}</ul><div class="row"><span class="pr"><b>${tk(kit.price)}</b><s>${tk(kit.compare)}</s></span><button class="btn" data-add="${kit.sku}">Add kit</button></div></div>`; }).join("");
  const concern = () => { const list = CONCERNS[concernTab]; const ps = [...new Set(list.flatMap(([n, re]) => matches(re)))];
    return `<div class="chips">${list.map(([c, re]) => `<a class="chip" href="shop.html?concern=${slugOf(c)}" style="display:inline-flex;align-items:center">${c} <span style="color:var(--muted);margin-left:6px">${matches(re).length}</span></a>`).join("")}</div>${rail(ps.slice(0, 10), "r-con")}`; };
  const bubbles = TOP.map(t => { const p = P.find(x => x.top === t && x.imgs[0]); return `<a class="bub" href="${curl(t)}"><span class="c"><img src="${IMG + p.imgs[0]}" alt=""></span>${SHORT[t]}</a>`; }).join("") + `<a class="bub" href="shop.html?cat=new"><span class="c" style="display:grid;place-items:center;background:var(--rose);font-family:var(--serif);font-size:22px;color:var(--berry)">New</span>New in</a><a class="bub" href="shop.html?cat=offers"><span class="c" style="display:grid;place-items:center;background:var(--sale);color:#fff;font-weight:700">% OFF</span>Offers</a>`;
  const slides = SLIDES.map((s, i) => `<div class="slide ${i ? "" : "on"}" style="background:${s.bg}"><div class="copy"><span class="kick" style="color:var(--berry)">${s.k}</span><h2>${s.h}</h2><p>${s.p}</p><div><a class="btn" href="${s.to}">Shop now</a></div></div><div class="imgs">${s.s.map(k => `<img src="${IMG + by[k].imgs[0]}" alt="${esc(by[k].name)}">`).join("")}</div></div>`).join("");
  const brandTiles = BRANDS.slice(0, 6).map(b => { const ps = P.filter(p => p.brand === b); const mx = Math.max(...ps.map(p => p.d)); const im = ps.find(p => p.imgs[1]) || ps[0]; return `<a class="bt" href="shop.html?brand=${slugOf(b)}"><div class="im"><img src="${IMG + (im.imgs[1] || im.imgs[0])}" alt="" loading="lazy"></div><div class="nm"><b>${esc(b)}</b><span>${mx ? `UP TO ${mx}% OFF` : `${ps.length} PRODUCTS`}</span></div></a>`; }).join("");
  const brandTiles2 = BRANDS.slice(6).map(b => { const ps = P.filter(p => p.brand === b); const im = ps.find(p => p.imgs[0]) || ps[0]; return `<a class="bt" href="shop.html?brand=${slugOf(b)}"><div class="im"><img src="${IMG + im.imgs[0]}" alt="" loading="lazy"></div><div class="nm"><b>${esc(b)}</b><span style="color:var(--muted)">${ps.length} product${ps.length > 1 ? "s" : ""}</span></div></a>`; }).join("");
  const ings = INGS.filter(([n, re]) => matches(re).length).slice(0, 8).map(([n, re, d]) => { const ps = matches(re); const im = ps.find(p => p.imgs[0]); return `<a class="ing" href="shop.html?ing=${slugOf(n)}"><img src="${IMG + (im.imgs[1] || im.imgs[0])}" alt="" loading="lazy"><div><b>${n}</b><p>${d}</p><span>${ps.length} products · View collection</span></div></a>`; }).join("");
  const rprods = ROUTINE.map(k => by[k]); const rsum = rprods.reduce((a, p) => a + p.price, 0);
  const pos = [[22,30],[62,22],[34,68],[74,62]];
  v.innerHTML = `
  <div class="wrap"><div class="bubbles">${bubbles}</div></div>
  <section class="wrap hero"><div class="slides" id="slides">${slides}<div class="sdots">${SLIDES.map((s, i) => `<button class="${i ? "" : "on"}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}</div></div>
    <button class="sarr l" data-slide="prev" aria-label="Previous slide">${ARR("l")}</button><button class="sarr r" data-slide="next" aria-label="Next slide">${ARR("r")}</button></section>
  <section class="wrap trust">
    <div>${IC.orig}<p style="margin:0"><b>100% Original</b><span>Sourced from official distributors</span></p></div>
    <div>${IC.ship}<p style="margin:0"><b>Free Delivery</b><span>On orders over ${tk(FREE)}</span></p></div>
    <div>${IC.cod}<p style="margin:0"><b>Cash on Delivery</b><span>Pay when it arrives</span></p></div>
    <div>${IC.ret}<p style="margin:0"><b>Easy Returns</b><span>Unopened items within 7 days</span></p></div>
  </section>
  <section class="sec"><div class="wrap"><div class="sh"><h2>New arrivals</h2><a class="va" href="shop.html?cat=new">View all</a></div>${rail(P.filter(p => p.isNew), "r-new")}</div></section>
  <section class="sec band"><div class="wrap"><div class="sh"><h2>Top brands</h2><a class="va" href="shop.html">All products</a></div><div class="brands">${brandTiles}</div></div></section>
  <section class="sec"><div class="wrap"><div class="sh"><h2>Bestsellers</h2><a class="va" href="shop.html?cat=best">View all</a></div>${rail(P.filter(p => BEST.has(p.sku)), "r-best")}</div></section>
  <section class="sec band"><div class="wrap"><div class="sh"><h2>Save more with combos</h2><div class="tabs" role="tablist">${Object.keys(COMBOS).map(t => `<button class="tab ${t === comboTab ? "on" : ""}" data-ctab="${t}" role="tab">${t}</button>`).join("")}</div></div><div class="combos" id="combos">${combos()}</div></div></section>
  <section class="sec"><div class="wrap"><div class="sh"><h2>Handpicked <em>brands</em></h2></div><div class="brands">${brandTiles2}</div></div></section>
  <section class="sec band"><div class="wrap"><div class="sh"><h2>What's your <em>skin concern?</em></h2><div class="tabs" role="tablist">${Object.keys(CONCERNS).map(t => `<button class="tab ${t === concernTab ? "on" : ""}" data-otab="${t}" role="tab">${t}</button>`).join("")}</div></div><div id="concern">${concern()}</div></div></section>
  <section class="sec"><div class="wrap"><div class="sh"><h2>Shop by <em>ingredient</em></h2></div><div class="ings">${ings}</div></div></section>
  <section class="sec band"><div class="wrap"><div class="sh"><h2>Shop the <em>morning routine</em></h2></div>
    <div class="look"><div class="ph"><img src="${IMG + by["HS-MIN-002"].imgs[1]}" alt="Morning routine" loading="lazy">${pos.map((p, i) => `<a class="hot" href="${purl(rprods[i])}" style="left:${p[0]}%;top:${p[1]}%" aria-label="${esc(rprods[i].title)}">${i + 1}</a>`).join("")}</div>
    <div class="lst">${rprods.map((p, i) => `<div class="lrow"><span class="n">${i + 1}</span><img src="${IMG + p.imgs[0]}" alt=""><div><div style="font-size:11px;color:var(--berry);font-weight:700;text-transform:uppercase;letter-spacing:.06em">${["Cleanse","Treat","Moisturise","Protect"][i]} · ${esc(p.brand)}</div><a class="t" href="${purl(p)}">${esc(p.title)}</a><div class="pr"><b>${tk(p.price)}</b></div></div><button class="btn line" data-add="${p.sku}" style="height:34px;padding:0 12px">Add</button></div>`).join("")}
      <div class="lsum"><span>4 products · <b>${tk(rsum)}</b></span><a class="va" href="${curl("Face Care")}" style="font-size:13px;font-weight:600;color:var(--berry);border-bottom:1px solid">Shop face care</a></div></div></div></div></section>
  <section class="sec"><div class="wrap"><div class="sh"><h2>Trending categories</h2></div><div class="trend">${[...TOP.map(t => [t, curl(t), P.find(p => p.top === t && p.imgs[0])]), ["Korean-style glow", "shop.html?ing=hyaluronic-acid", by["HS-DK-006"]], ["Men's grooming", curl("Hair Care"), by["HS-MTX-001"]]].map(([n, h, p]) => `<a href="${h}"><img src="${IMG + p.imgs[0]}" alt="">${esc(n)}</a>`).join("")}</div></div></section>
  <section class="sec band"><div class="wrap"><div class="sh"><h2>#HelloSkin <em>speaks</em></h2><span class="sample">Sample reviews · replace before launch</span></div>
    <div class="revs">${REVIEWS.map(([n, k], i) => { const p = by[k]; return `<div class="rev"><div class="who"><span class="av">${["A","R","S"][i]}</span><div><b style="font-size:13px">Customer name</b><div class="rv"><i>★★★★★</i> Verified buyer</div></div></div><q>Sample review text. A short quote from a real Hello Skin customer about the ${esc(n)} goes here.</q><a class="pp" href="${purl(p)}"><img src="${IMG + p.imgs[0]}" alt=""><span><b>${esc(p.title)}</b><br><span style="color:var(--berry);font-weight:700">SHOP NOW ›</span></span></a></div>`; }).join("")}</div></div></section>
  <section class="sec"><div class="wrap"><div class="sh"><h2>Popular searches</h2></div><p class="pops">${["sunscreen","vitamin c serum","salicylic acid","niacinamide","kojic acid","lip balm","hair growth serum","the derma co","dot & key","minimalist","body lotion","face wash","matrix shampoo","underarm roll-on"].map(s => `<a href="shop.html?s=${encodeURIComponent(s)}">${esc(s)}</a>`).join("<i>|</i>")}</p>
    <div class="seo" style="margin-top:24px"><h3>Buy authentic skincare online in Bangladesh</h3><p>Hello Skin is an online beauty store for original skincare, sun care, hair care and body care. We stock ${P.length} products from ${BRANDS.length} brands, including ${BRANDS.slice(0, 6).join(", ")}, sourced from official distributors.</p><p>Shop by concern, from acne and dark spots to hair fall and frizz, or by ingredient, from salicylic acid and niacinamide to vitamin C and ceramides. Pay with cash on delivery or bank transfer, and orders over ${tk(FREE)} ship free anywhere in Bangladesh.</p><p>Not sure where to start? Our morning routine pairs a gentle cleanser, a vitamin C serum, a light moisturiser and an SPF 50 sunscreen, the four steps most skin types need in a hot, humid climate.</p></div></div></section>`;
  const goSlide = i => { slideI = (i + SLIDES.length) % SLIDES.length; $$(".slide").forEach((s, j) => s.classList.toggle("on", j === slideI)); $$(".sdots button").forEach((s, j) => s.classList.toggle("on", j === slideI)); };
  const start = () => { clearInterval(slideT); slideT = setInterval(() => goSlide(slideI + 1), 5000); };
  start();
  v.addEventListener("click", e => {
    const t = e.target.closest("[data-slide],[data-ctab],[data-otab]"); if (!t) return; const d = t.dataset;
    if (d.slide) { goSlide(d.slide === "next" ? slideI + 1 : d.slide === "prev" ? slideI - 1 : +d.slide); start(); }
    else if (d.ctab) { comboTab = d.ctab; $("#combos").innerHTML = combos(); $$("[data-ctab]").forEach(b => b.classList.toggle("on", b.dataset.ctab === comboTab)); }
    else if (d.otab) { concernTab = d.otab; $("#concern").innerHTML = concern(); $$("[data-otab]").forEach(b => b.classList.toggle("on", b.dataset.otab === concernTab)); }
  });
};

pages.shop = v => {
  const cat = qs.get("cat"), s = (qs.get("s") || "").trim().toLowerCase();
  let ctx = { title: "All products", list: P };
  if (cat === "new") ctx = { title: "New arrivals", list: P.filter(p => p.isNew) };
  else if (cat === "best") ctx = { title: "Bestsellers", list: P.filter(p => BEST.has(p.sku)) };
  else if (cat === "offers") ctx = { title: "Offers", list: P.filter(p => p.d) };
  else if (cat) { const t = TOP.find(t => slugOf(t) === cat); if (t) ctx = { title: t, top: t, list: P.filter(p => p.top === t) };
    else for (const t of TOP) for (const x of subsOf(t)) if (slugOf(x) === cat) ctx = { title: x, top: t, sub: x, list: P.filter(p => p.sub === x) }; }
  if (qs.get("brand")) { const b = BRANDS.find(b => slugOf(b) === qs.get("brand")); if (b) ctx = { title: b, list: P.filter(p => p.brand === b) }; }
  if (qs.get("ing")) { const i = INGS.find(i => slugOf(i[0]) === qs.get("ing")); if (i) ctx = { title: i[0], list: matches(i[1]) }; }
  if (qs.get("concern")) for (const g of Object.values(CONCERNS)) for (const [n, re] of g) if (slugOf(n) === qs.get("concern")) ctx = { title: n, list: matches(re) };
  if (s) ctx = { title: `Results for “${s}”`, list: P.filter(p => text(p).includes(s) || p.brand.toLowerCase().includes(s)) };
  document.title = `${ctx.title.replace(/[“”]/g, "")} – Hello Skin`;
  let sortBy = "menu", fBrands = new Set(), fPrice = "", sideOpen = false;
  const base = ctx.list;
  const draw = () => {
    const brandCounts = BRANDS.map(b => [b, base.filter(p => p.brand === b).length]).filter(x => x[1]);
    let list = base.filter(p => (!fBrands.size || fBrands.has(p.brand)) && (!fPrice || (p.price >= +fPrice.split("-")[0] && p.price <= +fPrice.split("-")[1])));
    if (sortBy === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    if (sortBy === "date") list = [...list].sort((a, b) => b.isNew - a.isNew);
    const lo = base.length ? Math.min(...base.map(p => p.price)) : 0, hi = base.length ? Math.max(...base.map(p => p.price)) : 0;
    const [cmin, cmax] = fPrice ? fPrice.split("-").map(Number) : [lo, hi];
    const subs = ctx.top ? subsOf(ctx.top) : [];
    v.innerHTML = `<div class="wrap"><div class="crumbs"><a href="index.html">Home</a> › <a href="shop.html">Shop</a> › ${ctx.top && ctx.sub ? `<a href="${curl(ctx.top)}">${esc(ctx.top)}</a> › ` : ""}${esc(ctx.title)}</div>
    <div class="shophead"><div><h1>${esc(ctx.title)}</h1><p>${base.length} product${base.length === 1 ? "" : "s"}</p></div></div>
    <div class="shopgrid"><aside class="side ${sideOpen ? "on" : ""}" id="side">
      <div><h4>Category</h4>${(subs.length ? subs : TOP).map(x => `<a href="${curl(x)}" style="display:block;padding:4px 0;font-size:13px;${x === ctx.sub || (!subs.length && x === ctx.top) ? "color:var(--berry);font-weight:700" : ""}">${esc(x)}</a>`).join("")}</div>
      <div><h4>Brand</h4>${brandCounts.map(([b, c]) => `<label><input type="checkbox" data-fb="${esc(b)}" ${fBrands.has(b) ? "checked" : ""}>${esc(b)}<span>${c}</span></label>`).join("")}</div>
      <div><h4>Filter by price</h4><div class="pf"><label for="pmin">Min<input id="pmin" type="number" value="${cmin}" min="0" step="50"></label><label for="pmax">Max<input id="pmax" type="number" value="${cmax}" min="0" step="50"></label></div><button class="btn line" id="pfgo" style="height:34px;margin-top:8px">Filter</button></div>
    </aside>
    <div><div class="toolbar"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="filterbtn" id="fbtn">Filter</button><div class="active">${[...fBrands].map(b => `<button data-fb="${esc(b)}" data-off>${esc(b)} ×</button>`).join("")}${fPrice ? `<button data-fp>${tk(cmin)} – ${tk(cmax)} ×</button>` : ""}</div></div>
      <label for="sortSel" style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)">Sort by <select id="sortSel"><option value="menu">Default sorting</option><option value="popular">Sort by popularity</option><option value="rating">Sort by average rating</option><option value="date">Sort by latest</option><option value="low">Sort by price: low to high</option><option value="high">Sort by price: high to low</option></select></label></div>
      <div class="pgrid">${list.length ? list.map(card).join("") : `<div class="empty">No products were found matching your selection. <a href="shop.html" style="color:var(--berry);font-weight:700">Back to shop</a></div>`}</div></div></div></div>`;
    const sel = $("#sortSel"); sel.value = sortBy; sel.onchange = () => { sortBy = sel.value; draw(); };
  };
  v.addEventListener("click", e => {
    const t = e.target.closest("[data-off],[data-fp],#pfgo,#fbtn"); if (!t) return;
    if (t.dataset.off !== undefined) fBrands.delete(t.dataset.fb);
    else if (t.dataset.fp !== undefined) fPrice = "";
    else if (t.id === "pfgo") fPrice = `${+$("#pmin").value || 0}-${+$("#pmax").value || 99999}`;
    else if (t.id === "fbtn") { sideOpen = !sideOpen; $("#side").classList.toggle("on", sideOpen); return; }
    draw();
  });
  v.addEventListener("change", e => { const t = e.target; if (t.dataset.fb) { t.checked ? fBrands.add(t.dataset.fb) : fBrands.delete(t.dataset.fb); draw(); } });
  draw();
};

const HOW = {"Face Wash & Cleansers":["Wet face with lukewarm water.","Massage a small amount for 30–60 seconds.","Rinse and pat dry. Use morning and night."],"Serums & Treatments":["Apply 2–3 drops to clean, dry skin.","Follow with moisturiser.","Use sunscreen in the daytime. Patch test first."],"Moisturizers & Creams":["Apply a pea-sized amount after serum.","Smooth over face and neck."],"Sun Care":["Apply generously as the last morning step.","Reapply every 2–3 hours outdoors."],"Lip Care":["Apply a thin layer to clean lips.","Reapply as needed."],"Shampoo & Conditioner":["Massage into wet scalp.","Lather and rinse."],"Hair Masks & Treatments":["Apply to lengths after shampoo.","Leave 5–10 minutes, then rinse."],"Hair Serums":["Apply as directed on pack.","Do not rinse."],"Body Care":["Use on damp skin after showering.","Massage until absorbed."],"Underarm & Personal Care":["Apply to clean, dry underarms.","Let dry before dressing."]};
pages.product = v => {
  const p = P.find(x => x.slug === qs.get("p")) || P[0];
  let gI = 0, qty = 1;
  const how = HOW[p.sub || p.top] || HOW["Body Care"];
  const related = P.filter(x => x.top === p.top && x.sku !== p.sku).slice(0, 10);
  const main = i => p.imgs[i] ? `<img src="${IMG + p.imgs[i]}" alt="${esc(p.name)}">` : `<div class="noimg"><div>${esc(p.title)}<small>Photo needed</small></div></div>`;
  document.title = `${p.name} – Hello Skin`;
  document.body.classList.add("pdp-on");
  v.innerHTML = `<div class="wrap"><div class="crumbs"><a href="index.html">Home</a> › <a href="${curl(p.top)}">${esc(p.top)}</a>${p.sub ? ` › <a href="${curl(p.sub)}">${esc(p.sub)}</a>` : ""} › ${esc(p.title)}</div>
  <section class="pdp"><div class="gal"><div class="mainimg" id="mainimg">${main(0)}</div>${p.imgs.length > 1 ? `<div class="th">${p.imgs.map((s, i) => `<button class="${i ? "" : "on"}" data-g="${i}" aria-label="Image ${i + 1}"><img src="${IMG + s}" alt=""></button>`).join("")}</div>` : ""}</div>
  <div class="pi"><a class="v" href="shop.html?brand=${slugOf(p.brand)}">${esc(p.brand)}</a><h1>${esc(p.title)}</h1>
    <div class="rv" style="font-size:13px"><i>★★★★★</i> ${p.rating} · ${p.reviews} ratings <span class="phn">Placeholder</span></div>
    <div class="pr"><b>${tk(p.price)}</b>${p.compare ? `<s>${tk(p.compare)}</s><span class="tg off">Sale</span>` : ""}<span class="phn">Placeholder price</span></div>
    <p style="margin:0">${esc(p.short)}.</p>
    <div class="offers"><span><b>Free delivery</b> on orders over ${tk(FREE)}</span><span><b>Cash on delivery</b> all over Bangladesh</span></div>
    <form class="buy" id="buy"><div class="qty"><button type="button" data-qty="-1" aria-label="Decrease">−</button><span id="qv">1</span><button type="button" data-qty="1" aria-label="Increase">+</button></div><button class="btn" type="submit">Add to cart</button></form>
    <div class="del"><div>${IC.orig}100% original</div><div>${IC.cod}Cash on delivery</div><div>${IC.ret}7-day returns</div></div>
    <div class="acc"><details open><summary>Description</summary><div class="bd">${esc(p.short)}. ${esc(p.brand)} · ${esc(p.sub || p.top)}.</div></details>
    <details><summary>Key ingredients</summary><div class="bd"><span class="draft">Draft copy</span><br>${esc(p.short)}. Full ingredient list to be added from the pack.</div></details>
    <details><summary>How to use</summary><div class="bd"><span class="draft">Draft copy</span><ul>${how.map(h => `<li>${h}</li>`).join("")}</ul></div></details>
    <details><summary>Delivery &amp; returns</summary><div class="bd"><ul><li>Inside Dhaka ৳60, 1–2 days. Outside Dhaka ৳120, 2–4 days.</li><li>Free over ${tk(FREE)}.</li><li>Unopened items returnable within 7 days. <a href="shipping-returns.html" style="color:var(--berry);text-decoration:underline">Full policy</a></li></ul></div></details></div>
  </div></section>
  ${related.length ? `<section class="sec"><div class="sh"><h2>You may also like</h2><a class="va" href="${curl(p.top)}">View all</a></div>${rail(related, "r-rel")}</section>` : ""}</div>
  <div class="satc on"><div><b>${tk(p.price)}</b>${p.compare ? ` <s style="color:var(--muted);font-size:12px">${tk(p.compare)}</s>` : ""}</div><button class="btn full" data-add="${p.sku}">Add to cart</button></div>`;
  v.addEventListener("click", e => {
    const t = e.target.closest("[data-g],[data-qty]"); if (!t) return;
    if (t.dataset.g) { gI = +t.dataset.g; $("#mainimg").innerHTML = main(gI); $$("[data-g]").forEach(b => b.classList.toggle("on", +b.dataset.g === gI)); }
    if (t.dataset.qty) { qty = Math.max(1, qty + +t.dataset.qty); $("#qv").textContent = qty; }
  });
  $("#buy").onsubmit = e => { e.preventDefault(); add(p.sku, qty); };
};

pages.cart = v => {
  const draw = () => {
    if (!cart.length) {
      v.innerHTML = `<section class="page-head"><div class="wrap"><h1>Cart</h1></div></section>
      <div class="wrap empty-page"><h2>Your cart is currently empty.</h2><p class="muted" style="margin:0">Browse cleansers, serums and SPF picked for humid days.</p><a class="btn" href="shop.html">Return to shop</a></div>`;
      return;
    }
    const T = totals();
    const cross = P.filter(p => !cart.find(i => i.sku === p.sku) && p.best).slice(0, 4);
    v.innerHTML = `
    <section class="page-head"><div class="wrap"><h1>Cart</h1><div class="steps-bar"><b>Cart</b><i>/</i><span>Checkout</span><i>/</i><span>Order complete</span></div></div></section>
    <div class="wrap">
      <div id="cnote"></div>
      <div class="cart-grid">
        <form id="cform" style="min-width:0">
          <table class="ctable">
            <thead><tr><th colspan="2">Product</th><th class="num">Price</th><th style="text-align:center">Quantity</th><th class="num">Subtotal</th><th><span hidden>Remove</span></th></tr></thead>
            <tbody>${cart.map(i => { const p = bySku[i.sku]; return `<tr>
              <td class="pimg"><a href="${purl(p)}">${p.imgs[0] ? `<img src="${IMG + p.imgs[0]}" alt="">` : `<div class="ni"></div>`}</a></td>
              <td class="pn"><small>${esc(p.brand)}</small><a href="${purl(p)}">${esc(p.title)}</a></td>
              <td class="num pr-c">${tk(p.price)}</td>
              <td class="qt" style="text-align:center"><div class="qty-in"><button type="button" data-step="${p.sku}|-1" aria-label="Decrease">−</button><input type="number" min="0" max="99" value="${i.q}" data-qin="${p.sku}" aria-label="Quantity for ${esc(p.title)}"><button type="button" data-step="${p.sku}|1" aria-label="Increase">+</button></div></td>
              <td class="num sb">${tk(p.price * i.q)}</td>
              <td class="x" style="text-align:right"><button type="button" class="rm" data-rm="${p.sku}" aria-label="Remove ${esc(p.title)}">×</button></td>
            </tr>`; }).join("")}</tbody>
          </table>
          <div class="cart-actions">
            <div class="coupon"><label for="ccode" hidden>Coupon</label><input id="ccode" placeholder="Coupon code" value=""><button type="button" class="btn line" id="capply">Apply coupon</button></div>
            <button class="btn line" type="submit" id="cupdate" disabled>Update cart</button>
          </div>
          <p class="fine" style="margin-top:12px">Try the example coupon <b>HELLO10</b> for 10% off.</p>
        </form>
        <aside class="totals">
          <h2>Cart totals</h2>
          <div class="trow"><span>Subtotal</span><span>${tk(T.sub)}</span></div>
          ${T.code ? `<div class="trow"><span>Coupon: ${esc(T.code)} <button class="link" style="font-size:11px;margin-left:6px" id="crm">Remove</button></span><span class="disc">−${tk(T.disc)}</span></div>` : ""}
          <div><div class="trow" style="margin-bottom:10px"><span>Shipping</span></div>
            <div class="shipopts">${RATES.map(r => `<label><input type="radio" name="ship" value="${r.id}" ${T.ship === r.id ? "checked" : ""}>${r.label}<span class="amt">${tk(r.cost)}</span></label>`).join("")}
            ${T.free ? `<label><input type="radio" name="ship" value="free" ${T.ship === "free" ? "checked" : ""}>Free shipping<span class="amt">${tk(0)}</span></label>` : `<p class="fine" style="margin:0">Add ${tk(FREE - T.sub)} more for free shipping.</p>`}</div></div>
          <div class="trow total"><span>Total</span><span>${tk(T.total)}</span></div>
          <a class="btn full" href="checkout.html">Proceed to checkout</a>
        </aside>
      </div>
      ${cross.length ? `<section style="padding-bottom:80px"><div class="sh"><h2>You may be interested in…</h2></div><div class="pgrid">${cross.map(card).join("")}</div></section>` : ""}
    </div>`;
    const dirty = () => { $("#cupdate").disabled = false; };
    $$("[data-qin]").forEach(inp => inp.oninput = dirty);
    $$("[data-step]").forEach(b => b.onclick = () => { const [s, d] = b.dataset.step.split("|"); const inp = $(`[data-qin="${s}"]`); inp.value = Math.max(0, (+inp.value || 0) + +d); dirty(); });
    $("#cform").onsubmit = e => { e.preventDefault(); $$("[data-qin]").forEach(inp => setQ(inp.dataset.qin, +inp.value)); note("Cart updated.", "ok"); };
    $("#capply").onclick = () => { const c = $("#ccode").value.trim().toUpperCase(); if (COUPONS[c]) { store.set("coupon", c); draw(); note("Coupon code applied successfully.", "ok"); } else note(c ? `Coupon "${esc(c)}" does not exist!` : "Please enter a coupon code.", "bad"); };
    $("#crm") && ($("#crm").onclick = () => { store.del("coupon"); draw(); note("Coupon has been removed.", "ok"); });
    $$('[name="ship"]').forEach(r => r.onchange = () => { store.set("ship", r.value); draw(); });
  };
  const note = (m, k) => { const n = $("#cnote"); if (n) n.innerHTML = `<div class="notice ${k}" style="margin-top:24px">${m}</div>`; };
  v.addEventListener("click", e => { const b = e.target.closest("[data-rm]"); if (b) { const t = bySku[b.dataset.rm].title; setQ(b.dataset.rm, 0); note(`“${esc(t)}” removed.`, "ok"); } });
  document.addEventListener("cart:change", draw);
  draw();
};

pages.checkout = v => {
  if (!cart.length) { v.innerHTML = `<section class="page-head"><div class="wrap"><h1>Checkout</h1></div></section><div class="wrap empty-page"><h2>Your cart is currently empty.</h2><a class="btn" href="shop.html">Return to shop</a></div>`; return; }
  const saved = store.get("billing", {});
  const F = (id, label, type = "text", req = true, extra = "") => `<div class="field" data-f="${id}"><label for="${id}">${label}${req ? ' <span class="req">*</span>' : ' <span class="muted">(optional)</span>'}</label><input id="${id}" name="${id}" type="${type}" ${req ? "required" : ""} value="${esc(saved[id] || "")}" ${extra}></div>`;
  const draw = () => {
    const T = totals();
    $("#review").innerHTML = `<h2>Your order</h2>
      ${cart.map(i => { const p = bySku[i.sku]; return `<div class="ritem"><span class="im">${p.imgs[0] ? `<img src="${IMG + p.imgs[0]}" alt="">` : `<span class="ni" style="display:block"></span>`}<span class="q">${i.q}</span></span><span>${esc(p.brand)} ${esc(p.title)}</span><span>${tk(p.price * i.q)}</span></div>`; }).join("")}
      <div class="trow" style="border-top:1px solid var(--line);padding-top:14px"><span>Subtotal</span><span>${tk(T.sub)}</span></div>
      ${T.code ? `<div class="trow"><span>Coupon: ${esc(T.code)}</span><span class="disc">−${tk(T.disc)}</span></div>` : ""}
      <div><div class="trow" style="margin-bottom:10px"><span>Shipping</span></div><div class="shipopts">${RATES.map(r => `<label><input type="radio" name="ship" value="${r.id}" ${T.ship === r.id ? "checked" : ""}>${r.label}<span class="amt">${tk(r.cost)}</span></label>`).join("")}${T.free ? `<label><input type="radio" name="ship" value="free" ${T.ship === "free" ? "checked" : ""}>Free shipping<span class="amt">${tk(0)}</span></label>` : ""}</div></div>
      <div class="trow total"><span>Total</span><span>${tk(T.total)}</span></div>
      <div class="pay">
        <div class="pm"><label><input type="radio" name="pay" value="cod" checked>Cash on delivery</label><div class="pd" data-pd="cod">Pay with cash when your order arrives.</div></div>
        <div class="pm"><label><input type="radio" name="pay" value="bacs">Direct bank transfer</label><div class="pd" data-pd="bacs" hidden>Pay into our bank account and use your order number as the reference. We ship once the payment clears.</div></div>
      </div>
      <p class="fine" style="margin:0">Your personal data will be used to process your order and for other purposes described in our <a class="link" href="shipping-returns.html#privacy">privacy policy</a>.</p>
      <label class="check"><input type="checkbox" id="terms" required><span>I have read and agree to the website <a class="link" href="shipping-returns.html#terms">terms and conditions</a> <span class="req" style="color:#B3261E">*</span></span></label>
      <button class="btn full" type="submit" form="coform" style="height:54px">Place order · ${tk(T.total)}</button>`;
    $$('[name="ship"]').forEach(r => r.onchange = () => { store.set("ship", r.value); draw(); });
    $$('[name="pay"]').forEach(r => r.onchange = () => $$("[data-pd]").forEach(d => d.hidden = d.dataset.pd !== r.value));
  };
  v.innerHTML = `
  <section class="page-head"><div class="wrap"><h1>Checkout</h1><div class="steps-bar"><a href="cart.html">Cart</a><i>/</i><b>Checkout</b><i>/</i><span>Order complete</span></div></div></section>
  <div class="wrap">
    <div class="notice" style="margin-top:24px"><span>Returning customer?</span><a class="link" href="my-account.html">Click here to log in</a></div>
    <div class="co-grid">
      <form id="coform" novalidate style="min-width:0">
        <div class="co-sec"><h2>Billing details</h2>
          <div class="row2">${F("first_name", "First name")}${F("last_name", "Last name")}</div>
          ${F("phone", "Phone", "tel", true, 'placeholder="01XXXXXXXXX" inputmode="tel"')}
          ${F("email", "Email address", "email", false)}
          <div class="field" data-f="state"><label for="state">District <span class="req">*</span></label><select id="state" name="state" required><option value="">Select a district…</option>${DISTRICTS.map(d => `<option ${saved.state === d ? "selected" : ""}>${d}</option>`).join("")}</select></div>
          ${F("city", "Town / City")}
          ${F("address_1", "Street address", "text", true, 'placeholder="House number and street name"')}
          ${F("postcode", "Postcode / ZIP", "text", false)}
        </div>
        <div class="co-sec" style="border-bottom:0;margin-bottom:0">
          <label class="check"><input type="checkbox" id="shipdiff">Ship to a different address?</label>
          <div id="shipaddr" hidden style="display:grid;gap:16px">
            <div class="row2"><div class="field"><label for="s_first">First name</label><input id="s_first"></div><div class="field"><label for="s_last">Last name</label><input id="s_last"></div></div>
            <div class="field"><label for="s_addr">Street address</label><input id="s_addr"></div>
          </div>
          <div class="field"><label for="notes">Order notes <span class="muted">(optional)</span></label><textarea id="notes" placeholder="Notes about your order, e.g. a landmark for delivery."></textarea></div>
        </div>
      </form>
      <aside class="review" id="review"></aside>
    </div>
  </div>`;
  draw();
  $("#coform").addEventListener("input", e => { const f = e.target.closest(".field.bad"); if (f) { f.classList.remove("bad"); $(".err", f)?.remove(); } });
  $("#coform").addEventListener("change", e => { const f = e.target.closest(".field.bad"); if (f) { f.classList.remove("bad"); $(".err", f)?.remove(); } });
  $("#shipdiff").onchange = e => $("#shipaddr").hidden = !e.target.checked;
  $("#state").onchange = e => { if (!totals().free) { store.set("ship", e.target.value === "Dhaka" ? "dhaka" : "outside"); draw(); } };
  $("#coform").onsubmit = e => {
    e.preventDefault();
    let ok = true; const data = {};
    $$("[data-f]").forEach(f => {
      const inp = $("input,select", f); const val = inp.value.trim(); data[inp.id] = val;
      let msg = inp.required && !val ? "is a required field." : "";
      if (!msg && inp.id === "phone" && !/^(\+?88)?01[3-9]\d{8}$/.test(val.replace(/[\s-]/g, ""))) msg = "is not a valid Bangladeshi mobile number.";
      if (!msg && inp.id === "email" && val && !/^\S+@\S+\.\S+$/.test(val)) msg = "is not a valid email address.";
      f.classList.toggle("bad", !!msg); $(".err", f)?.remove();
      if (msg) { ok = false; f.insertAdjacentHTML("beforeend", `<span class="err">${$("label", f).childNodes[0].textContent.trim()} ${msg}</span>`); }
    });
    if (!$("#terms").checked) { ok = false; toast("Please read and accept the terms and conditions to proceed."); }
    if (!ok) { const b = $(".field.bad"); b && b.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    store.set("billing", data);
    const T = totals();
    const order = { no: 1000 + Math.floor(Math.random() * 9000), date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), items: cart, T, pay: $('[name="pay"]:checked').value, billing: data, rateLabel: T.ship === "free" ? "Free shipping" : RATES.find(r => r.id === T.ship).label };
    store.set("lastOrder", order);
    store.set("orders", [order, ...store.get("orders", [])].slice(0, 10));
    cart = []; saveCart(); store.del("coupon");
    location.href = "order-received.html";
  };
};

function orderTable(o) {
  return `<table class="otable"><thead><tr><th>Product</th><th>Total</th></tr></thead><tbody>
    ${o.items.map(i => { const p = bySku[i.sku]; return p ? `<tr><td><a class="link" href="${purl(p)}">${esc(p.brand)} ${esc(p.title)}</a> × ${i.q}</td><td>${tk(p.price * i.q)}</td></tr>` : ""; }).join("")}</tbody>
    <tfoot><tr><th>Subtotal:</th><td>${tk(o.T.sub)}</td></tr>${o.T.code ? `<tr><th>Discount:</th><td>−${tk(o.T.disc)}</td></tr>` : ""}<tr><th>Shipping:</th><td>${o.T.rate ? tk(o.T.rate) : "Free"} <span class="muted">via ${esc(o.rateLabel)}</span></td></tr><tr><th>Payment method:</th><td>${o.pay === "cod" ? "Cash on delivery" : "Direct bank transfer"}</td></tr><tr><th>Total:</th><td><b>${tk(o.T.total)}</b></td></tr></tfoot></table>`;
}
pages.received = v => {
  const o = store.get("lastOrder", null);
  if (!o) { v.innerHTML = `<section class="page-head"><div class="wrap"><h1>Order received</h1></div></section><div class="wrap empty-page"><h2>No recent order found.</h2><p class="muted" style="margin:0">Place an order from the checkout to see this page.</p><a class="btn" href="shop.html">Return to shop</a></div>`; return; }
  const b = o.billing;
  v.innerHTML = `
  <section class="page-head"><div class="wrap"><h1>Order received</h1><div class="steps-bar"><span>Cart</span><i>/</i><span>Checkout</span><i>/</i><b>Order complete</b></div></div></section>
  <div class="wrap thanks">
    <div class="notice ok">Thank you. Your order has been received.</div>
    <div class="ometa"><div><span>Order number</span><b>${o.no}</b></div><div><span>Date</span><b>${o.date}</b></div><div><span>Total</span><b>${tk(o.T.total)}</b></div><div><span>Payment method</span><b>${o.pay === "cod" ? "Cash on delivery" : "Bank transfer"}</b></div></div>
    ${o.pay === "cod" ? `<p style="margin:0">Pay with cash when your order arrives.</p>` : `<p style="margin:0">Please transfer the total to our bank account and use order number <b>${o.no}</b> as the reference. <span class="example">Bank details added in WooCommerce settings</span></p>`}
    <div><h2 style="font-size:22px;margin-bottom:14px">Order details</h2>${orderTable(o)}</div>
    <div><h2 style="font-size:22px;margin-bottom:14px">Billing address</h2><address class="addr">${esc(b.first_name)} ${esc(b.last_name)}<br>${esc(b.address_1)}<br>${esc(b.city)}, ${esc(b.state)}${b.postcode ? " " + esc(b.postcode) : ""}<br>${esc(b.phone)}${b.email ? "<br>" + esc(b.email) : ""}</address></div>
    <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="shop.html">Continue shopping</a><a class="btn line" href="my-account.html">View my account</a></div>
  </div>`;
};

pages.account = v => {
  const user = store.get("user", null);
  if (!user) {
    v.innerHTML = `
    <section class="page-head"><div class="wrap"><h1>My account</h1></div></section>
    <div class="wrap acct">
      <form id="login"><h2>Login</h2>
        <div class="field"><label for="lu">Username or email address <span class="req">*</span></label><input id="lu" required autocomplete="username"></div>
        <div class="field"><label for="lp">Password <span class="req">*</span></label><input id="lp" type="password" required autocomplete="current-password"></div>
        <label class="check"><input type="checkbox">Remember me</label>
        <div><button class="btn" type="submit">Log in</button></div>
        <a class="link" href="#" id="lost" style="justify-self:start">Lost your password?</a>
      </form>
      <form id="register"><h2>Register</h2>
        <div class="field"><label for="re">Email address <span class="req">*</span></label><input id="re" type="email" required autocomplete="email"></div>
        <p class="fine" style="margin:0">A link to set a new password will be sent to your email address.</p>
        <p class="fine" style="margin:0">Your personal data will be used to support your experience throughout this website and for other purposes described in our <a class="link" href="shipping-returns.html#privacy">privacy policy</a>.</p>
        <div><button class="btn line" type="submit">Register</button></div>
      </form>
    </div>`;
    $("#login").onsubmit = e => { e.preventDefault(); store.set("user", { name: $("#lu").value.split("@")[0] }); location.reload(); };
    $("#register").onsubmit = e => { e.preventDefault(); store.set("user", { name: $("#re").value.split("@")[0] }); location.reload(); };
    $("#lost").onclick = e => { e.preventDefault(); toast("Password reset isn't connected in this preview"); };
    return;
  }
  const orders = store.get("orders", []), b = store.get("billing", {});
  const tabs = { dashboard: "Dashboard", orders: "Orders", addresses: "Addresses", details: "Account details", logout: "Log out" };
  let tab = "dashboard";
  const body = () => ({
    dashboard: `<h2>Hello ${esc(user.name)}</h2><p style="margin:0">From your account dashboard you can view your <button class="link" data-tab="orders">recent orders</button>, manage your <button class="link" data-tab="addresses">shipping and billing addresses</button>, and <button class="link" data-tab="details">edit your password and account details</button>.</p>`,
    orders: orders.length ? `<h2>Orders</h2><div class="tscroll"><table class="otable"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead><tbody>${orders.map(o => `<tr><td>#${o.no}</td><td>${o.date}</td><td>Processing</td><td>${tk(o.T.total)} for ${o.items.reduce((a, i) => a + i.q, 0)} items</td></tr>`).join("")}</tbody></table></div>` : `<div class="notice"><span>No order has been made yet.</span><a class="btn line" href="shop.html">Browse products</a></div>`,
    addresses: `<h2>Addresses</h2><p class="muted" style="margin:0">The following addresses will be used on the checkout page by default.</p><div class="row2"><div><h3 style="font-size:15px;margin-bottom:8px">Billing address</h3><address class="addr">${b.first_name ? `${esc(b.first_name)} ${esc(b.last_name)}<br>${esc(b.address_1)}<br>${esc(b.city)}, ${esc(b.state)}<br>${esc(b.phone)}` : "You have not set up this type of address yet."}</address></div><div><h3 style="font-size:15px;margin-bottom:8px">Shipping address</h3><address class="addr">You have not set up this type of address yet.</address></div></div>`,
    details: `<h2>Account details</h2><form id="det" style="display:grid;gap:16px;max-width:520px"><div class="row2"><div class="field"><label for="dfn">First name</label><input id="dfn" value="${esc(b.first_name || "")}"></div><div class="field"><label for="dln">Last name</label><input id="dln" value="${esc(b.last_name || "")}"></div></div><div class="field"><label for="ddn">Display name</label><input id="ddn" value="${esc(user.name)}"></div><div class="field"><label for="dem">Email address</label><input id="dem" type="email" value="${esc(b.email || "")}"></div><div><button class="btn" type="submit">Save changes</button></div></form>`
  }[tab]);
  const draw = () => {
    v.innerHTML = `<section class="page-head"><div class="wrap"><h1>My account</h1></div></section>
    <div class="wrap dash"><nav class="dnav">${Object.entries(tabs).map(([k, l]) => `<button class="${k === tab ? "on" : ""}" data-tab="${k}">${l}</button>`).join("")}</nav><div class="dbody">${body()}</div></div>`;
    $("#det") && ($("#det").onsubmit = e => { e.preventDefault(); toast("Account details changed successfully."); });
  };
  v.addEventListener("click", e => { const t = e.target.closest("[data-tab]"); if (!t) return; if (t.dataset.tab === "logout") { store.del("user"); location.reload(); return; } tab = t.dataset.tab; draw(); });
  draw();
};

pages.about = v => {
  const a = bySku["HS-DEC-001"], b = bySku["HS-DK-014"];
  v.innerHTML = `
  <section class="page-head"><div class="wrap"><p class="label muted" style="margin:0 0 12px">About us</p><h1>Skincare you can trust, delivered across Bangladesh.</h1></div></section>
  <section class="about-split"><div class="img"><img src="${IMG + a.imgs[2]}" alt="" loading="lazy"></div>
    <div class="txt"><p class="label muted" style="margin:0">Our story</p><h2>Fewer products. Better ones.</h2>
    <p>Hello Skin started with a simple frustration: it is hard to know whether the serum you ordered online is the real thing. We buy only from official distributors, store products away from heat, and stock a short list of formulas that work in our climate.</p>
    <p>Our shelves cover the routine most skin needs: a gentle cleanser, a targeted serum, a light moisturiser and a sunscreen you'll actually wear, plus hair and body care from brands we trust.</p>
    <div><a class="btn" href="shop.html">Shop the range</a></div></div></section>
  <section class="sec"><div class="wrap"><div class="sh"><h2>What we promise</h2></div>
    <div class="vals"><div><h3>100% authentic</h3><p>Every product comes from the brand or its official distributor in Bangladesh.</p></div><div><h3>Honest advice</h3><p>We'll tell you when you don't need another product. Ask us anything on Facebook.</p></div><div><h3>Delivered with care</h3><p>Cash on delivery nationwide, and free delivery on orders over ${tk(FREE)}.</p></div></div>
  </div></section>
  <section class="about-split"><div class="txt"><p class="label muted" style="margin:0">${BRANDS.length} brands, ${P.length} products</p><h2>Brands we carry</h2><p>${BRANDS.join(", ")}.</p><div><a class="link" href="shop.html">Browse all products</a></div></div><div class="img"><img src="${IMG + b.imgs[1]}" alt="" loading="lazy"></div></section>`;
};

pages.contact = v => {
  v.innerHTML = `
  <section class="page-head"><div class="wrap"><h1>Contact us</h1><p>Questions about an order, a product or your routine? Send us a message and we'll reply within one working day.</p></div></section>
  <div class="wrap contact">
    <form id="cf">
      <div class="row2"><div class="field"><label for="cn">Name <span class="req">*</span></label><input id="cn" required></div><div class="field"><label for="cp">Phone</label><input id="cp" type="tel"></div></div>
      <div class="field"><label for="ce">Email <span class="req">*</span></label><input id="ce" type="email" required></div>
      <div class="field"><label for="cs">Topic</label><select id="cs"><option>Order or delivery</option><option>Product question</option><option>Returns</option><option>Something else</option></select></div>
      <div class="field"><label for="cm">Message <span class="req">*</span></label><textarea id="cm" required style="height:160px"></textarea></div>
      <div><button class="btn" type="submit">Send message</button></div>
      <div id="cmsg" aria-live="polite"></div>
    </form>
    <aside class="cinfo">
      <div><h3>Message us</h3><p>The fastest way to reach us is our <a class="link" href="https://www.facebook.com/profile.php?id=61578828301744" target="_blank" rel="noopener">Facebook page</a>.</p></div>
      <div><h3>Phone &amp; email</h3><p><span class="example">Add your phone and email</span></p></div>
      <div><h3>Hours</h3><p>Saturday to Thursday, 10am – 8pm</p></div>
      <div><h3>Help</h3><p><a class="link" href="shipping-returns.html">Shipping &amp; returns</a> · <a class="link" href="shipping-returns.html#faq">FAQ</a></p></div>
    </aside>
  </div>`;
  $("#cf").onsubmit = e => { e.preventDefault(); $("#cmsg").innerHTML = `<div class="notice ok">Thanks, your message has been sent. In the live site this goes to your inbox through the Elementor Pro form.</div>`; e.target.reset(); };
};

pages.policies = v => {
  v.innerHTML = `
  <section class="page-head"><div class="wrap"><h1>Shipping &amp; returns</h1><p>Delivery times, costs and how returns work. <span class="example">Example terms, replace with your own</span></p></div></section>
  <div class="wrap prose">
    <h2>Delivery</h2>
    <ul><li><b>Inside Dhaka:</b> ৳60, delivered in 1–2 working days.</li><li><b>Outside Dhaka:</b> ৳120, delivered in 2–4 working days.</li><li><b>Free delivery</b> on every order over ${tk(FREE)}.</li><li>Cash on delivery is available across Bangladesh.</li></ul>
    <h2>Returns</h2>
    <p>Unopened, unused items can be returned within 7 days of delivery. For hygiene reasons we can't accept opened skincare unless it arrived damaged or was the wrong item. Contact us with your order number and a photo, and we'll arrange a replacement or refund.</p>
    <h2 id="faq">FAQ</h2>
    <div class="faq">
      <details><summary>Are your products original?</summary><div class="a">Yes. We buy only from brands and their official distributors in Bangladesh.</div></details>
      <details><summary>How do I choose the right product?</summary><div class="a">Start with your main concern (acne, dark spots, dryness or sun protection), then browse that category. Message us on Facebook if you're unsure.</div></details>
      <details><summary>Can I change my order after placing it?</summary><div class="a">Contact us as soon as possible. If the order hasn't shipped, we can change or cancel it.</div></details>
      <details><summary>Which payment methods do you accept?</summary><div class="a">Cash on delivery and direct bank transfer.</div></details>
    </div>
    <h2 id="privacy">Privacy policy</h2>
    <p>We use your details only to process and deliver your order and, if you sign up, to send our newsletter. <span class="example">Full policy to be added</span></p>
    <h2 id="terms">Terms and conditions</h2>
    <p>By placing an order you agree to our delivery and returns terms above. <span class="example">Full terms to be added</span></p>
  </div>`;
};

/* ---------------- boot ---------------- */
document.addEventListener("click", e => {
  const a = e.target.closest("[data-add]"); if (a) { e.preventDefault(); add(a.dataset.add); return; }
  const r = e.target.closest("#drawer [data-rm]"); if (r) setQ(r.dataset.rm, 0);
});
chrome();
pages[document.body.dataset.page]($("#view"));
})();
