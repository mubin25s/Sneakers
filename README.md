# 👟 ShoeZone Collective

> **A premium sneakers e-commerce experience** — built with TypeScript, Vite, Three.js, and GSAP.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-F43F5E?style=for-the-badge)](https://mubin25s.github.io/Sneakers-)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r165-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

---

## ✨ Overview

**ShoeZone Collective** is a fully-typed, production-ready frontend e-commerce application for sneaker enthusiasts. The project has evolved from a plain HTML/JS prototype into a modern **TypeScript + Vite** application featuring:

- **3D interactive canvas** powered by Three.js — a floating wireframe sneaker geometry with particle field and dynamic lighting
- **Scroll-driven animations** via GSAP ScrollTrigger — staggered card reveals, hero text fly-ins, and section fades
- **Dark glassmorphism UI** with a rose-crimson accent palette
- **Typed service architecture** — strongly-typed modules for cart, auth, API, and UI

---

## 🔗 Live Demo

👉 **https://mubin25s.github.io/Sneakers-**

---

## 💡 Features

| Feature | Details |
|---|---|
| 🎮 **3D Hero Canvas** | Interactive Three.js scene — orbit-rotated geometry, particle field, ambient + point lighting |
| 🛍 **Shop & Filter** | Category/brand filters, search, quick-view modal with size selection |
| 🛒 **Persistent Cart** | `localStorage`-backed cart with live count badge, item removal, and totals |
| 🔐 **Auth Flow** | JWT-based login/register with session persistence across pages |
| 📣 **Toast System** | Non-intrusive slide-in notifications for every user action |
| 📦 **Product Detail** | Sticky image panel, size picker, add-to-cart, delivery info cards |
| 📱 **Responsive** | Mobile-first layout, adapts from 320px to ultra-wide |
| ⚡ **Vite Build** | HMR in dev, optimized + tree-shaken bundle in production |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Language** | TypeScript 5.x (strict mode) |
| **Bundler** | Vite 5.x |
| **3D Engine** | Three.js r165 |
| **Animations** | GSAP 3 + ScrollTrigger |
| **Styling** | Vanilla CSS3 with custom property design tokens |
| **State** | localStorage + in-memory singletons |
| **Type Checking** | `tsc --noEmit` in CI |

---

## 📂 Project Structure

```
ShoeZone/
├── index.html          # Homepage with 3D hero
├── shop.html           # Product grid + filters
├── product.html        # Product detail page
├── cart.html           # Shopping cart
├── login.html          # Login + register portal
├── about.html          # Brand story
│
├── assets/
│   ├── css/
│   │   └── style.css           # Global design system & component styles
│   ├── js/
│   │   ├── index.ts            # Homepage entry — GSAP, 3D init, newsletter
│   │   ├── three-scene.ts      # Three.js scene: geometry, particles, lighting
│   │   ├── shop.ts             # Shop filters, search, quick-view modal
│   │   ├── product.ts          # Product detail, size picker, add to cart
│   │   ├── cart.ts             # Cart page — item display, totals, remove
│   │   ├── login.ts            # Login/register form handlers
│   │   ├── about.ts            # About page hydration
│   │   ├── api-service.ts      # Typed REST/mock API client
│   │   ├── auth-service.ts     # JWT auth with session management
│   │   ├── cart-service.ts     # Cart singleton with localStorage sync
│   │   ├── ui-service.ts       # Toast notifications & loaders
│   │   ├── mock-data.ts        # Typed product seed data
│   │   └── main.ts             # Shared layout init (header, cart badge)
│   └── images/                 # Optimized product & brand assets
│
├── vite.config.ts      # Multi-page MPA Vite configuration
├── tsconfig.json       # TypeScript compiler options
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repo
git clone https://github.com/mubin25s/Sneakers-.git
cd Sneakers-

# Install dependencies
npm install

# Start dev server (HMR enabled)
npm run dev
# → http://localhost:5173/

# Type-check + production build
npm run build

# Preview the production build
npm run preview
```

---

## 🎨 Design System

The entire visual identity is defined via CSS custom properties in `style.css`:

```css
:root {
  --color-primary:       #F43F5E;   /* Rose-crimson accent */
  --color-bg:            #050505;   /* Near-black background */
  --color-surface:       #0D0D0D;   /* Card surfaces */
  --color-surface-light: #1A1A1A;   /* Elevated surfaces */
  --glass-bg:            rgba(255,255,255,0.03);
  --glass-border:        rgba(255,255,255,0.08);
}
```

**Glassmorphism cards** use `backdrop-filter: blur(12px)` combined with semi-transparent backgrounds to create depth without heavy shadows.

---

## 📄 License

MIT — feel free to fork, learn from, and build on this project.

---

✨ *ShoeZone Collective — Step Into The Elite Choice.*
