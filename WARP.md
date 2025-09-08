# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Georgian-language e-commerce website for "ქუთაისის ქვის ქარხანა" (Kutaisi Stone Factory), a marble and stone manufacturing company. The site is built as a static HTML website with vanilla JavaScript for shopping cart functionality and modern CSS with GSAP animations.

## Development Commands

### Local Development
```powershell
# Start a local development server
python -m http.server 8000
# or with Node.js http-server
npx http-server -p 8000
```

### Opening the Website
- Main entry point: `index.html`
- Open directly in browser or use any local server

### File Validation
```powershell
# Validate HTML files (if html5validator is installed)
html5validator --root . --also-check-css

# Check for broken links (if linkchecker is installed)  
linkchecker index.html
```

## Architecture & Code Structure

### File Organization
- **HTML Pages**: Multi-page website with consistent header/footer structure
  - `index.html` - Homepage with hero section and services showcase
  - `products.html` - Product catalog with filtering and cart functionality
  - `cart.html` - Shopping cart with localStorage persistence
  - `checkout.html` - Order completion page
  - `aboutus.html` - Company information
  - `contact.html` - Contact form and information
  
- **Styling**:
  - `style.css` - Main styles with CSS custom properties and modern features
  - `media.css` - Responsive design breakpoints
  - `reset.css` - CSS normalization

- **JavaScript**:
  - `cart.js` - Shopping cart management system with localStorage
  - Inline scripts in HTML for page-specific functionality

### Key Technical Features

#### Shopping Cart System (`cart.js`)
- **CartManager class**: Centralized cart state management
- **localStorage persistence**: Cart data survives page refreshes
- **Event-driven updates**: Real-time cart badge and summary updates
- **Notification system**: Toast notifications for user actions

#### Animation & UX
- **GSAP ScrollTrigger**: Scroll-based animations throughout
- **ScrollSmoother**: Smooth scrolling implementation
- **CSS animations**: Custom keyframe animations for visual effects
- **Mobile-responsive**: Breakpoints from 1300px down to 580px

#### Styling Approach
- **CSS Custom Properties**: Centralized theming with gradients and colors
- **Modern CSS**: Flexbox, Grid, backdrop-filter effects
- **Georgian language support**: UTF-8 encoding for Georgian text
- **Glass morphism**: Modern UI design with transparency effects

### Product Management
Products are defined directly in HTML with data attributes:
- `data-category`: Filter category (basalt, marble, granite)
- `data-product-id`: Unique identifier
- `data-name`: Product name in Georgian
- `data-price`: Price in Georgian Lari (₾)

### State Management
- Cart data persists in `localStorage` as "stoneFactoryCart"
- No external dependencies or frameworks
- Pure JavaScript class-based architecture

## Common Development Tasks

### Adding New Products
1. Add product card HTML structure to `products.html`
2. Include required data attributes for filtering and cart functionality
3. Ensure image assets are added to `images/` directory

### Modifying Cart Functionality
- Edit the `CartManager` class in `cart.js`
- Update cart display templates in `cart.html` script section

### Styling Changes
- Main theme colors in CSS custom properties (`:root` selector in `style.css`)
- Responsive breakpoints managed in `media.css`
- Animation timing and effects configured via GSAP settings

### Adding New Pages
- Follow existing HTML structure with header and footer
- Include necessary CSS and JavaScript dependencies
- Update navigation links in all pages' header sections

## External Dependencies

### CDN Resources
- **Bootstrap 5.3.3**: UI components and utilities
- **GSAP 3.12.2**: Animation library with ScrollTrigger plugin
- **Font Awesome 6.4.0**: Icon fonts
- **jQuery 3.3.1**: DOM manipulation for smooth scrolling
- **Inter font**: Typography from Google Fonts

### Image Resources
- Product images primarily from Unsplash with specific crop parameters
- Local assets stored in `images/` directory
- Company logos and factory photos included

## Browser Support
- Modern browsers supporting CSS Grid, Flexbox, and CSS Custom Properties
- JavaScript ES6 classes and localStorage required
- Mobile-responsive design tested down to 320px width
