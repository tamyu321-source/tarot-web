import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Locale, ReadingSlot, SpreadDefinition, TarotCard } from '../types';

interface TarotSceneProps {
  activeIndex: number | null;
  language: Locale;
  onDraw: () => void;
  reading: ReadingSlot[];
  spread: SpreadDefinition;
  onReveal: (index: number) => void;
}

interface InteractiveCard {
  group: THREE.Group;
  mesh: THREE.Mesh;
  slotIndex: number;
  card: TarotCard;
  drawn: boolean;
  reversed: boolean;
  revealed: boolean;
  targetDraw: number;
  currentDraw: number;
  targetFlip: number;
  currentFlip: number;
  baseX: number;
  baseZ: number;
  baseRotation: number;
  createdAt: number;
  drawnAt: number;
  burstAt: number;
  frontTexture: THREE.CanvasTexture;
  backTexture: THREE.CanvasTexture;
}

const cardWidth = 1.22;
const cardHeight = 1.86;
const cardDepth = 0.045;
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export default function TarotScene({
  activeIndex,
  language,
  onDraw,
  reading,
  spread,
  onReveal,
}: TarotSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SceneController | null>(null);
  const drawRef = useRef(onDraw);
  const revealRef = useRef(onReveal);

  drawRef.current = onDraw;
  revealRef.current = onReveal;

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const controller = new SceneController(
      mountRef.current,
      () => drawRef.current(),
      (index) => {
        revealRef.current(index);
      },
    );

    controllerRef.current = controller;
    controller.setState({ activeIndex, language, reading, spread });
    controller.start();

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setState({ activeIndex, language, reading, spread });
  }, [activeIndex, language, reading, spread]);

  return <div ref={mountRef} className="tarot-scene" aria-hidden="true" />;
}

class SceneController {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  private readonly renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  private readonly clock = new THREE.Clock();
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2(99, 99);
  private readonly deckGroup = new THREE.Group();
  private readonly deckPortal = new THREE.Group();
  private readonly cardsGroup = new THREE.Group();
  private readonly haloGroup = new THREE.Group();
  private readonly deckPortalMaterials: THREE.MeshBasicMaterial[] = [];
  private readonly interactiveCards: InteractiveCard[] = [];
  private readonly backTexture = createBackTexture('zh-TW');
  private readonly particleMaterial = new THREE.PointsMaterial({
    color: '#f2c66d',
    transparent: true,
    opacity: 0.48,
    size: 0.035,
    depthWrite: false,
  });
  private animationId = 0;
  private hoverIndex: number | null = null;
  private deckHovered = false;
  private canDraw = false;
  private disposed = false;
  private stateKey = '';
  private language: Locale = 'zh-TW';
  private activeIndex: number | null = null;

