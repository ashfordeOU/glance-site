# Site audit for Glance 2.0.1

Audited 24 November 2026 on branch `claude/eloquent-newton-d0traq`, before launch. Every page (home, privacy, support,
404) was rendered with Playwright at 1440 and 390 px wide, in dark and in light. Claims were checked against the app's
source (`Sources/`, `Edition.isAppStore`), `CHANGELOG.md` (2.0.1) and `docs/appstore/GLANCE-LISTING.md`.

The rendering itself was clean before and after: no console errors, no failed requests, no horizontal scroll at
390 px, and every internal link and `#anchor` resolves. The problems were structure and repetition.

## The home page

### What was wrong

**No single story.** Sections were numbered 1 to 10 in the source comments, but ran 1, 3, 6b, 4, 2, 5, 7, 6, 8, 9,
"Exactly as it looks", 8, 9, 10. The page went Island, shelf, weather, Dashboard, then back to the menu bar panel and
its Stay Awake and Evening Mode pages, then back to the Island's tools and recorder, then docks and storage. The nav
began with Panel, and the hero's "See what it does" jumped to the panel, past the Island it had just introduced.

**The same thing said or drawn more than once:**

| Repeated | Where |
|---|---|
| Free, no account, nothing collected | The hero card, then straight after it a numbers strip ("Free", "0 accounts"), then the privacy section, the final call and the footer |
| The shelf | Its own band, and a tile "A shelf that works with your files" in the Island's tiles just above it |
| Weather | Its own band, and a tile "World clocks and weather" in the Island's tiles, and a Weather button on the Dashboard's drawing, and the same Weather drawing again in the gallery |
| Chance of rain | The Weather drawing shows the next 48 hours with the chance of rain; a second tile under it drew the next 12 hours' chance of rain again |
| Song finder | The Tools band's drawing, its card, and again as the first line of the "More in the Island" list beside it |
| Meeting Notes | The Record band ("Record your screen or a call, get a transcript") and an "And more" tile |
| Docks | Their own band with four cards, and a "Docks of your own" tile in "And more" |
| Moving apps between docks | The Docks card's paragraph, then the four cards below that show exactly that |
| Privacy Guard and Breaks | Chips on the Storage band ("Microphone switch", "Camera alerts", "Breaks") with nothing told there, then full tiles in "And more" |
| Clipboard history, text and QR codes | Chips in the Tools band and tiles in "And more" (kept: the chips are the App Store look's highlights, the tiles the one place they are explained) |
| "Every screen, up close" gallery | Nine drawings, of which eight were already on the page: the Dashboard's Overview, Weather, the panel, its System, Stay Awake and Evening Mode pages, the Island on Home, Tools and Calendar. Only the Time page was new, and it is one click away on the Dashboard's drawing |
| Monorail | The section's paragraph listed what Monorail adds, then the comparison under it listed the same things |
| "Your Mac, one … away" | "Your Mac, one glance up" (Island), "Your Mac, one click away" (panel), and the Stay Awake band's label "One click away" |

**Inconsistent section styles.** Three features spilled out of their gradient band into a separate dark band below
it with no heading of its own: the Island's eight tiles, the list of Dashboard pages, and the four docks cards. On the
page they read as new sections. The Stay Awake and Evening Mode band already showed the right pattern: the cards
inside the band.

**Headings and content that didn't match.**
- Storage: "Tidy, private, rested." with chips for the microphone switch, camera alerts, time tracking, insights and
  breaks, but the card and the drawing were only about Smart clean-up.
- "Every Dashboard page" listed 16 pages; Glance's Dashboard has 21 (`DashboardSection.available` with
  `Edition.isAppStore`: Agents, Sensors, Bluetooth, Recording and Switches were missing). The numbers strip said
  "16 Dashboard pages" too.
- The Tools band's list was captioned "More in the Island", the same words as the Island's tiles.

**Drawings not true to 2.0.1.**
- The closed Island was drawn in Split bubbles, but since 2.0.1 Just bubbles is the style for new installs (the pill
  hides behind the camera and every live thing floats in its own bubble). The style picker had no Just bubbles.
- The closed Island drew an orange "microphone is on" dot. Since 2.0.1 the closed Island leaves the camera and
  microphone item out (`IslandSensors.closedList`), as macOS's own lights already show it. The hero's description
  for screen readers said the same.
- The Island card said "Rest the pointer on it to peek, click to open it", which in Just bubbles is the camera's job;
  each bubble shows its own card.

### What changed

The page now tells one story, top to bottom:

