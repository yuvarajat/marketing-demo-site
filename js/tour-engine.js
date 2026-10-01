/* ==========================================================================
   LUMINA VILLA - UNBROKEN CONTINUOUS 3D WALKTHROUGH & INTERACTIVE MAP ENGINE
   No Disjointed Cuts • Continuous Spatial Journey From Entrance to Sanctuary
   ========================================================================== */

const ESTATES_CATALOG = {
  promontory: {
    id: 'promontory',
    name: 'The Promontory Villa',
    location: 'Pacific Palisades, California',
    price: '$34,500,000 USD / ₹285 Cr',
    carpetArea: '14,500 SQ. FT.',
    bedsBaths: '5 Suites • 7 Baths',
    lotSize: '1.8 Acres Oceanfront',
    structure: 'Monolithic Concrete & Steel',
    scenes: [
      {
        num: '01 / APPROACH',
        title: 'The Monolithic Arrival',
        specs: '14,500 SQ. FT. • PRE-STRESSED CONCRETE & GLASS',
        desc: 'Hovering 14ft above dark granite reflection pools, the cantilevered wings frame the ocean horizon as you approach along the entry driveway.',
        src: 'assets/exterior-arrival.jpg',
        nodeX: 30,
        nodeY: 100,
        nodeName: 'Arrival'
      },
      {
        num: '02 / THRESHOLD',
        title: 'The Pivot Entryway',
        specs: '12-FT BRONZE PIVOT DOOR • STONE WATER BRIDGE',
        desc: 'Stepping across the monolithic stone bridge spanning the reflection pool directly toward the illuminated 12-ft architectural bronze pivot door.',
        src: 'assets/entrance-door.jpg',
        nodeX: 68,
        nodeY: 90,
        nodeName: 'Threshold'
      },
      {
        num: '03 / FOYER',
        title: 'The Grand Travertine Foyer',
        specs: 'SCULPTURAL BRONZE STAIR • DOUBLE-HEIGHT VOID',
        desc: 'Crossing the threshold into the expansive travertine foyer, with the curved bronze staircase ascending overhead and formal living ahead.',
        src: 'assets/foyer-stair.jpg',
        nodeX: 110,
        nodeY: 75,
        nodeName: 'Foyer'
      },
      {
        num: '04 / GREAT SALON',
        title: 'The Great Salon & Hearth',
        specs: '24-FT CEILINGS • HONED ROMAN TRAVERTINE',
        desc: 'Moving forward into the double-height living salon, anchored by an 8-foot floating linear flame hearth with motorized glass pocket walls.',
        src: 'assets/great-room.jpg',
        nodeX: 160,
        nodeY: 60,
        nodeName: 'Great Salon'
      },
      {
        num: '05 / TERRACE',
        title: 'The Horizon Infinity Terrace',
        specs: '65-FT ZERO-EDGE POOL • SUNKEN FIRE LOUNGE',
        desc: 'Stepping out through retracted glass walls onto the cantilevered zero-edge saline pool deck overlooking the Pacific ocean sunset.',
        src: 'assets/infinity-pool.jpg',
        nodeX: 215,
        nodeY: 50,
        nodeName: 'Pool Deck'
      },
      {
        num: '06 / MASTER SUITE',
        title: 'The Master Sky Sanctuary',
        specs: '1,400 SQ. FT. PRIVATE AERIE • 270° CORNER GLASS',
        desc: 'Ascending to the upper cantilevered wing into the master suite, where frameless butt-glazed glass meets fluted white oak acoustic walls.',
        src: 'assets/master-suite.jpg',
        nodeX: 180,
        nodeY: 18,
        nodeName: 'Master Suite'
      }
    ]
  },
  alpine: {
    id: 'alpine',
    name: 'The Forest Glass Pavilion',
    location: 'Aspen Forest Reserve, Colorado',
    price: '$22,800,000 USD / ₹190 Cr',
    carpetArea: '11,200 SQ. FT.',
    bedsBaths: '4 Suites • 5 Baths',
    lotSize: '3.4 Acres Evergreen Forest',
    structure: 'Dark Architectural Steel & Cedar',
    scenes: [
      {
        num: '01 / FOREST ARRIVAL',
        title: 'The Pine Canopy Pavilion',
        specs: '11,200 SQ. FT. • MINIMALIST BLACK STEEL & GLASS',
        desc: 'A floating black steel pavilion set among misty alpine evergreens, featuring wrap-around dark cedar decks and natural stone reflection waters.',
        src: 'assets/alpine-exterior.jpg',
        nodeX: 40,
        nodeY: 95,
        nodeName: 'Canopy Arrival'
      },
      {
        num: '02 / LIVING ATRIUM',
        title: 'The Suspended Hearth Atrium',
        specs: 'TIMBER SLAT CEILING • FLOATING STEEL FIREPLACE',
        desc: 'Stepping into the central living room where floor-to-ceiling glass showcases towering pine trees centered around a sculptural suspended steel hearth.',
        src: 'assets/alpine-living.jpg',
        nodeX: 105,
        nodeY: 70,
        nodeName: 'Hearth Atrium'
      },
      {
        num: '03 / CEDAR SPA',
        title: 'The Alpine Infinity Spa',
        specs: 'HEATED BLACK GRANITE SPA • HEATED CEDAR DECK',
        desc: 'Walking out onto the cantilevered cedar deck to the heated infinity spa overlooking misty valley trees with rising geothermal steam.',
        src: 'assets/alpine-pool.jpg',
        nodeX: 175,
        nodeY: 55,
        nodeName: 'Infinity Spa'
      },
      {
        num: '04 / CANOPY SUITE',
        title: 'The Forest Master Sanctuary',
        specs: 'LOW-PROFILE WALNUT BED • PRIVATE WOOD STOVE',
        desc: 'Entering the master sanctuary where corner glass dissolves into the misty pine forest, complemented by dark cedar partitions and private hearth.',
        src: 'assets/alpine-bedroom.jpg',
        nodeX: 145,
        nodeY: 25,
        nodeName: 'Master Suite'
      }
    ]
  }
};

