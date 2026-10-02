(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    if (!phone) return true;
    return /^[+]?[0-9\s()-]{7,}$/.test(phone);
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "-error");
    if (!field || !errorElement) return;
    field.classList.add("error");
    field.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "-error");
    if (!field || !errorElement) return;
    field.classList.remove("error");
    field.removeAttribute("aria-invalid");
    errorElement.textContent = "";
  }

  function showMessage(type, message) {
    const messagesContainer = document.getElementById("form-messages");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");
    if (!messagesContainer || !successMessage || !errorMessage) return;
    successMessage.hidden = type !== "success";
    errorMessage.hidden = type !== "error";
    const target = type === "success" ? successMessage : errorMessage;
    const span = target.querySelector("span");
    if (span) span.textContent = message;
    messagesContainer.hidden = false;
    setTimeout(() => {
      messagesContainer.hidden = true;
    }, 6000);
  }

  function validateForm(formData) {
    let isValid = true;
    ["firstName", "lastName", "email", "phone", "subject", "message"].forEach(clearError);

    if (!formData.firstName.trim()) {
      showError("firstName", "სახელი სავალდებულოა");
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      showError("lastName", "გვარი სავალდებულოა");
      isValid = false;
    }
    if (!formData.email.trim()) {
      showError("email", "ელ.ფოსტა სავალდებულოა");
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      showError("email", "გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი");
      isValid = false;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      showError("phone", "გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი");
      isValid = false;
    }
    if (!formData.subject) {
      showError("subject", "თემის არჩევა სავალდებულოა");
      isValid = false;
    }
    if (!formData.message.trim()) {
      showError("message", "შეტყობინება სავალდებულოა");
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      showError("message", "შეტყობინება უნდა იყოს მინიმუმ 10 სიმბოლო");
      isValid = false;
    }
    return isValid;
  }

  function saveToLocalStorage(data) {
    const submissions = JSON.parse(localStorage.getItem("contactSubmissions") || "[]");
    submissions.push({
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now(),
    });
    localStorage.setItem("contactSubmissions", JSON.stringify(submissions));
  }

  function isStaticHost() {
    return /(^|\.)qutstone\.com$|github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
  }

  async function sendToBackend(data, submitBtn, originalHTML) {
    if (isStaticHost()) {
      saveToLocalStorage(data);
      showMessage("success", "შეტყობინება შენახულია! ჩვენ დაგიკავშირდებით უმოკლეს დროში.");
      form.reset();
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
      return;
    }
    try {
      const response = await fetch("/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "დაფიქსირდა შეცდომა");
      showMessage("success", "შეტყობინება წარმატებით გაიგზავნა!");
      form.reset();
    } catch (error) {
      saveToLocalStorage(data);
      showMessage("success", "შეტყობინება შენახულია! ჩვენ დაგიკავშირდებით უმოკლეს დროში.");
      form.reset();
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  }

  const quote = sessionStorage.getItem("quoteMessage");
  if (quote) {
    const message = document.getElementById("message");
    const subject = document.getElementById("subject");
    if (message && !message.value) message.value = quote;
    if (subject) subject.value = "quote";
    sessionStorage.removeItem("quoteMessage");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!validateForm(data)) return;

    const submitBtn = document.getElementById("submit-btn");
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = "<span>იგზავნება...</span>";
    submitBtn.disabled = true;

    const templateParams = {
      from_name: data.firstName + " " + data.lastName,
      from_email: data.email,
      phone: data.phone || "არ არის მითითებული",
      subject: data.subject,
      message: data.message,
      to_email: "info@kutaisistonefactory.ge",
    };

    // Set window.EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID and EMAILJS_PUBLIC_KEY
    // before this script if EmailJS is configured. Otherwise the message is saved locally.
    const serviceId = window.EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
    const templateId = window.EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
    const publicKey = window.EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";
    const configured = serviceId && serviceId !== "YOUR_SERVICE_ID" && typeof emailjs !== "undefined";

    if (configured) {
      emailjs.init(publicKey);
      emailjs
        .send(serviceId, templateId, templateParams)
        .then(() => {
          showMessage("success", "შეტყობინება წარმატებით გაიგზავნა! ჩვენ დაგიკავშირდებით უმოკლეს დროში.");
          form.reset();
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        })
        .catch(() => {
          sendToBackend(data, submitBtn, originalHTML);
        });
    } else {
      sendToBackend(data, submitBtn, originalHTML);
    }
  });

  document.getElementById("email")?.addEventListener("blur", function () {
    if (this.value && !validateEmail(this.value)) showError("email", "გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი");
    else clearError("email");
  });
  document.getElementById("phone")?.addEventListener("blur", function () {
    if (this.value && !validatePhone(this.value)) showError("phone", "გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი");
    else clearError("phone");
  });
  ["firstName", "lastName", "email", "phone", "subject", "message"].forEach((fieldId) => {
    document.getElementById(fieldId)?.addEventListener("input", function () {
      if (this.classList.contains("error")) clearError(fieldId);
    });
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener("click", () => {
      const phoneNumber = (link.getAttribute("href") || "").replace("tel:", "");
      const isMobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
      if (isMobile) return;
      const toast = document.createElement("div");
      toast.className = "toast is-in";
      toast.setAttribute("role", "status");
      toast.textContent = "დარეკვა: " + phoneNumber;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2800);
    });
  });
})();
