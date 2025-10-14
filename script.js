// Header Scroll Behavior
let lastScrollTop = 0;
const header = document.querySelector("header");
const heroSection = document.querySelector(".hero");

// Add a class to ensure transitions work after page load
setTimeout(() => {
  header.classList.add("transitions-ready");
}, 1500);

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const heroHeight = heroSection ? heroSection.offsetHeight : 0;
  const scrollingDown = scrollTop > lastScrollTop;

  // Only add scrolled class (white background) when header is visible and past threshold
  if (!header.classList.contains("hidden") && scrollTop > 100) {
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
});

// Close mobile menu when clicking on a nav link
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    navMenu.classList.remove("active");
  });
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
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const elementsToAnimate = document.querySelectorAll(
    ".service-card, .gallery-item, .about-content, .location-content, .contact-content"
  );

  elementsToAnimate.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
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

  function showSlide(index) {
    // Hide all slides
    leftSlides.forEach((slide) => slide.classList.remove("active"));
    rightSlides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Show current slide
    if (leftSlides[index]) leftSlides[index].classList.add("active");
    if (rightSlides[index]) rightSlides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % leftSlides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + leftSlides.length) % leftSlides.length;
    showSlide(currentSlide);
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

  // Auto-slide (optional)
  setInterval(nextSlide, 7000);

  // Initialize first slide
  showSlide(0);
});

console.log("Business Website Template Loaded Successfully!");

// World Map Countries Hover Functionality
document.addEventListener("DOMContentLoaded", function () {
  const worldMapObject = document.getElementById("world-map-svg");
  const globalDescription = document.getElementById("global-description");

  const originalText =
    "Explore our global network of partnerships and projects spanning across multiple continents, each contributing to our mission of delivering exceptional results worldwide.";

  const countryTexts = {
    US: "🇺🇸 North America (USA) - Leading innovative projects focusing on cutting-edge technology solutions, strategic partnerships, and sustainable business practices that drive growth in major metropolitan markets.",

    AE: "🇦🇪 Middle East (UAE) - Building strong presence in the UAE, tapping into the region's innovative ecosystem while facilitating cross-continental business development and technological advancement opportunities.",

    IN: "🇮🇳 Asia (India) - Partnering with India's dynamic market to deliver scalable solutions that support rapid growth, digital transformation, and leverage local expertise with international standards.",

    TR: "🇹🇷 Europe (Turkey) - Expanding our European footprint through strategic partnerships in Turkey, delivering innovative solutions that bridge traditional business with modern digital transformation.",

    VN: "🇻🇳 Asia (Vietnam) - Growing our footprint in Vietnam through collaborative projects that leverage local expertise and international standards for sustainable business development.",

    IL: "🇮🇱 Middle East (Israel) - Building partnerships in Israel to tap into the region's innovative ecosystem and technological advancement opportunities in dynamic markets.",
  };

  function setupCountryHovers() {
    if (worldMapObject && worldMapObject.contentDocument) {
      const svgDoc = worldMapObject.contentDocument;

      Object.keys(countryTexts).forEach((countryCode) => {
        const countryPath = svgDoc.getElementById(countryCode);

        if (countryPath) {
          countryPath.addEventListener("mouseenter", function () {
            globalDescription.style.transition = "all 0.3s ease";
            globalDescription.innerHTML = countryTexts[countryCode];
            globalDescription.style.color = "#a68b5c";
            globalDescription.style.fontWeight = "500";
          });

          countryPath.addEventListener("mouseleave", function () {
            globalDescription.style.transition = "all 0.3s ease";
            globalDescription.innerHTML = originalText;
            globalDescription.style.color = "";
            globalDescription.style.fontWeight = "";
          });
        }
      });
    }
  }

  // Wait for SVG to load
  if (worldMapObject) {
    worldMapObject.addEventListener("load", setupCountryHovers);
    // In case it's already loaded
    if (worldMapObject.contentDocument) {
      setupCountryHovers();
    }
  }
});