class VillaTourEngine {
  constructor() {
    this.canvas = document.getElementById('tour-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.currentEstateKey = 'promontory';
    this.currentSceneIndex = 0;
    this.scrollProgress = 0;
    this.images = [];
    this.imagesLoaded = 0;

    // Mouse Parallax values with smooth inertia
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.currentTiltX = 0;
    this.currentTiltY = 0;

    // UI Elements
    this.indicatorZone = document.querySelector('.indicator-zone');
    this.indicatorTitle = document.querySelector('.indicator-title');
    this.indicatorSpecs = document.querySelector('.indicator-specs');
    this.estateSwitchButtons = document.querySelectorAll('.estate-switch-btn');
    this.houseMapSvg = document.getElementById('house-map-svg');

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.loadEstate(this.currentEstateKey);
    this.setupEventListeners();
    this.setupEstateSwitcher();
    this.animate();
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * Math.min(window.devicePixelRatio, 2);
    this.canvas.height = this.height * Math.min(window.devicePixelRatio, 2);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
  }

  loadEstate(estateKey) {
    const estate = ESTATES_CATALOG[estateKey];
    if (!estate) return;

    this.currentEstateKey = estateKey;
    this.images = [];
    this.imagesLoaded = 0;

    // Preload estate scenes
    estate.scenes.forEach((scene, index) => {
      const img = new Image();
      img.src = scene.src;
      img.onload = () => {
        this.imagesLoaded++;
        if (this.imagesLoaded === estate.scenes.length) {
          this.renderScene(0, 0);
          this.updateHUD(0);
        }
      };
      this.images[index] = img;
    });

    // Render Scrollytelling Sections for this estate
    this.renderTourSections(estate);

    // Render Interactive House Map for this estate
    this.renderHouseMap(estate);
  }

  renderTourSections(estate) {
    const track = document.getElementById('scroll-track');
    if (!track) return;

    let html = '';
    estate.scenes.forEach((scene, idx) => {
      const isRight = idx % 2 === 1;
      html += `
        <section class="tour-section-trigger" data-index="${idx}">
          <div class="container" style="width: 100%;">
            <div class="tour-card-panel ${isRight ? 'align-right' : ''}">
              <div class="eyebrow">${estate.name.toUpperCase()} • ${scene.num}</div>
              <h2>${scene.title}.</h2>
              <p>${scene.desc}</p>
              
              <div class="estate-specs-row">
                <div class="estate-spec-item">
                  <span class="label">Space Dimension</span>
                  <span class="val">${scene.specs.split('•')[0] || estate.carpetArea}</span>
                </div>
                <div class="estate-spec-item">
                  <span class="label">Architecture</span>
                  <span class="val">${scene.specs.split('•')[1] || estate.structure}</span>
                </div>
              </div>

              <div style="display: flex; gap: 12px; align-items: center;">
                ${idx === 0 ? `
                  <button id="reel-tour-btn" class="btn-luxury">
                    <i class="ri-play-circle-line"></i>
                    <span>Walkthrough Tour [R]</span>
                  </button>
                ` : `
                  <button class="btn-luxury open-vip-modal">
                    <span>Inspect Space</span>
                    <i class="ri-arrow-right-line"></i>
                  </button>
                `}
                <a href="#vip-modal" class="btn-ghost-cyan open-vip-modal">
                  <span>Inquire</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      `;
    });

    track.innerHTML = html;

    // Reattach modal open listeners
    document.querySelectorAll('.open-vip-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('vip-modal');
        if (modal) modal.classList.add('active');
        if (window.luminaAudio) window.luminaAudio.playClick();
      });
    });

    // Reattach tour button listener
    const tourBtn = document.getElementById('reel-tour-btn');
    if (tourBtn && window.luminaDirector) {
      tourBtn.addEventListener('click', () => window.luminaDirector.toggleTour());
      window.luminaDirector.playBtn = tourBtn;
    }
  }

  renderHouseMap(estate) {
    if (!this.houseMapSvg) return;

    let pathD = '';
    let nodesMarkup = '';

    estate.scenes.forEach((scene, i) => {
      if (i === 0) {
        pathD += `M ${scene.nodeX} ${scene.nodeY}`;
      } else {
        pathD += ` L ${scene.nodeX} ${scene.nodeY}`;
      }

      nodesMarkup += `
        <g class="map-node ${i === 0 ? 'active' : ''}" data-index="${i}" transform="translate(${scene.nodeX}, ${scene.nodeY})">
          <circle class="node-bg" r="7" />
          <circle class="node-core" r="3" />
          <text x="12" y="3">${scene.nodeName}</text>
        </g>
      `;
    });

    this.houseMapSvg.innerHTML = `
      <!-- Walking Path Connection Line -->
      <path d="${pathD}" fill="none" stroke="rgba(212, 175, 55, 0.3)" stroke-width="1.8" stroke-dasharray="3,3" />
      <path id="map-active-path" d="${pathD}" fill="none" stroke="#00f2fe" stroke-width="2" stroke-dasharray="250" stroke-dashoffset="250" />
      
      <!-- Interactive Nodes -->
      ${nodesMarkup}

      <!-- Dynamic Drone Traveler Pin -->
      <g id="map-traveler-pin" transform="translate(${estate.scenes[0].nodeX}, ${estate.scenes[0].nodeY})">
        <circle r="12" fill="none" stroke="#00f2fe" stroke-width="1.2" opacity="0.6">
          <animate attributeName="r" values="6;14;6" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="#00f2fe" filter="drop-shadow(0 0 4px #00f2fe)" />
      </g>
    `;

    // Bind click events on Map Nodes
    const nodes = this.houseMapSvg.querySelectorAll('.map-node');
    nodes.forEach(node => {
      node.addEventListener('click', (e) => {
        const idx = parseInt(node.getAttribute('data-index'), 10);
        this.jumpToScene(idx);
        if (window.luminaAudio) window.luminaAudio.playClick();
      });
    });
  }

  jumpToScene(idx) {
    const triggers = document.querySelectorAll('.tour-section-trigger');
    if (triggers[idx]) {
      triggers[idx].scrollIntoView({ behavior: 'smooth' });
    }
  }

  setupEstateSwitcher() {
    this.estateSwitchButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const estateKey = e.currentTarget.getAttribute('data-estate');
        if (estateKey && estateKey !== this.currentEstateKey) {
          if (window.luminaAudio) window.luminaAudio.playClick();
          
          this.estateSwitchButtons.forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');

          this.loadEstate(estateKey);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.renderScene(this.currentSceneIndex, 0);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      this.targetTiltX = this.mouseX * 14;
      this.targetTiltY = this.mouseY * 8;
    });

    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  handleScroll() {
    const triggers = document.querySelectorAll('.tour-section-trigger');
    if (!triggers.length) return;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    const progress = Math.max(0, Math.min(1, currentScroll / totalHeight));
    this.scrollProgress = progress;

    const estate = ESTATES_CATALOG[this.currentEstateKey];
    if (!estate) return;

    const totalScenes = estate.scenes.length;
    const floatScene = progress * (totalScenes - 1);
    const sceneIndex = Math.min(totalScenes - 2, Math.floor(floatScene));
    const sceneTransitionProgress = floatScene - sceneIndex;

    this.currentSceneIndex = Math.round(floatScene);
    this.renderScene(sceneIndex, sceneTransitionProgress);
    this.updateHUD(this.currentSceneIndex, progress);
  }

  renderScene(fromIdx, transitionProgress) {
    const estate = ESTATES_CATALOG[this.currentEstateKey];
    if (!estate || this.images.length < estate.scenes.length) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const fromImg = this.images[fromIdx];
    const toIdx = Math.min(estate.scenes.length - 1, fromIdx + 1);
    const toImg = this.images[toIdx];

    // True Steadicam Forward Push: The current room zooms forward continuously,
    // and the incoming room smoothly reveals from its natural vanishing point!
    const baseScaleFrom = 1.0 + (transitionProgress * 0.18);
    const baseScaleTo = 1.18 - (transitionProgress * 0.18);

    this.ctx.save();
    this.ctx.globalAlpha = 1.0 - transitionProgress;
    this.drawCoverImage(fromImg, baseScaleFrom, this.currentTiltX, this.currentTiltY);
    this.ctx.restore();

    if (transitionProgress > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = transitionProgress;
      this.drawCoverImage(toImg, baseScaleTo, this.currentTiltX, this.currentTiltY);
      this.ctx.restore();
    }
  }

  drawCoverImage(img, scale, tiltX, tiltY) {
    if (!img || !img.complete) return;

    const imgAspect = img.width / img.height;
    const screenAspect = this.width / this.height;

    let drawW, drawH, drawX, drawY;

    if (screenAspect > imgAspect) {
      drawW = this.width * scale;
      drawH = (this.width / imgAspect) * scale;
    } else {
      drawH = this.height * scale;
      drawW = (this.height * imgAspect) * scale;
    }

    drawX = (this.width - drawW) / 2 + tiltX;
    drawY = (this.height - drawH) / 2 + tiltY;

    this.ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  updateHUD(sceneIdx, progress = 0) {
    const estate = ESTATES_CATALOG[this.currentEstateKey];
    if (!estate) return;

    const scene = estate.scenes[sceneIdx];
    if (!scene) return;

    if (this.indicatorZone) this.indicatorZone.textContent = scene.num;
    if (this.indicatorTitle) this.indicatorTitle.textContent = scene.title;
    if (this.indicatorSpecs) this.indicatorSpecs.textContent = scene.specs;

    // Update House Map Traveler Pin & Nodes
    if (this.houseMapSvg) {
      const pin = document.getElementById('map-traveler-pin');
      if (pin) {
        pin.setAttribute('transform', `translate(${scene.nodeX}, ${scene.nodeY})`);
      }

      const nodes = this.houseMapSvg.querySelectorAll('.map-node');
      nodes.forEach((node, i) => {
        if (i === sceneIdx) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });

      // Update animated path progress
      const activePath = document.getElementById('map-active-path');
      if (activePath) {
        activePath.style.strokeDashoffset = `${250 - (progress * 250)}`;
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.08;
    this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.08;

    const estate = ESTATES_CATALOG[this.currentEstateKey];
    if (estate) {
      const totalScenes = estate.scenes.length;
      const floatScene = this.scrollProgress * (totalScenes - 1);
      const sceneIndex = Math.min(totalScenes - 2, Math.floor(floatScene));
      const transitionP = floatScene - sceneIndex;
      this.renderScene(sceneIndex, transitionP);
    }
  }
}

window.VillaTourEngine = VillaTourEngine;
