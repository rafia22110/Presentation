import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCcw, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { audioService } from '../services/audioService';

interface ThreeCanvasProps {
  dayIndex: number;
  magicBurst: number;
  onMagicClick: () => void;
  dayBadge: string;
  holoTitle: string;
}

interface DynamicItem {
  mesh: THREE.Object3D;
  type: 'orbit' | 'ring' | 'flame' | 'pulse' | 'rain' | 'float' | 'sway' | 'selfSpin' | 'wave';
  speed?: number;
  offset?: number;
  baseY?: number;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  dayIndex,
  magicBurst,
  onMagicClick,
  dayBadge,
  holoTitle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const dynamicItemsRef = useRef<DynamicItem[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Interaction state
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotTargetRef = useRef<{ x: number; y: number }>({ x: 0.12, y: 0 });
  const rotCurrentRef = useRef<{ x: number; y: number }>({ x: 0.12, y: 0 });
  const zoomTargetRef = useRef<number>(7.2);
  const zoomCurrentRef = useRef<number>(7.2);

  const [isInteracting, setIsInteracting] = useState(false);

  // Helper to dispose Three.js objects cleanly
  const disposeNode = (node: THREE.Object3D) => {
    if (node instanceof THREE.Mesh) {
      if (node.geometry) node.geometry.dispose();
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((m) => m.dispose());
        } else {
          node.material.dispose();
        }
      }
    }
  };

  const clearRootGroup = () => {
    if (!rootGroupRef.current) return;
    while (rootGroupRef.current.children.length > 0) {
      const child = rootGroupRef.current.children[0];
      rootGroupRef.current.remove(child);
      child.traverse(disposeNode);
    }
    dynamicItemsRef.current = [];
  };

  // Build the 3D procedural models for each day (Disney-Pixel style)
  const buildDayModel = useCallback((day: number) => {
    if (!rootGroupRef.current) return;
    clearRootGroup();
    const group = rootGroupRef.current;
    rotTargetRef.current = { x: 0.12, y: 0 };
    rotCurrentRef.current = { x: 0.12, y: 0 };

    // Common stylized PBR materials generator
    const createToonMat = (color: number, roughness = 0.35, metalness = 0.1, emissive = 0x000000, emissiveIntensity = 0.15) => {
      return new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        emissive,
        emissiveIntensity,
      });
    };

    // Soft contact shadow disc for grounding
    const shadowGeo = new THREE.CircleGeometry(1.9, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050114,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    });
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = -2.18;
    group.add(shadowDisc);

    // ==========================================
    // DAY 0: INTRODUCTION - THE MAGICAL EARTH & CREATION RINGS
    // ==========================================
    if (day === 0) {
      // 1. Disney stylized Earth sphere
      const oceanGeo = new THREE.SphereGeometry(1.25, 32, 32);
      const oceanMat = createToonMat(0x00a8e8, 0.25, 0.15, 0x006494, 0.3);
      const earthMesh = new THREE.Mesh(oceanGeo, oceanMat);
      group.add(earthMesh);

      // 2. Stylized green continents (extruded curvy patches around globe)
      const landGroup = new THREE.Group();
      const landGeo = new THREE.DodecahedronGeometry(0.55, 1);
      const landMat = createToonMat(0x38b000, 0.45, 0.05, 0x007200, 0.2);

      const positions = [
        [0.7, 0.5, 0.8],
        [-0.8, 0.3, 0.7],
        [0.2, -0.7, 0.9],
        [-0.5, -0.6, -0.8],
        [0.8, -0.2, -0.7],
        [0.1, 0.9, -0.6],
      ];

      positions.forEach(([x, y, z]) => {
        const patch = new THREE.Mesh(landGeo, landMat);
        patch.position.set(x, y, z).normalize().multiplyScalar(1.22);
        patch.scale.set(0.9, 0.8, 0.25);
        patch.lookAt(0, 0, 0);
        landGroup.add(patch);
      });
      earthMesh.add(landGroup);

      // 3. Disney fluffy cartoon clouds floating above Earth
      for (let c = 0; c < 4; c++) {
        const cloudGroup = new THREE.Group();
        for (let b = 0; b < 3; b++) {
          const puff = new THREE.Mesh(
            new THREE.SphereGeometry(0.18 + (b % 2) * 0.08, 14, 14),
            createToonMat(0xffffff, 0.2, 0.0, 0x90e0ef, 0.4)
          );
          puff.position.set((b - 1) * 0.16, 0, 0);
          cloudGroup.add(puff);
        }
        const angle = (c / 4) * Math.PI * 2;
        cloudGroup.position.set(Math.cos(angle) * 1.55, (c % 2) * 0.4 - 0.2, Math.sin(angle) * 1.55);
        group.add(cloudGroup);
        dynamicItemsRef.current.push({ mesh: cloudGroup, type: 'float', offset: c });
      }

      // 4. Seven magical golden creation rings with jewel nodes for 7 days
      const ringColors = [0xffbe0b, 0x00f2fe, 0x38b000, 0xffd166, 0x00bbf9, 0xff4d6d, 0xffd700];
      for (let r = 0; r < 2; r++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.85 + r * 0.35, 0.035, 16, 64),
          new THREE.MeshBasicMaterial({ color: r === 0 ? 0xffd700 : 0x00f2fe, transparent: true, opacity: 0.85 })
        );
        ring.rotation.x = Math.PI / 3 + r * 0.5;
        ring.rotation.y = r * 0.4;
        group.add(ring);
        dynamicItemsRef.current.push({ mesh: ring, type: 'ring', speed: 0.012 * (r + 1) });

        // Day jewel emblems along the ring
        for (let j = 0; j < 3; j++) {
          const jewel = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.12, 0),
            new THREE.MeshBasicMaterial({ color: ringColors[(r * 3 + j) % ringColors.length] })
          );
          const a = (j / 3) * Math.PI * 2;
          jewel.position.set(Math.cos(a) * (1.85 + r * 0.35), Math.sin(a) * (1.85 + r * 0.35), 0);
          ring.add(jewel);
        }
      }
    }

    // ==========================================
    // DAY 1: LIGHT & DARKNESS (FIRST LIGHT)
    // ==========================================
    else if (day === 1) {
      // 1. Ornate Disney golden candlestick holder
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.9, 0.35, 24),
        createToonMat(0xffd700, 0.2, 0.75, 0xb8860b, 0.3)
      );
      pedestal.position.y = -1.45;
      group.add(pedestal);

      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.42, 1.4, 24),
        createToonMat(0xfffdf0, 0.25, 0.1, 0xffeedd, 0.2)
      );
      pillar.position.y = -0.65;
      group.add(pillar);

      // 2. Multi-layer Disney flame spirit of First Light
      const flameCore = new THREE.Mesh(
        new THREE.ConeGeometry(0.28, 0.85, 20),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      flameCore.position.y = 0.52;
      group.add(flameCore);

      const flameOuter = new THREE.Mesh(
        new THREE.ConeGeometry(0.48, 1.25, 20),
        new THREE.MeshBasicMaterial({ color: 0xffa200, transparent: true, opacity: 0.8 })
      );
      flameOuter.position.y = 0.58;
      group.add(flameOuter);

      const flameHalo = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xffd166, wireframe: true, transparent: true, opacity: 0.35 })
      );
      flameHalo.position.y = 0.6;
      group.add(flameHalo);

      // 3. Crescent moon face representing the gentle night
      const nightPivot = new THREE.Group();
      nightPivot.position.set(1.4, 0.2, -0.4);
      const moonBody = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.18, 16, 32, Math.PI * 1.3),
        createToonMat(0x64748b, 0.3, 0.2, 0x1e293b, 0.5)
      );
      nightPivot.add(moonBody);
      group.add(nightPivot);

      dynamicItemsRef.current.push({ mesh: flameCore, type: 'flame' });
      dynamicItemsRef.current.push({ mesh: flameOuter, type: 'flame' });
      dynamicItemsRef.current.push({ mesh: flameHalo, type: 'pulse' });
      dynamicItemsRef.current.push({ mesh: nightPivot, type: 'float', offset: 1.5 });
    }

    // ==========================================
    // DAY 2: THE FIRMAMENT (SKY, CLOUDS & SEAS)
    // ==========================================
    else if (day === 2) {
      // 1. Crystalline sky dome separating waters
      const domeGeo = new THREE.SphereGeometry(1.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.35,
        wireframe: true,
        roughness: 0.1,
      });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = -0.3;
      group.add(dome);

      // 2. Undulating ocean cylinder below
      const sea = new THREE.Mesh(
        new THREE.CylinderGeometry(1.75, 1.75, 0.45, 32),
        createToonMat(0x0077b6, 0.2, 0.3, 0x023e8a, 0.5)
      );
      sea.position.y = -1.25;
      group.add(sea);

      // 3. Fluffy 3D clouds above the firmament
      for (let c = 0; c < 3; c++) {
        const cloudGroup = new THREE.Group();
        for (let b = 0; b < 4; b++) {
          const puff = new THREE.Mesh(
            new THREE.SphereGeometry(0.3 + (b % 2) * 0.1, 16, 16),
            createToonMat(0xffffff, 0.2, 0.05, 0xa0e7e5, 0.3)
          );
          puff.position.set((b - 1.5) * 0.28, (b % 2) * 0.12, 0);
          cloudGroup.add(puff);
        }
        cloudGroup.position.set((c - 1) * 1.15, 1.15 + (c % 2) * 0.25, (c - 1) * 0.3);
        group.add(cloudGroup);
        dynamicItemsRef.current.push({ mesh: cloudGroup, type: 'float', offset: c });
      }

      // 4. Disney crystalline raindrops falling through the firmament
      for (let r = 0; r < 24; r++) {
        const drop = new THREE.Mesh(
          new THREE.ConeGeometry(0.045, 0.22, 8),
          new THREE.MeshBasicMaterial({ color: 0x48cae4 })
        );
        drop.position.set((Math.random() - 0.5) * 2.6, Math.random() * 2 - 0.7, (Math.random() - 0.5) * 1.6);
        group.add(drop);
        dynamicItemsRef.current.push({ mesh: drop, type: 'rain', speed: 0.045 + Math.random() * 0.03 });
      }
    }

    // ==========================================
    // DAY 3: DRY LAND, PLANTS, FRUIT TREES & CORAL REEF
    // ==========================================
    else if (day === 3) {
      // 1. Island knoll with sand shore and green grass top
      const shore = new THREE.Mesh(
        new THREE.CylinderGeometry(1.65, 1.95, 0.4, 32),
        createToonMat(0xf4a261, 0.5, 0.05, 0xe76f51, 0.15)
      );
      shore.position.y = -1.25;
      group.add(shore);

      const grassKnoll = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.65, 0.25, 32),
        createToonMat(0x38b000, 0.4, 0.05, 0x007200, 0.25)
      );
      grassKnoll.position.y = -1.0;
      group.add(grassKnoll);

      // 2. Disney fruit tree (gnarled brown trunk + layered round crowns + glossy apples)
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.28, 1.25, 16),
        createToonMat(0x7c4d2b, 0.6, 0.05)
      );
      trunk.position.set(0.15, -0.3, 0);
      group.add(trunk);

      // Layered puffy leafy crowns
      const crownColors = [0x2d6a4f, 0x40916c, 0x52b788, 0x74c69d];
      crownColors.forEach((col, idx) => {
        const puff = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.65 - idx * 0.08, 1),
          createToonMat(col, 0.35, 0.05, col, 0.2)
        );
        puff.position.set(0.15 + (idx % 2 ? 0.15 : -0.15), 0.45 + idx * 0.25, (idx > 1 ? 0.1 : -0.1));
        group.add(puff);
      });

      // Glossy red apples with tiny green leaves
      for (let a = 0; a < 7; a++) {
        const angle = (a / 7) * Math.PI * 2;
        const apple = new THREE.Mesh(
          new THREE.SphereGeometry(0.11, 14, 14),
          createToonMat(0xe63946, 0.15, 0.2, 0xd00000, 0.3)
        );
        apple.position.set(
          0.15 + Math.cos(angle) * 0.68,
          0.55 + (a % 3) * 0.18,
          Math.sin(angle) * 0.68
        );
        group.add(apple);
      }

      // 3. Colorful coral reef polyps in the water
      const coralColors = [0xff4d6d, 0xff9e00, 0x7209b7, 0x00f5d4, 0xfee440];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const coral = new THREE.Mesh(
          new THREE.TorusKnotGeometry(0.2, 0.065, 36, 8, 2, 3),
          createToonMat(coralColors[i % coralColors.length], 0.3, 0.1, coralColors[i % coralColors.length], 0.3)
        );
        coral.position.set(Math.cos(a) * 1.35, -0.85, Math.sin(a) * 1.35);
        coral.scale.set(0.7, 0.7, 0.7);
        group.add(coral);
        dynamicItemsRef.current.push({ mesh: coral, type: 'sway', offset: i });
      }
    }

    // ==========================================
    // DAY 4: SUN, MOON & SOLAR SYSTEM
    // ==========================================
    else if (day === 4) {
      // 1. Smiling golden Sun at the center
      const sunGeo = new THREE.SphereGeometry(0.8, 32, 32);
      const sunMat = createToonMat(0xffbe0b, 0.2, 0.1, 0xffa200, 0.6);
      const sun = new THREE.Mesh(sunGeo, sunMat);
      group.add(sun);

      // Sun halo corona
      const sunCorona = new THREE.Mesh(
        new THREE.SphereGeometry(1.02, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xff9f1c, wireframe: true, transparent: true, opacity: 0.45 })
      );
      group.add(sunCorona);
      dynamicItemsRef.current.push({ mesh: sunCorona, type: 'pulse' });

      // 2. Planets orbiting on tracks
      const planetDefs = [
        { r: 1.3, size: 0.15, col: 0xff6b6b, spd: 0.035, name: 'Mars' },
        { r: 1.85, size: 0.24, col: 0x00b4d8, spd: 0.022, name: 'Earth', moon: true },
        { r: 2.45, size: 0.32, col: 0xf4a261, spd: 0.014, name: 'Saturn', rings: true },
      ];

      planetDefs.forEach((p, idx) => {
        // Glowing orbital ring
        const track = new THREE.Mesh(
          new THREE.RingGeometry(p.r - 0.02, p.r + 0.02, 64),
          new THREE.MeshBasicMaterial({ color: 0x00f2fe, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
        );
        track.rotation.x = Math.PI / 2;
        group.add(track);

        const pivot = new THREE.Group();
        pivot.rotation.y = idx * 2.2;
        group.add(pivot);

        const planet = new THREE.Mesh(
          new THREE.SphereGeometry(p.size, 20, 20),
          createToonMat(p.col, 0.3, 0.2, p.col, 0.3)
        );
        planet.position.x = p.r;
        pivot.add(planet);

        if (p.moon) {
          const moon = new THREE.Mesh(
            new THREE.SphereGeometry(0.075, 12, 12),
            createToonMat(0xffffff, 0.3, 0.1, 0xe2e8f0, 0.3)
          );
          moon.position.set(0.42, 0.12, 0);
          planet.add(moon);
        }

        if (p.rings) {
          const ringMesh = new THREE.Mesh(
            new THREE.RingGeometry(0.4, 0.58, 32),
            new THREE.MeshBasicMaterial({ color: 0xffe066, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
          );
          ringMesh.rotation.x = Math.PI / 2.6;
          planet.add(ringMesh);
        }

        dynamicItemsRef.current.push({ mesh: pivot, type: 'orbit', speed: p.spd });
      });
    }

    // ==========================================
    // DAY 5: SEA CREATURES & SKY BIRDS
    // ==========================================
    else if (day === 5) {
      // 1. Water realm ring
      const seaVortex = new THREE.Mesh(
        new THREE.CylinderGeometry(1.7, 1.7, 0.4, 32),
        createToonMat(0x0077b6, 0.25, 0.2, 0x023e8a, 0.4)
      );
      seaVortex.position.y = -1.2;
      group.add(seaVortex);

      // 2. Leaping Disney dolphin
      const dolphinPivot = new THREE.Group();
      group.add(dolphinPivot);

      const dolphinGroup = new THREE.Group();
      // Curved body
      const dBody = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 1.1, 16),
        createToonMat(0x48cae4, 0.2, 0.1, 0x0096c7, 0.3)
      );
      dBody.rotation.z = Math.PI / 2.3;
      dolphinGroup.add(dBody);

      // Dorsal fin & tail
      const dFin = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.35, 4),
        createToonMat(0x0096c7, 0.2, 0.1)
      );
      dFin.position.set(0.05, 0.25, 0);
      dFin.rotation.z = -0.4;
      dolphinGroup.add(dFin);

      const dTail = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.35, 0.6),
        createToonMat(0x0077b6, 0.2, 0.1)
      );
      dTail.position.set(-0.55, -0.15, 0);
      dolphinGroup.add(dTail);

      dolphinGroup.position.set(1.15, -0.2, 0);
      dolphinPivot.add(dolphinGroup);
      dynamicItemsRef.current.push({ mesh: dolphinPivot, type: 'orbit', speed: 0.028 });

      // 3. School of colorful tropical fish swimming
      for (let f = 0; f < 5; f++) {
        const fishPivot = new THREE.Group();
        fishPivot.rotation.y = (f / 5) * Math.PI * 2;
        group.add(fishPivot);

        const fish = new THREE.Group();
        const fBody = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 12, 12),
          createToonMat(f % 2 === 0 ? 0xff9f1c : 0xffbe0b, 0.2, 0.1, 0xff7b00, 0.3)
        );
        fBody.scale.set(1.4, 0.9, 0.7);
        fish.add(fBody);

        const fTail = new THREE.Mesh(
          new THREE.ConeGeometry(0.12, 0.2, 3),
          new THREE.MeshBasicMaterial({ color: 0xffd166 })
        );
        fTail.rotation.z = -Math.PI / 2;
        fTail.position.x = -0.25;
        fish.add(fTail);

        fish.position.set(1.45, -0.7 + (f % 3) * 0.2, 0);
        fishPivot.add(fish);
        dynamicItemsRef.current.push({ mesh: fishPivot, type: 'orbit', speed: 0.02 + (f % 2) * 0.008 });
      }

      // 4. Disney flying cartoon birds soaring above
      for (let b = 0; b < 3; b++) {
        const birdPivot = new THREE.Group();
        birdPivot.rotation.y = b * 2.1;
        group.add(birdPivot);

        const bird = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.18, 0),
          createToonMat(0xff4d6d, 0.3, 0.1, 0xff0055, 0.3)
        );
        bird.scale.set(1.6, 0.45, 0.9);
        bird.position.set(1.1, 1.1 + (b % 2) * 0.3, 0);
        birdPivot.add(bird);
        dynamicItemsRef.current.push({ mesh: birdPivot, type: 'orbit', speed: -0.024 });
      }
    }

    // ==========================================
    // DAY 6: ANIMALS OF THE LAND & MAN (ADAM & EVE)
    // ==========================================
    else if (day === 6) {
      // 1. Lush Eden meadow island
      const knoll = new THREE.Mesh(
        new THREE.CylinderGeometry(1.65, 1.85, 0.35, 32),
        createToonMat(0x52b788, 0.4, 0.05, 0x1b4332, 0.3)
      );
      knoll.position.y = -1.2;
      group.add(knoll);

      // 2. Stylized cute Adam & Eve cartoon figures
      [-0.45, 0.45].forEach((xPos, idx) => {
        const person = new THREE.Group();
        // Head
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 16, 16),
          createToonMat(0xf4a261, 0.3, 0.05)
        );
        head.position.y = 0.32;
        person.add(head);

        // Disney hair
        const hair = new THREE.Mesh(
          new THREE.SphereGeometry(0.26, 14, 14),
          createToonMat(idx === 0 ? 0x4a2810 : 0x7c4d2b, 0.5, 0.05)
        );
        hair.position.set(0, 0.38, -0.04);
        hair.scale.set(1, 1, 0.9);
        person.add(hair);

        // Body / tunic
        const tunic = new THREE.Mesh(
          new THREE.ConeGeometry(0.35, 0.9, 16),
          createToonMat(idx === 0 ? 0x2a9d8f : 0xe76f51, 0.4, 0.05, idx === 0 ? 0x264653 : 0x9d0208, 0.2)
        );
        tunic.position.y = -0.32;
        person.add(tunic);

        person.position.set(xPos, -0.35, 0);
        group.add(person);
      });

      // 3. Cute lion cub with rounded mane
      const lion = new THREE.Group();
      const lionMane = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 14, 14),
        createToonMat(0xd97706, 0.4, 0.05)
      );
      lionMane.position.set(0.9, -0.65, 0.4);
      lion.add(lionMane);

      const lionFace = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 14, 14),
        createToonMat(0xfcd34d, 0.3, 0.05)
      );
      lionFace.position.set(0.9, -0.65, 0.52);
      lion.add(lionFace);
      group.add(lion);

      // 4. Floating heart-crown of loving stewardship over Creation
      const heartCrown = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.38, 1),
        createToonMat(0xff4d6d, 0.2, 0.1, 0xff0055, 0.6)
      );
      heartCrown.position.y = 1.05;
      group.add(heartCrown);
      dynamicItemsRef.current.push({ mesh: heartCrown, type: 'pulse' });
    }

    // ==========================================
    // DAY 7: SHABBAT SANCTUARY - CANDLES, CHALLAH & CROWN
    // ==========================================
    else if (day === 7) {
      // 1. Festive Shabbat table with white cover
      const table = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 0.28, 32),
        createToonMat(0xffffff, 0.2, 0.05, 0xf1f5f9, 0.3)
      );
      table.position.y = -1.2;
      group.add(table);

      // 2. Two golden Shabbat candlesticks with animated warm flames
      [-0.55, 0.55].forEach((cx, idx) => {
        const candlestick = new THREE.Group();
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.28, 0.75, 16),
          createToonMat(0xffd700, 0.2, 0.8, 0xb8860b, 0.3)
        );
        candlestick.add(base);

        const wax = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16),
          createToonMat(0xfffdf5, 0.2, 0.05, 0xffeedd, 0.2)
        );
        wax.position.y = 0.65;
        candlestick.add(wax);

        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.16, 0.45, 16),
          new THREE.MeshBasicMaterial({ color: 0xffbe0b })
        );
        flame.position.y = 1.25;
        candlestick.add(flame);
        dynamicItemsRef.current.push({ mesh: flame, type: 'flame' });

        candlestick.position.set(cx, -0.65, 0);
        group.add(candlestick);
      });

      // 3. Braided golden Challah loaf on a wooden platter
      const board = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.08, 0.55),
        createToonMat(0x7c4d2b, 0.6, 0.05)
      );
      board.position.set(0, -1.02, 0.45);
      group.add(board);

      const challahGroup = new THREE.Group();
      for (let b = 0; b < 3; b++) {
        const braid = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 14, 14),
          createToonMat(0xd97706, 0.35, 0.05, 0xb45309, 0.2)
        );
        braid.scale.set(1.2, 0.8, 0.9);
        braid.position.set((b - 1) * 0.22, 0, 0);
        challahGroup.add(braid);
      }
      challahGroup.position.set(0, -0.92, 0.45);
      group.add(challahGroup);

      // 4. Hovering golden crown of Shabbat holiness
      const crown = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.045, 16, 64),
        new THREE.MeshBasicMaterial({ color: 0xffd700 })
      );
      crown.position.y = 0.65;
      group.add(crown);
      dynamicItemsRef.current.push({ mesh: crown, type: 'ring', speed: 0.012 });
    }
  }, []);

  // Initialize Three.js scene once on mount
  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const w = mount.clientWidth || 500;
    const h = mount.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 1.4, zoomTargetRef.current);
    camera.lookAt(0, 0.2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Procedural RoomEnvironment for realistic PBR reflections
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback ambient if PMREM not available
    }

    // Studio lighting rig
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-4, -2, -4);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x00f2fe, 2.2, 16);
    bottomGlow.position.set(0, -3.0, 1);
    scene.add(bottomGlow);

    // Root group for day model
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // Background stardust particles
    const pCount = 110;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 6.5;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x72efdd,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop with exponential damping
    let prevTime = performance.now();
    let tickCount = 0;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = Math.min((currentTime - prevTime) / 1000, 0.1);
      prevTime = currentTime;
      tickCount++;

      // Smooth rotation damping
      if (!isDraggingRef.current) {
        rotTargetRef.current.y += 0.008 + (magicBurst > 0 ? 0.04 : 0);
      }
      rotCurrentRef.current.x = THREE.MathUtils.damp(rotCurrentRef.current.x, rotTargetRef.current.x, 8, delta);
      rotCurrentRef.current.y = THREE.MathUtils.damp(rotCurrentRef.current.y, rotTargetRef.current.y, 8, delta);

      // Smooth zoom damping
      zoomCurrentRef.current = THREE.MathUtils.damp(zoomCurrentRef.current, zoomTargetRef.current, 8, delta);
      if (cameraRef.current) {
        cameraRef.current.position.z = zoomCurrentRef.current;
      }

      if (rootGroupRef.current) {
        rootGroupRef.current.rotation.x = rotCurrentRef.current.x;
        rootGroupRef.current.rotation.y = rotCurrentRef.current.y;
        rootGroupRef.current.position.y = Math.sin(tickCount * 0.04) * 0.09;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y -= 0.003;
      }

      // Dynamic item animations
      dynamicItemsRef.current.forEach((item, idx) => {
        if (item.type === 'orbit' && item.speed) {
          item.mesh.rotation.y += item.speed * (magicBurst > 0 ? 3.5 : 1);
        } else if (item.type === 'ring' && item.speed) {
          item.mesh.rotation.z += item.speed;
        } else if (item.type === 'flame') {
          const s = 1 + Math.sin(tickCount * 0.2 + idx) * 0.12 + (magicBurst > 0 ? 0.4 : 0);
          item.mesh.scale.set(s, 1 + Math.cos(tickCount * 0.25) * 0.16, s);
        } else if (item.type === 'pulse') {
          const p = 1 + Math.sin(tickCount * 0.1) * 0.1 + (magicBurst > 0 ? 0.3 : 0);
          item.mesh.scale.set(p, p, p);
          item.mesh.rotation.y += 0.02;
        } else if (item.type === 'rain' && item.speed) {
          item.mesh.position.y -= item.speed * (magicBurst > 0 ? 2.5 : 1);
          if (item.mesh.position.y < -1.1) item.mesh.position.y = 1.1;
        } else if (item.type === 'float' && item.offset !== undefined) {
          item.mesh.position.y = 1.15 + Math.sin(tickCount * 0.08 + item.offset) * 0.12;
        } else if (item.type === 'sway' && item.offset !== undefined) {
          item.mesh.rotation.z = Math.sin(tickCount * 0.08 + item.offset) * 0.2;
        }
      });

      renderer.render(scene, camera);
    };

    animate();
    buildDayModel(dayIndex);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      if (nw === 0 || nh === 0) return;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      clearRootGroup();
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [buildDayModel]);

  // Rebuild model when dayIndex changes
  useEffect(() => {
    buildDayModel(dayIndex);
  }, [dayIndex, buildDayModel]);

  // Mouse & Touch interaction handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: clientX, y: clientY };
    setIsInteracting(true);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - prevPointerRef.current.x;
    const dy = clientY - prevPointerRef.current.y;
    rotTargetRef.current.y += dx * 0.014;
    rotTargetRef.current.x = Math.max(-0.6, Math.min(0.65, rotTargetRef.current.x + dy * 0.01));
    prevPointerRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsInteracting(false);
  };

  const handleZoom = (inOut: 'in' | 'out') => {
    audioService.playClick();
    if (inOut === 'in') {
      zoomTargetRef.current = Math.max(4.5, zoomTargetRef.current - 0.8);
    } else {
      zoomTargetRef.current = Math.min(9.5, zoomTargetRef.current + 0.8);
    }
  };

  const handleResetView = () => {
    audioService.playClick();
    rotTargetRef.current = { x: 0.12, y: 0 };
    zoomTargetRef.current = 7.2;
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-3xl border-4 border-cyan-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_35px_rgba(0,242,254,0.35)] overflow-hidden group select-none">
      
      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        className={`absolute inset-0 w-full h-full z-20 ${
          isInteracting ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handlePointerUp}
      />

      {/* Hologram Lighting Cone & Rings */}
      <div className="holo-beam-cone" />
      <div className="holo-ring" />
      <div className="holo-scanlines" />

      {/* Top badges: Day label and 3D Model Name */}
      <div className="absolute top-3 right-3 z-30 bg-gradient-to-r from-amber-300 to-amber-400 text-amber-950 border-2 border-white font-bold px-3.5 py-1 rounded-2xl text-sm sm:text-base shadow-lg nikud-text">
        {dayBadge}
      </div>

      <div className="absolute top-3 left-3 z-30 bg-cyan-950/85 text-cyan-200 border border-cyan-400/80 font-bold px-3 py-1 rounded-2xl text-xs sm:text-sm shadow-lg flex items-center gap-1.5 backdrop-blur-md nikud-text">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
        <span>{holoTitle}</span>
      </div>

      {/* Bottom controls dock: Magic Burst + Zoom + Reset */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        <button
          onClick={onMagicClick}
          className="pointer-events-auto disney-btn bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="nikud-text">הַפְעֵל אֲלוּמַת קֶסֶם!</span>
        </button>

        <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/80 p-1 rounded-xl border border-cyan-400/50 backdrop-blur-md">
          <button
            onClick={() => handleZoom('in')}
            title="הִתְקָרֵב"
            className="p-1.5 text-cyan-200 hover:text-white rounded-lg hover:bg-cyan-800/50 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="הִתְרַחֵק"
            className="p-1.5 text-cyan-200 hover:text-white rounded-lg hover:bg-cyan-800/50 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="אִפּוּס מַבָּט"
            className="p-1.5 text-amber-300 hover:text-white rounded-lg hover:bg-amber-800/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
