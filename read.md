# Kutaisi Stone Factory - Replit Project

## Project Overview

This is a Georgian-language e-commerce website for "ქუთაისის ქვის ქარხანა" (Kutaisi Stone Factory), a marble and stone manufacturing company. The project has been optimized for the Replit environment with modern web development practices.

## Recent Changes (October 2025)

### Server Optimization
- ✅ Migrated to Express 5.x with proper static file serving
- ✅ Configured server to run on port 5000 (Replit requirement)
- ✅ Added cache control headers for optimal performance
- ✅ Bound server to 0.0.0.0 to work with Replit's proxy

### Email Integration
- ✅ Implemented EmailJS as primary email solution
- ✅ Added Nodemailer as fallback with environment variables
- ✅ Removed hardcoded credentials for security
- ✅ Created `.env.example` for easy configuration

### Performance Optimizations
- ✅ Added lazy loading for images
- ✅ Implemented caching strategy:
  - HTML: No cache (always fresh)
  - CSS/JS: 24 hour cache
  - Images: 1 year cache
- ✅ Created optimization script for image loading

### Security Improvements
- ✅ Moved all credentials to environment variables
- ✅ Added .gitignore to prevent sensitive data commits
- ✅ EmailJS configuration separated into external file

## Environment Variables

Create a `.env` file with the following:

```env
# Email Configuration (Nodemailer fallback)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
RECIPIENT_EMAIL=info@kutaisistonefactory.ge

# EmailJS Configuration (Primary)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key

# Server
PORT=5000
```

## EmailJS Setup Instructions

1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up
2. Create a new email service (Gmail recommended)
3. Create an email template with these variables:
   - `{{from_name}}` - Sender's full name
   - `{{from_email}}` - Sender's email
   - `{{phone}}` - Phone number
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{to_email}}` - Recipient email

4. Get your credentials from EmailJS dashboard:
   - Service ID
   - Template ID
   - Public Key

5. Update `emailjs-config.js`:
```javascript
window.EMAILJS_SERVICE_ID = 'your_service_id';
window.EMAILJS_TEMPLATE_ID = 'your_template_id';
window.EMAILJS_PUBLIC_KEY = 'your_public_key';
```

## Architecture

### Frontend
- **Framework**: Vanilla JavaScript (no framework dependencies)
- **Styling**: CSS3 with custom properties, Bootstrap 5.3.3
- **Animations**: GSAP 3.12.2 with ScrollTrigger and ScrollSmoother
- **Icons**: Font Awesome 6.4.0

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express 5.x
- **Email**: EmailJS (primary), Nodemailer (fallback)
- **Dependencies**: cors, dotenv, nodemailer

### Data Storage
- **Shopping Cart**: LocalStorage (client-side persistence)
- **Contact Forms**: EmailJS or backend API

## File Structure

```
.
├── server.js              # Express server (port 5000)
├── package.json           # Dependencies
├── .env.example           # Environment variable template
├── .gitignore            # Git ignore rules
├── index.html            # Homepage
├── products.html         # Product catalog
├── cart.html            # Shopping cart
├── checkout.html        # Checkout page
├── aboutus.html         # About page
├── contact.html         # Contact form with EmailJS
├── cart.js              # Cart management logic
├── optimize.js          # Performance optimizations
├── emailjs-config.js    # EmailJS credentials
├── style.css            # Main styles
├── media.css            # Responsive breakpoints
├── reset.css            # CSS normalization
├── README.md            # Project documentation
└── images/              # Image assets
```

## Running Locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in values
3. Update `emailjs-config.js` with your EmailJS credentials
4. Run: `node server.js`
5. Visit: http://localhost:5000

## Deployment on Replit

The project is configured to run on Replit with:
- Port 5000 (required by Replit)
- Static file serving from root directory
- Webview output type for browser preview
- Automatic workflow restart on changes

## User Preferences

- Language: Georgian (UTF-8)
- Target audience: Georgian customers
- Design style: Modern, clean, professional
- Color scheme: Stone/marble inspired with gradients

## Known Limitations

1. Shopping cart is client-side only (no server persistence)
2. No payment gateway integration (checkout is informational)
3. Contact form requires EmailJS setup or Gmail configuration
4. Images are local files (consider CDN for production)

## Next Steps for Production

1. **Email**: Configure EmailJS or set up Gmail app passwords
2. **Images**: Optimize and compress all images
3. **Analytics**: Add Google Analytics or similar
4. **SEO**: Add meta tags, sitemap, robots.txt
5. **Payment**: Integrate payment gateway if needed
6. **Database**: Consider adding database for orders/products
7. **Deployment**: Configure custom domain in Replit

## Support

For technical issues or questions:
- Check README.md for troubleshooting
- Review console logs in browser DevTools
- Check server logs in Replit conso