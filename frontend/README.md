# Frontend — React + Vite

Single React app covering the marketing site, the public blog, and the admin
panel, routed with React Router.

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build      # emits dist/ — the backend serves it in production
npm run preview    # preview the production build
```

The dev server proxies `/api` and `/uploads` to `http://localhost:5000`
(see `vite.config.js`), so the browser sees a single origin and the httpOnly
session cookie works without any CORS handling. Start the backend first.

Point it somewhere else with `VITE_API_TARGET=http://host:port npm run dev`.

---

## Layout

```
public/assets/images/       Product photography, served as static files
src/
  main.jsx                  Entry — Router + global.css
  App.jsx                   Route table (public + admin)

  api/client.js             fetch wrapper + typed endpoint helpers
  context/AuthContext.jsx   Session state, resumed from the cookie on mount
  data/products.js          Catalogue, comparison matrix, calculator profiles
  utils/format.js           Dates, file sizes, reading time

  layouts/
    PublicLayout.jsx        Header + Footer shell
    AdminLayout.jsx         Sidebar shell + toast provider

  components/
    common/ScrollToTop.jsx  Scroll reset / hash scrolling on navigation
    site/                   SiteHeader · SiteFooter · HeroCarousel ·
                            ProductCatalog · LoadCalculator ·
                            ComparisonTable · Applications · RfqForm
    blog/BlogCard.jsx
    admin/                  RequireAuth · MediaPicker · Toast

  pages/
    HomePage · BlogPage · PostPage · NotFoundPage
    admin/                  LoginPage · PostsPage · PostEditorPage ·
                            MediaPage · InquiriesPage · SettingsPage

  styles/
    global.css              Site design tokens + marketing styles
    blog.css                Blog listing + article typography
    admin.css               Admin panel
```

## Notes

- **Auth** — `AuthContext` calls `/api/admin/me` once on mount to resume a valid
  cookie. `RequireAuth` waits for that check before redirecting, so a hard
  refresh inside the panel doesn't bounce a signed-in user to the login screen.
- **Hero carousel** — two stacked `<img>` layers crossfade; the incoming image is
  painted on the hidden layer before opacity flips, and the copy swaps at the
  midpoint of the fade. Auto-advances every 3s, pauses on hover.
- **Post content** is rendered with `dangerouslySetInnerHTML`. It comes from the
  admin editor only — see the trust note in the backend README.
- Styles are plain CSS, imported per route. The admin CSS loads only when an
  admin route mounts.
