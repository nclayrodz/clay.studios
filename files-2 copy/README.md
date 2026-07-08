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
