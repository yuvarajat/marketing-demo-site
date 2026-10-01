/* ==========================================================================
   LUMINA RESIDENCES - 3D ARCHITECTURAL WEBGL SCENE (Three.js)
   Procedural Luxury Skyscraper with Scroll Triggers & Lighting Modes
   ========================================================================== */

class LuminaArchitecturalScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.currentTheme = 'midnight';
    this.scrollProgress = 0;
    this.targetRotationY = 0;
    this.targetRotationX = 0;
    this.currentRotationY = 0;
    this.currentRotationX = 0;

    // Mouse tracking with smooth damping
    this.mouseX = 0;
    this.mouseY = 0;

    this.initScene();
    this.buildArchitecturalTower();
    this.createAmbientParticleField();
    this.setupLighting();
    this.setupEventListeners();
    this.animate();
  }

  initScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070c, 0.015);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 15, 48);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // Clock
    this.clock = new THREE.Clock();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    // Key gold luxury light
    this.goldSpot = new THREE.PointLight(0xd4af37, 4, 80);
    this.goldSpot.position.set(20, 30, 25);
    this.scene.add(this.goldSpot);

    // Cyan cyber accent light
    this.cyanSpot = new THREE.PointLight(0x00f2fe, 3.5, 70);
    this.cyanSpot.position.set(-25, -10, 20);
    this.scene.add(this.cyanSpot);

    // Rim lighting from behind
    this.rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.rimLight.position.set(0, 40, -30);
    this.scene.add(this.rimLight);
  }

  buildArchitecturalTower() {
    this.towerGroup = new THREE.Group();
    this.scene.add(this.towerGroup);

    // Materials
    this.materials = {
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x111e38,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.85,
        transparent: true,
        opacity: 0.45,
        reflectivity: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      }),
      wireframe: new THREE.LineBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.75,
        linewidth: 1
      }),
      cyanGlowLine: new THREE.LineBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.85
      }),
      coreIlluminated: new THREE.MeshStandardMaterial({
        color: 0x0a1428,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.45,
        roughness: 0.2
      }),
      pedestal: new THREE.MeshStandardMaterial({
        color: 0x080b12,
        roughness: 0.8,
        metalness: 0.2
      })
    };

    // Central Elevator Core (Internal Pillar)
    const coreGeo = new THREE.BoxGeometry(3, 46, 3);
    const coreMesh = new THREE.Mesh(coreGeo, this.materials.coreIlluminated);
    coreMesh.position.y = 12;
    this.towerGroup.add(coreMesh);

    // Multi-tier Floor Plates (48 Floors)
    this.floorPlates = [];
    const totalFloors = 44;
    const baseWidth = 14;
    const baseDepth = 14;

    for (let i = 0; i < totalFloors; i++) {
      const heightPercent = i / totalFloors;
      // Elegant architectural taper and twist
      const scaleX = Math.max(0.35, 1 - Math.pow(heightPercent, 1.5) * 0.65);
      const scaleZ = Math.max(0.35, 1 - Math.pow(heightPercent, 1.5) * 0.65);
      const y = (i * 0.95) - 8;

      const floorGeo = new THREE.BoxGeometry(baseWidth * scaleX, 0.18, baseDepth * scaleZ);
      const floorMesh = new THREE.Mesh(floorGeo, this.materials.glass);
      floorMesh.position.y = y;

      // Slight spiral twist up the building
      floorMesh.rotation.y = heightPercent * Math.PI * 0.25;

      // Add wireframe edge border
      const edges = new THREE.EdgesGeometry(floorGeo);
      const edgeLine = new THREE.LineSegments(
        edges, 
        i >= 38 ? this.materials.cyanGlowLine : this.materials.wireframe
      );
      floorMesh.add(edgeLine);

      // Cantilevered Sky Balconies on selected luxury floors
      if (i === 18 || i === 28 || i === 38) {
        const balconyGeo = new THREE.BoxGeometry(
          (baseWidth * scaleX) + 3, 
          0.12, 
          (baseDepth * scaleZ) + 3
        );
        const balconyMesh = new THREE.Mesh(balconyGeo, this.materials.glass);
        const balconyEdges = new THREE.LineSegments(new THREE.EdgesGeometry(balconyGeo), this.materials.cyanGlowLine);
        balconyMesh.add(balconyEdges);
        floorMesh.add(balconyMesh);
      }

      this.towerGroup.add(floorMesh);
      this.floorPlates.push(floorMesh);
    }

    // Apex Penthouse Spire & Beacon
    const spireGeo = new THREE.ConeGeometry(0.8, 12, 4);
    const spireMesh = new THREE.Mesh(spireGeo, this.materials.glass);
    spireMesh.position.y = 39;
    const spireEdges = new THREE.LineSegments(new THREE.EdgesGeometry(spireGeo), this.materials.wireframe);
    spireMesh.add(spireEdges);
    this.towerGroup.add(spireMesh);

    // Helipad Ring at Top Tier
    const helipadGeo = new THREE.RingGeometry(2.5, 3.2, 32);
    const helipadMesh = new THREE.Mesh(helipadGeo, new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    }));
    helipadMesh.rotation.x = Math.PI / 2;
    helipadMesh.position.y = 33.5;
    this.towerGroup.add(helipadMesh);

    // Base Podium Reflection Grid
    const baseGridGeo = new THREE.PlaneGeometry(60, 60, 30, 30);
    const baseGridWire = new THREE.WireframeGeometry(baseGridGeo);
    const baseGridLine = new THREE.LineSegments(baseGridWire, new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.12
    }));
    baseGridLine.rotation.x = Math.PI / 2;
    baseGridLine.position.y = -8.5;
    this.towerGroup.add(baseGridLine);
  }

  createAmbientParticleField() {
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color(0xd4af37);
    const cyanColor = new THREE.Color(0x00f2fe);

    for (let i = 0; i < particleCount; i++) {
      // Cylinder distribution around the tower
      const radius = 8 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() * 55) - 10;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      const chosenColor = Math.random() > 0.4 ? goldColor : cyanColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, particleMaterial);
    this.scene.add(this.particles);
  }

  setupEventListeners() {
    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.onWindowResize();
    });

    // Page Scroll tracking
    window.addEventListener('scroll', () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
    });
  }

  onWindowResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // API Methods for UI Controls
  setTheme(theme) {
    this.currentTheme = theme;
    if (theme === 'golden-hour') {
      this.goldSpot.color.setHex(0xffaa00);
      this.goldSpot.intensity = 5.5;
      this.cyanSpot.color.setHex(0xffdd66);
      this.cyanSpot.intensity = 3.0;
      this.scene.fog.color.setHex(0x120e09);
    } else {
      // Midnight Obsidian
      this.goldSpot.color.setHex(0xd4af37);
      this.goldSpot.intensity = 4.0;
      this.cyanSpot.color.setHex(0x00f2fe);
      this.cyanSpot.intensity = 3.5;
      this.scene.fog.color.setHex(0x05070c);
    }
  }

  setCameraAngle(angleType) {
    if (angleType === 'penthouse') {
      // High bird's eye view
      this.targetCamY = 32;
      this.targetCamZ = 28;
    } else if (angleType === 'low-angle') {
      // Soaring dramatic perspective
      this.targetCamY = 2;
      this.targetCamZ = 40;
    } else {
      // Balanced default elevation
      this.targetCamY = 15;
      this.targetCamZ = 48;
    }
  }

  highlightFloorTier(tier) {
    // Highlights floors corresponding to selected unit
    let startIndex = 0;
    let endIndex = 15;

    if (tier === 'penthouse') {
      startIndex = 36;
      endIndex = 44;
    } else if (tier === 'sky-villa') {
      startIndex = 26;
      endIndex = 35;
    } else if (tier === 'duplex') {
      startIndex = 14;
      endIndex = 25;
    } else {
      startIndex = 2;
      endIndex = 13;
    }

    this.floorPlates.forEach((mesh, index) => {
      if (index >= startIndex && index <= endIndex) {
        mesh.material.opacity = 0.9;
        mesh.children[0].material.color.setHex(0x00f2fe);
      } else {
        mesh.material.opacity = 0.35;
        mesh.children[0].material.color.setHex(0xd4af37);
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Constant subtle ambient rotation
    this.targetRotationY = elapsedTime * 0.15 + (this.mouseX * 0.65);
    this.targetRotationX = -(this.mouseY * 0.35);

    // Smooth inertia interpolation
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.05;
    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.05;

    if (this.towerGroup) {
      this.towerGroup.rotation.y = this.currentRotationY;
      this.towerGroup.rotation.x = this.currentRotationX;

      // Scroll-driven camera and building elevation
      const scrollOffset = this.scrollProgress * 22;
      this.towerGroup.position.y = (Math.sin(elapsedTime * 0.8) * 0.4) - (scrollOffset * 0.5);
    }

    // Gently rotate particle field in reverse
    if (this.particles) {
      this.particles.rotation.y = -elapsedTime * 0.05;
      this.particles.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;
    }

    // Dynamic pulsating lights
    if (this.goldSpot) {
      this.goldSpot.position.x = Math.cos(elapsedTime * 0.6) * 25;
      this.goldSpot.position.z = Math.sin(elapsedTime * 0.6) * 25;
    }
    if (this.cyanSpot) {
      this.cyanSpot.position.x = -Math.cos(elapsedTime * 0.4) * 28;
      this.cyanSpot.position.z = -Math.sin(elapsedTime * 0.4) * 28;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Attach to window for global access
window.LuminaArchitecturalScene = LuminaArchitecturalScene;
