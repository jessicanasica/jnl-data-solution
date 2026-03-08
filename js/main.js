/* ============================================
   Conservation Tech Solutions — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Each init is independent — one failure cannot break the others
  const inits = [
    initSlideshow,
    initMobileNav,
    initSmoothScroll,
    initHeaderScroll,
    initActiveNavHighlight,
    initScrollAnimations,
    initSolutionCards,
    initProjectModals,
    initContactForm,
  ];

  inits.forEach(fn => {
    try { fn(); } catch (e) { console.error(fn.name + ' failed:', e); }
  });

  // Load Lucide icons dynamically — never blocks DOMContentLoaded
  var script = document.createElement('script');
  script.src = 'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js';
  script.onload = function () {
    try { lucide.createIcons(); } catch (e) { console.warn('Lucide:', e); }
  };
  document.body.appendChild(script);
});

/* ----- Hero Slideshow ----- */
function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;

  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('slide-active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('slide-active');
  }, 4000);
}

/* ----- Mobile Navigation ----- */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.nav-overlay');

  if (!toggle || !navMenu) return;

  function openMenu() {
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when clicking a nav link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
      toggle.focus();
    }
  });
}

/* ----- Smooth Scrolling ----- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ----- Header Background on Scroll ----- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Run once on load
  updateHeader();
}

/* ----- Active Nav Link Highlighting ----- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    let currentSection = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveLink);
      ticking = true;
    }
  }, { passive: true });
}

/* ----- Scroll-Triggered Animations ----- */
function initScrollAnimations() {
  // Animate individual sections
  const animateSections = document.querySelectorAll(
    '.problem-section, .solutions-section, .process-section, .projects-section, .clients-section, .cta-section, .contact-section'
  );

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll', 'visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  animateSections.forEach(section => {
    section.classList.add('animate-on-scroll');
    sectionObserver.observe(section);
  });

  // Animate staggered children (cards)
  const staggerContainers = document.querySelectorAll('.animate-stagger');

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  staggerContainers.forEach(container => {
    staggerObserver.observe(container);
  });

  // Animate solution cards individually
  const solutionCards = document.querySelectorAll('.solution-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  solutionCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    cardObserver.observe(card);
  });

  // Animate process steps
  const processSteps = document.querySelectorAll('.process-step');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        stepObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  processSteps.forEach((step, i) => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(24px)';
    step.style.transition = `opacity 0.5s ease-out ${i * 0.12}s, transform 0.5s ease-out ${i * 0.12}s`;
    stepObserver.observe(step);
  });
}

