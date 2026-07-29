# VATZ — Visual • Audio • Tech • Zone

**Premium Creative Digital Agency Website**

A fully static, multi-page agency website built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies — just fast, accessible, production-ready pages.

---

## Pages

| File | Route | Description |
|---|---|---|
| `index.html` | `/` | Homepage — hero, services overview, portfolio preview, testimonials, CTA |
| `about.html` | `/about` | Company story, team, values, awards & recognition |
| `services.html` | `/services` | Full service breakdown: UI/UX, Branding, Web Dev, AI, Photography, Video, Audio, Marketing |
| `solutions.html` | `/solutions` | Product solutions: VatzStore, VATZ AR, VATZ Intelligence, Brand Studio |
| `technologies.html` | `/technologies` | Full tech stack by category: Frontend, Backend, Cloud, Design, AI/ML |
| `portfolio.html` | `/portfolio` | Filterable masonry project gallery with lightbox |
| `industries.html` | `/industries` | Industry verticals served |
| `careers.html` | `/careers` | Open roles with department filter |
| `blog.html` | `/blog` | Article listing with category filter |
| `blog-detail.html` | `/blog-detail` | Single article view with reading progress bar and TOC |
| `contact.html` | `/contact` | Contact form with custom select and validation |

---

## Project Structure

```
vatz/
├── index.html
├── about.html
├── services.html
├── solutions.html
├── technologies.html
├── portfolio.html
├── industries.html
├── careers.html
├── blog.html
├── blog-detail.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── css/
│   └── main.css           # All styles — layout, components, animations, responsive
├── js/
│   ├── main.js            # Core JS — nav, animations, slider, modal, counters, cursor, page loader
│   ├── contact.js         # Contact form validation and submission handling
│   ├── custom-select.js   # Accessible custom dropdown component
│   └── portfolio.js       # Portfolio masonry filter and lightbox
└── assets/
    └── images/
        └── logo/
            └── VATZ_Logo.svg
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 — semantic, ARIA-labelled |
| Styling | CSS3 — custom properties, Grid, Flexbox, animations |
| Scripting | Vanilla JavaScript (ES2024, strict mode) |
| Icons | Font Awesome 6.5.1 (CDN) |
| Images | Unsplash (hotlinked, with SVG gradient fallback) |
| Fonts | Gotham (primary), Inter, Plus Jakarta Sans (fallbacks) |
| SEO | Open Graph, Twitter Card, JSON-LD structured data, canonical URLs |

No npm. No bundler. No runtime dependencies.

---

## Features

**Page Loading**
- Full-screen premium preloader on every page
- Animated VATZ "V" logo — SVG polygon draws in with a scale-up, then gently breathes
- Two-phase progress bar: eased ramp to ~85 % on `DOMContentLoaded`, sprints to 100 % on `window.load`
- Percentage counter synced to the bar in real time
- Exit animation: curtain wipe-up reveals the page, then the overlay fades out
- Self-removes from the DOM after all transitions complete
- 6-second safety timeout guarantees the loader always clears
- `prefers-reduced-motion`: animations skipped, instant dismiss

**Navigation**
- Fixed header with scroll-hide on scroll-down / reveal on scroll-up
- Full-screen mega menu overlay with staggered item animations and reverse-exit on close
- Active page detection via `data-page` attributes
- Responsive mobile navigation

**Animations & Effects**
- Scroll reveal (`IntersectionObserver`) — fade, slide-left, slide-right, scale variants
- Animated number counters triggered on scroll
- Canvas particle background (hero)
- Custom CSS cursor — lagged ring + instant dot, hover/click states
- Parallax orb movement on `mousemove`
- Infinite CSS marquee strip

**Components**
- Schedule a Call modal with form and success state
- WhatsApp floating widget with auto-show tooltip
- Testimonial slider with dot navigation and auto-advance
- Solutions hero image carousel (3-slot: left / center / right)
- Portfolio masonry grid with category filter and lightbox
- Careers job filter by department
- Blog category filter
- Blog reading progress bar
- Blog table-of-contents with active section highlight
- Scroll-to-top button
- Button ripple effect

**SEO & Accessibility**
- Skip-to-content link on every page
- All interactive elements keyboard-accessible
- `aria-label`, `aria-expanded`, `aria-modal`, `role` attributes throughout
- Page loader uses `role="status"` and `aria-live="polite"` for screen reader compatibility
- `robots.txt` and `sitemap.xml` included
- `prefers-reduced-motion` respected — all JS animations disabled when set

---

## Getting Started

This is a static site. No installation or build step required.

**Open locally**

Open any `.html` file directly in a browser, or serve the folder with any static server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# Use the "Live Server" extension and click "Go Live"
```

