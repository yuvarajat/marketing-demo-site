/* ==========================================================================
   LUMINA RESIDENCES - INTERACTIVE RESIDENCE CONFIGURATOR & BLUEPRINT
   ========================================================================== */

const RESIDENCE_COLLECTION = {
  penthouse: {
    id: 'penthouse',
    title: 'The Apex Triplex Penthouse',
    subtitle: 'Crown of Lumina — Floors 42 to 44',
    price: '₹28.50 Cr',
    priceUsd: '$3.45M USD',
    specs: {
      area: '8,450 SQ. FT.',
      bedrooms: '5 En-Suite Penthouses',
      ceiling: '14.5 FT Glass Height',
      view: '360° Panoramic Skyline',
      elevation: 'Level 42–44 (Spire Tier)',
      features: 'Private Helipad • Cantilevered Pool • Wine Atelier'
    },
    description: 'An architectural magnum opus suspended in the clouds. Featuring private elevator biometric access, multi-tier cantilevered infinity pool, dual-level library, and an open sky lounge overlooking the metropolis.',
    hotspots: [
      { id: 'h1', title: 'Cantilevered Sky Pool', desc: 'Heated infinity edge jutting 4m beyond perimeter', x: 260, y: 110 },
      { id: 'h2', title: 'Grand Master Sanctuary', desc: '1,200 sq.ft suite with Italian marble bath & dual walk-ins', x: 140, y: 220 },
      { id: 'h3', title: 'Private Helipad Access', desc: 'Direct biometric high-speed elevator to rooftop pad', x: 420, y: 130 },
      { id: 'h4', title: 'Great Room & Wine Salon', desc: 'Double-height glass hall with 300-bottle climate cellar', x: 320, y: 280 }
    ],
    svgWalls: `
      <!-- Penthouse Perimeter & Partitions -->
      <polygon points="60,60 480,60 480,180 540,180 540,360 60,360" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-dasharray="none" />
      <rect x="80" y="80" width="160" height="140" fill="rgba(212, 175, 55, 0.05)" stroke="rgba(212, 175, 55, 0.4)" stroke-width="1.2" />
      <text x="95" y="155" fill="#f3e5ab" font-size="11" font-family="monospace">MASTER SANCTUARY</text>
      
      <rect x="250" y="80" width="120" height="90" fill="rgba(0, 242, 254, 0.12)" stroke="#00f2fe" stroke-width="1.5" />
      <text x="260" y="130" fill="#a5f3fc" font-size="10" font-family="monospace">SKY POOL DECK</text>

      <rect x="250" y="180" width="210" height="160" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2" />
      <text x="280" y="270" fill="#ffffff" font-size="12" font-family="monospace">GREAT ROOM (DOUBLE HT)</text>

      <rect x="80" y="230" width="160" height="110" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2" />
      <text x="110" y="290" fill="#94a3b8" font-size="10" font-family="monospace">GUEST SUITE & SPA</text>
    `
  },
  'sky-villa': {
    id: 'sky-villa',
    title: 'The Celestial Sky Villa',
    subtitle: 'Elevated Haven — Floors 30 to 36',
    price: '₹16.80 Cr',
    priceUsd: '$2.05M USD',
    specs: {
      area: '5,200 SQ. FT.',
      bedrooms: '4 Grand Suites',
      ceiling: '12.8 FT Vaulted',
      view: '270° Ocean & City Horizon',
      elevation: 'Level 30–36 (High Tier)',
      features: 'Biophilic Sky Garden • Private Elevator • Chef Kitchen'
    },
    description: 'Designed for effortless indoor-outdoor living, featuring seamless floor-to-ceiling glass pocket doors that dissolve into an expansive landscaped sky terrace and private chef show-kitchen.',
    hotspots: [
      { id: 'h1', title: 'Biophilic Sky Garden', desc: 'Indigenous flora with automated micro-misting system', x: 450, y: 120 },
      { id: 'h2', title: 'Show Kitchen & Island', desc: 'Custom Poliform cabinetry with Sub-Zero appliances', x: 280, y: 220 },
      { id: 'h3', title: 'Sunset Lanai Lounge', desc: 'Wraparound deck with panoramic evening glow', x: 120, y: 310 }
    ],
    svgWalls: `
      <!-- Sky Villa Layout -->
      <polygon points="70,70 510,70 510,340 70,340" fill="none" stroke="#d4af37" stroke-width="2" />
      <rect x="90" y="90" width="180" height="130" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2" />
      <text x="110" y="160" fill="#ffffff" font-size="11" font-family="monospace">PRIMARY SUITE</text>

      <rect x="280" y="90" width="210" height="110" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" stroke-width="1.2" />
      <text x="310" y="150" fill="#6ee7b7" font-size="10" font-family="monospace">BIOPHILIC GARDEN</text>

      <rect x="90" y="230" width="400" height="90" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2" />
      <text x="210" y="280" fill="#ffffff" font-size="12" font-family="monospace">LIVING & SHOW KITCHEN</text>
    `
  },
  duplex: {
    id: 'duplex',
    title: 'The Azure Grand Duplex',
    subtitle: 'Volumetric Drama — Floors 18 to 28',
    price: '₹10.20 Cr',
    priceUsd: '$1.25M USD',
    specs: {
      area: '3,850 SQ. FT.',
      bedrooms: '3 Grand Suites + Den',
      ceiling: '20 FT Mezzanine Void',
      view: 'East-Facing Sunrise Panorama',
      elevation: 'Level 18–28 (Mid Tier)',
      features: 'Floating Glass Staircase • Media Lounge • Double Deck'
    },
    description: 'An architectural playground defined by a 20-foot vertical double-height living room and a sculptural floating structural glass staircase linking formal entertainment with private quarters.',
    hotspots: [
      { id: 'h1', title: 'Floating Glass Stair', desc: 'Cantilevered crystal treads with integrated LED edge glow', x: 260, y: 220 },
      { id: 'h2', title: 'Mezzanine Media Den', desc: 'Dolby Atmos acoustic treated retreat lounge', x: 380, y: 140 }
    ],
    svgWalls: `
      <!-- Duplex Layout -->
      <polygon points="80,80 500,80 500,340 80,340" fill="none" stroke="#d4af37" stroke-width="2" />
      <rect x="100" y="100" width="220" height="220" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.2" />
      <text x="130" y="215" fill="#f3e5ab" font-size="12" font-family="monospace">DOUBLE HEIGHT LIVING</text>

      <rect x="330" y="100" width="150" height="110" fill="rgba(0, 242, 254, 0.06)" stroke="rgba(0, 242, 254, 0.3)" stroke-width="1.2" />
      <text x="350" y="160" fill="#a5f3fc" font-size="10" font-family="monospace">MEZZANINE LOUNGE</text>

      <rect x="330" y="220" width="150" height="100" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2" />
      <text x="360" y="275" fill="#94a3b8" font-size="10" font-family="monospace">GUEST WING</text>
    `
  },
  horizon: {
    id: 'horizon',
    title: 'The Horizon Executive Suite',
    subtitle: 'Urban Sophistication — Floors 04 to 16',
    price: '₹5.80 Cr',
    priceUsd: '$700K USD',
    specs: {
      area: '2,200 SQ. FT.',
      bedrooms: '2 Suites + Home Study',
      ceiling: '11.5 FT Finished',
      view: 'Lush Podium Parkland & City Lights',
      elevation: 'Level 04–16 (Podium Tier)',
      features: 'EstateOS Smart Lock • Acoustic Glazing • Balcony'
    },
    description: 'A tailored urban sanctuary engineered for executives and international investors. Integrates native EstateOS automation for keyless access, climate staging, and automated energy optimization.',
    hotspots: [
      { id: 'h1', title: 'EstateOS Smart Hub', desc: 'Integrated touch panel controlling light, shades & HVAC', x: 270, y: 160 },
      { id: 'h2', title: 'Executive Study', desc: 'Acoustically isolated office with panoramic park view', x: 140, y: 140 }
    ],
    svgWalls: `
      <!-- Horizon Suite Layout -->
      <polygon points="90,90 490,90 490,330 90,330" fill="none" stroke="#d4af37" stroke-width="2" />
      <rect x="110" y="110" width="170" height="200" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2" />
      <text x="145" y="210" fill="#ffffff" font-size="11" font-family="monospace">GREAT ROOM</text>

      <rect x="290" y="110" width="180" height="95" fill="rgba(0, 242, 254, 0.06)" stroke="rgba(0, 242, 254, 0.3)" stroke-width="1.2" />
      <text x="325" y="160" fill="#a5f3fc" font-size="10" font-family="monospace">SMART STUDY</text>

      <rect x="290" y="215" width="180" height="95" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2" />
      <text x="330" y="265" fill="#94a3b8" font-size="10" font-family="monospace">MASTER SUITE</text>
    `
  }
};

