// Header Scroll Behavior
let lastScrollTop = 0;
const header = document.querySelector("header");
const heroSection = document.querySelector(".hero");

// Add a class to ensure transitions work after page load
setTimeout(() => {
  header.classList.add("transitions-ready");
}, 1500);

// All section animations are now handled by intersection observer when scrolled into view
// This includes About, Expertise, Partnerships, and other sections

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Only add scrolled class (white background) when header is visible and past threshold
  if (scrollTop > 100) {
    header.classList.add("scrolled");
  } else if (scrollTop <= 100) {
    header.classList.remove("scrolled");
  }

  // World map background scroll reveal effect
  const worldBgImage = document.querySelector(".world-bg-image");
  if (worldBgImage) {
    const globalSection = document.querySelector(".global-reach-section");
    if (globalSection) {
      const rect = globalSection.getBoundingClientRect();
      const sectionTop = globalSection.offsetTop;
      const sectionHeight = globalSection.offsetHeight;

      // Check if section is in view
      if (
        scrollTop + window.innerHeight > sectionTop &&
        scrollTop < sectionTop + sectionHeight
      ) {
        // Calculate progress through the section (0 to 1)
        const sectionProgress = Math.max(
          0,
          Math.min(
            1,
            (scrollTop + window.innerHeight - sectionTop) /
              (sectionHeight + window.innerHeight)
          )
        );

        // Move background from top (-25%) to bottom (0%) based on scroll progress
        const backgroundPosition = -25 + 25 * sectionProgress;
        worldBgImage.style.transform = `translateY(${backgroundPosition}%)`;
      }
    }
  }

  lastScrollTop = scrollTop;
});

// Mobile Navigation Toggle
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.querySelector(".nav-menu");

mobileMenu.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  navMenu.classList.toggle("active");

  // Add class to header when mobile menu is active for proper styling
  if (navMenu.classList.contains("active")) {
    header.classList.add("mobile-menu-active");
  } else {
    header.classList.remove("mobile-menu-active");
    // Force refresh header state when closing menu
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop <= 100) {
      // At top, ensure header is transparent
      header.classList.remove("scrolled");
    }
  }
});

// Close mobile menu when clicking on a nav link
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    navMenu.classList.remove("active");
    header.classList.remove("mobile-menu-active");
    // Force refresh header state when closing menu via link
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop <= 100) {
      header.classList.remove("scrolled");
    }
  });
});

// Close mobile menu when clicking outside of it
document.addEventListener("click", (e) => {
  if (
    !mobileMenu.contains(e.target) &&
    !navMenu.contains(e.target) &&
    navMenu.classList.contains("active")
  ) {
    mobileMenu.classList.remove("active");
    navMenu.classList.remove("active");
    header.classList.remove("mobile-menu-active");
    // Force refresh header state when closing menu via outside click
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop <= 100) {
      header.classList.remove("scrolled");
    }
  }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Gallery Lightbox Functionality
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const imgSrc = item.getAttribute("data-src");
    lightboxImg.src = imgSrc;
    lightbox.style.display = "block";
    document.body.style.overflow = "hidden";
  });
});

// Close lightbox
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close lightbox with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.style.display === "block") {
    closeLightbox();
  }
});

function closeLightbox() {
  lightbox.style.display = "none";
  document.body.style.overflow = "auto";
}

// Active Navigation Link Highlighting
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const scrollPos = window.pageYOffset + 100;

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      // Remove active class from all nav links
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      // Add active class to current section's nav link
      const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
});

// Contact Form Handling
const contactForm = document.querySelector(".contact-form form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const formObject = {};

    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }

    // Basic form validation
    const name = formObject.name?.trim();
    const email = formObject.email?.trim();
    const message = formObject.message?.trim();

    if (!name || !email || !message) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Simulate form submission
    const submitButton = this.querySelector(".cta-button");
    const originalText = submitButton.textContent;

    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
      showNotification(
        "Thank you for your message! We'll get back to you soon.",
        "success"
      );
      this.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
}

