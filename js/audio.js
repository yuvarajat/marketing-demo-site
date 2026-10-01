/* ==========================================================================
   LUMINA RESIDENCES - PROCEDURAL WEB AUDIO SYNTHESIZER
   Zero-dependency luxury sound design using native Web Audio API oscillators
   ========================================================================== */

class LuminaAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.oscillators = [];
    this.isInitialized = false;

    this.toggleBtn = document.getElementById('sound-toggle-btn');
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleSound());
    }
  }

  initAudioContext() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isInitialized = true;
      this.setupAmbientPad();
    } catch (err) {
      console.warn('Web Audio API not supported on this device:', err);
    }
  }

  setupAmbientPad() {
    if (!this.ctx) return;

    // Master Ambient Gain Node
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);

    // Warm Low-Pass Filter (removes harsh highs, creates luxury warmth)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    this.ambientGain.connect(filter);
    filter.connect(this.ctx.destination);

    // Harmonic Chord (Ethereal luxury chord: Root F#1, C#2, A#2, D#3)
    const frequencies = [46.25, 69.3, 116.54, 155.56];

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (idx * 0.15), this.ctx.currentTime);

      oscGain.gain.setValueAtTime(0.12 / frequencies.length, this.ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.ambientGain);

      osc.start();
      this.oscillators.push(osc);
    });
  }

  toggleSound() {
    if (!this.isInitialized) {
      this.initAudioContext();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.ambientGain) {
      const targetGain = this.isMuted ? 0 : 0.28;
      this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.6);
    }

    // Update UI button
    if (this.toggleBtn) {
      const label = this.toggleBtn.querySelector('.sound-label');
      const icon = this.toggleBtn.querySelector('.sound-icon');
      if (this.isMuted) {
        this.toggleBtn.classList.remove('active');
        if (label) label.textContent = 'SOUND: OFF';
        if (icon) icon.className = 'ri-volume-mute-line sound-icon';
      } else {
        this.toggleBtn.classList.add('active');
        if (label) label.textContent = 'SOUND: ON';
        if (icon) icon.className = 'ri-volume-up-line sound-icon';
        this.playClick();
      }
    }
  }

  // Futuristic micro-click sound
  playClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Soft subtle hover harmonic
  playHover() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
}

window.LuminaAudioEngine = LuminaAudioEngine;