  constructor(
    private readonly mount: HTMLDivElement,
    private readonly onDraw: () => void,
    private readonly onReveal: (index: number) => void,
  ) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.mount.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 6.7, 7.8);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new THREE.AmbientLight('#f5e9cf', 1.15));

    const leftLight = new THREE.PointLight('#72d6bd', 2.2, 12);
    leftLight.position.set(-4, 4.2, 3);
    this.scene.add(leftLight);

    const rightLight = new THREE.PointLight('#f17f9c', 2, 12);
    rightLight.position.set(4, 3.6, -2);
    this.scene.add(rightLight);

    const topLight = new THREE.DirectionalLight('#fff2cf', 2.1);
    topLight.position.set(0, 7, 5);
    this.scene.add(topLight);

    this.createTable();
    this.createParticles();
    this.createDeck();
    this.scene.add(this.deckPortal, this.deckGroup, this.cardsGroup, this.haloGroup);

    window.addEventListener('resize', this.resize);
    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove);
    this.renderer.domElement.addEventListener('pointerleave', this.handlePointerLeave);
    this.renderer.domElement.addEventListener('click', this.handleClick);

    this.resize();
  }

  start() {
    this.clock.start();
    this.animate();
  }

  setState({
    activeIndex,
    language,
    reading,
    spread,
  }: {
    activeIndex: number | null;
    language: Locale;
    reading: ReadingSlot[];
    spread: SpreadDefinition;
  }) {
    this.activeIndex = activeIndex;
    const nextKey = [
      language,
      spread.id,
      reading.map((slot) => `${slot.card.id}:${slot.reversed}`).join('|'),
    ].join('::');

    if (nextKey !== this.stateKey) {
      this.language = language;
      this.stateKey = nextKey;
      this.rebuildCards(reading, spread, language);
    }

    reading.forEach((slot, index) => {
      const interactive = this.interactiveCards[index];
      if (!interactive) {
        return;
      }

      if (slot.drawn && !interactive.drawn) {
        interactive.drawn = true;
        interactive.targetDraw = 1;
        interactive.drawnAt = this.clock.getElapsedTime();
        interactive.currentDraw = 0.001;
      }

      if (slot.revealed && !interactive.revealed) {
        interactive.burstAt = this.clock.getElapsedTime();
      }

      interactive.revealed = slot.revealed;
      interactive.targetFlip = slot.revealed ? 1 : 0;
    });

    this.canDraw =
      reading.some((slot) => !slot.drawn) && !reading.some((slot) => slot.drawn && !slot.revealed);
    this.deckGroup.visible = reading.length === 0 || this.canDraw;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
    this.renderer.domElement.removeEventListener('pointermove', this.handlePointerMove);
    this.renderer.domElement.removeEventListener('pointerleave', this.handlePointerLeave);
    this.renderer.domElement.removeEventListener('click', this.handleClick);
    this.interactiveCards.forEach((card) => {
      card.frontTexture.dispose();
      card.backTexture.dispose();
    });
    this.deckPortalMaterials.forEach((material) => material.dispose());
    this.backTexture.dispose();
    this.particleMaterial.dispose();
    this.renderer.dispose();
    this.mount.removeChild(this.renderer.domElement);
  }

  private readonly resize = () => {
    const { clientWidth, clientHeight } = this.mount;
    const width = Math.max(clientWidth, 1);
    const height = Math.max(clientHeight, 1);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  private readonly handlePointerMove = (event: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  private readonly handlePointerLeave = () => {
    this.pointer.set(99, 99);
    this.hoverIndex = null;
    this.renderer.domElement.style.cursor = 'default';
  };

  private readonly handleClick = () => {
    if (this.deckHovered && this.canDraw) {
      this.onDraw();
      return;
    }

    if (this.hoverIndex === null) {
      return;
    }

    const interactive = this.interactiveCards[this.hoverIndex];
    if (interactive && interactive.drawn && !interactive.revealed) {
      this.onReveal(interactive.slotIndex);
    }
  };

  private animate = () => {
    if (this.disposed) {
      return;
    }

    const elapsed = this.clock.getElapsedTime();
    this.updateRaycast();
    this.updateDeck(elapsed);
    this.updateCards(elapsed);
    this.updateHalos(elapsed);
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate);
  };

  private createTable() {
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(4.6, 4.85, 0.08, 96),
      new THREE.MeshStandardMaterial({
        color: '#1b1718',
        roughness: 0.72,
        metalness: 0.12,
      }),
    );
    table.position.y = -0.06;
    this.scene.add(table);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.08, 0.012, 10, 160),
      new THREE.MeshBasicMaterial({
        color: '#f2c66d',
        transparent: true,
        opacity: 0.38,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.015;
    this.scene.add(ring);

    const innerRing = ring.clone();
    innerRing.scale.setScalar(0.62);
    innerRing.material = new THREE.MeshBasicMaterial({
      color: '#72d6bd',
      transparent: true,
      opacity: 0.28,
    });
    this.scene.add(innerRing);
  }

  private createParticles() {
    const vertices: number[] = [];

    for (let index = 0; index < 180; index += 1) {
      const radius = 2.2 + Math.random() * 2.45;
      const angle = Math.random() * Math.PI * 2;
      vertices.push(Math.cos(angle) * radius, 0.08 + Math.random() * 1.1, Math.sin(angle) * radius);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const particles = new THREE.Points(geometry, this.particleMaterial);
    particles.name = 'arcana-particles';
    this.scene.add(particles);
  }

  private createDeck() {
    for (let index = 0; index < 3; index += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: index === 0 ? '#f2c66d' : index === 1 ? '#72d6bd' : '#e16f93',
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.84 + index * 0.18, 0.012, 10, 96), material);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.08 + index * 0.01;
      ring.userData.deckPortal = true;
      this.deckPortal.add(ring);
      this.deckPortalMaterials.push(material);
    }

    for (let index = 0; index < 30; index += 1) {
      const mesh = this.createCardMesh({
        frontTexture: this.backTexture,
        backTexture: this.backTexture,
      });
      mesh.position.set((index - 15) * 0.004, index * 0.012, 0);
      mesh.rotation.z = (index - 15) * 0.008;
      mesh.userData.deckCard = true;
      this.deckGroup.add(mesh);
    }

    this.deckGroup.position.set(0, 0.12, 0);
    this.deckGroup.rotation.z = -0.12;
  }

  private rebuildCards(reading: ReadingSlot[], spread: SpreadDefinition, language: Locale) {
    this.clearCards();

    reading.forEach((slot, index) => {
      const spreadSlot = spread.slots[index];
      const frontTexture = createFrontTexture(slot.card, language, slot.reversed);
      const backTexture = createBackTexture(language);
      const mesh = this.createCardMesh({ frontTexture, backTexture });
      const group = new THREE.Group();
      group.add(mesh);
      group.position.set(0, 0.16, 0);
      group.visible = slot.drawn;
      group.rotation.y = -0.4 + index * 0.08;
      group.rotation.z = spreadSlot.rotation;
      this.cardsGroup.add(group);

      this.interactiveCards.push({
        group,
        mesh,
        slotIndex: index,
        card: slot.card,
        drawn: slot.drawn,
        reversed: slot.reversed,
        revealed: slot.revealed,
        targetDraw: slot.drawn ? 1 : 0,
        currentDraw: slot.drawn ? 1 : 0,
        targetFlip: slot.revealed ? 1 : 0,
        currentFlip: slot.revealed ? 1 : 0,
        baseX: spreadSlot.x,
        baseZ: spreadSlot.z,
        baseRotation: spreadSlot.rotation,
        createdAt: this.clock.getElapsedTime() + index * 0.12,
        drawnAt: slot.drawn ? this.clock.getElapsedTime() : Number.POSITIVE_INFINITY,
        burstAt: Number.NEGATIVE_INFINITY,
        frontTexture,
        backTexture,
      });

      this.createHalo(index, slot.card.palette);
    });
  }

  private clearCards() {
    this.interactiveCards.forEach((card) => {
      card.frontTexture.dispose();
      card.backTexture.dispose();
    });

    this.interactiveCards.length = 0;
    this.cardsGroup.clear();
    this.haloGroup.clear();
  }

  private createHalo(index: number, palette: [string, string, string]) {
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.98, 1.12, 64),
      new THREE.MeshBasicMaterial({
        color: palette[index % 2],
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    halo.rotation.x = Math.PI / 2;
    halo.userData.slotIndex = index;
    this.haloGroup.add(halo);
  }

  private createCardMesh({
    frontTexture,
    backTexture,
  }: {
    frontTexture: THREE.Texture;
    backTexture: THREE.Texture;
  }) {
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: '#34251e',
      roughness: 0.62,
      metalness: 0.18,
    });
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.55,
      metalness: 0.05,
    });
    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.5,
      metalness: 0.08,
    });

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(cardWidth, cardDepth, cardHeight), [
      edgeMaterial,
      edgeMaterial,
      backMaterial,
      frontMaterial,
      edgeMaterial,
      edgeMaterial,
    ]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private updateDeck(elapsed: number) {
    const drawPulse = this.canDraw ? 1 : 0;
    const hoverPulse = this.deckHovered && this.canDraw ? 1 : 0;
    this.deckGroup.rotation.y = Math.sin(elapsed * 0.7) * (0.16 + drawPulse * 0.08);
    this.deckGroup.rotation.z = -0.12 + Math.sin(elapsed * 1.4) * (0.035 + hoverPulse * 0.025);
    this.deckGroup.position.y = 0.16 + Math.sin(elapsed * 1.1) * (0.04 + drawPulse * 0.025) + hoverPulse * 0.08;
    const deckScale = 1 + hoverPulse * 0.055 + Math.sin(elapsed * 3.5) * drawPulse * 0.012;
    this.deckGroup.scale.setScalar(deckScale);

    this.deckGroup.children.forEach((child, index) => {
      const topFan = this.canDraw ? Math.max(0, index - 22) * 0.004 : 0;
      child.rotation.y = Math.sin(elapsed * 2.2 + index * 0.3) * (0.035 + drawPulse * 0.02);
      child.position.x = (index - 15) * 0.004 + Math.sin(elapsed * 1.8 + index) * (0.012 + topFan);
    });

    this.deckPortal.visible = this.deckGroup.visible;
    this.deckPortal.children.forEach((child, index) => {
      child.rotation.z = elapsed * (0.8 + index * 0.22) * (index % 2 ? -1 : 1);
      child.scale.setScalar(1 + Math.sin(elapsed * 3 + index) * 0.08 + hoverPulse * 0.08);
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity += ((this.canDraw ? 0.19 + hoverPulse * 0.12 : 0.05) - material.opacity) * 0.08;
    });
  }

  private updateCards(elapsed: number) {
    this.interactiveCards.forEach((interactive, index) => {
      if (!interactive.drawn && interactive.currentDraw <= 0.001) {
        interactive.group.visible = false;
        return;
      }

      interactive.group.visible = true;
      const drawProgress = easeOutCubic(clamp01((elapsed - interactive.drawnAt) / 0.95));
      interactive.currentDraw = Math.max(interactive.currentDraw, drawProgress);
      const deal = interactive.currentDraw;
      const hover = this.hoverIndex === index && !interactive.revealed ? 1 : 0;
      const active = this.activeIndex === index ? 1 : 0;
      interactive.currentFlip += (interactive.targetFlip - interactive.currentFlip) * 0.105;

      const arc = Math.sin(deal * Math.PI);
      const drift = Math.sin(elapsed * 1.6 + index * 1.7) * 0.035;
      const packPop = clamp01((elapsed - interactive.drawnAt) / 0.28);
      const x = interactive.baseX * deal + Math.sin(index * 2.1 + elapsed * 6) * (1 - deal) * 0.18;
      const z = interactive.baseZ * deal + Math.cos(index * 1.7 + elapsed * 5) * (1 - deal) * 0.18;
      const y =
        0.13 +
        arc * 2.05 +
        hover * 0.18 +
        active * 0.1 +
        drift * deal +
        Math.sin(packPop * Math.PI) * 0.75 * (1 - deal);

      interactive.group.position.set(x, y, z);
      interactive.group.rotation.x = interactive.currentFlip * Math.PI;
      interactive.group.rotation.y = (1 - deal) * (Math.PI * 3.3 + index * 0.34);
      interactive.group.rotation.z =
        interactive.baseRotation * deal +
        (1 - deal) * (index * 0.8 + Math.sin(elapsed * 7 + index) * 0.55) +
        Math.sin(elapsed * 2.4 + index) * 0.012 * deal;

      const burst = Math.max(0, 1 - (elapsed - interactive.burstAt) / 0.75);
      const meshScale = 1 + hover * 0.035 + active * 0.025 + burst * 0.08 + Math.sin(packPop * Math.PI) * 0.12;
      interactive.mesh.scale.set(meshScale, meshScale, meshScale);
    });
  }

  private updateHalos(elapsed: number) {
    this.haloGroup.children.forEach((child, index) => {
      const interactive = this.interactiveCards[index];
      if (!interactive) {
        return;
      }

      child.position.set(interactive.baseX, 0.035, interactive.baseZ);
      child.rotation.z = elapsed * 0.18 + index;
      const drawGlow = interactive.drawn ? 1 : 0;
      const burst = Math.max(0, 1 - (elapsed - interactive.burstAt) / 0.75);
      child.scale.setScalar(1 + Math.sin(elapsed * 1.4 + index) * 0.035 + burst * 0.22);

      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      const isLit = interactive.revealed || this.hoverIndex === index || this.activeIndex === index;
      material.opacity += ((drawGlow ? (isLit ? 0.28 : 0.08) + burst * 0.36 : 0) - material.opacity) * 0.08;
    });
  }

  private updateRaycast() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = this.interactiveCards
      .filter((card) => card.drawn)
      .map((card) => card.mesh);
    const intersections = this.raycaster.intersectObjects(meshes, false);
    const hit = intersections[0]?.object;

    const deckIntersections = this.deckGroup.visible
      ? this.raycaster.intersectObjects(this.deckGroup.children, false)
      : [];

    if (!hit && deckIntersections.length === 0) {
      this.hoverIndex = null;
      this.deckHovered = false;
      this.renderer.domElement.style.cursor = 'default';
      return;
    }

    if (
      deckIntersections.length > 0 &&
      this.canDraw &&
      (!hit || deckIntersections[0].distance < intersections[0].distance)
    ) {
      this.hoverIndex = null;
      this.deckHovered = true;
      this.renderer.domElement.style.cursor = 'pointer';
      return;
    }

    this.deckHovered = false;
    const nextIndex = this.interactiveCards.findIndex((card) => card.mesh === hit);
    this.hoverIndex = nextIndex >= 0 ? nextIndex : null;
    const interactive = this.hoverIndex === null ? null : this.interactiveCards[this.hoverIndex];
    this.renderer.domElement.style.cursor =
      interactive && interactive.drawn && !interactive.revealed ? 'pointer' : 'default';
  }
}

