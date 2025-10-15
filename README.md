# ქუთაისის ქვის ქარხანა (Kutaisi Stone Factory)

A modern, high-performance e-commerce website for a Georgian marble and stone manufacturing company.

## 🌟 Features

- **Responsive Design**: Mobile-first, works on all devices
- **Modern Animations**: GSAP-powered smooth scrolling and animations
- **Shopping Cart**: LocalStorage-based cart with real-time updates
- **Contact Form**: EmailJS integration with backend fallback
- **Performance Optimized**: Lazy loading, caching headers, and optimized assets
- **Georgian Language**: Full UTF-8 support for Georgian text

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=info@kutaisistonefactory.ge

# EmailJS Configuration (recommended)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key

# Server
PORT=5000
```

5. Start the development server:
```bash
npm start
# or
node server.js
```

6. Open http://localhost:5000 in your browser

## 📧 Email Configuration

### Option 1: EmailJS (Recommended)

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Update `emailjs-config.js` with your credentials:
```javascript
window.EMAILJS_SERVICE_ID = 'your_service_id';
window.EMAILJS_TEMPLATE_ID = 'your_template_id';
window.EMAILJS_PUBLIC_KEY = 'your_public_key';
```

### Option 2: Nodemailer (Fallback)

Configure Gmail app password in `.env`:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password (not your regular password)
- `RECIPIENT_EMAIL`: Email to receive contact form submissions

## 📁 Project Structure

```
.
├── index.html           # Homepage
├── products.html        # Product catalog
├── cart.html           # Shopping cart
├── checkout.html       # Checkout page
├── aboutus.html        # About us page
├── contact.html        # Contact page
├── cart.js             # Shopping cart logic
├── server.js           # Express server
├── style.css           # Main styles
├── media.css           # Responsive styles
├── reset.css           # CSS reset
├── optimize.js         # Performance optimizations
├── emailjs-config.js   # EmailJS configuration
└── images/             # Image assets
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express 5.x
- **Email**: EmailJS, Nodemailer
- **Animations**: GSAP 3.12.2 with ScrollTrigger
- **Icons**: Font Awesome 6.4.0
- **UI Framework**: Bootstrap 5.3.3

## 🎨 Customization

### Changing Colors
Edit CSS custom properties in `style.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Adding Products
Add product cards to `products.html` with required data attributes:
```html
<div class="product-card" 
     data-category="marble" 
     data-product-id="unique-id"
     data-name="Product Name"
     data-price="99">
  <!-- Product content -->
</div>
```

## 🚢 Deployment

### Replit Deployment
1. Click "Publish" button in Replit
2. Follow the deployment wizard
3. Configure your custom domain (optional)

### Manual Deployment
1. Set `NODE_ENV=production`
2. Configure your environment variables
3. Run `node server.js`
4. Deploy to your hosting service

## 📈 Performance Features

- **Lazy Loading**: Images load only when visible
- **Cache Control**: Optimized caching headers
  - HTML: No cache (always fresh)
  - CSS/JS: 24 hours cache
  - Images: 1 year cache
- **Compression**: Enable gzip/brotli in production
- **CDN**: External libraries loaded from CDN

## 🔒 Security

- Email credentials stored in environment variables
- No sensitive data in client-side code
- CORS enabled for API endpoints
- Input validation on contact form

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is available
- Verify all dependencies are installed
- Check `.env` file exists

### Email not sending
- Verify EmailJS credentials are correct
- Check Gmail app password is valid
- Check browser console for errors

### Images not loading
- Verify image paths in `images/` directory
- Check file permissions
- Clear browser cache

## 📝 License

© 2024 Kutaisi Stone Factory. All rights reserved.

## 🤝 Support

For support, email info@kutaisistonefactory.ge or visit our website.