Then visit `http://localhost:8080`.

---

## Customisation

### Brand colors
All colors are defined as CSS custom properties in `css/main.css`:

```css
:root {
  --purple-600:    #6D28FF;
  --purple-500:    #8B5CF6;
  --purple-400:    #A855F7;
  --blue-500:      #3B82F6;
  --blue-400:      #60A5FA;
  --bg-primary:    #050505;
  --bg-secondary:  #0B0B0B;
  --text-primary:  #F9FAFB;
  --text-secondary:#9CA3AF;
  --text-muted:    #6B7280;
}
```

### Logo
Replace `assets/images/logo/VATZ_Logo.svg` with your own SVG. The `<img>` tag references it on every page via `assets/images/logo/VATZ_Logo.svg`.

The page loader also renders an inline SVG "V" polygon. To change its shape, edit the `<polygon points="...">` inside the `#page-loader` markup in each HTML file, or update the shared snippet if you move it to a server-side include.

### Real images
The site currently uses Unsplash hotlinks. To use local images:
1. Add your image files to `assets/images/`
2. Replace the `src` URLs in the relevant HTML files

A branded SVG gradient placeholder automatically renders if any Unsplash image fails to load (see `initImageFallback` in `main.js`).

### Contact & social links
Update the following across all pages:
- Phone: `+1 (555) 123-4567` → your number
- Email: `hello@vatz.studio` → your email
- Address: `123 Creative Ave, Tech City` → your address
- WhatsApp link in `index.html` (`wa.me/15551234567`)
- Social `href="#"` anchors in every page footer

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome / Edge | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | 15+ |
| Mobile (iOS/Android) | Fully responsive |

CSS custom properties, `IntersectionObserver`, `requestAnimationFrame`, and Canvas 2D API are required. All are available in every modern browser.

---

## SEO Setup

- Each page has a unique `<title>`, `<meta name="description">`, and `<link rel="canonical">`
- Open Graph and Twitter Card meta tags are present on all pages
- JSON-LD structured data (`ProfessionalService`, `BreadcrumbList`, `Service`, etc.)
- `robots.txt` allows all crawlers
- `sitemap.xml` lists all public URLs

Update the domain from `vatz.studio` to your actual domain across all canonical, OG, and sitemap URLs before deploying.

---

## Deployment

Drop the entire folder onto any static hosting platform:

- **Netlify** — drag and drop the folder in the Netlify dashboard
- **Vercel** — `vercel --prod` from the folder root
- **GitHub Pages** — push to a `gh-pages` branch or configure root directory in repo settings
- **AWS S3** — enable static website hosting and upload all files

No server-side processing is needed.

---

## Changelog

### July 2026
- Added full-screen premium page loading animation across all 11 pages
  - SVG logo draw-in + breathe keyframes
  - Two-phase eased progress bar with percentage counter
  - Curtain wipe-up exit with DOM self-cleanup
  - Full `prefers-reduced-motion` support

---

## License

All design, code, and content in this repository are proprietary to VATZ.  
© 2026 VATZ. All rights reserved.
