/* ==========================================================================
   LUMINA VILLA - MINIMALIST REEL FLYTHROUGH DIRECTOR
   Automated 28-Second Smooth Flythrough for Video Recording (Shortcut: Space or R)
   ========================================================================== */

class CinematicReelDirector {
  constructor() {
    this.isPlaying = false;
    this.startTime = null;
    this.duration = 28000;
    this.animationFrameId = null;

    this.progressBar = document.getElementById('reel-progress-bar');
    this.playBtn = document.getElementById('reel-tour-btn');
    this.scrollPrompt = document.getElementById('scroll-prompt');

    this.init();
  }

  init() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.toggleTour());
    }

    // Keyboard Shortcuts for hands-free video filming
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === ' ' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        this.toggleTour();
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
      if (text) text.textContent = 'STOPPING...';
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

    if (this.scrollPrompt) this.scrollPrompt.style.opacity = '0.85';

    if (this.playBtn) {
      this.playBtn.classList.remove('active');
      const text = this.playBtn.querySelector('span');
      if (text) text.textContent = 'Flythrough Tour [R]';
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
}

window.CinematicReelDirector = CinematicReelDirector;
