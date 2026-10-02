(function () {
  const list = document.getElementById("cartItems");
  if (!list || !window.cartManager) return;

  function money(value) {
    return (Number(value) || 0).toFixed(2) + " ₾";
  }

  function render() {
    const cart = window.cartManager.cart;
    const itemCount = document.getElementById("itemCount");
    const cartTotal = document.getElementById("cartTotal");
    const empty = document.getElementById("emptyCart");
    const summary = document.getElementById("cartSummary");
    if (itemCount) itemCount.textContent = String(window.cartManager.getCartItemCount());
    if (cartTotal) cartTotal.textContent = money(window.cartManager.getCartTotal());
    if (!cart.length) {
      list.innerHTML = "";
      if (empty) empty.hidden = false;
      if (summary) summary.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (summary) summary.hidden = false;
    list.innerHTML = cart
      .map((item) => {
        const image = item.image
          ? '<img src="' + item.image + '" alt="' + item.name + '">'
          : "";
        return (
          '<article class="cart-item">' +
          image +
          "<div><h3>" +
          item.name +
          "</h3><p>" +
          ({ granite: "გრანიტი" }[item.category] || item.category || "") +
          "</p><p>" +
          money(item.price) +
          '</p><div class="qty"><button type="button" data-qty="-1" data-id="' +
          item.id +
          '" aria-label="შემცირება">−</button><input data-input="' +
          item.id +
          '" value="' +
          item.quantity +
          '" inputmode="numeric" aria-label="რაოდენობა"><button type="button" data-qty="1" data-id="' +
          item.id +
          '" aria-label="გაზრდა">+</button></div></div>' +
          '<button type="button" class="remove-btn" data-remove="' +
          item.id +
          '">წაშლა</button></article>'
        );
      })
      .join("");
  }

  list.addEventListener("click", (event) => {
    const qty = event.target.closest("[data-qty]");
    const remove = event.target.closest("[data-remove]");
    if (qty) {
      const id = qty.getAttribute("data-id");
      const item = window.cartManager.cart.find((entry) => entry.id === id);
      if (!item) return;
      window.cartManager.updateQuantity(id, item.quantity + Number(qty.getAttribute("data-qty")));
      render();
    }
    if (remove) {
      window.cartManager.removeFromCart(remove.getAttribute("data-remove"));
      render();
    }
  });

  list.addEventListener("change", (event) => {
    const input = event.target.closest("[data-input]");
    if (!input) return;
    const quantity = parseInt(input.value, 10);
    window.cartManager.updateQuantity(input.getAttribute("data-input"), Number.isFinite(quantity) ? quantity : 1);
    render();
  });

  document.getElementById("clearCart")?.addEventListener("click", () => {
    window.cartManager.clearCart();
    render();
  });

  document.getElementById("checkout")?.addEventListener("click", () => {
    const lines = window.cartManager.cart.map(
      (item) => item.name + " × " + item.quantity + " — " + money(item.price * item.quantity)
    );
    const text =
      "მსურს კონსულტაცია შემდეგ პროდუქციაზე:\n" +
      lines.join("\n") +
      "\nჯამი: " +
      money(window.cartManager.getCartTotal());
    sessionStorage.setItem("quoteMessage", text);
    window.location.href = "contact.html";
  });

  render();
})();
