// Cart Management System
class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.updateCartDisplay();
  }

  // Load cart from localStorage
  loadCart() {
    const savedCart = localStorage.getItem("stoneFactoryCart");
    return savedCart ? JSON.parse(savedCart) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem("stoneFactoryCart", JSON.stringify(this.cart));
    this.updateCartDisplay();
  }

  // Add item to cart
  addToCart(product) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        quantity: 1,
      });
    }

    this.saveCart();
    this.showNotification(`${product.name} კალათაში დაემატა!`);
  }

  // Remove item from cart
  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  // Get cart total
  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Get cart item count
  getCartItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Update cart display (cart icon badge)
  updateCartDisplay() {
    const cartBadge = document.querySelector(".cart-badge");
    const cartCount = document.querySelector(".cart-count");
    const itemCount = this.getCartItemCount();

    if (cartBadge) {
      cartBadge.textContent = itemCount;
      cartBadge.style.display = itemCount > 0 ? "block" : "none";
    }

    if (cartCount) {
      cartCount.textContent = itemCount;
    }
  }

  // Show notification
  showNotification(message, type = "success") {
    // Remove existing notification
    const existingNotification = document.querySelector(".cart-notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

    // Add notification styles
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === "success" ? "#27ae60" : "#e74c3c"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// Initialize cart manager
const cartManager = new CartManager();

// Export for global use
window.cartManager = cartManager;