// Email validation helper function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Remove any existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 1rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background-color: ${
          type === "success"
            ? "#d4edda"
            : type === "error"
            ? "#f8d7da"
            : "#d1ecf1"
        };
        border: 1px solid ${
          type === "success"
            ? "#c3e6cb"
            : type === "error"
            ? "#f5c6cb"
            : "#bee5eb"
        };
        color: ${
          type === "success"
            ? "#155724"
            : type === "error"
            ? "#721c24"
            : "#0c5460"
        };
    `;

  const notificationContent = notification.querySelector(
    ".notification-content"
  );
  notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;

  const closeButton = notification.querySelector(".notification-close");
  closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: inherit;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add a small delay for more natural feel
      setTimeout(() => {
        entry.target.classList.add("animate-in");
      }, 100);
    }
  });
}, observerOptions);

// Setup intersection observer for scroll animations
document.addEventListener("DOMContentLoaded", () => {
  const elementsToAnimate = document.querySelectorAll(
    ".service-card, .gallery-item, .about-content, .location-content, .contact-content, .global-content-side, .global-map-side, .region-item, .partnerships-info, .contact-form-card, .footer-section, .footer-bottom, .about-animate-image, .about-animate-text, .about-animate-quote, .expertise-header-animate, .expertise-intro-animate, .expertise-card-animate, .approach-header-animate, .approach-slider-left-animate, .approach-slider-right-animate, .approach-controls-animate, .partnership-title-animate, .partnership-item-animate, .section-title-animate, .section-title-center, .section-title-responsive, .quote-divider"
  );

  elementsToAnimate.forEach((el) => {
    // Don't override existing styles for elements that have their own CSS animations
    if (
      !el.classList.contains("about-animate-image") &&
      !el.classList.contains("about-animate-text") &&
      !el.classList.contains("about-animate-quote") &&
      !el.classList.contains("expertise-header-animate") &&
      !el.classList.contains("expertise-intro-animate") &&
      !el.classList.contains("expertise-card-animate") &&
      !el.classList.contains("approach-header-animate") &&
      !el.classList.contains("approach-slider-left-animate") &&
      !el.classList.contains("approach-slider-right-animate") &&
      !el.classList.contains("approach-controls-animate") &&
      !el.classList.contains("partnership-title-animate") &&
      !el.classList.contains("partnership-item-animate") &&
      !el.classList.contains("section-title-animate") &&
      !el.classList.contains("section-title-center") &&
      !el.classList.contains("section-title-responsive") &&
      !el.classList.contains("quote-divider")
    ) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    }
    observer.observe(el);
  });
});

// Add CSS for animations
const animationStyles = document.createElement("style");
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .quote-divider.animate-in {
        opacity: 1 !important;
        transform: scaleX(1) !important;
    }
    
    .nav-link.active {
        color: #a68b5c!important;
    }
`;
document.head.appendChild(animationStyles);

// Lazy loading for images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add("loaded");
        img.style.opacity = "1";
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";

    // Check if image is already loaded
    if (img.complete && img.naturalHeight !== 0) {
      img.style.opacity = "1";
    } else {
      img.onload = () => {
        img.style.opacity = "1";
      };
      img.onerror = () => {
        img.style.opacity = "1"; // Show even if there's an error
      };
    }

    imageObserver.observe(img);
  });
});

// Scroll to top functionality
const scrollToTopButton = document.createElement("button");
scrollToTopButton.innerHTML = "↑";
scrollToTopButton.className = "scroll-to-top";
scrollToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #000000ff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 20px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;

scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

document.body.appendChild(scrollToTopButton);

// Show/hide scroll to top button
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopButton.style.opacity = "1";
    scrollToTopButton.style.visibility = "visible";
  } else {
    scrollToTopButton.style.opacity = "0";
    scrollToTopButton.style.visibility = "hidden";
  }
});

