(function () {
  class CartManager {
    constructor() {
      this.storageKey = "stoneFactoryCart";
      this.cart = this.loadCart();
      this.updateCartDisplay();
    }

    loadCart() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    }

    saveCart() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      this.updateCartDisplay();
    }

    addToCart(product) {
      if (!product || !product.id) return;
      const existing = this.cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += product.quantity || 1;
      } else {
        this.cart.push({
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          category: product.category || "",
          image: product.image || "",
          quantity: product.quantity || 1,
        });
      }
      this.saveCart();
      this.showNotification(product.name + " კალათაში დაემატა");
    }

    removeFromCart(productId) {
      this.cart = this.cart.filter((item) => item.id !== productId);
      this.saveCart();
    }

    updateQuantity(productId, quantity) {
      const item = this.cart.find((entry) => entry.id === productId);
      if (!item) return;
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      item.quantity = quantity;
      this.saveCart();
    }

    getCartTotal() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    getCartItemCount() {
      return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
      this.cart = [];
      this.saveCart();
    }

    updateCartDisplay() {
      const count = this.getCartItemCount();
      document.querySelectorAll("[data-cart-count]").forEach((badge) => {
        badge.textContent = String(count);
        badge.hidden = count <= 0;
      });
    }

    showNotification(message) {
      const existing = document.querySelector(".toast");
      if (existing) existing.remove();
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.textContent = message;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add("is-in"));
      setTimeout(() => {
        toast.classList.remove("is-in");
        setTimeout(() => toast.remove(), 400);
      }, 2600);
    }
  }

  window.cartManager = new CartManager();
})();
