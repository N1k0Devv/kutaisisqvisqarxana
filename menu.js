// Mobile Menu Functionality
class MobileMenu {
  constructor() {
    this.menuButton = document.getElementById("menu");
    this.navMenu = document.getElementById("navMenu");
    this.init();
  }

  init() {
    if (this.menuButton && this.navMenu) {
      this.setupEventListeners();
    }
  }

  toggleMenu() {
    if (this.menuButton && this.navMenu) {
      this.menuButton.classList.toggle("active");
      this.navMenu.classList.toggle("active");
    }
  }

  closeMenu() {
    if (this.navMenu && this.navMenu.classList.contains("active")) {
      // Add closing animation
      this.navMenu.classList.add("closing");

      // Remove active class after animation delay
      setTimeout(() => {
        this.navMenu.classList.remove("active", "closing");
      }, 400);
    }

    if (this.menuButton) {
      this.menuButton.classList.remove("active");
    }
  }

  setupEventListeners() {
    // Menu button click
    this.menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Close menu when clicking on links
    const navLinks = this.navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const isClickInsideMenu =
        this.menuButton && this.menuButton.contains(e.target);
      const isClickInsideNavMenu = this.navMenu.contains(e.target);

      if (
        !isClickInsideMenu &&
        !isClickInsideNavMenu &&
        this.navMenu.classList.contains("active")
      ) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.navMenu.classList.contains("active")) {
        this.closeMenu();
      }
    });
  }
}

// Global functions for backward compatibility
function toggleMenu() {
  if (window.mobileMenu) {
    window.mobileMenu.toggleMenu();
  }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.mobileMenu = new MobileMenu();
});

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
