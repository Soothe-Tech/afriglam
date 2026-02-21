# Frontend Interaction Matrix

Status legend:
- `working`: action performs expected behavior end-to-end.
- `partially_working`: UI responds, but no real backend/state effect.
- `blocked`: no action wired.

## Store and Auth

| Area | Control | File | Status | Notes |
|---|---|---|---|---|
| Login | Sign In submit | `pages/Login.tsx` | partially_working | Navigates without real auth. |
| Login | Forgot password | `pages/Login.tsx` | blocked | Placeholder link (`#`). |
| Login | Password visibility icon | `pages/Login.tsx` | blocked | Visual icon only. |
| Login | Remember me checkbox | `pages/Login.tsx` | blocked | No persistence/session behavior. |
| Login | Google/Apple buttons | `pages/Login.tsx` | blocked | No OAuth action. |
| Signup | Join AfriGlam submit | `pages/Signup.tsx` | partially_working | Navigates without account creation. |
| Signup | Google/Apple buttons | `pages/Signup.tsx` | blocked | No OAuth action. |
| Country select | Region cards | `pages/CountrySelect.tsx` | working | Local state selection works. |
| Country select | Continue to Shop | `pages/CountrySelect.tsx` | working | Route navigation works. |
| Country select | Need help choosing | `pages/CountrySelect.tsx` | blocked | No handler. |
| Onboarding | Skip intro | `pages/Onboarding.tsx` | working | Route navigation works. |
| Onboarding | Get Started | `pages/Onboarding.tsx` | working | Route navigation works. |
| Onboarding | Play button | `pages/Onboarding.tsx` | blocked | No handler. |
| Store layout | Collections/About links | `components/StoreLayout.tsx` | blocked | Placeholder links (`#`). |
| Store layout | Search input | `components/StoreLayout.tsx` | blocked | No behavior. |
| Store layout | Cart icon | `components/StoreLayout.tsx` | partially_working | Navigates to placeholder cart route. |
| Store layout | Footer legal links | `components/StoreLayout.tsx` | blocked | Placeholder links (`#`). |

## Product Discovery and Purchase

| Area | Control | File | Status | Notes |
|---|---|---|---|---|
| Feed | Category pills | `pages/Feed.tsx` | blocked | Visual only. |
| Feed | View details CTA | `pages/Feed.tsx` | working | Navigates to product detail route. |
| Feed | Book a Stylist CTA | `pages/Feed.tsx` | blocked | No handler. |
| Product detail | Thumbnail selector | `pages/ProductDetail.tsx` | partially_working | Visual focus only; same image. |
| Product detail | Quantity + / - | `pages/ProductDetail.tsx` | blocked | No quantity state update. |
| Product detail | Add to cart | `pages/ProductDetail.tsx` | blocked | No cart integration. |
| Product listing | `/products/:category` | `App.tsx` | blocked | Placeholder page. |
| Cart | `/cart` | `App.tsx` | blocked | Placeholder page. |
| Checkout | `/checkout` | `App.tsx` | blocked | Placeholder page. |

## Admin

| Area | Control | File | Status | Notes |
|---|---|---|---|---|
| Admin login | Sign in submit | `pages/admin/AdminLogin.tsx` | partially_working | Navigates without auth. |
| Admin layout | Mobile menu button | `components/AdminLayout.tsx` | blocked | Placeholder only. |
| Dashboard | Download report | `pages/admin/Dashboard.tsx` | blocked | No action. |
| Dashboard | View all orders | `pages/admin/Dashboard.tsx` | blocked | No action. |
| Dashboard | View calendar | `pages/admin/Dashboard.tsx` | blocked | No action. |
| Orders | Filter/Export | `pages/admin/Orders.tsx` | blocked | No logic. |
| Orders | Search input | `pages/admin/Orders.tsx` | blocked | No filtering. |
| Orders | Row action menu | `pages/admin/Orders.tsx` | blocked | No menu/actions. |
| Orders | Pagination buttons | `pages/admin/Orders.tsx` | blocked | Static labels only. |
| Products | Category tabs | `pages/admin/Products.tsx` | blocked | No filtering. |
| Products | Search input | `pages/admin/Products.tsx` | blocked | No filtering. |
| Products | Edit/Delete buttons | `pages/admin/Products.tsx` | blocked | No handlers. |
| Bookings | New appointment | `pages/admin/Bookings.tsx` | blocked | No flow. |
| Bookings | Calendar arrows | `pages/admin/Bookings.tsx` | blocked | No month state change. |
| Bookings | Edit appointment | `pages/admin/Bookings.tsx` | blocked | No handler. |
| Customers | Add customer | `pages/admin/Customers.tsx` | blocked | No flow. |
| Customers | Search input | `pages/admin/Customers.tsx` | blocked | No filtering. |
| Customers | Row action menu | `pages/admin/Customers.tsx` | blocked | No menu/actions. |
| Analytics | Export Data modal confirm | `pages/admin/Analytics.tsx` | blocked | Closes modal only; no export. |
| Settings | Save Changes | `pages/admin/Settings.tsx` | partially_working | Simulated success timeout only. |
| Settings | Enable 2FA | `pages/admin/Settings.tsx` | blocked | No integration. |
| Settings | Profile image edit | `pages/admin/Settings.tsx` | blocked | No upload flow. |
| Add Product | Generate with AI | `pages/admin/AddProduct.tsx` | partially_working | Gemini call works if API key present. |
| Add Product | Publish Product | `pages/admin/AddProduct.tsx` | blocked | No persistence/API call. |
