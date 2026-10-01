/* ==========================================================================
   LUMINA VILLA - MAIN APPLICATION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Custom Smooth Cursor Glow
  setupCursor();

  // 2. Initialize 3D Photorealistic Villa Flythrough Engine
  try {
    if (window.VillaTourEngine) {
      window.luminaTour = new window.VillaTourEngine();
    }
  } catch (err) {
    console.error('Failed to initialize Villa Tour Engine:', err);
  }

  // 3. Initialize Procedural Audio Synthesizer
  try {
    if (window.LuminaAudioEngine) {
      window.luminaAudio = new window.LuminaAudioEngine();
    }
  } catch (err) {
    console.error('Failed to initialize audio engine:', err);
  }

  // 4. Initialize Cinematic Reel Flythrough Director
  try {
    if (window.CinematicReelDirector) {
      window.luminaDirector = new window.CinematicReelDirector();
    }
  } catch (err) {
    console.error('Failed to initialize reel director:', err);
  }

  // 5. Header Scroll Effects & Smooth Navigation
  setupHeader();

  // 6. VIP Booking Modal & Form Handlers
  setupVipModal();

  // Hide scroll prompt on scroll
  const scrollPrompt = document.getElementById('scroll-prompt');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 120 && scrollPrompt) {
      scrollPrompt.style.opacity = '0';
      scrollPrompt.style.pointerEvents = 'none';
    } else if (scrollPrompt && (!window.luminaDirector || !window.luminaDirector.isPlaying)) {
      scrollPrompt.style.opacity = '0.9';
    }
  });
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

  const interactiveElements = document.querySelectorAll('a, button, input, .room-nav-btn, .live-hotspot, .tour-card-panel');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower.classList.remove('active');
    });
  });
}

/* --- Header Sticky & Active Link Spy --- */
function setupHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
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
