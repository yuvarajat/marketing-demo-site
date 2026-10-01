/* ==========================================================================
   LUMINA RESIDENCES - MAIN APPLICATION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Custom Cursor Glow
  setupCursor();

  // 2. Initialize Three.js 3D Architectural Scene
  try {
    if (typeof THREE !== 'undefined' && window.LuminaArchitecturalScene) {
      window.lumina3D = new window.LuminaArchitecturalScene('webgl-canvas');
    }
  } catch (err) {
    console.error('Failed to initialize 3D scene:', err);
  }

  // 3. Initialize Interactive Residence & Blueprint Configurator
  try {
    if (window.FloorplanConfigurator) {
      window.luminaFloorplan = new window.FloorplanConfigurator();
    }
  } catch (err) {
    console.error('Failed to initialize floorplan configurator:', err);
  }

  // 4. Initialize Procedural Audio Synthesizer
  try {
    if (window.LuminaAudioEngine) {
      window.luminaAudio = new window.LuminaAudioEngine();
    }
  } catch (err) {
    console.error('Failed to initialize audio engine:', err);
  }

  // 5. Initialize Cinematic Reel Tour Director
  try {
    if (window.CinematicReelDirector) {
      window.luminaDirector = new window.CinematicReelDirector();
    }
  } catch (err) {
    console.error('Failed to initialize reel director:', err);
  }

  // 6. Header Scroll Blur & Navigation
  setupHeader();

  // 7. VIP Modal & Form Handlers
  setupVipModal();

  // 8. 3D Viewport HUD Control Buttons
  setupViewportHudControls();
});

/* --- Custom Cursor Follower --- */
function setupCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorFollower = document.querySelector('.cursor-follower');
  if (!cursorDot || !cursorFollower) return;

  // Don't show custom cursor on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursorDot.style.display = 'none';
    cursorFollower.style.display = 'none';
    return;
  }

  window.addEventListener('mousemove', (e) => {
    cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  const interactiveElements = document.querySelectorAll('a, button, input, .unit-tab-btn, .blueprint-hotspot, .feature-card');
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

  // Smooth anchor scrolling
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

      submitBtn.textContent = 'RESERVED • ESTATEOS SYNCHRONIZED';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      submitBtn.style.color = '#ffffff';

      setTimeout(() => {
        alert('Thank you for reserving a private consultation. Integrated directly with EstateOS CRM.');
        modal.classList.remove('active');
        bookingForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 900);
    });
  }
}

/* --- 3D Viewport HUD Controls --- */
function setupViewportHudControls() {
  const resetBtn = document.getElementById('hud-reset-view');
  const zoomInBtn = document.getElementById('hud-zoom-in');
  const zoomOutBtn = document.getElementById('hud-zoom-out');

  if (resetBtn && window.lumina3D) {
    resetBtn.addEventListener('click', () => {
      window.lumina3D.targetRotationX = 0;
      window.lumina3D.targetRotationY = 0;
      window.lumina3D.setCameraAngle('default');
      if (window.luminaAudio) window.luminaAudio.playClick();
    });
  }

  if (zoomInBtn && window.lumina3D) {
    zoomInBtn.addEventListener('click', () => {
      window.lumina3D.camera.position.z = Math.max(22, window.lumina3D.camera.position.z - 6);
      if (window.luminaAudio) window.luminaAudio.playClick();
    });
  }

  if (zoomOutBtn && window.lumina3D) {
    zoomOutBtn.addEventListener('click', () => {
      window.lumina3D.camera.position.z = Math.min(75, window.lumina3D.camera.position.z + 6);
      if (window.luminaAudio) window.luminaAudio.playClick();
    });
  }
}
