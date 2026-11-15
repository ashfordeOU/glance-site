# glance.ashforde.org

The website for **Glance by Ashforde**, the Mac App Store app: a home page, a privacy policy and a support page.
It's plain HTML, CSS and JavaScript with no build step and no outside scripts; GitHub Pages serves the repository root.

## Layout

| Path | What it is |
|---|---|
| `index.html` | Home page, with working drawn copies of the panel, the Island and the Dashboard |
| `privacy/`, `support/`, `404.html` | The other pages |
| `ui/site.css`, `ui/site.js` | Shared design system and behaviour (appearance, menu, the Mac App Store link, reveals) |
| `ui/home.css`, `ui/home.js` | The home page's drawn app and its animations |
| `ui/mocks.css`, `ui/mocks.js` | The “Exactly as it looks” gallery: Glance’s own screens redrawn in HTML and CSS |
| `assets/`, `icons/`, `favicon.ico`, `apple-touch-icon.png` | The Glance icon in every size |
| `img/og.png` | The 1200 × 630 share image |

## Before launch

- **App Store link.** In `ui/site.js`, replace `id0000000000` in `GLANCE_APP_STORE_URL` with the real App Store ID.
  Until then every Mac App Store button reads "Coming soon to the Mac App Store" and links nowhere; afterwards it reads
  "Download on the Mac App Store" and links to the listing.

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
