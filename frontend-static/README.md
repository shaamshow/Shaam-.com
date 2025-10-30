Static frontend snapshot for PodcastPro

This folder contains a static snapshot of the site's public pages suitable for hosting on GitHub Pages.

What I included:
- index.html, about.html, blog.html, gallery.html, videos.html
- Links to existing `assets/` folder (CSS and JS are shared)

Notes:
- Dynamic content (blog list, videos, gallery, admin pages) were snapped as static placeholders.
- To enable dynamic comments/likes: point the frontend's API calls (forms/fetch) to your hosted backend and add CORS headers on the backend.

Deploy to GitHub Pages:
1. Create a new repository on GitHub (e.g., `podcastpro-frontend`).
2. Copy the contents of this folder into the repo root (or into a `docs/` folder).
3. Push and enable GitHub Pages in repository Settings.

If you want, I can:
- Run an automated capture (wget) to include more pages and assets.
- Update form/fetch endpoints to a provided backend URL.
- Create a `.nojekyll` file or a `CNAME` if you have a custom domain.
