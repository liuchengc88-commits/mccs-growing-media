# MCCS Growing Media Website

This is the GitHub / Vercel ready version for the MCCS independent website.

## Current Product System

All product models have been updated to the CF series.

Examples:
- ZY-001 → CF-001
- ZY-128 → CF-128
- ZY-128-1 → CF-128-1
- 67 Growing Cup → CF-067

## Where product files are stored

- Product data: `/data/products.json`
- Product CSV: `/data/products-cf.csv`
- Product images: `/assets/products/`
- Product page: `/products/`
- Product manager: `/admin.html`

## How to add or update products

1. Upload the product image to `/assets/products/`.
2. Open `/admin.html` on the website.
3. Add or edit the product information.
4. Download `products.json`.
5. Upload and overwrite `/data/products.json` in GitHub.
6. Commit changes. Vercel will deploy automatically.

## Integrations

- Google Analytics Measurement ID: G-JGR2SQBQHW
- Formspree endpoint: https://formspree.io/f/mredrnea
- Conversion event: submit_quote_form

## Deployment

Upload this package to the GitHub repository root. Any commit to the main branch will trigger a new Vercel deployment.


## Latest update

- Product images use the original embedded images from the uploaded product spreadsheet.
- Dry size fields removed. Wet size is now displayed as Size.


## 2026-06 Product Page Enhancements
- Added CF Series value proposition.
- Added B2B material, certification and export support area.
- Added application filters: Seedling, Orchid, Tissue Culture, Hydroponic and Succulent.
- Added Best Seller / New tags and Quick View details.
- Removed repeated private-label feature lines from product cards.
- Added product comparison table, buyer feedback and Product structured data.
