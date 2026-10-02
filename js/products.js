(function () {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  let allProducts = [];
  let filteredProducts = [];
  let currentModal = null;
  const quickViewState = {
    images: [],
    currentIndex: 0,
    title: "",
    transitionTimeout: null,
  };

  function money(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "";
    return number.toFixed(2) + " ₾";
  }

  function getProductImages(card) {
    const raw = (card.getAttribute("data-images") || "").trim();
    let images = [];
    if (raw.startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) images = parsed;
      } catch (error) {
        images = [];
      }
    } else if (raw) {
      images = raw.split("|");
    }
    images = images.map((src) => String(src).trim()).filter(Boolean);
    const fallback = card.getAttribute("data-image") || "";
    if (!images.length && fallback) images.push(fallback);
    return images;
  }

  function initializeProducts() {
    allProducts = Array.from(document.querySelectorAll(".product-card")).map((card) => {
      const priceEl = card.querySelector("[data-price-text]");
      if (priceEl && !priceEl.textContent.trim()) {
        priceEl.textContent = money(card.getAttribute("data-price"));
      }
      return {
        element: card,
        id: card.getAttribute("data-product-id"),
        name: card.getAttribute("data-name") || "",
        title: (card.querySelector("h3") || {}).textContent || "",
        category: card.getAttribute("data-category") || "",
        price: parseFloat(card.getAttribute("data-price")) || 0,
        image: card.getAttribute("data-image") || "",
        images: getProductImages(card),
      };
    });
    filteredProducts = allProducts.slice();
  }

  function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearch");
    if (!searchInput || !clearSearchBtn) return;
    searchInput.addEventListener("input", () => {
      clearSearchBtn.hidden = !searchInput.value;
      applyFilters();
    });
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearSearchBtn.hidden = true;
      applyFilters();
    });
  }

  function setupPriceFilter() {
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const priceRange = document.getElementById("priceRange");
    const maxPriceLabel = document.getElementById("maxPriceLabel");
    if (!priceRange || !allProducts.length) return;
    const maxPrice = Math.max(...allProducts.map((product) => product.price));
    priceRange.max = String(maxPrice);
    priceRange.value = String(maxPrice);
    if (maxPriceLabel) maxPriceLabel.textContent = maxPrice + "₾";
    if (maxPriceInput) maxPriceInput.max = String(maxPrice);

    priceRange.addEventListener("input", () => {
      if (maxPriceInput) maxPriceInput.value = priceRange.value;
      if (maxPriceLabel) maxPriceLabel.textContent = priceRange.value + "₾";
      applyFilters();
    });
    if (minPriceInput) minPriceInput.addEventListener("input", applyFilters);
    if (maxPriceInput) {
      maxPriceInput.addEventListener("input", () => {
        if (maxPriceInput.value) {
          priceRange.value = maxPriceInput.value;
          if (maxPriceLabel) maxPriceLabel.textContent = maxPriceInput.value + "₾";
        }
        applyFilters();
      });
    }
  }

  function setupSort() {
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) sortSelect.addEventListener("change", applyFilters);
  }

  function setupViewToggle() {
    const gridViewBtn = document.getElementById("gridView");
    const listViewBtn = document.getElementById("listView");
    if (!gridViewBtn || !listViewBtn) return;
    gridViewBtn.addEventListener("click", () => {
      grid.classList.remove("is-list");
      gridViewBtn.classList.add("is-active");
      listViewBtn.classList.remove("is-active");
      gridViewBtn.setAttribute("aria-pressed", "true");
      listViewBtn.setAttribute("aria-pressed", "false");
    });
    listViewBtn.addEventListener("click", () => {
      grid.classList.add("is-list");
      listViewBtn.classList.add("is-active");
      gridViewBtn.classList.remove("is-active");
      listViewBtn.setAttribute("aria-pressed", "true");
      gridViewBtn.setAttribute("aria-pressed", "false");
    });
  }

  function sortProducts(products, sortBy) {
    const originalOrder = allProducts.map((product) => product.id);
    switch (sortBy) {
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name, "ka"));
        break;
      case "name-desc":
        products.sort((a, b) => b.name.localeCompare(a.name, "ka"));
        break;
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        products.sort((a, b) => originalOrder.indexOf(a.id) - originalOrder.indexOf(b.id));
    }
  }

  function updateProductDisplay() {
    const noResults = document.getElementById("noResults");
    allProducts.forEach((product) => product.element.classList.add("is-hidden"));
    if (!filteredProducts.length) {
      if (noResults) noResults.classList.add("is-visible");
      return;
    }
    if (noResults) noResults.classList.remove("is-visible");
    filteredProducts.forEach((product) => {
      product.element.classList.remove("is-hidden");
      grid.appendChild(product.element);
    });
  }

  function updateResultsCount() {
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) resultsCount.textContent = filteredProducts.length + " პროდუქტი ნაპოვნია";
  }

  function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById("activeFilters");
    if (!activeFiltersContainer) return;
    const filters = [];
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput ? searchInput.value : "";
    if (searchTerm) filters.push("ძიება: " + searchTerm);
    const activeCategory = document.querySelector(".chip.is-active");
    if (activeCategory && activeCategory.getAttribute("data-filter") !== "all") {
      filters.push("კატეგორია: " + activeCategory.textContent.trim());
    }
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const minPrice = minPriceInput ? minPriceInput.value : "";
    const maxPrice = maxPriceInput ? maxPriceInput.value : "";
    const ceiling = allProducts.length ? Math.max(...allProducts.map((product) => product.price)) : Infinity;
    if (minPrice || (maxPrice && Number(maxPrice) < ceiling)) {
      filters.push("ფასი: " + (minPrice || 0) + "₾ - " + (maxPrice || "∞") + "₾");
    }
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect && sortSelect.value !== "default") {
      filters.push("დალაგება: " + sortSelect.options[sortSelect.selectedIndex].text);
    }
    activeFiltersContainer.innerHTML = filters
      .map((filter) => '<span class="filter-tag">' + filter + "</span>")
      .join("");
  }

  function applyFilters() {
    const searchInput = document.getElementById("searchInput");
    const activeCategory = document.querySelector(".chip.is-active");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const sortSelect = document.getElementById("sortSelect");
    const searchTerm = (searchInput ? searchInput.value : "").toLowerCase();
    const category = activeCategory ? activeCategory.getAttribute("data-filter") : "all";
    const minPrice = parseFloat(minPriceInput && minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput && maxPriceInput.value) || Infinity;
    filteredProducts = allProducts.filter((product) => {
      const haystack = (product.name + " " + product.title).toLowerCase();
      const matchesSearch = haystack.includes(searchTerm);
      const matchesCategory = category === "all" || product.category === category;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
    sortProducts(filteredProducts, sortSelect ? sortSelect.value : "default");
    updateProductDisplay();
    updateResultsCount();
    updateActiveFilters();
  }

  function clearAllFilters() {
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearch");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const sortSelect = document.getElementById("sortSelect");
    const priceRange = document.getElementById("priceRange");
    const maxPriceLabel = document.getElementById("maxPriceLabel");
    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.hidden = true;
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";
    if (sortSelect) sortSelect.value = "default";
    if (allProducts.length && priceRange) {
      const maxProductPrice = Math.max(...allProducts.map((product) => product.price));
      priceRange.value = String(maxProductPrice);
      if (maxPriceLabel) maxPriceLabel.textContent = maxProductPrice + "₾";
    }
    document.querySelectorAll(".chip").forEach((btn) => btn.classList.remove("is-active"));
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add("is-active");
    applyFilters();
  }
  window.clearAllFilters = clearAllFilters;

  function renderQuickViewImage(animate) {
    const modalImage = document.getElementById("modalImage");
    if (!modalImage || !quickViewState.images.length) return;
    const src = quickViewState.images[quickViewState.currentIndex];
    const alt = quickViewState.title + " " + (quickViewState.currentIndex + 1);
    const apply = () => {
      modalImage.src = src;
      modalImage.alt = alt;
      modalImage.classList.remove("is-changing");
    };
    if (animate) {
      modalImage.classList.add("is-changing");
      clearTimeout(quickViewState.transitionTimeout);
      quickViewState.transitionTimeout = setTimeout(apply, 110);
    } else {
      apply();
    }
    document.querySelectorAll(".qv-thumbnail, .qv-dot").forEach((node) => {
      const index = Number(node.getAttribute("data-index"));
      node.classList.toggle("is-active", index === quickViewState.currentIndex);
    });
  }

  function goToQuickViewImage(index) {
    if (!quickViewState.images.length) return;
    const total = quickViewState.images.length;
    quickViewState.currentIndex = (index + total) % total;
    renderQuickViewImage(true);
  }

  function setupQuickViewCarousel(images, title) {
    const prevBtn = document.getElementById("qvPrev");
    const nextBtn = document.getElementById("qvNext");
    const thumbnails = document.getElementById("qvThumbnails");
    const dots = document.getElementById("qvDots");
    quickViewState.images = images.length ? images : [""];
    quickViewState.currentIndex = 0;
    quickViewState.title = title || "პროდუქტი";
    const multiple = quickViewState.images.length > 1;
    if (thumbnails) {
      thumbnails.innerHTML = quickViewState.images
        .map(
          (src, index) =>
            '<button type="button" class="qv-thumbnail' +
            (index === 0 ? " is-active" : "") +
            '" data-index="' +
            index +
            '" aria-label="სურათი ' +
            (index + 1) +
            '"><img src="' +
            src +
            '" alt=""></button>'
        )
        .join("");
      thumbnails.classList.toggle("qv-hidden", !multiple);
    }
    if (dots) {
      dots.innerHTML = quickViewState.images
        .map(
          (_, index) =>
            '<button type="button" class="qv-dot' +
            (index === 0 ? " is-active" : "") +
            '" data-index="' +
            index +
            '" aria-label="სურათი ' +
            (index + 1) +
            '"></button>'
        )
        .join("");
      dots.classList.toggle("qv-hidden", !multiple);
    }
    if (prevBtn) prevBtn.classList.toggle("qv-hidden", !multiple);
    if (nextBtn) nextBtn.classList.toggle("qv-hidden", !multiple);
    renderQuickViewImage(false);
  }

  window.openQuickView = function openQuickView(button) {
    const card = button.closest(".product-card");
    if (!card) return;
    const modal = document.getElementById("quickViewModal");
    const title = card.querySelector("h3");
    const category = card.querySelector(".product-cat");
    const price = card.querySelector("[data-price-text]");
    const description = document.getElementById("modalDescription");
    document.getElementById("modalTitle").textContent = title ? title.textContent : "";
    document.getElementById("modalCategory").textContent = category ? category.textContent : "";
    document.getElementById("modalPrice").textContent = price ? price.textContent : money(card.getAttribute("data-price"));
    if (description) description.textContent = card.getAttribute("data-description") || description.textContent;
    const contact = document.getElementById("modalContact");
    if (contact) {
      const href = card.getAttribute("data-href");
      contact.hidden = !href;
      contact.href = href || "contact.html";
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    currentModal = modal;
    setupQuickViewCarousel(getProductImages(card), title ? title.textContent.trim() : "");
    const closeBtn = document.getElementById("closeModal");
    if (closeBtn) closeBtn.focus();
  };

  window.closeQuickView = function closeQuickView() {
    const modal = document.getElementById("quickViewModal");
    if (!modal) return;
    clearTimeout(quickViewState.transitionTimeout);
    const thumbnails = document.getElementById("qvThumbnails");
    const dots = document.getElementById("qvDots");
    if (thumbnails) thumbnails.innerHTML = "";
    if (dots) dots.innerHTML = "";
    quickViewState.images = [];
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    currentModal = null;
  };

  window.addProductToCart = function addProductToCart(button) {
    const card = button.closest(".product-card");
    if (!card || !window.cartManager) return;
    window.cartManager.addToCart({
      id: card.getAttribute("data-product-id"),
      name: card.getAttribute("data-name"),
      price: card.getAttribute("data-price"),
      category: card.getAttribute("data-category"),
      image: card.getAttribute("data-image"),
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initializeProducts();
    setupSearch();
    setupPriceFilter();
    setupSort();
    setupViewToggle();
    const clearFiltersBtn = document.getElementById("clearFilters");
    if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", clearAllFilters);
    applyFilters();

    document.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach((item) => item.classList.remove("is-active"));
        btn.classList.add("is-active");
        applyFilters();
      });
    });

    const modal = document.getElementById("quickViewModal");
    const closeModalBtn = document.getElementById("closeModal");
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeQuickView);
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeQuickView();
      });
    }
    document.getElementById("qvPrev")?.addEventListener("click", () => goToQuickViewImage(quickViewState.currentIndex - 1));
    document.getElementById("qvNext")?.addEventListener("click", () => goToQuickViewImage(quickViewState.currentIndex + 1));
    document.getElementById("qvThumbnails")?.addEventListener("click", (event) => {
      const target = event.target.closest("[data-index]");
      if (target) goToQuickViewImage(parseInt(target.getAttribute("data-index"), 10));
    });
    document.getElementById("qvDots")?.addEventListener("click", (event) => {
      const target = event.target.closest("[data-index]");
      if (target) goToQuickViewImage(parseInt(target.getAttribute("data-index"), 10));
    });
    const stage = document.getElementById("qvImageStage");
    let startX = 0;
    stage?.addEventListener("touchstart", (event) => {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });
    stage?.addEventListener("touchend", (event) => {
      const delta = startX - event.changedTouches[0].clientX;
      if (Math.abs(delta) < 40) return;
      goToQuickViewImage(quickViewState.currentIndex + (delta > 0 ? 1 : -1));
    }, { passive: true });
    document.addEventListener("keydown", (event) => {
      if (!currentModal) return;
      if (event.key === "ArrowLeft") goToQuickViewImage(quickViewState.currentIndex - 1);
      if (event.key === "ArrowRight") goToQuickViewImage(quickViewState.currentIndex + 1);
      if (event.key === "Escape") closeQuickView();
    });

    const modalCart = document.getElementById("modalAdd");
    if (modalCart) {
      modalCart.addEventListener("click", () => {
        const title = document.getElementById("modalTitle").textContent;
        const product = allProducts.find((item) => item.title === title || item.name === title);
        if (product && window.cartManager) {
          window.cartManager.addToCart(product);
        }
      });
    }
  });
})();
