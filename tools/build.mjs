// Builds the minified CSS the pages actually load.
//   cd tools && npm i && npm run build      (run `npm run icons` first if you added a new icon)
//
//   site.min.css           reset + style + media     (index, aboutus, contact, produqti1) - ONE render-blocking request
//   site-products.min.css  style + reset + media     (products.html - it has always loaded reset.css AFTER
//                          style.css, which removes the footer padding; kept identical on purpose)
//   icons.min.css          icons.css                 loaded NON-blocking (preload + onload) so icons never delay first paint
//
// Edit the plain reset.css / style.css / media.css / icons.css and re-run the build; do not edit *.min.css by hand.
import fs from "node:fs";
import path from "node:path";
import { transform } from "lightningcss";

const root = path.resolve(import.meta.dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const bundles = {
  "site.min.css": ["reset.css", "style.css", "media.css"],
  "site-products.min.css": ["style.css", "reset.css", "media.css"],
  "icons.min.css": ["icons.css"],
};
for (const [out, parts] of Object.entries(bundles)) {
  const code = Buffer.from(parts.map(read).join("\n"));
  const min = transform({ filename: out, code, minify: true }).code;
  fs.writeFileSync(path.join(root, out), min);
  console.log(`${out}: ${(min.length / 1024).toFixed(1)} KB (from ${(code.length / 1024).toFixed(1)} KB)`);
}