// Performance optimization: debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
  // Scroll-based functionality here
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Our Approach Section Slider
document.addEventListener("DOMContentLoaded", function () {
  const leftSlider = document.querySelector(
    ".focus-sectors-section-slider-left"
  );
  const rightSlider = document.querySelector(
    ".focus-sectors-section-slider-right"
  );
  const dots = document.querySelectorAll(".slider-dots li");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (!leftSlider || !rightSlider) return;

  const leftSlides = leftSlider.querySelectorAll(".slider-item");
  const rightSlides = rightSlider.querySelectorAll(".slider-item");
  let currentSlide = 0;

  let isAnimating = false;

  function showSlide(index, direction = "next") {
    // Prevent multiple animations at once
    if (isAnimating) return;
    isAnimating = true;

    // Get currently active slides
    const currentActiveLeft = leftSlider.querySelector(".slider-item.active");
    const currentActiveRight = rightSlider.querySelector(".slider-item.active");

    // Handle left side (content) animation
    if (
      currentActiveLeft &&
      leftSlides[index] &&
      currentActiveLeft !== leftSlides[index]
    ) {
      // Animate out current content
      currentActiveLeft.style.opacity = "0";
      currentActiveLeft.style.transform = "translateY(30px)";

      setTimeout(() => {
        currentActiveLeft.classList.remove("active");
        currentActiveLeft.style.transform = "translateY(-30px)";

        // Show new content
        leftSlides[index].classList.add("active");
        leftSlides[index].style.transform = "translateY(-30px)";
        leftSlides[index].style.opacity = "0";

        // Force reflow
        leftSlides[index].offsetHeight;

        // Animate in new content
        setTimeout(() => {
          leftSlides[index].style.opacity = "1";
          leftSlides[index].style.transform = "translateY(0)";
        }, 50);
      }, 250);
    } else if (!currentActiveLeft && leftSlides[index]) {
      // Initial load
      leftSlides[index].classList.add("active");
      leftSlides[index].style.opacity = "1";
      leftSlides[index].style.transform = "translateY(0)";
    }

    // Handle right side (image) sliding animation
    if (
      currentActiveRight &&
      rightSlides[index] &&
      currentActiveRight !== rightSlides[index]
    ) {
      // Position new slide off-screen based on direction
      if (direction === "next") {
        rightSlides[index].style.transform = "translateX(100%)";
      } else {
        rightSlides[index].style.transform = "translateX(-100%)";
      }

      // Make new slide visible and active
      rightSlides[index].classList.add("active");

      // Force reflow
      rightSlides[index].offsetHeight;

      // Start animations
      setTimeout(() => {
        // Animate current slide out
        if (direction === "next") {
          currentActiveRight.style.transform = "translateX(-100%)";
        } else {
          currentActiveRight.style.transform = "translateX(100%)";
        }

        // Animate new slide in
        rightSlides[index].style.transform = "translateX(0)";

        // Clean up after animation completes
        setTimeout(() => {
          currentActiveRight.classList.remove("active");
          currentActiveRight.style.transform = "";
          isAnimating = false;
        }, 500);
      }, 50);
    } else if (!currentActiveRight && rightSlides[index]) {
      // Initial load
      rightSlides.forEach((slide) => slide.classList.remove("active"));
      rightSlides[index].classList.add("active");
      rightSlides[index].style.transform = "translateX(0)";
      isAnimating = false;
    } else {
      isAnimating = false;
    }

    // Update dots
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % leftSlides.length;
    showSlide(currentSlide, "next");
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + leftSlides.length) % leftSlides.length;
    showSlide(currentSlide, "prev");
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Initialize first slide
  showSlide(0);
});

console.log("Business Website Template Loaded Successfully!");

