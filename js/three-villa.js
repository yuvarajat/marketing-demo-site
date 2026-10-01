/* ==========================================================================
   VILLA ATELIER — PREMIUM PHOTOREALISTIC 3D ARCHITECTURAL WALKTHROUGH
   Three.js r128 | PBR Materials | Procedural Textures | Bloom Post-Processing
   Cinematic Camera Spline | Shadow-Casting | Environment Reflections
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

    // Mouse look-around
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetLookOffsetX = 0;
    this.targetLookOffsetY = 0;
    this.currentLookOffsetX = 0;
    this.currentLookOffsetY = 0;

    // Waypoints (matching scrollytelling sections)
    this.waypoints = [
      { t: 0.00, zone: '01 / APPROACH', name: 'The Entry Approach', specs: '14,500 SQ. FT. • CONCRETE & GLASS RESIDENCE' },
      { t: 0.20, zone: '02 / THRESHOLD', name: 'The Pivot Entryway', specs: '12-FT BRONZE PIVOT DOOR • STONE BRIDGE' },
      { t: 0.40, zone: '03 / FOYER', name: 'The Grand Foyer & Staircase', specs: 'SCULPTURAL STAIR • TRAVERTINE FLOOR' },
      { t: 0.60, zone: '04 / GREAT SALON', name: 'The Great Living Salon', specs: '24-FT CEILINGS • FLOATING LINEAR FIREPLACE' },
      { t: 0.80, zone: '05 / POOL TERRACE', name: 'The Horizon Infinity Pool', specs: '65-FT ZERO-EDGE POOL • SUNKEN FIRE BOWL' },
      { t: 1.00, zone: '06 / MASTER SUITE', name: 'The Master Sky Sanctuary', specs: '1,400 SQ. FT. AERIE • 270° CORNER GLASS' }
    ];

    this.initRenderer();
    this.createProceduralTextures();
    this.createMaterials();
    this.createEnvironment();
    this.buildVilla();
    this.setupCameraSplines();
    this.setupLighting();
    this.setupEventListeners();
    this.animate();
  }

  /* ── Renderer with Tone Mapping & Shadows ── */
  initRenderer() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1200);
    this.camera.position.set(0, 3.2, 42);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.clock = new THREE.Clock();
  }

  /* ── Procedural Canvas Textures (Photorealistic PBR) ── */
  createProceduralTextures() {
    // Honed Travertine Marble
    this.texMarble = this._canvasTexture(512, 512, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#d4c5ab');
      grad.addColorStop(0.3, '#c9b89a');
      grad.addColorStop(0.6, '#ddd0bc');
      grad.addColorStop(1, '#bfae96');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Veining
      ctx.strokeStyle = 'rgba(160, 140, 110, 0.2)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        let x = Math.random() * w, y = Math.random() * h;
        ctx.moveTo(x, y);
        for (let s = 0; s < 6; s++) {
          x += (Math.random() - 0.5) * 80;
          y += (Math.random() - 0.5) * 40;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // Fine grain noise
      for (let i = 0; i < 8000; i++) {
        const px = Math.random() * w, py = Math.random() * h;
        const brightness = 150 + Math.random() * 60;
        ctx.fillStyle = `rgba(${brightness}, ${brightness - 15}, ${brightness - 30}, 0.08)`;
        ctx.fillRect(px, py, 2, 2);
      }
    });

    // Dark Walnut Wood Grain
    this.texWood = this._canvasTexture(512, 512, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2a1a0e');
      grad.addColorStop(0.5, '#3b2314');
      grad.addColorStop(1, '#241509');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Wood grain lines
      for (let i = 0; i < 80; i++) {
        const y = (i / 80) * h + (Math.random() - 0.5) * 8;
        ctx.strokeStyle = `rgba(60, 35, 15, ${0.15 + Math.random() * 0.2})`;
        ctx.lineWidth = 0.8 + Math.random() * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < w; x += 20) {
          ctx.lineTo(x, y + Math.sin(x * 0.03) * 3 + (Math.random() - 0.5) * 2);
        }
        ctx.stroke();
      }
      // Subtle wood knot highlights
      for (let i = 0; i < 5; i++) {
        const kx = Math.random() * w, ky = Math.random() * h;
        const kr = 8 + Math.random() * 12;
        const kgrad = ctx.createRadialGradient(kx, ky, 0, kx, ky, kr);
        kgrad.addColorStop(0, 'rgba(80, 50, 25, 0.3)');
        kgrad.addColorStop(1, 'rgba(80, 50, 25, 0)');
        ctx.fillStyle = kgrad;
        ctx.fillRect(kx - kr, ky - kr, kr * 2, kr * 2);
      }
    });

    // Board-Formed Concrete
    this.texConcrete = this._canvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#1e2533';
      ctx.fillRect(0, 0, w, h);
      // Board form lines
      for (let i = 0; i < 30; i++) {
        const y = (i / 30) * h;
        ctx.strokeStyle = `rgba(40, 50, 65, ${0.4 + Math.random() * 0.3})`;
        ctx.lineWidth = 1 + Math.random();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + (Math.random() - 0.5) * 3);
        ctx.stroke();
      }
      // Rough granular noise
      for (let i = 0; i < 12000; i++) {
        const px = Math.random() * w, py = Math.random() * h;
        const v = 25 + Math.random() * 40;
        ctx.fillStyle = `rgba(${v}, ${v + 5}, ${v + 12}, 0.06)`;
        ctx.fillRect(px, py, 1.5, 1.5);
      }
    });

    // Concrete Normal Map approximation
    this.texConcreteNormal = this._canvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#8080ff';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 4000; i++) {
        const px = Math.random() * w, py = Math.random() * h;
        const r = 128 + (Math.random() - 0.5) * 30;
        const g = 128 + (Math.random() - 0.5) * 30;
        ctx.fillStyle = `rgb(${r|0}, ${g|0}, 255)`;
        ctx.fillRect(px, py, 2, 2);
      }
    });

    // Dark Granite (for pool basins)
    this.texGranite = this._canvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 6000; i++) {
        const px = Math.random() * w, py = Math.random() * h;
        const v = Math.random() * 25;
        ctx.fillStyle = `rgba(${v + 10}, ${v + 15}, ${v + 25}, 0.15)`;
        ctx.fillRect(px, py, 1.5 + Math.random(), 1.5 + Math.random());
      }
    });

    // Fabric/Leather Texture (for sofa)
    this.texFabric = this._canvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(0, 0, w, h);
      // Weave pattern
      for (let y = 0; y < h; y += 3) {
        for (let x = 0; x < w; x += 3) {
          const v = ((x + y) % 6 === 0) ? 55 : 45;
          ctx.fillStyle = `rgba(${v}, ${v + 5}, ${v + 15}, 0.15)`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
    });
  }

  _canvasTexture(w, h, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, w, h);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  /* ── PBR Material Library ── */
  createMaterials() {
    // Honed Travertine Floor
    this.texMarble.repeat.set(6, 6);
    this.matTravertine = new THREE.MeshStandardMaterial({
      map: this.texMarble,
      roughness: 0.28,
      metalness: 0.08,
      envMapIntensity: 1.2
    });

    // Polished Travertine (higher reflection for feature walls)
    this.matTravertinePolished = new THREE.MeshStandardMaterial({
      map: this.texMarble,
      roughness: 0.12,
      metalness: 0.15,
      envMapIntensity: 1.6
    });

    // Board-Formed Concrete
    this.texConcrete.repeat.set(3, 3);
    this.matConcrete = new THREE.MeshStandardMaterial({
      map: this.texConcrete,
      normalMap: this.texConcreteNormal,
      normalScale: new THREE.Vector2(0.4, 0.4),
      roughness: 0.82,
      metalness: 0.05,
      envMapIntensity: 0.6
    });

    // Dark Bronze (door, stair rails, hardware)
    this.matDarkBronze = new THREE.MeshStandardMaterial({
      color: 0x1a1510,
      metalness: 0.92,
      roughness: 0.18,
      envMapIntensity: 2.0
    });

    // Brushed Gold Accent
    this.matGold = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
      envMapIntensity: 2.5
    });

    // Architectural Glass with Reflections
    this.matGlass = new THREE.MeshPhysicalMaterial({
      color: 0x88ccee,
      metalness: 0.0,
      roughness: 0.02,
      transmission: 0.94,
      transparent: true,
      opacity: 0.3,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 3.0
    });

    // Deep Water (Pool Basin)
    this.matWater = new THREE.MeshPhysicalMaterial({
      color: 0x0a3d5c,
      emissive: 0x001a33,
      emissiveIntensity: 0.15,
      metalness: 0.02,
      roughness: 0.04,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
      envMapIntensity: 2.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01
    });

    // Shallow Water / Reflection Pool
    this.matReflectionWater = new THREE.MeshPhysicalMaterial({
      color: 0x061825,
      emissive: 0x001122,
      emissiveIntensity: 0.1,
      metalness: 0.05,
      roughness: 0.02,
      transmission: 0.4,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      envMapIntensity: 3.0
    });

    // Dark Walnut Wood
    this.texWood.repeat.set(2, 2);
    this.matWood = new THREE.MeshStandardMaterial({
      map: this.texWood,
      roughness: 0.45,
      metalness: 0.05,
      envMapIntensity: 1.0
    });

    // Granite Dark
    this.texGranite.repeat.set(4, 4);
    this.matGranite = new THREE.MeshStandardMaterial({
      map: this.texGranite,
      roughness: 0.3,
      metalness: 0.1,
      envMapIntensity: 1.5
    });

    // Luxury Fabric (Sofa/Bedding)
    this.texFabric.repeat.set(8, 8);
    this.matFabric = new THREE.MeshStandardMaterial({
      map: this.texFabric,
      roughness: 0.92,
      metalness: 0.0,
      envMapIntensity: 0.3
    });

    // Warm White Emissive (LED strips, ambient glow)
    this.matLED = new THREE.MeshBasicMaterial({
      color: 0xffe8c8
    });

    // Fire Emissive
    this.matFire = new THREE.MeshBasicMaterial({
      color: 0xff8800
    });

    // Matte Black (accents, frames)
    this.matBlack = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.95,
      metalness: 0.0
    });
  }

  /* ── Sky + Ocean Horizon + Environment Cubemap ── */
  createEnvironment() {
    // Gradient Sky Sphere
    const skyGeo = new THREE.SphereGeometry(500, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x020610) },
        horizonColor: { value: new THREE.Color(0x0d1b2a) },
        sunsetColor: { value: new THREE.Color(0x1a0a14) },
        bottomColor: { value: new THREE.Color(0x030508) },
        sunGlowColor: { value: new THREE.Color(0x2a1a08) },
        sunDir: { value: new THREE.Vector3(0.5, -0.05, -1.0).normalize() }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 horizonColor;
        uniform vec3 sunsetColor;
        uniform vec3 bottomColor;
        uniform vec3 sunGlowColor;
        uniform vec3 sunDir;
        varying vec3 vWorldPos;
        void main() {
          vec3 dir = normalize(vWorldPos);
          float y = dir.y;
          // Sky gradient
          vec3 col = mix(horizonColor, topColor, smoothstep(0.0, 0.5, y));
          col = mix(bottomColor, col, smoothstep(-0.15, 0.02, y));
          // Sunset band at horizon
          float horizonBand = 1.0 - smoothstep(0.0, 0.08, abs(y));
          col = mix(col, sunsetColor, horizonBand * 0.6);
          // Sun glow
          float sunDot = max(0.0, dot(dir, sunDir));
          col += sunGlowColor * pow(sunDot, 32.0) * 2.0;
          col += sunGlowColor * pow(sunDot, 8.0) * 0.4;
          // Stars in upper sky
          float starNoise = fract(sin(dot(dir.xz * 400.0, vec2(12.9898, 78.233))) * 43758.5453);
          if (y > 0.2 && starNoise > 0.997) {
            col += vec3(0.6, 0.65, 0.8) * (starNoise - 0.997) * 300.0 * smoothstep(0.2, 0.5, y);
          }
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });
    this.skySphere = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skySphere);

    // Ocean Plane at Horizon
    const oceanGeo = new THREE.PlaneGeometry(1200, 600, 64, 32);
    const oceanMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        deepColor: { value: new THREE.Color(0x030a14) },
        surfaceColor: { value: new THREE.Color(0x0a2540) },
        reflectColor: { value: new THREE.Color(0x15304a) }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = sin(pos.x * 0.04 + time * 0.8) * 0.6 +
                       sin(pos.y * 0.06 + time * 1.2) * 0.3 +
                       sin((pos.x + pos.y) * 0.03 + time * 0.5) * 0.4;
          pos.z += wave;
          vWave = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 deepColor;
        uniform vec3 surfaceColor;
        uniform vec3 reflectColor;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          float depth = smoothstep(0.0, 1.0, vUv.y);
          vec3 col = mix(deepColor, surfaceColor, depth);
          // Wave highlight shimmer
          float highlight = smoothstep(0.3, 0.7, vWave * 0.5 + 0.5);
          col = mix(col, reflectColor, highlight * 0.25);
          // Distance fog
          float fog = smoothstep(0.0, 0.5, vUv.y);
          col = mix(col, deepColor, fog * 0.4);
          gl_FragColor = vec4(col, 0.92);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    this.oceanMesh.rotation.x = -Math.PI / 2;
    this.oceanMesh.position.set(0, -1.2, -180);
    this.scene.add(this.oceanMesh);

    // Volumetric Fog
    this.scene.fog = new THREE.FogExp2(0x04080e, 0.006);

    // Generate simple environment cubemap for reflections
    this._createEnvMap();
  }

  _createEnvMap() {
    // Create a simple cubemap from 6 gradient canvases for realistic reflections
    const size = 128;
    const faces = [];
    const colors = [
      ['#0d1b2a', '#081020'], // +x
      ['#0d1b2a', '#081020'], // -x
      ['#020610', '#0d1b2a'], // +y (sky above)
      ['#030508', '#050a12'], // -y (ground)
      ['#1a0a14', '#0d1b2a'], // +z (sunset direction)
      ['#060d18', '#0d1b2a']  // -z
    ];

    for (let i = 0; i < 6; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, size);
      grad.addColorStop(0, colors[i][0]);
      grad.addColorStop(1, colors[i][1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      faces.push(canvas);
    }

    this.envMap = new THREE.CubeTexture(faces);
    this.envMap.encoding = THREE.sRGBEncoding;
    this.envMap.needsUpdate = true;
    this.scene.environment = this.envMap;
  }

  /* ── Premium Architectural Villa Model ── */
  buildVilla() {
    this.house = new THREE.Group();
    this.scene.add(this.house);

    // ─── TERRAIN & LANDSCAPING ───
    this._buildTerrain();

    // ─── APPROACH: REFLECTION POOL & STONE BRIDGE ───
    this._buildApproach();

    // ─── ENTRANCE FACADE & PIVOT DOOR ───
    this._buildEntrance();

    // ─── MAIN HOUSE STRUCTURE ───
    this._buildMainStructure();

    // ─── GRAND FOYER & STAIRCASE ───
    this._buildFoyer();

    // ─── GREAT LIVING SALON ───
    this._buildLivingSalon();

    // ─── INFINITY POOL & TERRACE ───
    this._buildPoolTerrace();

    // ─── MASTER SKY SUITE ───
    this._buildMasterSuite();

    // ─── AMBIENT PARTICLES ───
    this._buildParticles();

    // ─── DECORATIVE ELEMENTS ───
    this._buildDecor();
  }

  _buildTerrain() {
    // Dark polished ground plane (extends far)
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x060a10,
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.house.add(ground);

    // Crushed basalt driveway (slightly lighter strip)
    const driveGeo = new THREE.PlaneGeometry(5, 30);
    const driveMat = new THREE.MeshStandardMaterial({ color: 0x0e1218, roughness: 0.95 });
    const drive = new THREE.Mesh(driveGeo, driveMat);
    drive.rotation.x = -Math.PI / 2;
    drive.position.set(0, 0.01, 38);
    drive.receiveShadow = true;
    this.house.add(drive);

    // Landscape planter boxes (left & right of approach)
    for (const side of [-1, 1]) {
      const planterGeo = new THREE.BoxGeometry(2.5, 0.8, 8);
      const planter = new THREE.Mesh(planterGeo, this.matConcrete);
      planter.position.set(side * 6, 0.4, 30);
      planter.castShadow = true;
      this.house.add(planter);

      // Topiary / abstract hedge mass
      const hedgeGeo = new THREE.SphereGeometry(1.2, 12, 8);
      const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x0a1a0a, roughness: 0.95 });
      const hedge = new THREE.Mesh(hedgeGeo, hedgeMat);
      hedge.position.set(side * 6, 1.5, 30);
      hedge.scale.set(1, 1.6, 3);
      this.house.add(hedge);
    }
  }

  _buildApproach() {
    // Front Reflection Pool (dark granite basin with water)
    const poolBorderGeo = new THREE.BoxGeometry(30, 0.6, 20);
    const poolBorder = new THREE.Mesh(poolBorderGeo, this.matGranite);
    poolBorder.position.set(0, 0.15, 23);
    poolBorder.receiveShadow = true;
    this.house.add(poolBorder);

    // Water surface inside pool (inset)
    const waterGeo = new THREE.PlaneGeometry(28, 18);
    const waterMesh = new THREE.Mesh(waterGeo, this.matReflectionWater);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, 0.46, 23);
    this.house.add(waterMesh);

    // Stone Walkway Bridge over reflection pool
    const bridgeGeo = new THREE.BoxGeometry(4.2, 0.35, 22);
    const bridge = new THREE.Mesh(bridgeGeo, this.matTravertinePolished);
    bridge.position.set(0, 0.5, 23);
    bridge.castShadow = true;
    bridge.receiveShadow = true;
    this.house.add(bridge);

    // Bridge Gold Edge Trim
    for (const side of [-1, 1]) {
      const trimGeo = new THREE.BoxGeometry(0.06, 0.06, 22);
      const trim = new THREE.Mesh(trimGeo, this.matGold);
      trim.position.set(side * 2.05, 0.7, 23);
      this.house.add(trim);
    }

    // Subtle LED strip under bridge edges
    for (const side of [-1, 1]) {
      const ledGeo = new THREE.BoxGeometry(0.15, 0.05, 20);
      const led = new THREE.Mesh(ledGeo, this.matLED);
      led.position.set(side * 1.9, 0.35, 23);
      this.house.add(led);
    }
  }

  _buildEntrance() {
    // Entrance Portal Frame (massive board-formed concrete)
    const portalGeo = new THREE.BoxGeometry(10, 8.5, 1.2);
    const portal = new THREE.Mesh(portalGeo, this.matConcrete);
    portal.position.set(0, 4.25, 13.5);
    portal.castShadow = true;
    this.house.add(portal);

    // Portal void (where door goes) — inset dark
    const voidGeo = new THREE.BoxGeometry(5, 7.2, 1.4);
    const voidMesh = new THREE.Mesh(voidGeo, this.matBlack);
    voidMesh.position.set(0, 3.6, 13.5);
    this.house.add(voidMesh);

    // Gold frame around door opening
    const frameParts = [
      { size: [5.2, 0.08, 0.1], pos: [0, 7.2, 13] },    // Top
      { size: [0.08, 7.2, 0.1], pos: [-2.55, 3.6, 13] }, // Left
      { size: [0.08, 7.2, 0.1], pos: [2.55, 3.6, 13] }   // Right
    ];
    frameParts.forEach(f => {
      const geo = new THREE.BoxGeometry(...f.size);
      const mesh = new THREE.Mesh(geo, this.matGold);
      mesh.position.set(...f.pos);
      this.house.add(mesh);
    });

    // 12-Ft Bronze Pivot Door (slightly ajar)
    this.pivotDoor = new THREE.Group();
    const doorGeo = new THREE.BoxGeometry(3.8, 7.0, 0.18);
    const doorMesh = new THREE.Mesh(doorGeo, this.matDarkBronze);
    doorMesh.position.set(1.9, 3.5, 0);
    doorMesh.castShadow = true;

    // Door handle — elongated vertical bar
    const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.0, 8);
    const handle = new THREE.Mesh(handleGeo, this.matGold);
    handle.position.set(3.4, 3.5, 0.15);
    this.pivotDoor.add(doorMesh, handle);
    this.pivotDoor.position.set(-1.9, 0, 13.5);
    this.pivotDoor.rotation.y = Math.PI * 0.2;
    this.house.add(this.pivotDoor);

    // Welcome light emanating from the door opening (warm glow strip)
    const welcomeGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: 0.4 })
    );
    welcomeGlow.position.set(0, 0.06, 13);
    welcomeGlow.rotation.x = -Math.PI / 2;
    this.house.add(welcomeGlow);
  }

  _buildMainStructure() {
    // ─── Ground Floor Slab ───
    const floorGeo = new THREE.BoxGeometry(34, 0.45, 42);
    const floor = new THREE.Mesh(floorGeo, this.matTravertine);
    floor.position.set(0, 0.2, -5);
    floor.receiveShadow = true;
    this.house.add(floor);

    // ─── Left Concrete Feature Wall (full height, with fireplace niche) ───
    const leftWallGeo = new THREE.BoxGeometry(0.9, 10, 40);
    const leftWall = new THREE.Mesh(leftWallGeo, this.matConcrete);
    leftWall.position.set(-16.5, 5, -5);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.house.add(leftWall);

    // ─── Right Wall (partial, transitions to glass) ───
    const rightWallGeo = new THREE.BoxGeometry(0.9, 10, 15);
    const rightWall = new THREE.Mesh(rightWallGeo, this.matConcrete);
    rightWall.position.set(16.5, 5, 6);
    rightWall.castShadow = true;
    this.house.add(rightWall);

    // ─── Ceiling / Roof Slab ───
    const ceilGeo = new THREE.BoxGeometry(35, 0.6, 42);
    const ceil = new THREE.Mesh(ceilGeo, this.matConcrete);
    ceil.position.set(0, 10.3, -5);
    this.house.add(ceil);

    // Recessed LED ceiling line
    const ceilLED = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.05, 38),
      this.matLED
    );
    ceilLED.position.set(0, 9.98, -5);
    this.house.add(ceilLED);

    // ─── Rear Glass Curtain Wall (floor-to-ceiling sliding panels) ───
    for (let i = 0; i < 5; i++) {
      const panelGeo = new THREE.BoxGeometry(6.5, 9.5, 0.08);
      const panel = new THREE.Mesh(panelGeo, this.matGlass);
      panel.position.set(-13 + i * 6.6, 5.2, -24.5);
      this.house.add(panel);

      // Mullion frame
      if (i < 4) {
        const mullion = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 9.5, 0.12),
          this.matDarkBronze
        );
        mullion.position.set(-13 + i * 6.6 + 3.3, 5.2, -24.5);
        this.house.add(mullion);
      }
    }

    // ─── Side glass window panels (right wall transitions) ───
    const sideGlassGeo = new THREE.BoxGeometry(0.08, 8, 22);
    const sideGlass = new THREE.Mesh(sideGlassGeo, this.matGlass);
    sideGlass.position.set(16.5, 4.5, -12);
    this.house.add(sideGlass);

    // ─── Interior Back Wall Section ───
    const backPartialWall = new THREE.Mesh(
      new THREE.BoxGeometry(8, 10, 0.5),
      this.matConcrete
    );
    backPartialWall.position.set(-12, 5, -24.5);
    this.house.add(backPartialWall);
  }

  _buildFoyer() {
    // Sculptural Curved Bronze Staircase
    const stairGroup = new THREE.Group();
    const stepsCount = 22;
    const stairRadius = 4.0;

    for (let s = 0; s < stepsCount; s++) {
      const angle = (s / stepsCount) * Math.PI * 0.9;
      const stepGeo = new THREE.BoxGeometry(1.8, 0.16, 0.65);
      const step = new THREE.Mesh(stepGeo, this.matDarkBronze);
      step.position.set(
        Math.cos(angle) * stairRadius - 7,
        s * 0.42 + 0.55,
        Math.sin(angle) * stairRadius + 4
      );
      step.rotation.y = -angle;
      step.castShadow = true;
      step.receiveShadow = true;

      // LED step illumination
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.03, 0.04),
        this.matLED
      );
      led.position.set(0, 0.09, 0.32);
      step.add(led);

      stairGroup.add(step);
    }

    // Staircase railing (bronze rod following helix path)
    for (let s = 0; s < stepsCount; s++) {
      const angle = (s / stepsCount) * Math.PI * 0.9;
      const postGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6);
      const post = new THREE.Mesh(postGeo, this.matGold);
      post.position.set(
        Math.cos(angle) * (stairRadius + 0.8) - 7,
        s * 0.42 + 1.1,
        Math.sin(angle) * (stairRadius + 0.8) + 4
      );
      stairGroup.add(post);
    }

    this.house.add(stairGroup);

    // Foyer pendant chandelier (abstract geometric — floating golden octahedron)
    const chandelierGroup = new THREE.Group();
    const octaGeo = new THREE.OctahedronGeometry(0.6, 0);
    const octaMesh = new THREE.Mesh(octaGeo, this.matGold);
    chandelierGroup.add(octaMesh);

    // Wireframe shell around chandelier
    const wireGeo = new THREE.OctahedronGeometry(0.85, 0);
    const wireMesh = new THREE.Mesh(wireGeo, new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    }));
    chandelierGroup.add(wireMesh);

    // Pendant cable
    const cable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 4, 6),
      this.matDarkBronze
    );
    cable.position.y = 2.5;
    chandelierGroup.add(cable);

    chandelierGroup.position.set(-3, 6.5, 4);
    this.chandelierGroup = chandelierGroup;
    this.house.add(chandelierGroup);
  }

  _buildLivingSalon() {
    // ─── L-Shape Sectional Sofa ───
    const sofaGroup = new THREE.Group();

    // Main bench
    const benchGeo = new THREE.BoxGeometry(8, 0.85, 3.5);
    const bench = new THREE.Mesh(benchGeo, this.matFabric);
    bench.position.set(1, 0.65, -9);
    bench.castShadow = true;
    sofaGroup.add(bench);

    // L-section
    const lGeo = new THREE.BoxGeometry(3.2, 0.85, 5);
    const lPart = new THREE.Mesh(lGeo, this.matFabric);
    lPart.position.set(4.1, 0.65, -5.75);
    lPart.castShadow = true;
    sofaGroup.add(lPart);

    // Backrest
    const backGeo = new THREE.BoxGeometry(8, 0.6, 0.5);
    const back = new THREE.Mesh(backGeo, this.matFabric);
    back.position.set(1, 1.35, -10.5);
    sofaGroup.add(back);

    // Sofa base frame (dark bronze legs)
    const baseGeo = new THREE.BoxGeometry(8.3, 0.15, 3.8);
    const base = new THREE.Mesh(baseGeo, this.matDarkBronze);
    base.position.set(1, 0.15, -9);
    sofaGroup.add(base);

    this.house.add(sofaGroup);

    // ─── Low Marble Coffee Table ───
    const tableTopGeo = new THREE.BoxGeometry(4.5, 0.12, 2.8);
    const tableTop = new THREE.Mesh(tableTopGeo, this.matTravertinePolished);
    tableTop.position.set(1, 0.62, -6.5);
    tableTop.castShadow = true;
    this.house.add(tableTop);

    // Table legs (slim dark bronze)
    for (const [x, z] of [[-1.8, -5.3], [1.8, -5.3], [-1.8, -7.7], [1.8, -7.7]]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8),
        this.matDarkBronze
      );
      leg.position.set(x + 1, 0.38, z);
      this.house.add(leg);
    }

    // ─── 8-Ft Linear Fireplace ───
    // Fireplace niche (recessed into concrete wall)
    const nicheGeo = new THREE.BoxGeometry(0.7, 1.4, 7.5);
    const niche = new THREE.Mesh(nicheGeo, this.matBlack);
    niche.position.set(-15.8, 2.2, -10);
    this.house.add(niche);

    // Flame element
    const flameGeo = new THREE.BoxGeometry(0.25, 0.5, 6.8);
    this.flameMesh = new THREE.Mesh(flameGeo, this.matFire);
    this.flameMesh.position.set(-15.6, 1.9, -10);
    this.house.add(this.flameMesh);

    // Fire glow plane (warm reflection on floor in front of hearth)
    const fireGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 7),
      new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.04 })
    );
    fireGlow.rotation.x = -Math.PI / 2;
    fireGlow.position.set(-14, 0.44, -10);
    this.house.add(fireGlow);

    // Gold trim above fireplace
    const fireTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.05, 7.8),
      this.matGold
    );
    fireTrim.position.set(-15.4, 3.0, -10);
    this.house.add(fireTrim);

    // ─── Art Piece / Feature Wall Element ───
    const artFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 3.5, 5),
      this.matDarkBronze
    );
    artFrame.position.set(-15.9, 6.5, -10);
    this.house.add(artFrame);

    // Abstract art canvas (textured)
    const artCanvas = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 3, 4.5),
      new THREE.MeshStandardMaterial({ color: 0x1a1520, roughness: 0.8 })
    );
    artCanvas.position.set(-15.8, 6.5, -10);
    this.house.add(artCanvas);
  }

  _buildPoolTerrace() {
    // ─── Outdoor Terrace Slab ───
    const terraceGeo = new THREE.BoxGeometry(34, 0.4, 24);
    const terrace = new THREE.Mesh(terraceGeo, this.matTravertine);
    terrace.position.set(0, 0.18, -36);
    terrace.receiveShadow = true;
    this.house.add(terrace);

    // Step down transition strip
    const stepDown = new THREE.Mesh(
      new THREE.BoxGeometry(34, 0.2, 1),
      this.matDarkBronze
    );
    stepDown.position.set(0, 0.3, -24.5);
    this.house.add(stepDown);

    // ─── 65-Ft Cantilevered Infinity Pool ───
    // Pool surround coping
    const poolCopingGeo = new THREE.BoxGeometry(20, 0.8, 18);
    const poolCoping = new THREE.Mesh(poolCopingGeo, this.matGranite);
    poolCoping.position.set(4, -0.1, -38);
    this.house.add(poolCoping);

    // Water surface
    const poolWaterGeo = new THREE.PlaneGeometry(18, 16);
    this.poolWater = new THREE.Mesh(poolWaterGeo, this.matWater);
    this.poolWater.rotation.x = -Math.PI / 2;
    this.poolWater.position.set(4, 0.32, -38);
    this.house.add(this.poolWater);

    // Underwater LED glow lines
    for (let i = 0; i < 4; i++) {
      const ledLine = new THREE.Mesh(
        new THREE.BoxGeometry(16, 0.03, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.25 })
      );
      ledLine.position.set(4, -0.08, -32 - i * 4);
      this.house.add(ledLine);
    }

    // ─── Floating Volcanic Stone Fire Bowl ───
    const bowlGroup = new THREE.Group();
    const bowlGeo = new THREE.CylinderGeometry(1.3, 0.7, 0.7, 24);
    const bowl = new THREE.Mesh(bowlGeo, this.matGranite);
    bowlGroup.add(bowl);

    // Fire cone
    const fireCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.6, 1.0, 16),
      this.matFire
    );
    fireCone.position.y = 0.65;
    this.fireBowlFlame = fireCone;
    bowlGroup.add(fireCone);

    bowlGroup.position.set(4, 0.6, -38);
    this.house.add(bowlGroup);

    // ─── Sunken Conversation Pit ───
    const pitFloor = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.15, 6),
      this.matGranite
    );
    pitFloor.position.set(-8, -0.3, -34);
    this.house.add(pitFloor);

    // Pit seating (C-shape bench)
    const pitBenchGeo = new THREE.BoxGeometry(6.5, 0.55, 1.2);
    for (const [pos, rot] of [
      [[- 8, 0.15, -36.5], 0],
      [[-8, 0.15, -31.5], 0]
    ]) {
      const bench = new THREE.Mesh(pitBenchGeo, this.matFabric);
      bench.position.set(...pos);
      bench.rotation.y = rot;
      this.house.add(bench);
    }
    const pitSideBench = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.55, 5.5),
      this.matFabric
    );
    pitSideBench.position.set(-11, 0.15, -34);
    this.house.add(pitSideBench);

    // Terrace railing (minimal glass balustrade at edge)
    const railGlass = new THREE.Mesh(
      new THREE.BoxGeometry(30, 1.2, 0.06),
      new THREE.MeshPhysicalMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.15,
        metalness: 0,
        roughness: 0.02,
        clearcoat: 1.0
      })
    );
    railGlass.position.set(0, 0.8, -47.5);
    this.house.add(railGlass);
  }

  _buildMasterSuite() {
    const suite = new THREE.Group();
    suite.position.set(-4, 10.5, -12);

    // Upper floor plate (cantilevered dark walnut)
    const upperFloor = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.35, 22),
      this.matWood
    );
    upperFloor.receiveShadow = true;
    suite.add(upperFloor);

    // Fluted headboard wall (textured wood)
    const headboard = new THREE.Mesh(
      new THREE.BoxGeometry(11, 5.5, 0.4),
      this.matWood
    );
    headboard.position.set(-3, 2.75, 9);
    headboard.castShadow = true;
    suite.add(headboard);

    // Fluting detail (vertical grooves on headboard)
    for (let i = 0; i < 18; i++) {
      const groove = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 5, 0.06),
        this.matBlack
      );
      groove.position.set(-8 + i * 0.62, 2.75, 9.22);
      suite.add(groove);
    }

    // Platform Bed
    const bedBase = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.4, 6.5),
      this.matWood
    );
    bedBase.position.set(-3, 0.2, 5);
    bedBase.castShadow = true;
    suite.add(bedBase);

    // Mattress / Bedding
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.5, 6),
      new THREE.MeshStandardMaterial({ color: 0xf0ebe2, roughness: 0.95 })
    );
    mattress.position.set(-3, 0.7, 5);
    suite.add(mattress);

    // Pillows
    for (const x of [-4.2, -3, -1.8]) {
      const pillow = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.25, 0.6),
        new THREE.MeshStandardMaterial({ color: 0xe8e0d4, roughness: 0.9 })
      );
      pillow.position.set(x, 0.95, 7.5);
      suite.add(pillow);
    }

    // Bedside tables
    for (const side of [-1, 1]) {
      const nightstand = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.55, 0.9),
        this.matWood
      );
      nightstand.position.set(-3 + side * 3.5, 0.45, 7);
      suite.add(nightstand);

      // Lamp on nightstand
      const lampBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 0.3, 12),
        this.matDarkBronze
      );
      lampBase.position.set(-3 + side * 3.5, 0.85, 7);
      suite.add(lampBase);

      const lampShade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 0.35, 12),
        new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: 0.7 })
      );
      lampShade.position.set(-3 + side * 3.5, 1.1, 7);
      suite.add(lampShade);
    }

    // 270° Corner Frameless Glass Walls
    const cornerGlass1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 5.5, 20),
      this.matGlass
    );
    cornerGlass1.position.set(9.5, 2.75, 0);
    suite.add(cornerGlass1);

    const cornerGlass2 = new THREE.Mesh(
      new THREE.BoxGeometry(20, 5.5, 0.06),
      this.matGlass
    );
    cornerGlass2.position.set(0, 2.75, -10.5);
    suite.add(cornerGlass2);

    // Suite ceiling
    const suiteCeil = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.3, 22),
      this.matConcrete
    );
    suiteCeil.position.set(0, 5.65, 0);
    suite.add(suiteCeil);

    // Recessed LED perimeter in suite ceiling
    const suiteLED = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.03, 0.15),
      this.matLED
    );
    suiteLED.position.set(0, 5.48, 0);
    suite.add(suiteLED);

    const suiteLED2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.03, 20),
      this.matLED
    );
    suiteLED2.position.set(0, 5.48, 0);
    suite.add(suiteLED2);

    this.house.add(suite);
  }

  _buildParticles() {
    // Twilight Embers / Stardust
    const pCount = 500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 80;
      pPos[i * 3 + 1] = Math.random() * 30;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
      pSizes[i] = 0.08 + Math.random() * 0.2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    this.ambientParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xffd599,
      size: 0.18,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    }));
    this.scene.add(this.ambientParticles);

    // Pool area cool particles
    const cCount = 150;
    const cGeo = new THREE.BufferGeometry();
    const cPos = new Float32Array(cCount * 3);
    for (let i = 0; i < cCount; i++) {
      cPos[i * 3] = (Math.random() - 0.5) * 20 + 4;
      cPos[i * 3 + 1] = 0.5 + Math.random() * 3;
      cPos[i * 3 + 2] = -28 - Math.random() * 20;
    }
    cGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));

    this.poolParticles = new THREE.Points(cGeo, new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.12,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    }));
    this.scene.add(this.poolParticles);
  }

  _buildDecor() {
    // Large indoor plant / tree near glass wall
    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 2.5, 8);
    const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.9 }));
    trunk.position.set(12, 1.7, -20);
    this.house.add(trunk);

    // Foliage mass
    const foliageGeo = new THREE.SphereGeometry(1.5, 8, 6);
    const foliage = new THREE.Mesh(foliageGeo, new THREE.MeshStandardMaterial({ color: 0x0d2a0d, roughness: 0.95 }));
    foliage.position.set(12, 3.5, -20);
    foliage.scale.set(1, 1.3, 1);
    this.house.add(foliage);

    // Floor vase near entrance
    const vaseGeo = new THREE.CylinderGeometry(0.35, 0.25, 1.2, 16);
    const vase = new THREE.Mesh(vaseGeo, this.matDarkBronze);
    vase.position.set(5, 0.85, 10);
    this.house.add(vase);

    // Decorative sphere on coffee table
    const sphereGeo = new THREE.SphereGeometry(0.25, 16, 12);
    const sphere = new THREE.Mesh(sphereGeo, this.matGold);
    sphere.position.set(1, 0.95, -6.5);
    this.house.add(sphere);

    // Book stack on coffee table
    for (let i = 0; i < 3; i++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.06, 0.55),
        new THREE.MeshStandardMaterial({
          color: [0x1a1520, 0x2a1f18, 0x15202a][i],
          roughness: 0.9
        })
      );
      book.position.set(2.5, 0.73 + i * 0.06, -6.5);
      book.rotation.y = i * 0.15;
      this.house.add(book);
    }
  }

  /* ── Cinematic Lighting System ── */
  setupLighting() {
    // Deep Blue Ambient (moonlit night ambience)
    this.ambientLight = new THREE.AmbientLight(0x0e172a, 0.8);
    this.scene.add(this.ambientLight);

    // Hemisphere light (sky/ground color bleed)
    this.hemiLight = new THREE.HemisphereLight(0x0a1628, 0x080c14, 0.5);
    this.scene.add(this.hemiLight);

    // Primary Directional Light (Moonlight / Twilight)
    this.sunLight = new THREE.DirectionalLight(0x4488cc, 1.8);
    this.sunLight.position.set(50, 60, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.left = -40;
    this.sunLight.shadow.camera.right = 40;
    this.sunLight.shadow.camera.top = 40;
    this.sunLight.shadow.camera.bottom = -40;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 150;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Interior Warm Point Lights
    this.foyerLight = new THREE.PointLight(0xffbe6b, 4.0, 35, 1.5);
    this.foyerLight.position.set(-3, 6, 4);
    this.foyerLight.castShadow = true;
    this.foyerLight.shadow.mapSize.width = 512;
    this.foyerLight.shadow.mapSize.height = 512;
    this.scene.add(this.foyerLight);

    this.salonLight = new THREE.PointLight(0xffbe6b, 3.5, 40, 1.5);
    this.salonLight.position.set(0, 6, -10);
    this.scene.add(this.salonLight);

    // Fireplace Flickering Light
    this.fireLight = new THREE.PointLight(0xff7700, 3.5, 18, 2.0);
    this.fireLight.position.set(-14, 2.2, -10);
    this.fireLight.castShadow = true;
    this.fireLight.shadow.mapSize.width = 256;
    this.fireLight.shadow.mapSize.height = 256;
    this.scene.add(this.fireLight);

    // Pool Cyan Glow
    this.poolLight = new THREE.PointLight(0x00d4ff, 4.0, 40, 1.5);
    this.poolLight.position.set(4, 1, -36);
    this.scene.add(this.poolLight);

    // Second pool accent light
    this.poolLight2 = new THREE.PointLight(0x0099cc, 2.0, 25, 2.0);
    this.poolLight2.position.set(10, 0.5, -42);
    this.scene.add(this.poolLight2);

    // Master Suite Warm Glow
    this.suiteLight = new THREE.PointLight(0xffd599, 3.0, 30, 1.5);
    this.suiteLight.position.set(-4, 14, -12);
    this.scene.add(this.suiteLight);

    // Entrance Welcome Light (warm spill from door)
    this.entranceLight = new THREE.SpotLight(0xffcc88, 2.5, 20, Math.PI * 0.25, 0.5, 1.5);
    this.entranceLight.position.set(0, 5, 14);
    this.entranceLight.target.position.set(0, 0, 20);
    this.scene.add(this.entranceLight);
    this.scene.add(this.entranceLight.target);
  }

  /* ── Camera Spline Trajectory ── */
  setupCameraSplines() {
    const cameraPoints = [
      new THREE.Vector3(0, 3.2, 42),      // 0. Far approach
      new THREE.Vector3(0, 2.8, 22),      // 1. Over reflection pool bridge
      new THREE.Vector3(0, 2.8, 12),      // 2. At pivot door
      new THREE.Vector3(-1.5, 2.8, -4),   // 3. Center of great salon
      new THREE.Vector3(2.5, 2.2, -28),   // 4. Infinity pool deck
      new THREE.Vector3(-4.5, 12.8, -8)   // 5. Master suite
    ];

    const lookTargetPoints = [
      new THREE.Vector3(0, 3.5, 14),      // Look at entrance
      new THREE.Vector3(0, 3.5, 10),      // Through bronze door
      new THREE.Vector3(-2, 3.5, -6),     // Into salon
      new THREE.Vector3(2, 2.2, -28),     // Through glass to pool
      new THREE.Vector3(4, 0.8, -40),     // Fire bowl on water
      new THREE.Vector3(6, 10, -28)       // Horizon through master glass
    ];

    this.cameraSpline = new THREE.CatmullRomCurve3(cameraPoints, false, 'catmullrom', 0.15);
    this.lookSpline = new THREE.CatmullRomCurve3(lookTargetPoints, false, 'catmullrom', 0.15);
  }

  /* ── Event Listeners ── */
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      this.targetLookOffsetX = this.mouseX * 3.0;
      this.targetLookOffsetY = -this.mouseY * 2.0;
    });

    window.addEventListener('scroll', () => this.handleScroll());

    this.setupMapNodeClicks();
  }

  setupMapNodeClicks() {
    document.querySelectorAll('.map-node').forEach(node => {
      node.addEventListener('click', () => {
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
    window.scrollTo({ top: t * totalHeight, behavior: 'smooth' });
  }

  handleScroll() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    this.scrollProgress = Math.max(0, Math.min(1, window.scrollY / totalHeight));
    this.updateHUD(this.scrollProgress);
  }

  /* ── HUD & Map Updates ── */
  updateHUD(t) {
    let activeWp = this.waypoints[0];
    let minDiff = 999;
    this.waypoints.forEach(wp => {
      const diff = Math.abs(wp.t - t);
      if (diff < minDiff) { minDiff = diff; activeWp = wp; }
    });

    const zoneEl = document.querySelector('.indicator-zone');
    const titleEl = document.querySelector('.indicator-title');
    const specsEl = document.querySelector('.indicator-specs');
    if (zoneEl) zoneEl.textContent = activeWp.zone;
    if (titleEl) titleEl.textContent = activeWp.name;
    if (specsEl) specsEl.textContent = activeWp.specs;

    document.querySelectorAll('.map-node').forEach(node => {
      const nodeT = parseFloat(node.getAttribute('data-t'));
      node.classList.toggle('active', Math.abs(nodeT - activeWp.t) < 0.1);
    });

    const mapPin = document.getElementById('map-traveler-pin');
    if (mapPin) {
      const pinX = 30 + (t * 185);
      const pinY = 100 - (t * 80) + Math.sin(t * Math.PI) * 12;
      mapPin.setAttribute('transform', `translate(${pinX}, ${pinY})`);
    }

    const activePath = document.getElementById('map-active-path');
    if (activePath) {
      activePath.style.strokeDashoffset = `${250 - (t * 250)}`;
    }
  }

  /* ── Theme Switching (Midnight ↔ Golden Hour) ── */
  setTheme(theme) {
    this.currentTheme = theme;
    const sky = this.skySphere?.material;

    if (theme === 'golden-hour') {
      this.scene.fog.color.setHex(0x181008);
      if (sky?.uniforms) {
        sky.uniforms.topColor.value.setHex(0x0a0814);
        sky.uniforms.horizonColor.value.setHex(0x2a1a0a);
        sky.uniforms.sunsetColor.value.setHex(0x3a1a08);
        sky.uniforms.sunGlowColor.value.setHex(0x4a2a0a);
      }
      this.sunLight.color.setHex(0xffaa44);
      this.sunLight.intensity = 2.8;
      this.ambientLight.color.setHex(0x1a1008);
      this.foyerLight.color.setHex(0xffaa22);
      this.poolLight.color.setHex(0x22d3ee);
      this.renderer.toneMappingExposure = 1.3;
    } else {
      this.scene.fog.color.setHex(0x04080e);
      if (sky?.uniforms) {
        sky.uniforms.topColor.value.setHex(0x020610);
        sky.uniforms.horizonColor.value.setHex(0x0d1b2a);
        sky.uniforms.sunsetColor.value.setHex(0x1a0a14);
        sky.uniforms.sunGlowColor.value.setHex(0x2a1a08);
      }
      this.sunLight.color.setHex(0x4488cc);
      this.sunLight.intensity = 1.8;
      this.ambientLight.color.setHex(0x0e172a);
      this.foyerLight.color.setHex(0xffbe6b);
      this.poolLight.color.setHex(0x00d4ff);
      this.renderer.toneMappingExposure = 1.1;
    }
  }

  /* ── Render Loop ── */
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Smooth mouse parallax
    this.currentLookOffsetX += (this.targetLookOffsetX - this.currentLookOffsetX) * 0.06;
    this.currentLookOffsetY += (this.targetLookOffsetY - this.currentLookOffsetY) * 0.06;

    // Smooth scroll interpolation
    this.targetScrollProgress += (this.scrollProgress - this.targetScrollProgress) * 0.06;
    const clampedT = Math.max(0.001, Math.min(0.999, this.targetScrollProgress));

    // Camera on spline
    if (this.cameraSpline && this.lookSpline) {
      const camPos = this.cameraSpline.getPointAt(clampedT);
      const lookPos = this.lookSpline.getPointAt(clampedT);

      this.camera.position.copy(camPos);
      this.camera.lookAt(
        lookPos.x + this.currentLookOffsetX,
        lookPos.y + this.currentLookOffsetY,
        lookPos.z
      );
    }

    // ── Dynamic Animations ──

    // Fireplace flicker
    if (this.fireLight) {
      this.fireLight.intensity = 3.2 + Math.sin(elapsed * 14) * 0.8 + Math.cos(elapsed * 27) * 0.5;
    }
    if (this.flameMesh) {
      this.flameMesh.scale.y = 1.0 + Math.sin(elapsed * 18) * 0.12;
      this.flameMesh.material.color.setHSL(
        0.08 + Math.sin(elapsed * 10) * 0.02,
        1.0,
        0.5 + Math.sin(elapsed * 15) * 0.08
      );
    }

    // Fire bowl flame animation
    if (this.fireBowlFlame) {
      this.fireBowlFlame.scale.y = 1.0 + Math.sin(elapsed * 12 + 1) * 0.15;
      this.fireBowlFlame.scale.x = 1.0 + Math.cos(elapsed * 16) * 0.08;
      this.fireBowlFlame.rotation.y = elapsed * 0.5;
    }

    // Pool water shimmer (light position drift)
    if (this.poolLight) {
      this.poolLight.position.x = 4 + Math.sin(elapsed * 1.5) * 2;
      this.poolLight.intensity = 3.5 + Math.sin(elapsed * 2.5) * 0.8;
    }
    if (this.poolLight2) {
      this.poolLight2.position.z = -42 + Math.cos(elapsed * 1.8) * 2;
    }

    // Ocean wave animation
    if (this.oceanMesh?.material?.uniforms) {
      this.oceanMesh.material.uniforms.time.value = elapsed;
    }

    // Chandelier gentle sway
    if (this.chandelierGroup) {
      this.chandelierGroup.rotation.y = elapsed * 0.15;
      this.chandelierGroup.children[0].rotation.x = Math.sin(elapsed * 0.8) * 0.05;
    }

    // Particle drift
    if (this.ambientParticles) {
      this.ambientParticles.rotation.y = elapsed * 0.015;
    }
    if (this.poolParticles) {
      this.poolParticles.rotation.y = -elapsed * 0.02;
      const positions = this.poolParticles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsed * 2 + i) * 0.002;
      }
      this.poolParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.TrueVilla3DEngine = TrueVilla3DEngine;
