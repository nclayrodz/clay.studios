## Copyright

© 2026 Naomi Clay. All rights reserved.

All images, photographs, and written content on this site are my original work
and may not be copied, reproduced, redistributed, or used for AI/ML training
without written permission.

For licensing or usage requests, contact: n.clay.visuals@gmail.com

# Medical Illustration Portfolio — Template

A static 4-page portfolio site (Home, About, Portfolio, Contact) with a warm/earthy
color palette and placeholder content and images, ready to publish on GitHub Pages.

## Files
- `index.html` — homepage / full-bleed hero / services / featured work / logo carousel
- `about.html` — bio, education timeline, awards, publications
- `portfolio.html` — filterable project grid with grid/gallery toggle + lightbox
- `project-detail.html` — single-project page template (hero, meta, write-up, gallery, prev/next)
- `contact.html` — contact form (static) + details
- `style.css` — all styling, palette defined as CSS variables at the top
- `script.js` — nav dropdown, scroll reveal, logo carousel, portfolio filter/view/lightbox, form handling

## Adding more project pages
`project-detail.html` is a template for one project. To add a real project page:
1. Duplicate the file, e.g. `project-extintos.html`.
2. Update the title, breadcrumb, hero, meta list, body copy, and gallery images.
3. Point the relevant portfolio grid item's `<h3><a>` (in `portfolio.html`) and any "Selected Work" card (in `index.html`) at your new filename instead of `project-detail.html`.
4. Update the `project-nav` prev/next links at the bottom of each project file to chain them together.

## Publish on GitHub Pages
1. Create a new GitHub repo (e.g. `your-username.github.io` for a root site, or any
   name for a project site).
2. Push these files to the repo root (or a `/docs` folder — your choice).
3. In the repo, go to **Settings → Pages**, set the source branch (usually `main`)
   and folder (`/root` or `/docs`), then save.
4. Your site will be live at `https://your-username.github.io/repo-name/`
   (or `https://your-username.github.io/` if you used the special repo name).

## Customizing
- **Palette**: edit the `:root` variables at the top of `style.css`
  (`--bg`, `--ink`, `--rust`, `--olive`, `--clay`, etc).
- **Images**: replace any `<div class="plate" ...>` block with a real `<img>` tag,
  or keep the div and set a `background-image` in CSS if you want to keep the
  figure-number/caption overlay.
- **Text**: every placeholder is plain text in the HTML — search for
  "Placeholder" to find what to replace.
- **Contact form**: the form doesn't submit anywhere (GitHub Pages is static-only).
  Wire it up with a free service like Formspree or Getform by pointing the
  `<form>` tag's `action` at their endpoint.

## Fonts
Uses Google Fonts (Fraunces + Inter + JetBrains Mono), loaded via `@import` in
`style.css`. No build step or dependencies required.

If you have fewer or more than 6 logos, just add/remove <span class="logo-item"> entries in both the real set and the aria-hidden="true" duplicate set below it — they need to match for the loop to be seamless.
If your logos have very different aspect ratios and 28px height looks off for some, change .logo-item img{ height: 28px; } in style.css to whatever suits your set.
<<<<<<< HEAD
SVG logos work with this exact same markup if you'd rather use those instead of PNG.
=======
SVG logos work with this exact same markup if you'd rather use those instead of PNG.
>>>>>>> eb4e2eda1703248d527f1d52ddb30e29f2d46d1f

# Image dimensions
Export at 2x the size it'll actually display so it looks sharp on retina screens, then compress. Here's what maps to each spot in your current CSS:

# Where	Aspect ratio	Recommended export size

Hero background (full-bleed)	flexible, fills section	2400×1350px or wider (min 1920px wide)

Homepage "Selected Work" cards	4:3	1600×1200px

Portfolio grid plates	~4:3.2	1500×1200px

Project-detail hero image	16:9	2400×1350px

Project-detail gallery images	4:3	1600×1200px

About page portrait	3:4	1200×1600px

Header logo	—	~500px wide, transparent PNG

Logo carousel (client logos)	—	~400×150px, transparent PNG

# A few practical notes:
JPG for photos/illustrations (quality ~80 is the sweet spot — smaller file, barely visible difference), PNG only when you need transparency (logos, line art).
Compress before uploading — run everything through Squoosh or TinyPNG first. Aim for under ~300–400KB per image; a portfolio site with a dozen uncompressed 5MB photos will load noticeably slow, especially on mobile.
Your CSS already uses object-fit: cover wherever you swap in real <img> tags, so images don't need to be exactly that ratio — just close, so nothing gets awkwardly cropped.

# Video
Two real options for a static GitHub Pages site:
Option A — Embed from YouTube/Vimeo (recommended)
Upload the video there (can be set to "unlisted" so it's not publicly searchable, only accessible via your site), then embed:
html
<div class="plate" style="aspect-ratio:16/9;">
  <iframe
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    style="width:100%; height:100%; border:0;"
    allow="accelerated-video; encrypted-media; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>
Why this is the better default: GitHub Pages has bandwidth/storage limits, self-hosted video eats through them fast, and YouTube/Vimeo handle compression, adaptive quality (so mobile doesn't download full-res unnecessarily), and a scrubber/controls for free.
Option B — Self-hosted <video> tag
Only reasonable for short, small clips (a few MB, not full reels):
html
<div class="plate" style="aspect-ratio:16/9;">
  <video controls style="width:100%; height:100%; object-fit:cover;">
    <source src="images/videos/my-clip.mp4" type="video/mp4">
  </video>
</div>
Keep it under ~20–30MB, 1080p or lower, H.264-encoded MP4 — GitHub also hard-blocks any single file over 100MB.