function createBackTexture(language: Locale) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas rendering context is unavailable.');
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#141119');
  gradient.addColorStop(0.38, '#26312a');
  gradient.addColorStop(0.72, '#33202a');
  gradient.addColorStop(1, '#19171d');
  ctx.fillStyle = gradient;
  drawRoundRect(ctx, 16, 16, 480, 736, 36);
  ctx.fill();

  ctx.strokeStyle = '#f2c66d';
  ctx.lineWidth = 8;
  drawRoundRect(ctx, 34, 34, 444, 700, 28);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(114, 214, 189, 0.86)';
  ctx.lineWidth = 2;
  for (let index = 0; index < 7; index += 1) {
    ctx.beginPath();
    ctx.ellipse(256, 384, 60 + index * 22, 146 - index * 8, index * 0.35, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#f2c66d';
  ctx.font = '700 58px Inter, "Noto Sans TC", "Noto Sans JP", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AK', 256, 385);

  ctx.font = '600 24px Inter, "Noto Sans TC", "Noto Sans JP", sans-serif';
  ctx.fillText(language === 'ja' ? 'タロット' : language === 'en' ? 'TAROT' : '塔羅', 256, 438);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFrontTexture(card: TarotCard, language: Locale, reversed: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas rendering context is unavailable.');
  }

  const [primary, secondary, dark] = card.palette;
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, primary);
  gradient.addColorStop(0.48, secondary);
  gradient.addColorStop(1, dark);
  ctx.fillStyle = gradient;
  drawRoundRect(ctx, 16, 16, 480, 736, 36);
  ctx.fill();

  ctx.fillStyle = 'rgba(20, 17, 20, 0.72)';
  drawRoundRect(ctx, 38, 38, 436, 692, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 238, 190, 0.92)';
  ctx.lineWidth = 6;
  drawRoundRect(ctx, 46, 46, 420, 676, 20);
  ctx.stroke();

  ctx.save();
  ctx.translate(256, 316);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  for (let index = 0; index < 9; index += 1) {
    ctx.rotate(Math.PI / 9);
    ctx.beginPath();
    ctx.ellipse(0, 0, 54 + index * 11, 142 - index * 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 248, 219, 0.95)';
  ctx.font = '700 92px Inter, "Noto Sans TC", "Noto Sans JP", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.glyph, 256, 326);

  ctx.font = '700 34px Inter, "Noto Sans TC", "Noto Sans JP", sans-serif';
  wrapText(ctx, card.names[language], 256, 104, 340, 40);

  ctx.font = '600 22px Inter, "Noto Sans TC", "Noto Sans JP", sans-serif';
  ctx.fillStyle = reversed ? '#ffb0c0' : '#bdeedd';
  ctx.fillText(reversed ? orientationLabel(language, true) : orientationLabel(language, false), 256, 164);

  ctx.fillStyle = 'rgba(255, 248, 219, 0.92)';
  ctx.font = '600 24px Inter, "Noto Sans TC", "Noto Sans JP", sans-serif';
  wrapText(ctx, card.keywords[language].join(' · '), 256, 516, 360, 32);

  ctx.globalAlpha = 0.72;
  ctx.fillStyle = secondary;
  ctx.beginPath();
  ctx.arc(108, 634, 22, 0, Math.PI * 2);
  ctx.arc(404, 634, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function orientationLabel(language: Locale, reversed: boolean) {
  if (language === 'en') {
    return reversed ? 'Reversed' : 'Upright';
  }

  if (language === 'ja') {
    return reversed ? '逆位置' : '正位置';
  }

  return reversed ? '逆位' : '正位';
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.includes(' ') ? text.split(' ') : Array.from(text);
  let line = '';
  let lineIndex = 0;

  words.forEach((word, index) => {
    const spacer = text.includes(' ') && line ? ' ' : '';
    const testLine = `${line}${spacer}${word}`;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && index > 0) {
      ctx.fillText(line, x, y + lineIndex * lineHeight);
      line = word;
      lineIndex += 1;
      return;
    }

    line = testLine;
  });

  ctx.fillText(line, x, y + lineIndex * lineHeight);
}
