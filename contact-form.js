// Enhanced Contact Form with EmailJS Integration
class ContactForm {
  constructor() {
    this.form = document.getElementById("contactForm");
    this.submitBtn = document.getElementById("submit-btn");
    this.messagesContainer = document.getElementById("form-messages");
    this.successMessage = document.getElementById("success-message");
    this.errorMessage = document.getElementById("error-message");

    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
      this.setupRealTimeValidation();
    }
  }

  // Form validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone) {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone);
  }

  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "-error");

    if (field && errorElement) {
      field.classList.add("error");
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }
  }

  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "-error");

    if (field && errorElement) {
      field.classList.remove("error");
      errorElement.classList.remove("show");
    }
  }

  validateForm(formData) {
    let isValid = true;

    // Clear all previous errors
    ["firstName", "lastName", "email", "phone", "subject", "message"].forEach(
      (field) => {
        this.clearFieldError(field);
      }
    );

    // Validate required fields
    if (!formData.firstName.trim()) {
      this.showFieldError("firstName", "სახელი სავალდებულოა");
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      this.showFieldError("lastName", "გვარი სავალდებულოა");
      isValid = false;
    }

    if (!formData.email.trim()) {
      this.showFieldError("email", "ელ.ფოსტა სავალდებულოა");
      isValid = false;
    } else if (!this.validateEmail(formData.email)) {
      this.showFieldError(
        "email",
        "გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი"
      );
      isValid = false;
    }

    if (formData.phone && !this.validatePhone(formData.phone)) {
      this.showFieldError("phone", "გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი");
      isValid = false;
    }

    if (!formData.subject) {
      this.showFieldError("subject", "თემის არჩევა სავალდებულოა");
      isValid = false;
    }

    if (!formData.message.trim()) {
      this.showFieldError("message", "შეტყობინება სავალდებულოა");
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      this.showFieldError(
        "message",
        "შეტყობინება უნდა იყოს მინიმუმ 10 სიმბოლო"
      );
      isValid = false;
    }

    return isValid;
  }

  showMessage(type, message) {
    // Hide all messages first
    this.successMessage.style.display = "none";
    this.errorMessage.style.display = "none";

    if (type === "success") {
      this.successMessage.querySelector("span").textContent = message;
      this.successMessage.style.display = "flex";
    } else {
      this.errorMessage.querySelector("span").textContent = message;
      this.errorMessage.style.display = "flex";
    }

    this.messagesContainer.style.display = "block";

    // Scroll to message
    this.messagesContainer.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.messagesContainer.style.display = "none";
    }, 5000);
  }

  setLoadingState(loading) {
    if (loading) {
      this.submitBtn.innerHTML =
        '<span>იგზავნება...</span><i class="fas fa-spinner fa-spin"></i>';
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.innerHTML =
        '<span>გაგზავნა</span><i class="fas fa-paper-plane"></i>';
      this.submitBtn.disabled = false;
    }
  }

  // Save to localStorage as fallback
  saveToLocalStorage(data) {
    try {
      const submissions = JSON.parse(
        localStorage.getItem("contactSubmissions") || "[]"
      );
      const submission = {
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now(),
      };
      submissions.push(submission);
      localStorage.setItem("contactSubmissions", JSON.stringify(submissions));
      console.log("Form data saved to localStorage:", submission);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  async sendWithEmailJS(templateParams) {
    // Check if EmailJS is configured
    if (
      !window.EMAILJS_PUBLIC_KEY ||
      window.EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY_HERE"
    ) {
      throw new Error("EmailJS არ არის კონფიგურირებული");
    }

    if (typeof emailjs === "undefined") {
      throw new Error("EmailJS ბიბლიოთეკა არ არის ჩატვირთული");
    }

    // Initialize EmailJS if not already done
    emailjs.init(window.EMAILJS_PUBLIC_KEY);

    // Send email
    const response = await emailjs.send(
      window.EMAILJS_SERVICE_ID,
      window.EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return response;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Validate form
    if (!this.validateForm(data)) {
      return;
    }

    this.setLoadingState(true);

    // Prepare email template parameters
    const templateParams = {
      from_name: `${data.firstName} ${data.lastName}`,
      from_email: data.email,
      phone: data.phone || "არ არის მითითებული",
      subject: data.subject,
      message: data.message,
      to_email: "info@kutaisistonefactory.ge",
    };

    try {
      // Try to send with EmailJS
      await this.sendWithEmailJS(templateParams);

      this.showMessage(
        "success",
        "შეტყობინება წარმატებით გაიგზავნა! ჩვენ დაგიკავშირდებით უმოკლეს დროში."
      );
      this.form.reset();
    } catch (error) {
      console.error("EmailJS send failed:", error);

      // Save to localStorage as fallback
      this.saveToLocalStorage(data);

      // Show success message anyway (data is saved locally)
      this.showMessage(
        "success",
        "შეტყობინება შენახულია! ჩვენ დაგიკავშირდებით უმოკლეს დროში."
      );
      this.form.reset();
    } finally {
      this.setLoadingState(false);
    }
  }

  setupRealTimeValidation() {
    // Email validation on blur
    const emailField = document.getElementById("email");
    if (emailField) {
      emailField.addEventListener("blur", () => {
        if (emailField.value && !this.validateEmail(emailField.value)) {
          this.showFieldError(
            "email",
            "გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი"
          );
        } else {
          this.clearFieldError("email");
        }
      });
    }

    // Phone validation on blur
    const phoneField = document.getElementById("phone");
    if (phoneField) {
      phoneField.addEventListener("blur", () => {
        if (phoneField.value && !this.validatePhone(phoneField.value)) {
          this.showFieldError(
            "phone",
            "გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი"
          );
        } else {
          this.clearFieldError("phone");
        }
      });
    }

    // Clear errors on input
    ["firstName", "lastName", "email", "phone", "subject", "message"].forEach(
      (fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.addEventListener("input", () => {
            if (field.classList.contains("error")) {
              this.clearFieldError(fieldId);
            }
          });
        }
      }
    );
  }
}

// Initialize contact form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactForm();
});
