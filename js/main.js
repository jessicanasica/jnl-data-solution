/* ============================================
   Conservation Tech Solutions — Main JavaScript
   ============================================ */

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icon = type === 'success'
    ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = icon + `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 4000);
}

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

  const slideshowTrack = document.getElementById('slideshow-track');
  const slideshowDots = document.getElementById('slideshow-dots');
  const prevBtn = document.getElementById('slideshow-prev');
  const nextBtn = document.getElementById('slideshow-next');
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
      title: 'ARM \u2014 App for Reserve Management',
      logo: 'assets/images/arm-logo.png',
      client: 'Nature Seychelles (Seychelles) \u2022 Cousin Island Special Reserve \u2022 SeyCCAT',
      slideshowHeight: '360px',
      images: [
        { src: 'assets/images/arm-1.jpg', alt: 'ARM app on tablet in the field' },
        { src: 'assets/images/arm-2.jpeg', alt: 'Field staff training with tablets' },
        { src: 'assets/images/arm-3.jpeg', alt: 'ARM app on tablet in the field' },
        { src: 'assets/images/arm-4.png', alt: 'Field staff training with tablets' },
        { src: 'assets/images/arm-5.jpeg', alt: 'ARM app on tablet in the field' },
        { src: 'assets/images/arm-6.png', alt: 'Field staff training with tablets' },
        { src: 'assets/images/arm-7.jpeg', alt: 'ARM app on tablet in the field' },
        { src: 'assets/images/arm-8.jpeg', alt: 'Field staff training with tablets' },
        { src: 'assets/images/arm-9.png', alt: 'ARM app on tablet in the field' },
        { src: 'assets/images/arm-10.jpeg', alt: 'ARM app on tablet in the field' },
        { src: 'assets/images/arm-11.jpeg', alt: 'Field staff training with tablets' },
         { src: 'assets/images/arm-12.jpg', alt: 'Field staff training with tablets' },
        { src: 'assets/images/arm-13.jpeg', alt: 'ARM app on tablet in the field' },
        { src: 'assets/images/arm-training.jpg', alt: 'Data collection on Cousin Island' },
        { src: 'assets/images/arm-training-2.jpg', alt: 'ARM dashboard overview' },
      ],
      challenge: 'Cousin Island\u2019s field teams were juggling 11 conservation activities \u2014 turtle patrols, seabird surveys, invasive species tracking and more \u2014 all on paper forms that took hours to transcribe. <strong>Data was regularly lost, delayed, or inconsistent</strong>, and science officers spent more time chasing paperwork than doing science.',
      solution: '<strong>ARM</strong> (App for Reserve Management), a fully custom field app covering all <strong>11 conservation monitoring modules</strong>, purpose-built for Cousin Island\u2019s tropical conditions. Key features include:<ul><li>\ud83d\udce1 <strong>Full offline functionality</strong> with automatic sync when back online</li><li>\ud83d\udccd <strong>Automatic GPS tracking &amp; photo capture</strong> on every form</li><li>\ud83d\udea8 <strong>Illegal activity tracking</strong> \u2014 logging and reporting of fishing violations and environmental offences</li><li>\ud83e\udd16 <strong>AI-generated reports</strong> with real-time data analysis</li><li>\ud83d\udcca <strong>Superuser dashboard</strong> \u2014 real-time oversight of all field activities, ensuring tasks are completed on time and to standard</li><li>\ud83d\udcda <strong>Built-in training guides</strong> \u2014 step-by-step helpers for wardens and volunteers</li><li>\u26a1 <strong>70% reduction in data processing time</strong> from field to insight</li></ul>Designed to eliminate paper forms entirely, ARM puts decision-ready data in science officers\u2019 hands faster than ever.',
      inlineImage: { src: 'assets/images/arm-4.png', alt: 'ARM app in action on Cousin Island' },
      result: 'Staff trained in <strong>4 weeks</strong>, tablets in hand for every monitoring activity from day one. ARM now saves field teams <strong>15\u201320 hours per week</strong>, has eliminated <strong>100% of paper forms</strong>, and generates automatically the reports that previously took hours to compile. As the first app in what is now a growing suite of Nature Seychelles conservation tools, ARM proved that <strong>island-scale digital transformation is not just possible \u2014 it\u2019s replicable.</strong>',
    },
    wet: {
      tag: 'Citizen Science',
      title: 'WETSAPP \u2014 Wetland Evaluation & Tracking Seychelles App',
      logo: 'assets/images/wetsapp-logo.png',
      client: 'Nature Seychelles (Seychelles) \u2022 EU \u201cWetlands of Hope\u201d \u2022 SeyCCAT',
      slideshowHeight: '360px',
      images: [
        { src: 'assets/images/mangrove-wetsapp2b.png', alt: 'Wetland field survey in progress' },
        { src: 'assets/images/mangrove-wetsapp2a.png', alt: 'WETSAPP interface on smartphone' },
        { src: 'assets/images/mangrove-wetsapp4.png', alt: 'WETSAPP interface on smartphone' },
        { src: 'assets/images/mangrove-wetsapp3.png', alt: 'Community citizen science event' },
        { src: 'assets/images/mangrove-wetland.jpg', alt: 'Aerial view of mangrove wetland' },
        { src: 'assets/images/mangrove-wetsapp5.png', alt: 'Funding partners', fit: 'contain' },
      ],
      challenge: 'Seychelles\u2019 wetland monitoring relied entirely on paper-based methods \u2014 slow, fragmented, and prone to data loss. Conservation partners needed a unified digital platform to collect real-time data on <strong>biodiversity, ecosystem health, and environmental threats</strong> across Mahe island, accessible to field teams, government agencies, private sector partners, and community participants \u2014 including in Seychellois Creole.',
      solution: '<strong>WETSAPP</strong> (Wetland Evaluation and Tracking Seychelles App), a citizen science app, was developed under the EU-funded \u201cWetlands of Hope\u201d initiative with additional SeyCCAT support. Built for the field by Dr. Jessica Nasica with direct input from the LEAP team, its key features include:<ul><li>\ud83d\udccd <strong>Automatic GPS, photo &amp; tide capture</strong> \u2014 no manual entry needed</li><li>\ud83d\udce1 <strong>Full offline functionality</strong> with automatic sync when back online</li><li>\ud83c\udf3f <strong>Built-in species library</strong> for mangroves, birds, fauna &amp; flora</li><li>\ud83e\udd16 <strong>AI-generated reports</strong> with real-time data analysis</li><li>\ud83c\uddf8\ud83c\udde8 Available in <strong>English and Seychellois Creole</strong></li></ul>8 dedicated monitoring modules cover flora-fauna surveys, mangrove health, biomass estimation, disturbance reporting, pollution tracking, wetland cleanups, and nursery monitoring.',
      inlineImage: { src: 'assets/images/mangrove-wetsapp1.png', alt: 'WETSAPP in use during field survey' },
      result: 'Officially launched on <strong>21 May 2026</strong> (International Biodiversity Day) at L\u2019Escale Resort, in the presence of the Minister of Environment, the CEO of SeyCCAT, and senior government and private sector partners. The <strong>Wetlands of Hope</strong> network \u2014 including Air Seychelles, Absa Bank, Avani Barbarons, Canopy by Hilton, Constance Ephelia, and Kempinski \u2014 now uses a single standardised platform for wetland data collection across Mah\u00e9. As Jean-Claude Labrosse (MECENR) put it: <em>\u201cThis will speed up our work and ensure that no data is lost.\u201d</em> WETSAPP joins ARM as part of Nature Seychelles\u2019 growing ecosystem of conservation technologies under its Smart Islands / Tech for Nature initiative.'
    },
    tracking: {
      tag: 'Wildlife Tracking',
      title: 'ARM Extension \u2014 Automated GPS Tortoise Tracking',
      logo: 'assets/images/arm-logo.png',
      client: 'Nature Seychelles (Seychelles) \u2022 Cousin Island \u2022 SeyCCAT',
      slideshowHeight: '360px',
      images: [
        { src: 'assets/images/tortoise-tracking.jpg', alt: 'GPS tracker on Aldabra giant tortoise' },
        { src: 'assets/images/tracking-2.JPG', alt: 'Tortoise tracker setup' },
        { src: 'assets/images/tracking-3.JPG', alt: 'Tortoise tracker setup' },
        { src: 'assets/images/tracking-7a.png', alt: 'LoRaWAN gateway on Cousin Island' },
        { src: 'assets/images/tracking-7b.png', alt: 'Gateway installation' },
        { src: 'assets/images/tracking-4.JPG', alt: 'Tortoise tracker setup' },
        { src: 'assets/images/tracking-5.JPG', alt: 'Tortoise tracker setup' },
        { src: 'assets/images/tracking-6.png', alt: 'Tortoise tracker setup' },
        { src: 'assets/images/tracking-8.png', alt: 'Tortoise movement map' },
      ],
      challenge: 'Aldabra giant tortoises are <strong>ecosystem engineers</strong> \u2014 as they move, feed, and rest, they shape Cousin Island\u2019s vegetation and habitats. But tracking their movements year-round manually was simply impossible. The reserve needed a way to follow <strong>8 individuals across the entire island</strong>, 24/7, with zero extra workload for wardens.',
      solution: 'A fully automated GPS tracking system built around lightweight, low-power trackers attached directly to tortoise shells \u2014 designed for long-term deployment while letting tortoises go about their daily lives undisturbed. How it works:<ul><li>\ud83d\udc22 <strong>GPS tracker on each shell</strong> \u2014 records location every 4 hours</li><li>\ud83d\udce1 <strong>LoRaWAN technology</strong> \u2014 transmits data wirelessly to a gateway on the island</li><li>\ud83d\uddfa\ufe0f <strong>Feeds directly into ARM</strong> \u2014 data is automatically stored, mapped, and analysed. No manpower needed</li><li>\ud83d\udd14 <strong>Custom geofencing alerts</strong> \u2014 conservationists are notified when animals enter sensitive zones</li><li>\ud83d\udd0b <strong>Long-term battery life</strong> \u2014 minimal maintenance for years of continuous monitoring</li></ul>Part of Nature Seychelles\u2019 <strong>Tech4Nature / Smart Islands Initiative</strong>: combining digital innovation and data-driven management to make better decisions for nature.',
      inlineImage: { src: 'assets/images/tracking-5b.png', alt: 'Tortoise tracking system in the field' },
      result: 'Eight Aldabra giant tortoises on Cousin Island are now tracked continuously, revealing for the first time <strong>where they go, which habitats they prefer, and how far they roam</strong> \u2014 all without a single warden leaving the station. Long-term movement data is already informing reserve management decisions, and the system runs autonomously year-round. A first for Cousin Island, and a blueprint for island-wide wildlife monitoring.',
    },
    coral: {
      tag: 'Facility Management',
      title: 'Conservation Facility Management System',
      // logo: 'assets/images/arc-logo.png', // TODO: uncomment once NDA lifts and ARC branding is approved
      client: 'Project details temporarily confidential • client and location withheld',
      images: [
        { src: 'assets/images/coral-facility-AI.png', alt: 'Coral nursery facility overview', aiGenerated: true },
      ],
      challenge: 'A conservation facility needed a digital system to track specimens, manage routine maintenance tasks, and monitor conditions across multiple units. Paper-based tracking was inefficient and made it difficult to stay on top of schedules.',
      solution: 'Custom facility management app with individual specimen tracking, automated task scheduling, and monitoring capabilities. The system includes calendar integration for maintenance reminders and real-time dashboards showing facility-wide status.',
      result: 'Staff can efficiently manage daily operations with automated task alerts ensuring nothing is missed. The system supports record-keeping requirements and provides clear oversight of facility activities. *Full project details available upon request.*'
    }
  };

  let lastFocusedElement = null;
  let currentSlide = 0;
  let slideTimer = null;
  let currentImages = [];

  function goToSlide(index) {
    if (!currentImages.length) return;
    const slides = slideshowTrack.querySelectorAll('img');
    const dots = slideshowDots.querySelectorAll('.slideshow-dot');

    slides[currentSlide].classList.remove('slide-active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = ((index % currentImages.length) + currentImages.length) % currentImages.length;

    slides[currentSlide].classList.add('slide-active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    // Show/hide AI caption based on current slide
    const modalAiCaption = document.getElementById('modal-ai-caption');
    if (modalAiCaption) {
      modalAiCaption.hidden = !currentImages[currentSlide].aiGenerated;
    }
  }

  function startAutoAdvance() {
    stopAutoAdvance();
    if (currentImages.length > 1) {
      slideTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
    }
  }

  function stopAutoAdvance() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  function buildSlideshow(images) {
    currentImages = images;
    currentSlide = 0;

    // Build images
    slideshowTrack.innerHTML = '';
    images.forEach((img, i) => {
      const el = document.createElement('img');
      el.src = img.src;
      el.alt = img.alt;
      el.loading = 'lazy';
      if (img.fit) el.style.objectFit = img.fit;
      if (i === 0) el.classList.add('slide-active');
      slideshowTrack.appendChild(el);
    });

    // Build dots
    slideshowDots.innerHTML = '';
    if (images.length > 1) {
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slideshow-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => {
          goToSlide(i);
          startAutoAdvance();
        });
        slideshowDots.appendChild(dot);
      });
    }

    // Show/hide nav buttons
    const showNav = images.length > 1;
    prevBtn.style.display = showNav ? '' : 'none';
    nextBtn.style.display = showNav ? '' : 'none';

    startAutoAdvance();
  }

  function openModal(projectKey) {
    const data = projectData[projectKey];
    if (!data) return;

    lastFocusedElement = document.activeElement;

    // Build slideshow
    const slideshowEl = document.getElementById('modal-slideshow');
    slideshowEl.style.height = data.slideshowHeight || '';
    buildSlideshow(data.images);

    // Populate modal text
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalClient.textContent = data.client;

    // Logo
    const modalLogo = document.getElementById('modal-logo');
    if (data.logo) {
      modalLogo.src = data.logo;
      modalLogo.alt = data.title + ' logo';
      modalLogo.hidden = false;
    } else {
      modalLogo.hidden = true;
    }
    modalChallenge.innerHTML = data.challenge;
    modalSolution.innerHTML = data.solution;
    modalResult.innerHTML = data.result;

    // Inline image (between solution and result)
    const inlineImageEl = document.getElementById('modal-inline-image');
    if (data.inlineImage) {
      const img = inlineImageEl.querySelector('img');
      img.src = data.inlineImage.src;
      img.alt = data.inlineImage.alt;
      inlineImageEl.hidden = false;
    } else {
      inlineImageEl.hidden = true;
    }

    // Show/hide AI caption for first slide
    const modalAiCaption = document.getElementById('modal-ai-caption');
    if (modalAiCaption) {
      modalAiCaption.hidden = !data.images[0].aiGenerated;
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
    stopAutoAdvance();

    setTimeout(() => {
      modal.hidden = true;
      modal.style.display = 'none';
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }, 300);
  }

  // Slideshow nav buttons
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentSlide - 1);
    startAutoAdvance();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentSlide + 1);
    startAutoAdvance();
  });

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
      // Send via EmailJS
      if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
      emailjs.init('iBLQxBd5LoMletrh5');

      const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
      const projectTypes = Array.from(checkboxes).map(cb => cb.value || cb.nextElementSibling?.textContent || cb.id).join(', ');

      await emailjs.send('service_1dwn6dl', 'template_jnl_contact', {
        from_name: form.querySelector('#name').value,
        from_email: form.querySelector('#email').value,
        organization: form.querySelector('#organization').value || 'Not specified',
        project_type: projectTypes || 'Not specified',
        message: form.querySelector('#message').value,
        to_email: 'jessicanasica@gmail.com',
      });

      // Show success toast
      showToast('Message sent successfully! We\'ll get back to you within 72 hours.', 'success');
      form.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      showToast('Failed to send message. Please try emailing us directly at jessicanasica@gmail.com', 'error');
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
