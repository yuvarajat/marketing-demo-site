/* ==========================================================================
   LUMINA RESIDENCES - CINEMATIC REEL TOUR & AUTO-DEMO MODE
   Automated 30-Second Smooth Showcase for effortless Instagram Reel recording
   ========================================================================== */

class CinematicReelDirector {
  constructor() {
    this.isPlaying = false;
    this.startTime = null;
    this.duration = 28000; // 28 seconds (ideal for a 30s Reel)
    this.animationFrameId = null;

    this.progressBar = document.getElementById('reel-progress-bar');
    this.playBtn = document.getElementById('reel-tour-btn');
    this.playBtnDock = document.getElementById('reel-tour-btn-dock');
    this.lightingBtn = document.getElementById('lighting-toggle-btn');
    this.camAngleBtn = document.getElementById('cam-angle-btn');

    this.currentTheme = 'midnight';
    this.camAngles = ['default', 'penthouse', 'low-angle'];
    this.currentCamIdx = 0;

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

    if (this.camAngleBtn) {
      this.camAngleBtn.addEventListener('click', () => this.cycleCameraAngle());
    }

    // Keyboard Shortcuts for filming convenience
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in a form input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === ' ' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        this.toggleTour();
      } else if (e.key.toLowerCase() === 'l') {
        this.toggleLighting();
      } else if (e.key.toLowerCase() === 'c') {
        this.cycleCameraAngle();
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

    if (this.playBtn) {
      this.playBtn.classList.add('active');
      const text = this.playBtn.querySelector('span');
      if (text) text.textContent = 'STOP REEL TOUR';
    }
    if (this.playBtnDock) {
      this.playBtnDock.classList.add('active');
      const text = this.playBtnDock.querySelector('span');
      if (text) text.textContent = 'STOPPING... [R]';
    }

    if (window.luminaAudio && window.luminaAudio.isMuted) {
      // Optionally turn on ambient sound for the video
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

    if (this.playBtn) {
      this.playBtn.classList.remove('active');
      const text = this.playBtn.querySelector('span');
      if (text) text.textContent = 'Cinematic Tour [R]';
    }
    if (this.playBtnDock) {
      this.playBtnDock.classList.remove('active');
      const text = this.playBtnDock.querySelector('span');
      if (text) text.textContent = 'AUTO TOUR [R]';
    }
  }

  animateTour(now) {
    if (!this.isPlaying) return;

    const elapsed = now - this.startTime;
    const progress = Math.min(1, elapsed / this.duration);

    // Update progress indicator
    if (this.progressBar) {
      this.progressBar.style.width = `${progress * 100}%`;
    }

    // Choreographed Keyframes along the 28s timeline
    const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Smooth easing curve
    let targetScrollProgress = 0;

    if (progress < 0.18) {
      // 0 - 5s: Hero section with 3D building slow orbit
      targetScrollProgress = 0;
      if (window.lumina3D) window.lumina3D.setCameraAngle('default');
    } else if (progress < 0.42) {
      // 5s - 12s: Smooth scroll to Architecture & Design cards
      const localP = (progress - 0.18) / (0.42 - 0.18);
      targetScrollProgress = this.easeInOutCubic(localP) * 0.28;
      if (window.lumina3D && localP > 0.5) window.lumina3D.setCameraAngle('low-angle');
    } else if (progress < 0.72) {
      // 12s - 20s: Interactive Floorplan Configurator
      const localP = (progress - 0.42) / (0.72 - 0.42);
      targetScrollProgress = 0.28 + this.easeInOutCubic(localP) * 0.38;

      // Automatically switch floorplan tabs for visual excitement
      if (window.luminaFloorplan) {
        if (localP > 0.2 && localP < 0.6 && window.luminaFloorplan.currentUnit !== 'penthouse') {
          window.luminaFloorplan.renderUnit('penthouse');
        } else if (localP >= 0.6 && window.luminaFloorplan.currentUnit !== 'sky-villa') {
          window.luminaFloorplan.renderUnit('sky-villa');
        }
      }
    } else if (progress < 0.90) {
      // 20s - 25s: EstateOS PropTech Ecosystem
      const localP = (progress - 0.72) / (0.90 - 0.72);
      targetScrollProgress = 0.66 + this.easeInOutCubic(localP) * 0.22;
    } else {
      // 25s - 28s: Final Call to Action & Brand Attribution
      const localP = (progress - 0.90) / 0.10;
      targetScrollProgress = 0.88 + this.easeInOutCubic(localP) * 0.12;
    }

    window.scrollTo({
      top: targetScrollProgress * totalScrollHeight,
      behavior: 'auto'
    });

    if (progress >= 1) {
      this.stopTour();
      return;
    }

    this.animationFrameId = requestAnimationFrame((t) => this.animateTour(t));
  }

  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  toggleLighting() {
    this.currentTheme = this.currentTheme === 'midnight' ? 'golden-hour' : 'midnight';
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    if (this.lightingBtn) {
      const label = this.lightingBtn.querySelector('span');
      if (label) {
        label.textContent = this.currentTheme === 'midnight' ? 'MIDNIGHT' : 'GOLDEN HOUR';
      }
    }

    if (window.lumina3D) {
      window.lumina3D.setTheme(this.currentTheme);
    }
    if (window.luminaAudio) {
      window.luminaAudio.playClick();
    }
  }

  cycleCameraAngle() {
    this.currentCamIdx = (this.currentCamIdx + 1) % this.camAngles.length;
    const selectedAngle = this.camAngles[this.currentCamIdx];

    if (this.camAngleBtn) {
      const label = this.camAngleBtn.querySelector('span');
      if (label) {
        label.textContent = selectedAngle.toUpperCase();
      }
    }

    if (window.lumina3D) {
      window.lumina3D.setCameraAngle(selectedAngle);
    }
    if (window.luminaAudio) {
      window.luminaAudio.playClick();
    }
  }
}

window.CinematicReelDirector = CinematicReelDirector;