/* ----- Expandable Solution Cards ----- */
function initSolutionCards() {
  const cards = document.querySelectorAll('.solution-card');

  cards.forEach(card => {
    const toggle = card.querySelector('.solution-toggle');
    const details = card.querySelector('.solution-details');

    if (!toggle || !details) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.contains('expanded');

      // Close all other cards
      cards.forEach(c => {
        if (c !== card && c.classList.contains('expanded')) {
          c.classList.remove('expanded');
          const t = c.querySelector('.solution-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this card
      if (!isExpanded) {
        card.classList.add('expanded');
        toggle.setAttribute('aria-expanded', 'true');

        // Scroll card into better view if needed
        setTimeout(() => {
          const rect = card.getBoundingClientRect();
          if (rect.bottom > window.innerHeight) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      } else {
        card.classList.remove('expanded');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard support
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  });
}

/* ----- Project Modals ----- */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const modalImage = document.getElementById('modal-image');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalClient = document.getElementById('modal-client');
  const modalChallenge = document.getElementById('modal-challenge');
  const modalSolution = document.getElementById('modal-solution');
  const modalResult = document.getElementById('modal-result');
  const closeBtn = modal.querySelector('.modal-close');
  const modalCta = modal.querySelector('.modal-cta');

  // Project data
  const projectData = {
    arm: {
      tag: 'Field Data Collection',
      title: 'Complete Reserve Management System',
      client: 'Nature Seychelles \u2022 Cousin Island Special Reserve',
      imageBg: 'arm-bg',
      challenge: 'Field staff needed to track 11 different conservation activities\u2014from turtle patrols to seabird monitoring\u2014all on paper forms that took hours to transcribe. Data was often lost, delayed, or inconsistent.',
      solution: 'Custom field app (ARM) covering all conservation monitoring modules, running on rugged tablets designed for tropical field conditions. The app works completely offline, with GPS tracking, photo capture, and automatic data syncing when connectivity is available. Reports are generated automatically.',
      result: 'Staff were trained in 4 weeks and now use tablets daily for all monitoring activities. Data collection is faster, significantly more accurate, and reports that previously took hours are now generated automatically.'
    },
    wet: {
      tag: 'Citizen Science',
      title: 'Community Environmental Monitoring',
      client: 'Project details temporarily confidential \u2022 client and location withheld',
      imageBg: 'wet-bg',
      challenge: 'Local communities wanted to participate in environmental monitoring, but needed a tool that non-experts could use without specialized training. The solution also needed to be available in the local language to ensure broad community participation.',
      solution: 'A citizen science platform with simple photo-based data collection, available also in the local community language. The interface uses visual guides, location tagging, and an integrated image library that teaches participants what to look for and how to identify key environmental indicators.',
      result: 'Community members are now contributing valuable environmental monitoring data without highly technical training. The built-in educational resources ensure data quality while building environmental literacy. The multilingual approach ensures inclusive participation across diverse community groups. Full project details and outcomes available upon request.'
    },
    tracking: {
      tag: 'Wildlife Tracking',
      title: 'Automated Tortoise Tracking',
      client: 'Nature Seychelles \u2022 Cousin Island',
      imageBg: 'tracking-bg',
      challenge: 'The reserve conservation team needed to track Aldabra giant tortoises across the entire reserve year-round.',
      solution: 'A fully automated digital tracking system with custom geofencing alerts, long-term battery life, and little to no maintenance for years. The system uses technology designed for remote deployments and adapted to the particular terrain of the reserve. Real-time position data is displayed on a mapping dashboard.',
      result: 'Real-time tracking data reveals tortoise movement patterns, habitat preferences, and territorial behavior\u2014all without constant battery changes or human intervention. Geofencing alerts notify conservationists when animals move into certain areas.'
    },
    coral: {
      tag: 'Facility Management',
      title: 'Conservation Facility Management System',
      client: 'Project details temporarily confidential • client and location withheld',
      imageBg: 'coral-bg',
      challenge: 'A conservation facility needed a digital system to track specimens, manage routine maintenance tasks, and monitor conditions across multiple units. Paper-based tracking was inefficient and made it difficult to stay on top of schedules.',
      solution: 'Custom facility management app with individual specimen tracking, automated task scheduling, and monitoring capabilities. The system includes calendar integration for maintenance reminders and real-time dashboards showing facility-wide status.',
      result: 'Staff can efficiently manage daily operations with automated task alerts ensuring nothing is missed. The system supports record-keeping requirements and provides clear oversight of facility activities. *Full project details available upon request.*'
    }
  };

  let lastFocusedElement = null;

  function openModal(projectKey) {
    const data = projectData[projectKey];
    if (!data) return;

    lastFocusedElement = document.activeElement;

    // Populate modal
    modalImage.className = 'modal-image ' + data.imageBg;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalClient.textContent = data.client;
    modalChallenge.textContent = data.challenge;
    modalSolution.textContent = data.solution;
    modalResult.textContent = data.result;

    // Show/hide AI caption for coral project only
    const modalAiCaption = document.getElementById('modal-ai-caption');
    if (modalAiCaption) {
      modalAiCaption.hidden = (projectKey !== 'coral');
    }

    // Show modal
    modal.hidden = false;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Trigger animation
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });

    // Re-init icons inside modal
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Focus trap
    setTimeout(() => closeBtn.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove('visible');
    document.body.style.overflow = '';

    setTimeout(() => {
      modal.hidden = true;
      modal.style.display = 'none';
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }, 300);
  }

  // Event listeners for project cards
  document.querySelectorAll('.project-card').forEach(card => {
    const projectKey = card.dataset.project;

    card.addEventListener('click', () => openModal(projectKey));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(projectKey);
      }
    });
  });

  // Close modal
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  // Close modal when clicking CTA link inside modal
  if (modalCta) {
    modalCta.addEventListener('click', () => {
      closeModal();
    });
  }
}

/* ----- Contact Form Validation ----- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('#submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const successMsg = form.querySelector('.success-message');

  // Real-time validation on blur
  form.querySelectorAll('input[required], textarea[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  // Email special validation
  const emailField = form.querySelector('#email');
  if (emailField) {
    emailField.addEventListener('blur', () => validateEmail(emailField));
  }

  // Show/hide "Other" details field
  const otherCheckbox = form.querySelector('#project-type-other');
  const otherDetails = form.querySelector('#other-details');
  if (otherCheckbox && otherDetails) {
    otherCheckbox.addEventListener('change', () => {
      otherDetails.hidden = !otherCheckbox.checked;
      if (!otherCheckbox.checked) {
        // Clear the field when unchecked
        const otherInput = otherDetails.querySelector('input');
        if (otherInput) otherInput.value = '';
      }
    });
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isValid = validateAllFields();
    if (!isValid) return;

    // Show loading state
    btnText.hidden = true;
    btnLoading.hidden = false;
    submitBtn.disabled = true;

    try {
      // Simulate form submission (replace with EmailJS/Formspree/etc.)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success
      successMsg.hidden = false;
      form.reset();

      // Re-init Lucide icons for the success message checkmark
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // Reset after 6 seconds
      setTimeout(() => {
        successMsg.hidden = true;
      }, 6000);

    } catch (error) {
      console.error('Form submission error:', error);
      alert('Something went wrong. Please try emailing us directly.');
    } finally {
      btnText.hidden = false;
      btnLoading.hidden = true;
      submitBtn.disabled = false;
    }
  });

  function validateAllFields() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (emailField && emailField.value.trim()) {
      if (!validateEmail(emailField)) {
        isValid = false;
      }
    }

    // Focus first invalid field
    if (!isValid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
    }

    return isValid;
  }

  function validateField(field) {
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (!errorMsg) return true;

    if (field.hasAttribute('required') && !field.value.trim()) {
      field.classList.add('error');
      errorMsg.hidden = false;
      return false;
    }

    field.classList.remove('error');
    errorMsg.hidden = true;
    return true;
  }

  function validateEmail(field) {
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (!errorMsg) return true;

    const value = field.value.trim();
    if (!value && field.hasAttribute('required')) {
      field.classList.add('error');
      errorMsg.textContent = 'Please enter your email';
      errorMsg.hidden = false;
      return false;
    }

    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.classList.add('error');
        errorMsg.textContent = 'Please enter a valid email address';
        errorMsg.hidden = false;
        return false;
      }
    }

    field.classList.remove('error');
    errorMsg.hidden = true;
    return true;
  }
}
