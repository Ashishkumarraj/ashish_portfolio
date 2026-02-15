// script.js - Main JavaScript for Ashish Portfolio
// Features: Navbar, theme toggle, accordion, works filter, skills animation, testimonials slider, contact validation, fade-in on scroll, hamburger menu, localStorage theme

document.addEventListener('DOMContentLoaded', function () {
  // Navbar sticky blur on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Theme toggle with localStorage
  const themeToggle = document.getElementById('themeToggle');
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(currentTheme);
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(theme);
  });

  // Accordion for services
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
      const item = this.parentElement;
      item.classList.toggle('open');
      document.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) i.classList.remove('open');
      });
    });
  });

  // Works filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      workCards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });

  // Skills progress bars animate on scroll, show %
  const skillBars = document.querySelectorAll('.progress');
  const percentEls = document.querySelectorAll('.progress-percent');
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;
  function animateSkills() {
    if (!skillsAnimated && skillsSection.getBoundingClientRect().top < window.innerHeight - 100) {
      skillBars.forEach((bar, i) => {
        const percent = parseInt(bar.dataset.progress, 10);
        bar.style.width = percent + '%';
        // Animate percent number
        let current = 0;
        const percentEl = bar.parentElement.querySelector('.progress-percent');
        const step = () => {
          if (current < percent) {
            current += Math.ceil(percent / 30);
            if (current > percent) current = percent;
            percentEl.textContent = current + '%';
            requestAnimationFrame(step);
          } else {
            percentEl.textContent = percent + '%';
          }
        };
        step();
      });
      skillsAnimated = true;
    }
  }
  window.addEventListener('scroll', animateSkills);
  animateSkills();
  // Floating dark slide toggle button (bottom right) - fixed for independent use
  const darkSlideToggle = document.getElementById('darkSlideToggle');
  const darkSlideIcon = document.getElementById('darkSlideIcon');
  function setDarkSlide(active) {
    if (active) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      darkSlideToggle.classList.add('active');
      darkSlideIcon.src = 'assets/sun.svg';
      darkSlideIcon.alt = 'Light Slide';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      darkSlideToggle.classList.remove('active');
      darkSlideIcon.src = 'assets/moon.svg';
      darkSlideIcon.alt = 'Dark Slide';
    }
  }

  // On load, set theme from localStorage and update button
  function syncDarkSlideBtn() {
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setDarkSlide(theme === 'dark');
  }

  // Listen for manual toggle
  darkSlideToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setDarkSlide(!isDark);
  });

  // Listen for storage changes (multi-tab)
  window.addEventListener('storage', syncDarkSlideBtn);

  // On load
  syncDarkSlideBtn();

  // Testimonials slider
  const slider = document.getElementById('testimonialsSlider');
  const cards = slider.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  function showSlide(idx) {
    cards.forEach((card, i) => {
      card.style.display = i === idx ? 'block' : 'none';
    });
  }
  showSlide(currentSlide);
  document.querySelector('.slider-btn.prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + cards.length) % cards.length;
    showSlide(currentSlide);
  });
  document.querySelector('.slider-btn.next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % cards.length;
    showSlide(currentSlide);
  });

  // Fade-in on scroll
  const fadeEls = document.querySelectorAll('.section-title, .stat-card, .work-card, .timeline-item, .skill-bar, .testimonial-card, .blog-card, .contact-form');
  function fadeInOnScroll() {
    fadeEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('fade-in');
      }
    });
  }
  window.addEventListener('scroll', fadeInOnScroll);
  fadeInOnScroll();

  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    let valid = true;
    if (name.length < 2) {
      valid = false;
      formMessage.textContent = 'Please enter your name.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      valid = false;
      formMessage.textContent = 'Please enter a valid email.';
    } else if (message.length < 10) {
      valid = false;
      formMessage.textContent = 'Message should be at least 10 characters.';
    }
    if (valid) {
      formMessage.textContent = 'Thank you! Your message has been sent.';
      formMessage.style.color = 'green';
      contactForm.reset();
      setTimeout(() => { formMessage.textContent = ''; }, 4000);
    } else {
      formMessage.style.color = 'red';
    }
  });
});
