# Aurea Hair Co. — Shopify Theme (Homepage Demo)

A luxury, editorial redesign of the **[shopaureaco.com](https://www.shopaureaco.com)** homepage,
built natively for **Shopify Online Store 2.0** (Liquid + JSON templates + sections).

> This is a **demo homepage**. It is a real, importable Shopify theme — not a React/Next mock.
> Products, prices, variants, collections and cart all bind to live Shopify data once installed.

---

## Install (upload to Shopify)

1. Download this repo as a **ZIP** (Code → Download ZIP), or zip the theme folder.
   - The ZIP must contain the folders at its **root**: `assets/ config/ layout/ locales/ sections/ snippets/ templates/`.
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip file**.
3. Click **Customize** to open the Theme Editor, then **Preview**.

Everything on the homepage is editable in the Theme Editor (hero, benefits, textures,
featured collection, editorial story, categories, featured product, gallery, testimonials, newsletter).

### Point sections at your real collections/products
Section defaults reference the store's existing handles:
`curly-units-and-bundles`, `body-wave-units-and-wavy-units`, `straight-units-and-bundles`,
`frontpage`, and the product `straight-hd-5x5-lace-closure`. If a handle differs on your store,
just re-pick the collection/product in each section via the Theme Editor.

---

## Hero video
The hero plays a bundled, muted, looped campaign film: `assets/aurea-hero.mp4`
(with `assets/aurea-hero-poster.jpg` as the poster/LCP fallback).
In the Theme Editor you can turn the video off (**Use background video**) to fall back to
images, or upload a different Shopify-hosted video.

## Structure
```
assets/     base.css, aurea.js, campaign video + poster, real Aurea photography
config/     settings_schema.json, settings_data.json
layout/     theme.liquid
locales/    en.default.json
sections/   aurea-* homepage sections + header/footer/announcement + main-* page sections
snippets/   product-card, price, icon, meta-tags
templates/  index.json (homepage) + product/collection/cart/search/page/404 JSON
```

## Design system
- **Palette:** ink `#16130f`, ivory `#f7f2ea`, champagne accent `#a9895f` (editable in Theme settings)
- **Type:** Fraunces (editorial serif) + Jost (UI sans), loaded via Google Fonts
- Responsive (tested 375 / 390 / 430 / 1440 / 1920), `prefers-reduced-motion` respected,
  lazy-loaded below the fold, Shopify image CDN sizing.

## Static demo (Vercel / any static host)
`index.html` at the repo root is a **self-contained static version of the homepage**
(same design, real assets, hero video) for presenting the demo without a Shopify store.
Vercel serves it automatically at `/` — no build step, framework preset **Other**.

> Vercel/Netlify cannot run the Shopify theme itself (it's Liquid, rendered by Shopify).
> `index.html` is a visual demo only; the importable theme is everything else in this repo.

## Local preview
`preview.html` (identical to `index.html`) is a **static visual preview only** (not part of the Shopify runtime).
Open it via a local server to eyeball the layout:
```
python3 -m http.server 8791   # then open http://localhost:8791/preview.html
```
Prices/products in the preview are illustrative; the live theme uses real Shopify data.

## Content honesty
Copy and testimonials are drawn from the existing Aurea site. No shipping guarantees,
hair-origin claims, or certifications were invented; unproven claims are left as editable
placeholders in the Theme Editor.
