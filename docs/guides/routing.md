---
title: Routing & navigation
description: How routing works in Piral and how pilets register pages and navigation items.
---

# Routing & navigation

Piral uses React Router v6. There's a single router, owned by the app shell — pilets don't configure it, they *contribute* to it. Each `registerPage` call adds a route at runtime, so the application's full route table is assembled from every pilet that happens to be loaded. Inside a pilet's own components you use the ordinary React Router hooks and components (`useParams`, `Link`, `useNavigate`, …); they work unchanged because the pilet renders within the shell's router context.

## Registering routes

```tsx
export function setup(api: PiletApi) {
  api.registerPage('/products', ProductsPage);
  api.registerPage('/products/:id', ProductDetailPage);
  api.registerPage('/admin/*', AdminSection);
}
```

## Route parameters

```tsx
import { useParams } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <h1>Product {id}</h1>;
};
```

## Navigation links

```tsx
import { Link } from 'react-router-dom';

const Nav = () => (
  <nav>
    <Link to="/products">Products</Link>
    <Link to="/checkout">Checkout</Link>
  </nav>
);
```

Programmatic:

```tsx
import { useNavigate } from 'react-router-dom';

const SubmitButton = () => {
  const navigate = useNavigate();
  return <button onClick={async () => { await save(); navigate('/success'); }}>Submit</button>;
};
```

## Menu items

Routes make a page reachable by URL; menu items make it reachable by clicking. A pilet registers entries into named menu *zones*, and the shell's layout decides where each zone renders — so a pilet adds navigation without knowing anything about the shell's chrome:

```tsx
api.registerMenu(() => <a href="/products">Products</a>, { type: 'general' });
api.registerMenu(() => <a href="/admin">Admin</a>, { type: 'admin' });
```

Shell renders them at: `<Menu type="general" />` and `<Menu type="admin" />`

## Route guards

A guard is just conditional rendering inside the page component — redirect when the user isn't allowed in. Remember this only hides UI; enforce real access on the server and, ideally, with [feed-level targeting](/concepts/feed-service#per-user-pilet-targeting) so unauthorized users never receive the pilet at all.

```tsx
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const isAuthenticated = api.isAuthenticated?.();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AdminDashboard />;
};

api.registerPage('/admin', AdminPage);
```

## Query parameters

```tsx
import { useSearchParams } from 'react-router-dom';

const ProductsPage = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'all';
  return <ProductList category={category} />;
};
```
