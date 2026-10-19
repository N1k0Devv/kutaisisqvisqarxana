# ქუთაისის ქვის ქარხანა (Kutaisi Stone Factory)

Static website for a granite processing factory in Kutaisi, Georgia. Live at https://www.qutstone.com (GitHub Pages, see `CNAME`).

## Pages
`index.html`, `products.html`, `aboutus.html`, `contact.html`, `404.html`

## Build
Pages load minified CSS bundles. Edit `reset.css`, `style.css`, `media.css`, `icons.css`, then:

```
cd tools && npm i && npm run build      # run `npm run icons` first if you add an icon
```

Do not edit `*.min.css` by hand.

## SEO / GEO / AEO
- JSON-LD (LocalBusiness, WebSite, WebPage/CollectionPage/AboutPage/ContactPage, FAQPage, Product list, BreadcrumbList) lives in each page's `<head>`. Keep the business details identical in all pages.
- The FAQ on the home page is visible content and mirrors the `FAQPage` markup. Change both together.
- `robots.txt` explicitly allows search and AI answer-engine crawlers; `llms.txt` is a plain summary for AI tools.
- Update `lastmod` in `sitemap.xml` when a page changes.

## Notes
- The contact form needs EmailJS keys (`window.EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`) before it can send anything.
