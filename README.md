# Conservation Tech Solutions — Portfolio Website

A modern, minimalistic service-focused portfolio website for a conservation technology consultancy. Built as a static HTML/CSS/JavaScript site ready for GitHub Pages deployment.

## Quick Start

Simply open `index.html` in a browser, or serve locally:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (if npx available)
npx serve .
```

Then visit `http://localhost:8080`

## File Structure

```
├── index.html          # Main HTML file (all sections)
├── css/
│   └── style.css       # All styles (CSS custom properties, responsive)
├── js/
│   └── main.js         # All interactive behavior (vanilla JS)
├── assets/
│   ├── images/         # Project images (add your own)
│   └── icons/          # Custom icons (if needed)
└── README.md           # This file
```

## Features

- **Responsive Design** — Mobile-first, works on all screen sizes
- **Interactive Solution Cards** — Click to expand for more details
- **Project Case Study Modals** — Click project cards for full case studies
- **Scroll Animations** — Fade-in sections using Intersection Observer
- **Mobile Navigation** — Smooth hamburger menu with slide-in panel
- **Contact Form** — Real-time validation with inline error messages
- **Active Nav Highlighting** — Current section highlighted as you scroll
- **Accessible** — ARIA labels, keyboard navigation, focus indicators, semantic HTML

## Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, flexbox, grid, animations
- **Vanilla JavaScript** — ES6+, no frameworks
- **Lucide Icons** — via CDN (lightweight SVG icons)
- **Inter Font** — via Google Fonts

## GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch and `/ (root)` folder
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Custom Domain (Optional)

1. Create a `CNAME` file in the root with your domain (e.g., `conservationtech.solutions`)
2. Configure DNS with your domain provider (A records or CNAME)
3. In GitHub Pages settings, add your custom domain and enable HTTPS

## Contact Form Integration

The contact form currently simulates submission. To connect it to a real backend:

### Option A: Formspree (easiest)
Replace the form submission in `js/main.js` with:
```javascript
await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' }
});
```

### Option B: EmailJS
Add the EmailJS SDK and configure with your service/template IDs.

## Customization

### Colors
Edit CSS custom properties in `css/style.css`:
```css
:root {
  --color-primary: #2d5f5d;
  --color-secondary: #3d8b85;
  --color-success: #48bb78;
  /* ... */
}
```

### Content
All content is in `index.html` — edit text directly.

### Images
Replace the gradient backgrounds on project cards with real images by updating the `.project-image` backgrounds in `css/style.css`.

## License

© 2026 Conservation Tech Solutions. All rights reserved.
