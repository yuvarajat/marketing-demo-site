/* ==========================================================================
   LUMINA VILLA - CINEMATIC REEL TOUR & AUTO-DEMO DIRECTOR
   Automated 28-Second Smooth Flythrough of Actual Residence for Instagram Reels
   ========================================================================== */

class CinematicReelDirector {
  constructor() {
    this.isPlaying = false;
    this.startTime = null;
    this.duration = 28000; // 28 seconds (ideal for high-retention Instagram Reel)
    this.animationFrameId = null;

    this.progressBar = document.getElementById('reel-progress-bar');
    this.playBtn = document.getElementById('reel-tour-btn');
    this.playBtnDock = document.getElementById('reel-tour-btn-dock');
    this.lightingBtn = document.getElementById('lighting-toggle-btn');
    this.scrollPrompt = document.getElementById('scroll-prompt');

    this.currentTheme = 'midnight';
    this.init();
  }

  init() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.toggleTour());
    }
    if (this.playBtnDock) {
      this.playBtnDock.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleTour();
      });
    }

    if (this.lightingBtn) {
      this.lightingBtn.addEventListener('click', () => this.toggleLighting());
    }

    // Keyboard Shortcuts for hands-free video filming
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === ' ' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        this.toggleTour();
      } else if (e.key.toLowerCase() === 'l') {
        this.toggleLighting();
      } else if (e.key.toLowerCase() === 'm' && window.luminaAudio) {
        window.luminaAudio.toggleSound();
      }
    });
  }

  toggleTour() {
    if (this.isPlaying) {
      this.stopTour();
    } else {
      this.startTour();
    }
  }

  startTour() {
    this.isPlaying = true;
    this.startTime = performance.now();
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (this.scrollPrompt) this.scrollPrompt.style.opacity = '0';

    if (this.playBtn) {
      this.playBtn.classList.add('active');
      const text = this.playBtn.querySelector('span');
      if (text) text.textContent = 'STOP FLYTHROUGH';
    }
    if (this.playBtnDock) {
      this.playBtnDock.classList.add('active');
      const text = this.playBtnDock.querySelector('span');
      if (text) text.textContent = 'STOPPING... [R]';
    }

    if (window.luminaAudio && window.luminaAudio.isMuted) {
      window.luminaAudio.toggleSound();
    }

    this.animateTour(performance.now());
  }

  stopTour() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }

    if (this.scrollPrompt) this.scrollPrompt.style.opacity = '0.9';

    if (this.playBtn) {
      this.playBtn.classList.remove('active');
      const text = this.playBtn.querySelector('span');
      if (text) text.textContent = 'Flythrough Tour [R]';
    }
    if (this.playBtnDock) {
      this.playBtnDock.classList.remove('active');
      const text = this.playBtnDock.querySelector('span');
      if (text) text.textContent = 'AUTO FLYTHROUGH [R]';
    }
  }

  animateTour(now) {
    if (!this.isPlaying) return;

    const elapsed = now - this.startTime;
    const progress = Math.min(1, elapsed / this.duration);

    if (this.progressBar) {
      this.progressBar.style.width = `${progress * 100}%`;
    }

    const track = document.getElementById('scroll-track');
    const totalScroll = track ? (track.scrollHeight - window.innerHeight) : (document.documentElement.scrollHeight - window.innerHeight);

    // Smooth continuous cubic easing
    const smoothProgress = this.easeInOutSine(progress);

    window.scrollTo({
      top: smoothProgress * totalScroll,
      behavior: 'auto'
    });

    if (progress >= 1) {
      this.stopTour();
      return;
    }

    this.animationFrameId = requestAnimationFrame((t) => this.animateTour(t));
  }

  easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  toggleLighting() {
    this.currentTheme = this.currentTheme === 'midnight' ? 'golden-hour' : 'midnight';
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    const canvas = document.getElementById('tour-canvas');
    if (canvas) {
      if (this.currentTheme === 'golden-hour') {
        canvas.style.filter = 'sepia(0.2) saturate(1.25) contrast(1.08) brightness(1.05)';
      } else {
        canvas.style.filter = 'none';
      }
    }

    if (this.lightingBtn) {
      const label = this.lightingBtn.querySelector('span');
      if (label) {
        label.textContent = this.currentTheme === 'midnight' ? 'MIDNIGHT' : 'GOLDEN HOUR';
      }
    }

    if (window.luminaAudio) {
      window.luminaAudio.playClick();
    }
  }
}

window.CinematicReelDirector = CinematicReelDirector;
