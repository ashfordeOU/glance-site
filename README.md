# glance.ashforde.org

The website for **Glance**, the Mac App Store app: a home page, eight feature pages, a privacy policy and a support page.
It's plain HTML, CSS and JavaScript with no build step and no outside scripts; GitHub Pages serves the repository root.

## Layout

| Path | What it is |
|---|---|
| `index.html` | Home page: what Glance is, then one band per feature, the details, and the download (order and reasons in `AUDIT-2.0.1.md`) |
| `island/`, `shelf/`, `stay-awake/`, `system-monitor/`, `screen-recorder/`, `storage-clean-up/`, `weather-and-world-clocks/`, `docks-and-widgets/` | One page per feature, for search: the home page's band for that feature, then the text, questions (FAQPage data), three related pages and the App Store call (`ui/feature.css`). The nav and footer link them; each home band has a "More about …" link |
| `privacy/`, `support/`, `404.html` | The other pages |
| `sitemap.xml`, `robots.txt`, `llms.txt` | Every indexable page; a plain summary of Glance and its pages for AI agents |
| `ui/site.css`, `ui/site.js` | Shared design system and behaviour (appearance, menu, the Mac App Store link, reveals) |
| `ui/home.css`, `ui/home.js` | The home page's drawn app and its animations |
| `ui/stage.css` | The App Store look: each feature on the gradient of its Mac App Store image, a white headline card with one accent word, glassy chips |
| `ui/live.css`, `ui/live.js` | Stay Awake, Evening Mode, Smart clean-up and the shelf, drawn as the app draws them and playing what they do |
| `ui/tiles.css`, `ui/tiles.js` | The Song finder, the screen recorder and share links (kept in step with the Monorail site's copies; the rain tile in it is no longer placed on this site) |
| `ui/mac.css`, `ui/mac.js`, `ui/screens.js` | The drawn MacBook with the Island, panel, Dashboard, docks and tour |
| `ui/mocks.css`, `ui/mocks.js` | Glance’s own screens redrawn in HTML and CSS (the Weather page, the Dashboard's pages, Monorail's strip) |
| `assets/`, `icons/`, `favicon.ico`, `apple-touch-icon.png` | The Glance icon in every size |
| `img/og.png` | The 1200 × 630 share image |

## Before launch

- **App Store link.** `GLANCE_APP_STORE_URL` in `ui/site.js` holds Glance's listing (id6832553480). While
  `GLANCE_ON_STORE` is false, every Mac App Store button reads "Coming soon to the Mac App Store" and links nowhere;
  set it to true once the app is live and every button reads "Download on the Mac App Store" and links to the listing.

Every page carries `<meta name="apple-itunes-app" content="app-id=6832553480">` for Safari's App Store banner. The nav
and footer are copied into every page: change them everywhere at once.

## One-time setup

1. Create the repository **ashfordeOU/glance-site** on GitHub and push this repository's `main` branch to it.
2. In the repository, open **Settings ▸ Pages** and set **Source** to **GitHub Actions**.
   (The workflow's `configure-pages` step also tries to enable Pages by itself.)
3. Still in **Settings ▸ Pages**, set the **Custom domain** to `glance.ashforde.org`, save, and once the certificate is
   issued tick **Enforce HTTPS**. The `CNAME` file in this repository holds the same domain.
4. At the DNS provider for `ashforde.org`, add a record:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `glance` | `ashfordeou.github.io` |

Every push to `main` (or **Actions ▸ Deploy to GitHub Pages ▸ Run workflow**) then deploys the site.

## Working on it locally

```sh
python3 -m http.server 8000
```

and open http://localhost:8000. The site follows the system's light or dark appearance; the half-filled circle in the
header switches it by hand.
