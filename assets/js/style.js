// ==================================
//   PORTFOLIO — DYNAMIC INTERACTIONS
//   Mobile-safe, touch-friendly
// ==================================

(function () {
  "use strict";

  // Detect touch device
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    document.body.classList.add("touch-device");
  }

  const isDesktop = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  // ==================================
  //   PRELOADER
  // ==================================
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(() => preloader.classList.add("hidden"), 800);
    }
  });

  // ==================================
  //   CUSTOM CURSOR (desktop only)
  // ==================================
  if (isDesktop) {
    const cursorDot = document.getElementById("cursor-dot");
    const cursorRing = document.getElementById("cursor-ring");
    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mouseX + "px";
        cursorDot.style.top = mouseY + "px";
      }
    });

    // Spring physics for cursor ring
    function animateCursorRing() {
      const ease = 0.12;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      if (cursorRing) {
        cursorRing.style.left = ringX + "px";
        cursorRing.style.top = ringY + "px";
      }
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Cursor hover state
    const hoverTargets = document.querySelectorAll(
      "a, button, [data-magnetic], .project-card, .detail-card, .contact-card, .skill-card, .cert-card, .hero-photo",
    );
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("cursor-hover"),
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("cursor-hover"),
      );
    });
  }

  // ==================================
  //   CLICK / TAP RIPPLE EFFECT
  // ==================================
  const rippleContainer = document.getElementById("ripple-container");
  if (rippleContainer) {
    const createRipple = (x, y) => {
      const ripple = document.createElement("div");
      ripple.className = "ripple";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.width = "100px";
      ripple.style.height = "100px";
      rippleContainer.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    };

    // Works on both click and touch
    document.addEventListener("click", (e) => {
      createRipple(e.clientX, e.clientY);
    });
  }

  // ==================================
  //   MAGNETIC HOVER EFFECT (desktop only)
  // ==================================
  if (isDesktop) {
    const magneticEls = document.querySelectorAll("[data-magnetic]");
    magneticEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.3;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
        el.style.transition =
          "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        setTimeout(() => {
          el.style.transition = "";
        }, 400);
      });
    });
  }

  // ==================================
  //   HEADER SCROLL & MOBILE MENU
  // ==================================
  const header = document.getElementById("header");
  const hamburger = document.getElementById("hamburger");
  const navContainer = document.getElementById("nav-container");

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (header) {
            header.classList.toggle("scrolled", window.scrollY > 60);
          }
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  if (hamburger && navContainer) {
    hamburger.addEventListener("click", () => {
      const isActive = hamburger.classList.toggle("active");
      navContainer.classList.toggle("active");
      const lines = hamburger.querySelectorAll(".line");

      if (isActive) {
        lines[0].style.transform = "rotate(45deg) translate(5px, 6px)";
        lines[1].style.opacity = "0";
        lines[2].style.transform = "rotate(-45deg) translate(5px, -6px)";
        // Prevent body scroll when menu is open
        document.body.style.overflow = "hidden";
      } else {
        lines[0].style.transform = "none";
        lines[1].style.opacity = "1";
        lines[2].style.transform = "none";
        document.body.style.overflow = "";
      }
    });

    // Close mobile menu on link click
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (navContainer.classList.contains("active")) {
          hamburger.click();
        }
      });
    });
  }

  // ==================================
  //   SCROLL PROGRESS BAR
  // ==================================
  const scrollProgress = document.getElementById("scroll-progress");
  window.addEventListener(
    "scroll",
    () => {
      if (scrollProgress) {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const scrolled = (window.scrollY / docHeight) * 100;
          scrollProgress.style.width = scrolled + "%";
        }
      }
    },
    { passive: true },
  );

  // ==================================
  //   SCROLL REVEAL (IntersectionObserver)
  // ==================================
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for very old browsers: show all
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  // ==================================
  //   TYPING EFFECT
  // ==================================
  const typedTextEl = document.getElementById("typed-text");
  const roles = [
    "Student",
    "Backend Developer",
    "Cloud & DevOps,
    "Problem Solver",
    "Cloud & System Security Enthusiast",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typedTextEl) return;
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else {
        typingSpeed = 80 + Math.random() * 60;
      }
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      } else {
        typingSpeed = 40;
      }
    }
    setTimeout(typeEffect, typingSpeed);
  }
  setTimeout(typeEffect, 1200);

  // ==================================
  //   TEXT SCRAMBLE (LOAD + HOVER)
  // ==================================

  const scrambleEls = document.querySelectorAll("[data-scramble]");
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Store original text
  scrambleEls.forEach((el) => {
    el.dataset.original = el.textContent;
  });

  function scrambleText(el) {
    const originalText = el.dataset.original;
    let iteration = 0;

    const interval = setInterval(() => {
      el.textContent = originalText
        .split("")
        .map((char, index) => {
          if (index < iteration) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      iteration += 0.5;

      if (iteration >= originalText.length) {
        clearInterval(interval);
        el.textContent = originalText;
      }
    }, 40);
  }

  // Run once when page loads
  setTimeout(() => {
    scrambleEls.forEach((el, i) => {
      setTimeout(() => scrambleText(el), i * 300);
    });
  }, 1200);

  // Hover animation (desktop)
  scrambleEls.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      scrambleText(el);
    });
  });

  // ==================================
  //   3D TILT EFFECT ON CARDS (desktop only)
  // ==================================
  if (isDesktop) {
    const tiltCards = document.querySelectorAll("[data-tilt]");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(800px) rotateX(0) rotateY(0) scale(1)";
        card.style.transition =
          "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        setTimeout(() => {
          card.style.transition = "";
        }, 500);
      });

      // Radial glow on project cards
      if (card.classList.contains("project-card")) {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--mouse-x", x + "%");
          card.style.setProperty("--mouse-y", y + "%");
        });
      }
    });
  }

  // ==================================
  //   ANIMATED COUNTERS
  // ==================================
  const statNumbers = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-count"), 10);
            animateCounter(el, target);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );
    statNumbers.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  // ==================================
  //   SKILL BAR ANIMATION
  // ==================================
  const skillFills = document.querySelectorAll(".skill-fill");
  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const width = el.getAttribute("data-width");
            el.style.width = width + "%";
            el.classList.add("animated");
            skillObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );
    skillFills.forEach((el) => skillObserver.observe(el));
  }

  // ==================================
  //   PARTICLES CANVAS
  // ==================================
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }
    resizeCanvas();

    // Debounced resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.35 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Fewer particles on mobile for performance
    const particleCount = isTouchDevice
      ? Math.min(30, Math.floor((canvas.width * canvas.height) / 25000))
      : Math.min(70, Math.floor((canvas.width * canvas.height) / 15000));

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Connection distance smaller on mobile
    const connectionDist = isTouchDevice ? 80 : 120;

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - dist / connectionDist) * 0.12;
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Mouse interaction (desktop only)
    if (isDesktop) {
      canvas.parentElement.addEventListener("mousemove", (e) => {
        const rect = canvas.parentElement.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        particles.forEach((p) => {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.speedX += (dx / dist) * force * 0.4;
            p.speedY += (dy / dist) * force * 0.4;
          }
          p.speedX *= 0.98;
          p.speedY *= 0.98;
        });
      });
    }
  }

  // ==================================
  //   SMOOTH SCROLL FOR NAV LINKS
  // ==================================
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

  // ==================================
  //   ACTIVE NAV LINK ON SCROLL
  // ==================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });
    },
    { passive: true },
  );

  // ==================================
  //   PARALLAX ON HERO (desktop only)
  // ==================================
  if (isDesktop) {
    const heroContent = document.querySelector(".hero-content");
    window.addEventListener("mousemove", (e) => {
      if (heroContent && window.scrollY < window.innerHeight) {
        const x = (window.innerWidth / 2 - e.clientX) / 60;
        const y = (window.innerHeight / 2 - e.clientY) / 60;
        heroContent.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }

  // ==================================
  //   CERTIFICATIONS SHOW MORE / LESS
  // ==================================
  const certToggleBtn = document.getElementById("cert-toggle-btn");
  const certTimeline = document.getElementById("cert-timeline");
  if (certToggleBtn && certTimeline) {
    certToggleBtn.addEventListener("click", () => {
      const isExpanded = certTimeline.classList.toggle("expanded");
      certToggleBtn.classList.toggle("active");
      const textEl = certToggleBtn.querySelector(".cert-toggle-text");
      if (textEl) {
        textEl.textContent = isExpanded ? "Show Less" : "Show More";
      }

      // When expanding, trigger reveal for newly-visible cards
      if (isExpanded) {
        const hiddenCards = certTimeline.querySelectorAll(
          ".cert-card:not(.revealed)",
        );
        hiddenCards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add("revealed");
          }, i * 60);
        });
      }
    });
  }

  // ==================================
  //   CONTACT FORM
  // ==================================
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector(".btn-submit span");
      const originalText = btn.textContent;
      btn.textContent = "Sent! ✓";
      btn.parentElement.style.background =
        "linear-gradient(135deg, #00ff88, #00cc66)";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.parentElement.style.background = "";
        contactForm.reset();
      }, 2500);
    });
  }

  // ==================================
  //   iOS VIEWPORT HEIGHT FIX
  // ==================================
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  setVH();
  window.addEventListener("resize", setVH);
  window.addEventListener("orientationchange", () => {
    setTimeout(setVH, 100);
  });

  // ==================================
  // ENABLE HOVER EFFECTS ON MOBILE (TAP)
  // ==================================
  if (isTouchDevice) {
    const hoverCards = document.querySelectorAll(
      ".project-card, .detail-card, .contact-card, .skill-card, .cert-card",
    );

    hoverCards.forEach((card) => {
      card.addEventListener("touchstart", () => {
        card.classList.add("touch-active");
      });

      card.addEventListener("touchend", () => {
        setTimeout(() => {
          card.classList.remove("touch-active");
        }, 300);
      });
    });
  }
})();
