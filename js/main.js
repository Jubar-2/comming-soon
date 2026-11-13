/**
 * DuniaExpress - Coming Soon Interactive Scripts
 * Handles Lucide icons, card mouse glow, scroll state, and launch alert notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  initCardMouseGlow();
  initCursorSpotlight();
  initHeaderScroll();
  initNotifyForm();
  initSmoothScroll();
});

/**
 * Initialize Lucide Icons with fallback SVGs if offline/CDN fails
 */
function initLucideIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  } else {
    // Robust embedded SVG fallback for offline and air-gapped environments
    renderSVGFallbacks();
  }
}

/**
 * SVG fallback icons in case external CDN is unreachable
 */
function renderSVGFallbacks() {
  const iconDefinitions = {
    'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    'diamond': '<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/>',
    'smartphone': '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    'sparkles': '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M18 6h-2v2"/><path d="M4 18h2v2"/>',
    'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'activity': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    'check-circle-2': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'
  };

  document.querySelectorAll('i[data-lucide]').forEach((el) => {
    const iconName = el.getAttribute('data-lucide');
    const path = iconDefinitions[iconName];
    if (path) {
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName}">${path}</svg>`;
    }
  });
}

/**
 * Dynamic Card Specular Highlight following mouse
 */
function initCardMouseGlow() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * Ambient Cursor Spotlight tracking mouse movement smoothly
 */
function initCursorSpotlight() {
  const spotlight = document.querySelector('.cursor-spotlight');
  if (!spotlight || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      spotlight.style.opacity = '1';
      isMoving = true;
    }
  });

  window.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
    isMoving = false;
  });

  function render() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/**
 * Header background transition on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Early Access Launch Notification Form
 */
function initNotifyForm() {
  const form = document.getElementById('notifyForm');
  const input = document.getElementById('notifyEmail');
  const successBox = document.getElementById('notifySuccess');
  const errorMsg = document.getElementById('notifyError');

  if (!form || !input || !successBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      input.focus();
      input.style.borderColor = '#ef4444';
      if (errorMsg) {
        errorMsg.textContent = 'Please enter a valid email address.';
        errorMsg.style.display = 'block';
      }
      return;
    }

    // Submit state simulation
    const submitBtn = form.querySelector('.notify-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Subscribing...';

    setTimeout(() => {
      form.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';
      successBox.classList.add('active');

      // Scroll slightly if needed
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 600);
  });

  input.addEventListener('input', () => {
    input.style.borderColor = '';
    if (errorMsg) errorMsg.style.display = 'none';
  });
}

/**
 * Smooth scrolling for internal anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