// World Map Countries Hover Functionality
document.addEventListener("DOMContentLoaded", function () {
  const worldMapObject = document.getElementById("world-map-svg");
  const globalDescription = document.getElementById("global-description");

  // Make SVG responsive by removing fixed dimensions
  function makeMapResponsive() {
    if (worldMapObject && worldMapObject.contentDocument) {
      const svgElement = worldMapObject.contentDocument.querySelector("svg");
      if (svgElement) {
        svgElement.removeAttribute("width");
        svgElement.removeAttribute("height");
        svgElement.setAttribute(
          "viewBox",
          svgElement.getAttribute("viewBox") || "0 0 1009.6727 665.96301"
        );
        svgElement.style.width = "100%";
        svgElement.style.height = "auto";
        svgElement.style.maxWidth = "100%";
      }
    }
  }

  // Try to make map responsive when object loads
  worldMapObject.addEventListener("load", makeMapResponsive);

  // Also try immediately in case it's already loaded
  setTimeout(makeMapResponsive, 100);

  const originalText =
    "Explore our global network of partnerships and projects spanning across multiple continents, each contributing to our mission of delivering exceptional results worldwide.";
  let setupAttempts = 0;
  const maxAttempts = 5;

  // Define European countries array
  const europeCountries = [
    "AT",
    "BE",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "FR",
    "DE",
    "GR",
    "HU",
    "IE",
    "IT",
    "LV",
    "LT",
    "LU",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SK",
    "SI",
    "ES",
    "SE", // EU countries
    "AL",
    "AD",
    "BA",
    "BY",
    "CH",
    "IS",
    "LI",
    "MK",
    "MD",
    "MC",
    "ME",
    "NO",
    "RS",
    "SM",
    "TR",
    "UA",
    "VA",
    "XK", // Non-EU European countries
    "GB", // United Kingdom (Great Britain)
  ];

  // Define Asia countries array (India and Vietnam)
  const asiaCountries = ["IN", "VN"];

  function trySetupMapHover() {
    setupAttempts++;

    if (!worldMapObject) {
      return false;
    }

    // Try to get the SVG document
    let svgDoc = null;

    try {
      if (worldMapObject.contentDocument) {
        svgDoc = worldMapObject.contentDocument;
      }
    } catch (e) {
      // Silent fail for security errors
    }

    if (!svgDoc) {
      try {
        if (
          worldMapObject.contentWindow &&
          worldMapObject.contentWindow.document
        ) {
          svgDoc = worldMapObject.contentWindow.document;
        }
      } catch (e) {
        // Silent fail for security errors
      }
    }

    if (!svgDoc) {
      try {
        if (typeof worldMapObject.getSVGDocument === "function") {
          svgDoc = worldMapObject.getSVGDocument();
        }
      } catch (e) {
        // Silent fail for security errors
      }
    }

    if (svgDoc && svgDoc.URL !== "about:blank") {
      // Wait a bit more for the SVG content to fully load
      setTimeout(() => {
        let setupComplete = false;

        // Setup USA hover
        const usaPath = svgDoc.getElementById("US");
        if (usaPath) {
          usaPath.removeEventListener("mouseenter", handleUSAMouseEnter);
          usaPath.removeEventListener("mouseleave", handleUSAMouseLeave);
          usaPath.addEventListener("mouseenter", handleUSAMouseEnter);
          usaPath.addEventListener("mouseleave", handleUSAMouseLeave);
          setupComplete = true;
        }

        // Setup Europe hover for all European countries
        europeCountries.forEach((countryCode) => {
          const countryPath = svgDoc.getElementById(countryCode);
          if (countryPath) {
            countryPath.removeEventListener(
              "mouseenter",
              handleEuropeMouseEnter
            );
            countryPath.removeEventListener(
              "mouseleave",
              handleEuropeMouseLeave
            );
            countryPath.addEventListener("mouseenter", handleEuropeMouseEnter);
            countryPath.addEventListener("mouseleave", handleEuropeMouseLeave);
            setupComplete = true;
          }
        });

        // Setup Asia hover for all Asian countries
        asiaCountries.forEach((countryCode) => {
          const countryPath = svgDoc.getElementById(countryCode);
          if (countryPath) {
            countryPath.removeEventListener("mouseenter", handleAsiaMouseEnter);
            countryPath.removeEventListener("mouseleave", handleAsiaMouseLeave);
            countryPath.addEventListener("mouseenter", handleAsiaMouseEnter);
            countryPath.addEventListener("mouseleave", handleAsiaMouseLeave);
            setupComplete = true;
          }
        });

        // Setup UAE hover
        const uaePath = svgDoc.getElementById("AE");
        if (uaePath) {
          uaePath.removeEventListener("mouseenter", handleUAEMouseEnter);
          uaePath.removeEventListener("mouseleave", handleUAEMouseLeave);
          uaePath.addEventListener("mouseenter", handleUAEMouseEnter);
          uaePath.addEventListener("mouseleave", handleUAEMouseLeave);
          setupComplete = true;
        }

        return setupComplete;
      }, 100);
    } else {
      return false;
    }
  }

  function handleUSAMouseEnter() {
    // Get SVG document
    const svgDoc =
      worldMapObject.contentDocument || worldMapObject.contentWindow?.document;
    if (svgDoc) {
      const usaPath = svgDoc.getElementById("US");
      if (usaPath) {
        usaPath.classList.add("europe-hover");
        // Bring element to front by re-appending to parent
        const parent = usaPath.parentNode;
        if (parent) {
          parent.appendChild(usaPath);
        }
      }
    }
  }

  function handleUSAMouseLeave() {
    // Get SVG document
    const svgDoc =
      worldMapObject.contentDocument || worldMapObject.contentWindow?.document;
    if (svgDoc) {
      const usaPath = svgDoc.getElementById("US");
      if (usaPath) {
        usaPath.classList.remove("europe-hover");
      }
    }
  }

  function handleEuropeMouseEnter() {
    // Add hover class to all European countries and bring them to front
    const svgDoc =
      worldMapObject.contentDocument || worldMapObject.contentWindow?.document;
    if (svgDoc) {
      europeCountries.forEach((countryCode) => {
        const countryPath = svgDoc.getElementById(countryCode);
        if (countryPath) {
          countryPath.classList.add("europe-hover");
          // Bring element to front by re-appending to parent
          const parent = countryPath.parentNode;
          if (parent) {
            parent.appendChild(countryPath);
          }
        }
      });
    }
  }

  function handleEuropeMouseLeave() {
    // Remove hover class from all European countries
    const svgDoc =
      worldMapObject.contentDocument || worldMapObject.contentWindow?.document;
    if (svgDoc) {
      europeCountries.forEach((countryCode) => {
        const countryPath = svgDoc.getElementById(countryCode);
        if (countryPath) {
          countryPath.classList.remove("europe-hover");
        }
      });
    }
  }

  function handleAsiaMouseEnter() {
    // Add hover class to all Asian countries and bring them to front
    const svgDoc =
      worldMapObject.contentDocument || worldMapObject.contentWindow?.document;
    if (svgDoc) {
      asiaCountries.forEach((countryCode) => {
        const countryPath = svgDoc.getElementById(countryCode);
        if (countryPath) {
          countryPath.classList.add("europe-hover");
          // Bring element to front by re-appending to parent
          const parent = countryPath.parentNode;
          if (parent) {
            parent.appendChild(countryPath);
          }
        }
      });
    }
  }

  function handleAsiaMouseLeave() {
    // Remove hover class from all Asian countries
    const svgDoc =
      worldMapObject.contentDocument || worldMapObject.contentWindow?.document;
    if (svgDoc) {
      asiaCountries.forEach((countryCode) => {
        const countryPath = svgDoc.getElementById(countryCode);
        if (countryPath) {
          countryPath.classList.remove("europe-hover");
        }
      });
    }
  }

  function handleUAEMouseEnter() {
    // Get SVG document
    const svgDoc =
      worldMapObject.contentDocument || worldMapObject.contentWindow?.document;
    if (svgDoc) {
      const uaePath = svgDoc.getElementById("AE");
      if (uaePath) {
        uaePath.classList.add("europe-hover");
        // Bring element to front by re-appending to parent
        const parent = uaePath.parentNode;
        if (parent) {
          parent.appendChild(uaePath);
        }
      }
    }
  }

  function handleUAEMouseLeave() {
    // Get SVG document
    const svgDoc =
      worldMapObject.contentDocument || worldMapObject.contentWindow?.document;
    if (svgDoc) {
      const uaePath = svgDoc.getElementById("AE");
      if (uaePath) {
        uaePath.classList.remove("europe-hover");
      }
    }
  }

  function retrySetup() {
    if (setupAttempts < maxAttempts) {
      setTimeout(() => {
        if (!trySetupMapHover()) {
          retrySetup();
        }
      }, 500 * setupAttempts); // Increasing delay
    }
  }

  // Setup text hover functionality
  function setupTextHovers() {
    // Get all region items (the entire container, not just the heading)
    const regionItems = document.querySelectorAll(".region-item");

    regionItems.forEach((regionItem) => {
      const heading = regionItem.querySelector("h3");
      if (!heading) return;

      const text = heading.textContent.trim();

      // Add cursor pointer and styling
      heading.style.cursor = "pointer";
      heading.style.transition = "color 0.3s ease";

      // Add hover events based on text content
      if (text === "North America") {
        regionItem.addEventListener("mouseenter", () => {
          handleUSAMouseEnter();
        });
        regionItem.addEventListener("mouseleave", () => {
          handleUSAMouseLeave();
        });
      } else if (text === "Europe") {
        regionItem.addEventListener("mouseenter", () => {
          handleEuropeMouseEnter();
        });
        regionItem.addEventListener("mouseleave", () => {
          handleEuropeMouseLeave();
        });
      } else if (text === "Middle East") {
        regionItem.addEventListener("mouseenter", () => {
          handleUAEMouseEnter();
        });
        regionItem.addEventListener("mouseleave", () => {
          handleUAEMouseLeave();
        });
      } else if (text === "Asia") {
        regionItem.addEventListener("mouseenter", () => {
          handleAsiaMouseEnter();
        });
        regionItem.addEventListener("mouseleave", () => {
          handleAsiaMouseLeave();
        });
      }
    });
  }

  // Start setup process
  if (worldMapObject) {
    // Try immediately
    if (!trySetupMapHover()) {
      // Listen for load event
      worldMapObject.addEventListener("load", function () {
        trySetupMapHover();
      });

      // Also retry with delays
      retrySetup();
    }
  }

  // Setup text hovers (doesn't need SVG to be loaded)
  setupTextHovers();
});
