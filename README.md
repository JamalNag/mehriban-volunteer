# Three Years at Mehriban

A one-page site about Jamal Naghizade's volunteer work at the Mehriban Women and Children Shelter, run by the "Clean World" Aid to Women Social Union. Static HTML, no build step. Available in English, Azerbaijani and Russian.

## Files

- `index.html`: the page. English text lives here.
- `assets/styles.css`: design tokens (colours, fonts, motion) at the top, then the layout.
- `assets/i18n.js`: Azerbaijani and Russian translations, keyed by each element's `data-i18n` (or `data-i18n-alt` / `data-i18n-aria`) attribute.
- `assets/main.js`: the language switcher, work-stage tabs, the plain-language before/after example, and the copy-email button.
- `assets/img/`: processed photos only.

## Privacy rules for photos

This site is about a domestic-violence shelter. Any photo added here must follow these rules:

- Blur every child's face.
- Show women staying at the shelter only from behind, never their faces, and only with their agreement.
- Don't show the building, gate, street sign, house number or address.
- Strip metadata. The current images have no EXIF or GPS data.

Never commit the original, unprocessed photos.

## Ornament

The border band is drawn from a Karabakh dragon carpet (Əjdahalı): the S-motif border, the rope guard stripes, and the red field crossed by an ivory lattice. The SVG patterns are at the top of `index.html`. The palette in `styles.css` is sampled from the same carpet.

## Publishing on GitHub Pages

Push this folder to a GitHub repository. Then go to **Settings → Pages**, choose **Deploy from a branch**, and select `main` with the `/ (root)` folder.
