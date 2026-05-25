import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/OrbitControls.js";

import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/postprocessing/RenderPass.js";

import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/postprocessing/UnrealBloomPass.js";

// ============================================
// CANVAS
// ============================================

const canvas = document.querySelector("#webgl");

// ============================================
// SCENE
// ============================================

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x000000, 0.00015);

// ============================================
// CAMERA
// ============================================

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000,
);

camera.position.set(0, 60, 180);

scene.add(camera);

// ============================================
// RENDERER
// ============================================

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ============================================
// CONTROLS
const planets = [];