1. **What Glance is**: the hero card with the App Store button and the drawn Island.
2. **The main features, each once, each in one band**, in the order you meet them on the Mac:
   the Island (with its other pieces as tiles inside the band) → the shelf → weather → Island tools and the Song finder
   → record and share → the menu bar panel → Stay Awake and Evening Mode (two of the panel's pages) → the Dashboard
   (with every page listed in the band) → docks and widgets (with the four ways to move apps inside the band) →
   storage, the privacy switches and breaks.
3. **The details**: and more → the welcome tour → privacy → Monorail, the sibling.
4. **Download**: the final App Store call.

In detail:

- **Removed the numbers strip** under the hero: it repeated the hero's "No account. No in-app purchases." and its
  "16 Dashboard pages" was wrong.
- **Removed the "Every screen, up close" gallery**: eight of its nine drawings were already on the page. The drawing
  code (`ui/mocks.js`) stays; it still draws the Weather page, the Dashboard's pages and Monorail's strip.
- **Moved** the Island's tiles, the Dashboard's page list and the four docks cards into their own bands, styled like
  the Stay Awake and Evening Mode cards (`ui/stage.css`).
- **Island tiles**: the shelf and weather tiles gave way to "Timers, Calendar and Tasks" (from the listing's Timer,
  Calendar and Tasks lines; these had chips but no words anywhere) and "World clocks" (with 2.0.1's Add a City by
  city or country). The floating player joined the Music tile.
- **Weather**: one drawing. The second chance-of-rain tile is gone; its "Weather data by Open-Meteo.com" credit moved
  into the card. Still no Apple Weather, next-hour rain or alerts anywhere.
- **Tools**: the list beside the Song finder no longer repeats it, and is captioned "More tools".
- **Record and share**: Meeting Notes is told here (transcript on your Mac where macOS supports it, a summary on
  macOS 26), and its "And more" tile is gone.
- **Stay Awake and Evening Mode**: labelled "In the panel", which is where they live, instead of a second "one click
  away".
- **Dashboard**: the Weather button on its drawing is gone (weather has its own band); the page list now names all 21
  pages in the app's group order, in a white panel under the drawing.
- **Docks**: the card no longer repeats what the four cards below it show.
- **Storage**: the card now tells all three things its headline promises: Smart clean-up, the Microphone and Camera
  switches (in the listing's words) and Breaks. Their "And more" tiles are gone.
- **And more**: now only what isn't told elsewhere: clipboard history, text and QR codes, time tracking, flights and
  parcels (`IslandAlertsTrips`; the listing's "Reminders for flights and parcels you add"), the ringed menu bar icon
  and how light Glance is on your Mac. Six tiles, two full rows.
- **The welcome tour** gets the page background, so the three detail sections no longer run together on one grey.
- **Monorail**: the paragraph says it adds "a window manager and more"; the comparison under it gives the list once.
- **The Island drawing** (`ui/mac.js`, `ui/screens.js`, `ui/mac.css`): a new Just bubbles state, now the default in
  the hero, the Island, the panel and the docks drawings: the pill behind the camera, what's playing as a round
  artwork bubble with the playing bars (as `IslandBubbles.swift` draws it), Stay Awake and a tea timer as rings, and
  charging. The style picker reads Just bubbles, Split bubbles, One pill, Glances at rest. No microphone dot in any
  closed style. The Island card's text follows 2.0.1: point at a bubble for its card, click the camera to open the
  Island.
- **Nav and footer**, on every page, follow the page's order: Island, Weather, Panel, Stay Awake, Dashboard, Docks,
  Storage, Privacy, Support. The hero's "See what it does" now goes to the Island.

## Support

### What was wrong
- "Why does Storage ask me to choose my home folder?" repeated "Which folders should I choose, and why?" just above it.
- The group "Updates and starting afresh" also held "Why is the icon dimmed while Monorail is open?", "Can Glance
  open when I log in?" and "Which Macs?". "Meeting Notes only hears me" sat under Permissions. "Stay Awake" was a
  group of two.

### What changed
- The Storage question is merged into the folders answer (its one extra point: clean-ups only ever go to the Bin).
- Four groups: **Permissions and folders**; **Using Glance** (Stay Awake, the lid closed, Meeting Notes, opening at
  login, using it with Monorail); **Updates, starting afresh and which Macs**; **Contact**. No answer was reworded.

## Privacy

Left as it is: a legal page with a clear order (summary, what's collected, outside services, share links, crash
reports, permissions, the Enhancer, children, this website, rights, changes, contact). Its data table still names
Apple Weather as a source the app tries first; left alone as asked. Only the shared nav and footer changed.

## 404

Fine. Only the shared nav and footer changed.

## SEO

Unchanged: every page's title, description, canonical, Open Graph and Twitter tags, the structured data and
`sitemap.xml`. The `#island`, `#shelf`, `#weather`, `#panel`, `#awake`, `#evening`, `#day`, `#dashboard`, `#docks`,
`#storage`, `#tools`, `#record`, `#more`, `#tour`, `#privacy` and `#monorail` anchors all still exist; only
`#screenshots` went with the gallery, and nothing linked to it.

## Left alone, to decide

- **The hero and the Island band both draw the Island.** The hero's drawing plays a short loop (closed, Home, Tools);
  the Island band's is the one you can drive. It's the App Store set's first image, so it stays as the hero.
- **The structured data** still says "a Dynamic Island for the Mac notch" in its description and feature list. It
  isn't visible text and was written for search, so it's left as it was; say if it should go.
- **Version**: the hero's eyebrow and the structured data say "version 2.0", which covers 2.0.1; change to 2.0.1 if
  you'd rather be exact.
- **`ui/tiles.js`** still holds the rain tile's code (kept in step with the Monorail site's copy); nothing on this
  site places it any more.
- **The privacy page** doesn't name adsb.lol, which `IslandAlertsTrips.swift` uses for the live position of a flight
  you add. I didn't check whether Glance's build makes that request; worth a look before launch.
