/* ==========================================================================
   VILLA ATELIER - MAIN APPLICATION CONTROLLER
   Coordinates Real-Time 3D WebGL Villa, Audio Synthesizer, and Tour
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Custom Smooth Cursor Glow
  setupCursor();

  // 2. Initialize True 3D Architectural Villa Engine (Three.js WebGL)
  try {
    if (typeof THREE !== 'undefined' && window.TrueVilla3DEngine) {
      window.villa3D = new window.TrueVilla3DEngine('villa-3d-canvas');
    }
  } catch (err) {
    console.error('Failed to initialize True 3D Villa Engine:', err);
  }

  // 3. Initialize Procedural Audio Synthesizer
  try {
    if (window.LuminaAudioEngine) {
      window.luminaAudio = new window.LuminaAudioEngine();
    }
  } catch (err) {
    console.error('Failed to initialize audio engine:', err);
  }

  // 4. Initialize Cinematic Reel Walkthrough Director
  try {
    if (window.CinematicReelDirector) {
      window.luminaDirector = new window.CinematicReelDirector();
    }
  } catch (err) {
    console.error('Failed to initialize reel director:', err);
  }

  // 5. Header Scroll Effects & Lighting Toggle
  setupHeader();

  // 6. VIP Booking Modal & Form Handlers
  setupVipModal();
});

/* --- Custom Cursor Follower --- */
function setupCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorFollower = document.querySelector('.cursor-follower');
  if (!cursorDot || !cursorFollower) return;

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursorDot.style.display = 'none';
    cursorFollower.style.display = 'none';
    return;
  }

  window.addEventListener('mousemove', (e) => {
    cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  const interactiveElements = document.querySelectorAll('a, button, input, .map-node, .tour-card-panel');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower.classList.remove('active');
    });
  });
}

/* --- Header Sticky & Lighting Toggle --- */
function setupHeader() {
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Lighting Mode Button
  const lightingBtn = document.getElementById('lighting-toggle-btn');
  if (lightingBtn) {
    lightingBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'midnight';
      const newTheme = currentTheme === 'midnight' ? 'golden-hour' : 'midnight';
      document.documentElement.setAttribute('data-theme', newTheme);

      const label = lightingBtn.querySelector('span');
      if (label) label.textContent = newTheme === 'midnight' ? 'MIDNIGHT' : 'GOLDEN HOUR';

      if (window.villa3D) window.villa3D.setTheme(newTheme);
      if (window.luminaAudio) window.luminaAudio.playClick();
    });
  }
}

/* --- VIP Modal Handlers --- */
function setupVipModal() {
  const modal = document.getElementById('vip-modal');
  const openBtns = document.querySelectorAll('.open-vip-modal');
  const closeBtn = document.getElementById('close-vip-modal');
  const bookingForm = document.getElementById('vip-booking-form');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      if (window.luminaAudio) window.luminaAudio.playClick();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.luminaAudio) window.luminaAudio.playClick();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'CONFIRMED • ESTATEOS SYNCHRONIZED';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      submitBtn.style.color = '#ffffff';

      setTimeout(() => {
        alert('Thank you for reserving a private walkthrough. Synced directly with EstateOS CRM.');
        modal.classList.remove('active');
        bookingForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 900);
    });
  }
}
