/* ==========================================================================
   VILLA ATELIER - TRUE 3D ARCHITECTURAL WALKTHROUGH ENGINE (Three.js)
   Full 3D Modeled Estate: Approach -> Bridge -> Foyer -> Living -> Pool -> Master Suite
   Camera travels along continuous 3D Catmull-Rom spline with mouse parallax look-around
   ========================================================================== */

class TrueVilla3DEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.currentTheme = 'midnight';

    // Mouse look-around offset
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetLookOffsetX = 0;
    this.targetLookOffsetY = 0;
    this.currentLookOffsetX = 0;
    this.currentLookOffsetY = 0;

    // Spline Waypoint Definitions (Zones)
    this.waypoints = [
      { t: 0.00, zone: '01 / APPROACH', name: 'The Entry Approach', specs: '14,500 SQ. FT. • CONCRETE & GLASS RESIDENCE', desc: 'Approaching the monolithic concrete estate over reflection waters.' },
      { t: 0.20, zone: '02 / THRESHOLD', name: 'The Pivot Entryway', specs: '12-FT BRONZE PIVOT DOOR • STONE BRIDGE', desc: 'Stepping across the stone bridge directly toward the glowing bronze pivot door.' },
      { t: 0.40, zone: '03 / FOYER', name: 'The Grand Foyer & Staircase', specs: 'SCULPTURAL STAIR • TRAVERTINE FLOOR', desc: 'Inside the double-height foyer, bronze staircase sweeping overhead into the salon.' },
      { t: 0.60, zone: '04 / GREAT SALON', name: 'The Great Living Salon', specs: '24-FT CEILINGS • FLOATING LINEAR FIREPLACE', desc: 'The double-height living room with Italian travertine and glowing hearth.' },
      { t: 0.80, zone: '05 / POOL TERRACE', name: 'The Horizon Infinity Pool', specs: '65-FT ZERO-EDGE POOL • SUNKEN FIRE BOWL', desc: 'Gliding out onto the cantilevered infinity terrace overlooking the sunset horizon.' },
      { t: 1.00, zone: '06 / MASTER SUITE', name: 'The Master Sky Sanctuary', specs: '1,400 SQ. FT. AERIE • 270° CORNER GLASS', desc: 'Ascending to the cantilevered upper master suite with panoramic horizon vistas.' }
    ];

    this.initThree();
    this.build3DHouseModel();
    this.setupCameraSplines();
    this.setupLighting();
    this.setupEventListeners();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x04060b, 0.012);

    this.camera = new THREE.PerspectiveCamera(52, this.width / this.height, 0.1, 800);
    this.camera.position.set(0, 3, 38);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    this.clock = new THREE.Clock();
  }

  setupLighting() {
    // Ambient Light
    this.ambientLight = new THREE.AmbientLight(0x0e172a, 1.2);
    this.scene.add(this.ambientLight);

    // Directional Twilight / Sun Light
    this.sunLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    this.sunLight.position.set(40, 50, 30);
    this.scene.add(this.sunLight);

    // Interior Warm Core Lights
    this.foyerLight = new THREE.PointLight(0xffbe6b, 3.5, 30);
    this.foyerLight.position.set(0, 4.5, 4);
    this.scene.add(this.foyerLight);

    this.salonLight = new THREE.PointLight(0xffbe6b, 4.0, 35);
    this.salonLight.position.set(0, 5.0, -10);
    this.scene.add(this.salonLight);

    // Fireplace Flickering Point Light
    this.fireLight = new THREE.PointLight(0xff7700, 3.0, 15);
    this.fireLight.position.set(-6.5, 1.8, -10);
    this.scene.add(this.fireLight);

    // Pool Blue Reflection Light
    this.poolLight = new THREE.PointLight(0x00f2fe, 3.5, 35);
    this.poolLight.position.set(5, 0.5, -28);
    this.scene.add(this.poolLight);

    // Upper Master Suite Warm Light
    this.suiteLight = new THREE.PointLight(0xffd599, 3.2, 28);
    this.suiteLight.position.set(-3, 8.5, -12);
    this.scene.add(this.suiteLight);
  }

  build3DHouseModel() {
    this.houseGroup = new THREE.Group();
    this.scene.add(this.houseGroup);

    // Shared Architectural Materials
    this.matConcrete = new THREE.MeshStandardMaterial({
      color: 0x222733,
      roughness: 0.85,
      metalness: 0.1
    });

    this.matTravertine = new THREE.MeshStandardMaterial({
      color: 0xc4b7a6,
      roughness: 0.35,
      metalness: 0.15
    });

    this.matDarkBronze = new THREE.MeshStandardMaterial({
      color: 0x1a1510,
      metalness: 0.85,
      roughness: 0.25
    });

    this.matGoldTrim = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });

    this.matGlass = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.92,
      transparent: true,
      opacity: 0.45,
      reflectivity: 0.9,
      clearcoat: 1.0
    });

    this.matWater = new THREE.MeshPhysicalMaterial({
      color: 0x0077b6,
      emissive: 0x003566,
      emissiveIntensity: 0.3,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.75,
      transparent: true,
      opacity: 0.8
    });

    this.matDarkWood = new THREE.MeshStandardMaterial({
      color: 0x2c1d11,
      roughness: 0.6
    });

    this.matFire = new THREE.MeshBasicMaterial({
      color: 0xffaa00
    });

    // 1. TERRAIN & GROUND PLANE
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMesh = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: 0x070a10, roughness: 0.95 }));
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.05;
    this.houseGroup.add(groundMesh);

    // 2. ENTRY DRIVEWAY & STONE BRIDGE OVER REFLECTION POOL
    // Front Reflection Pool
    const frontPoolGeo = new THREE.BoxGeometry(28, 0.4, 18);
    const frontPoolMesh = new THREE.Mesh(frontPoolGeo, this.matWater);
    frontPoolMesh.position.set(0, 0.1, 24);
    this.houseGroup.add(frontPoolMesh);

    // Stone Walkway Bridge crossing pool into house
    const bridgeGeo = new THREE.BoxGeometry(4.5, 0.45, 20);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, this.matTravertine);
    bridgeMesh.position.set(0, 0.22, 24);
    this.houseGroup.add(bridgeMesh);

    // Reflection Pool Coping Border
    const poolBorder = new THREE.LineSegments(new THREE.EdgesGeometry(frontPoolGeo), new THREE.LineBasicMaterial({ color: 0xd4af37, opacity: 0.4, transparent: true }));
    frontPoolMesh.add(poolBorder);

    // 3. ENTRANCE FACADE & PIVOT DOOR FRAME
    // Main Entrance Portal Frame
    const portalFrameGeo = new THREE.BoxGeometry(8, 7.5, 0.8);
    const portalFrameMesh = new THREE.Mesh(portalFrameGeo, this.matDarkBronze);
    portalFrameMesh.position.set(0, 3.75, 14);
    this.houseGroup.add(portalFrameMesh);

    // Massive 12-ft Bronze Pivot Door (Slightly ajar at 35 degrees inviting the camera in!)
    this.pivotDoor = new THREE.Group();
    const doorLeafGeo = new THREE.BoxGeometry(3.6, 7.0, 0.2);
    const doorLeafMesh = new THREE.Mesh(doorLeafGeo, this.matDarkBronze);
    doorLeafMesh.position.set(1.8, 3.5, 0);

    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.5), this.matGoldTrim);
    doorHandle.position.set(3.2, 3.5, 0.18);
    this.pivotDoor.add(doorLeafMesh);
    this.pivotDoor.add(doorHandle);

    this.pivotDoor.position.set(-1.8, 0, 14);
    this.pivotDoor.rotation.y = Math.PI * 0.22; // Open 40 degrees
    this.houseGroup.add(this.pivotDoor);

    // 4. MAIN HOUSE MASSING (Board-Formed Concrete Walls & Foundation)
    // Ground Floor Travertine Slab (Foyer + Living Room + Kitchen)
    const floorSlabGeo = new THREE.BoxGeometry(32, 0.4, 40);
    const floorSlabMesh = new THREE.Mesh(floorSlabGeo, this.matTravertine);
    floorSlabMesh.position.set(0, 0.2, -4);
    this.houseGroup.add(floorSlabMesh);

    // Left Concrete Feature Wall (with fireplace inset)
    const leftWallGeo = new THREE.BoxGeometry(0.8, 9, 38);
    const leftWallMesh = new THREE.Mesh(leftWallGeo, this.matConcrete);
    leftWallMesh.position.set(-15, 4.5, -4);
    this.houseGroup.add(leftWallMesh);

    // Ceiling / Upper Floor Slab
    const ceilingGeo = new THREE.BoxGeometry(32, 0.5, 38);
    const ceilingMesh = new THREE.Mesh(ceilingGeo, this.matConcrete);
    ceilingMesh.position.set(0, 9.25, -4);
    this.houseGroup.add(ceilingMesh);

    // 5. GRAND FOYER (Double-Height Void & Bronze Curved Staircase)
    const stairGroup = new THREE.Group();
    const stepsCount = 18;
    for (let s = 0; s < stepsCount; s++) {
      const stepAngle = (s / stepsCount) * Math.PI * 0.85;
      const stepRadius = 3.6;
      const stepGeo = new THREE.BoxGeometry(1.6, 0.2, 0.55);
      const stepMesh = new THREE.Mesh(stepGeo, this.matDarkBronze);
      stepMesh.position.set(
        Math.cos(stepAngle) * stepRadius - 6,
        s * 0.42 + 0.4,
        Math.sin(stepAngle) * stepRadius + 4
      );
      stepMesh.rotation.y = -stepAngle;

      // Small gold edge LED strip
      const ledEdge = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.06), new THREE.MeshBasicMaterial({ color: 0xffdd88 }));
      ledEdge.position.set(0, 0.1, 0.26);
      stepMesh.add(ledEdge);

      stairGroup.add(stepMesh);
    }
    this.houseGroup.add(stairGroup);

    // 6. GREAT LIVING SALON (Furniture, Sofa, Fireplace, Coffee Table)
    // Low Minimalist Modular L-Sofa
    const sofaMainGeo = new THREE.BoxGeometry(7.5, 1.0, 3.2);
    const sofaMainMesh = new THREE.Mesh(sofaMainGeo, new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 }));
    sofaMainMesh.position.set(1.5, 0.7, -9);
    this.houseGroup.add(sofaMainMesh);

    const sofaLGeo = new THREE.BoxGeometry(3.0, 1.0, 4.5);
    const sofaLMesh = new THREE.Mesh(sofaLGeo, new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 }));
    sofaLMesh.position.set(3.75, 0.7, -5.5);
    this.houseGroup.add(sofaLMesh);

    // Marble Low Table
    const tableGeo = new THREE.BoxGeometry(4.0, 0.45, 2.5);
    const tableMesh = new THREE.Mesh(tableGeo, this.matTravertine);
    tableMesh.position.set(1.0, 0.45, -9);
    this.houseGroup.add(tableMesh);

    // 8-ft Floating Linear Fireplace in concrete wall
    const hearthNicheGeo = new THREE.BoxGeometry(0.6, 1.2, 7.0);
    const hearthNicheMesh = new THREE.Mesh(hearthNicheGeo, new THREE.MeshBasicMaterial({ color: 0x05070c }));
    hearthNicheMesh.position.set(-14.4, 2.0, -10);
    this.houseGroup.add(hearthNicheMesh);

    // Glowing Flame Core inside Hearth
    const flameGeo = new THREE.BoxGeometry(0.2, 0.35, 6.2);
    this.flameMesh = new THREE.Mesh(flameGeo, this.matFire);
    this.flameMesh.position.set(-14.3, 1.7, -10);
    this.houseGroup.add(this.flameMesh);

    // Floor-to-Ceiling Motorized Glass Sliding Wall to Terrace
    const glassWallGeo = new THREE.BoxGeometry(26, 8.5, 0.15);
    const glassWallMesh = new THREE.Mesh(glassWallGeo, this.matGlass);
    glassWallMesh.position.set(0, 4.5, -22);
    this.houseGroup.add(glassWallMesh);

    // 7. CANTILEVERED INFINITY POOL DECK (Rear Terrace)
    // Outdoor Stone Deck
    const terraceGeo = new THREE.BoxGeometry(32, 0.4, 22);
    const terraceMesh = new THREE.Mesh(terraceGeo, this.matTravertine);
    terraceMesh.position.set(0, 0.18, -32);
    this.houseGroup.add(terraceMesh);

    // 65-ft Cantilevered Infinity Pool Basin
    const poolGeo = new THREE.BoxGeometry(16, 1.8, 22);
    const poolMesh = new THREE.Mesh(poolGeo, this.matWater);
    poolMesh.position.set(5, -0.6, -34);
    this.houseGroup.add(poolMesh);

    // Floating Volcanic Fire Bowl on Pool
    const bowlGeo = new THREE.CylinderGeometry(1.2, 0.6, 0.6, 24);
    const bowlMesh = new THREE.Mesh(bowlGeo, this.matDarkBronze);
    bowlMesh.position.set(5, 0.4, -34);

    const bowlFire = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.9, 16), this.matFire);
    bowlFire.position.set(0, 0.55, 0);
    bowlMesh.add(bowlFire);
    this.houseGroup.add(bowlMesh);

    // Sunken Outdoor Lounge Conversation Pit
    const sunkenBenchGeo = new THREE.BoxGeometry(8, 0.6, 1.6);
    const sunkenBenchMesh = new THREE.Mesh(sunkenBenchGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }));
    sunkenBenchMesh.position.set(-8, 0.5, -30);
    this.houseGroup.add(sunkenBenchMesh);

    // 8. UPPER CANTILEVERED MASTER SKY SUITE (Level 2)
    const upperSuiteGroup = new THREE.Group();
    upperSuiteGroup.position.set(-4, 9.5, -12);

    // Upper Floor Plate extending out as cantilever
    const upperFloorGeo = new THREE.BoxGeometry(18, 0.4, 20);
    const upperFloorMesh = new THREE.Mesh(upperFloorGeo, this.matDarkWood);
    upperSuiteGroup.add(upperFloorMesh);

    // Fluted Wood Headboard Wall
    const woodWallGeo = new THREE.BoxGeometry(10, 5, 0.3);
    const woodWallMesh = new THREE.Mesh(woodWallGeo, this.matDarkWood);
    woodWallMesh.position.set(-3, 2.5, 8);
    upperSuiteGroup.add(woodWallMesh);

    // Platform King Bed
    const bedBaseGeo = new THREE.BoxGeometry(5.2, 0.8, 6.2);
    const bedBaseMesh = new THREE.Mesh(bedBaseGeo, new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 }));
    bedBaseMesh.position.set(-3, 0.4, 4.5);
    upperSuiteGroup.add(bedBaseMesh);

    // Corner Frameless Glass Walls (270 degree view)
    const cornerGlassGeo1 = new THREE.BoxGeometry(0.1, 5, 18);
    const cornerGlass1 = new THREE.Mesh(cornerGlassGeo1, this.matGlass);
    cornerGlass1.position.set(8.8, 2.5, 0);
    upperSuiteGroup.add(cornerGlass1);

    const cornerGlassGeo2 = new THREE.BoxGeometry(18, 5, 0.1);
    const cornerGlass2 = new THREE.Mesh(cornerGlassGeo2, this.matGlass);
    cornerGlass2.position.set(0, 2.5, -9.8);
    upperSuiteGroup.add(cornerGlass2);

    this.houseGroup.add(upperSuiteGroup);

    // 9. AMBIENT PARTICLES (Stardust / Twilight Embers)
    const pCount = 350;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 60;
      pPos[i * 3 + 1] = Math.random() * 24;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    this.ambientParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xffd599,
      size: 0.22,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    }));
    this.scene.add(this.ambientParticles);
  }

  setupCameraSplines() {
    // Continuous 3D Walkthrough Trajectory Points through the actual house
    // 0: Approach -> 1: Bridge Threshold -> 2: Foyer -> 3: Salon -> 4: Pool Deck -> 5: Master Suite
    const cameraPoints = [
      new THREE.Vector3(0, 3.2, 38),     // 0. Approach Driveway
      new THREE.Vector3(0, 2.6, 22),     // 1. Stone Water Bridge
      new THREE.Vector3(0, 2.8, 12),     // 2. Through Pivot Door into Foyer
      new THREE.Vector3(-1.5, 2.8, -4),  // 3. Center of Great Living Salon
      new THREE.Vector3(2.5, 2.2, -24),  // 4. Cantilevered Infinity Pool Deck
      new THREE.Vector3(-4.5, 11.8, -8)  // 5. Upper Master Sky Sanctuary
    ];

    const lookTargetPoints = [
      new THREE.Vector3(0, 3.5, 14),     // Look at front entrance door
      new THREE.Vector3(0, 3.5, 10),     // Look straight through bronze door
      new THREE.Vector3(-2, 3.5, -4),    // Look forward into the great salon
      new THREE.Vector3(2, 2.8, -24),    // Look through glass to pool & sunset
      new THREE.Vector3(5, 1.2, -36),    // Look at fire bowl and horizon
      new THREE.Vector3(6, 9.5, -28)     // Look through master corner glass to sea
    ];

    this.cameraSpline = new THREE.CatmullRomCurve3(cameraPoints, false, 'catmullrom', 0.15);
    this.lookSpline = new THREE.CatmullRomCurve3(lookTargetPoints, false, 'catmullrom', 0.15);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    // Mouse look-around offset
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      this.targetLookOffsetX = this.mouseX * 3.5;
      this.targetLookOffsetY = -this.mouseY * 2.2;
    });

    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Bind Floorplan Map Interactive Node Clicks
    this.setupMapNodeClicks();
  }

  setupMapNodeClicks() {
    const mapNodes = document.querySelectorAll('.map-node');
    mapNodes.forEach(node => {
      node.addEventListener('click', (e) => {
        const tVal = parseFloat(node.getAttribute('data-t'));
        if (!isNaN(tVal)) {
          this.jumpToT(tVal);
          if (window.luminaAudio) window.luminaAudio.playClick();
        }
      });
    });
  }

  jumpToT(t) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: t * totalHeight,
      behavior: 'smooth'
    });
  }

  handleScroll() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    const scrollY = window.scrollY;
    this.scrollProgress = Math.max(0, Math.min(1, scrollY / totalHeight));

    // Update Minimal Room Indicator & Map Node Active States
    this.updateHUD(this.scrollProgress);
  }

  updateHUD(t) {
    // Find closest waypoint
    let activeWp = this.waypoints[0];
    let minDiff = 999;
    this.waypoints.forEach(wp => {
      const diff = Math.abs(wp.t - t);
      if (diff < minDiff) {
        minDiff = diff;
        activeWp = wp;
      }
    });

    const zoneEl = document.querySelector('.indicator-zone');
    const titleEl = document.querySelector('.indicator-title');
    const specsEl = document.querySelector('.indicator-specs');

    if (zoneEl) zoneEl.textContent = activeWp.zone;
    if (titleEl) titleEl.textContent = activeWp.name;
    if (specsEl) specsEl.textContent = activeWp.specs;

    // Update Map Nodes
    const mapNodes = document.querySelectorAll('.map-node');
    mapNodes.forEach(node => {
      const nodeT = parseFloat(node.getAttribute('data-t'));
      if (Math.abs(nodeT - activeWp.t) < 0.1) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Update Map Drone Traveler Pin along SVG path
    const mapPin = document.getElementById('map-traveler-pin');
    if (mapPin) {
      // Map x: 25 -> 220, y: 105 -> 18
      const pinX = 30 + (t * 185);
      const pinY = 100 - (t * 80) + Math.sin(t * Math.PI) * 12;
      mapPin.setAttribute('transform', `translate(${pinX}, ${pinY})`);
    }

    const activePath = document.getElementById('map-active-path');
    if (activePath) {
      activePath.style.strokeDashoffset = `${250 - (t * 250)}`;
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    if (theme === 'golden-hour') {
      this.scene.fog.color.setHex(0x181008);
      this.sunLight.color.setHex(0xffaa44);
      this.sunLight.intensity = 2.2;
      this.foyerLight.color.setHex(0xffaa22);
      this.poolLight.color.setHex(0x22d3ee);
    } else {
      this.scene.fog.color.setHex(0x04060b);
      this.sunLight.color.setHex(0x38bdf8);
      this.sunLight.intensity = 1.4;
      this.foyerLight.color.setHex(0xffbe6b);
      this.poolLight.color.setHex(0x00f2fe);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Smooth inertia interpolation for mouse parallax
    this.currentLookOffsetX += (this.targetLookOffsetX - this.currentLookOffsetX) * 0.08;
    this.currentLookOffsetY += (this.targetLookOffsetY - this.currentLookOffsetY) * 0.08;

    // Smooth scroll position interpolation (prevents jitter)
    this.targetScrollProgress += (this.scrollProgress - this.targetScrollProgress) * 0.08;
    const clampedT = Math.max(0.001, Math.min(0.999, this.targetScrollProgress));

    // Sample 3D Camera Position & Look Target along Catmull-Rom Splines
    if (this.cameraSpline && this.lookSpline) {
      const camPos = this.cameraSpline.getPointAt(clampedT);
      const lookPos = this.lookSpline.getPointAt(clampedT);

      this.camera.position.copy(camPos);

      // Add mouse look-around offset to camera target
      const adjustedLook = new THREE.Vector3(
        lookPos.x + this.currentLookOffsetX,
        lookPos.y + this.currentLookOffsetY,
        lookPos.z
      );
      this.camera.lookAt(adjustedLook);
    }

    // Dynamic fire flicker
    if (this.fireLight) {
      this.fireLight.intensity = 2.8 + Math.sin(elapsed * 12) * 0.6 + Math.cos(elapsed * 23) * 0.4;
    }
    if (this.flameMesh) {
      this.flameMesh.scale.y = 1.0 + Math.sin(elapsed * 15) * 0.15;
    }

    // Shimmering Pool Water
    if (this.poolLight) {
      this.poolLight.position.x = 5 + Math.sin(elapsed * 2.0) * 1.5;
    }

    // Gently rotate ambient particles
    if (this.ambientParticles) {
      this.ambientParticles.rotation.y = elapsed * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.TrueVilla3DEngine = TrueVilla3DEngine;