class FloorplanConfigurator {
  constructor() {
    this.currentUnit = 'penthouse';
    this.blueprintSvg = document.getElementById('blueprint-svg');
    this.unitPriceEl = document.getElementById('unit-price');
    this.unitTitleEl = document.getElementById('unit-title');
    this.unitDescEl = document.getElementById('unit-desc');
    this.specAreaEl = document.getElementById('spec-area');
    this.specBedsEl = document.getElementById('spec-beds');
    this.specCeilingEl = document.getElementById('spec-ceiling');
    this.specElevationEl = document.getElementById('spec-elevation');
    this.tooltipEl = document.getElementById('hotspot-tooltip');

    this.tabButtons = document.querySelectorAll('.unit-tab-btn');

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderUnit('penthouse');
  }

  bindEvents() {
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const unitKey = e.currentTarget.getAttribute('data-unit');
        if (unitKey && unitKey !== this.currentUnit) {
          if (window.luminaAudio) window.luminaAudio.playClick();
          this.renderUnit(unitKey);
        }
      });
    });
  }

  renderUnit(unitKey) {
    const data = RESIDENCE_COLLECTION[unitKey];
    if (!data) return;

    this.currentUnit = unitKey;

    // Update active tab button
    this.tabButtons.forEach(btn => {
      if (btn.getAttribute('data-unit') === unitKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Text & Specs
    if (this.unitPriceEl) this.unitPriceEl.textContent = data.price;
    if (this.unitTitleEl) this.unitTitleEl.textContent = data.title;
    if (this.unitDescEl) this.unitDescEl.textContent = data.description;
    if (this.specAreaEl) this.specAreaEl.textContent = data.specs.area;
    if (this.specBedsEl) this.specBedsEl.textContent = data.specs.bedrooms;
    if (this.specCeilingEl) this.specCeilingEl.textContent = data.specs.ceiling;
    if (this.specElevationEl) this.specElevationEl.textContent = data.specs.elevation;

    // Render SVG Blueprint Layout & Hotspots
    this.renderSvgBlueprint(data);

    // Synchronize 3D tower floor highlight
    if (window.lumina3D) {
      window.lumina3D.highlightFloorTier(unitKey);
    }
  }

  renderSvgBlueprint(data) {
    if (!this.blueprintSvg) return;

    let hotspotsMarkup = '';
    data.hotspots.forEach(spot => {
      hotspotsMarkup += `
        <g class="blueprint-hotspot" data-title="${spot.title}" data-desc="${spot.desc}" transform="translate(${spot.x}, ${spot.y})">
          <circle class="ping" r="14" fill="none" stroke="#00f2fe" stroke-width="1.5" opacity="0.7" />
          <circle class="core" r="5" fill="#d4af37" />
        </g>
      `;
    });

    this.blueprintSvg.innerHTML = `
      <g>
        ${data.svgWalls}
        ${hotspotsMarkup}
      </g>
    `;

    // Reattach hotspot hover listeners
    const hotspots = this.blueprintSvg.querySelectorAll('.blueprint-hotspot');
    hotspots.forEach(spot => {
      spot.addEventListener('mouseenter', (e) => {
        const title = spot.getAttribute('data-title');
        const desc = spot.getAttribute('data-desc');
        this.showTooltip(title, desc);
        if (window.luminaAudio) window.luminaAudio.playHover();
      });

      spot.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(title, desc) {
    if (!this.tooltipEl) return;
    this.tooltipEl.innerHTML = `<strong>${title}</strong>: ${desc}`;
    this.tooltipEl.classList.add('show');
  }

  hideTooltip() {
    if (!this.tooltipEl) return;
    this.tooltipEl.classList.remove('show');
  }
}

window.FloorplanConfigurator = FloorplanConfigurator;
