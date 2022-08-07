import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const star = textureLoader.load("./textures/particles/8.png");

// Particles
// Geometries
const particleGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random();
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  map: star,
  transparent: true,
  alphaMap: star,
});
particleMaterial.vertexColors = true;
particleMaterial.depthWrite = false;
// particleMaterial.alphaTest = 0.001
// particleMaterial.depthTest = false

// Points
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

function ConstructPlanet(
  scene,
  [radius, widthSegments = 32, heightSegments = 32],
  { size = 0.01, color }
) {
  const planet = new THREE.Points(
    new THREE.SphereGeometry(radius, widthSegments, heightSegments),
    new THREE.PointsMaterial({ size: size, color: color })
  );
  scene.add(planet);
  return planet;
}

const particleSun = ConstructPlanet(scene, [1, 64, 64], {
  color: "yellow",
});
const particleMercury = ConstructPlanet(scene, [0.3], {
  color: "orange",
});
const particleVenus = ConstructPlanet(scene, [0.45], {
  color: "orange",
});
const particleEarth = ConstructPlanet(scene, [0.5], {
  color: "green",
});
const particleMoon = ConstructPlanet(scene, [0.2], {
  color: "grey",
});
const particleMars = ConstructPlanet(scene, [0.4], {
  color: "red",
});
const particlePhobos = ConstructPlanet(scene, [0.125], {
  color: "grey",
});
const particleDeimos = ConstructPlanet(scene, [0.0625], {
  color: "grey",
});
const particleJupiter = ConstructPlanet(scene, [0.8], {
  color: "orange",
});
const particleSaturn = ConstructPlanet(scene, [0.7], {
  color: "orange",
});
const particleUranus = ConstructPlanet(scene, [0.7], {
  color: 0x8888ff,
});
const particleNeptune = ConstructPlanet(scene, [0.6], {
  color: 0x8888ff,
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(20, 20, 20);
camera.lookAt(particleSun);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

class SpaceObject {
  constructor(
    spaceObject,
    orbitSpeed,
    orbitRadius,
    rotationSpeed,
    parent = null,
    timeOffset = null
  ) {
    this.spaceObject = spaceObject;
    this.orbitSpeed = orbitSpeed;
    this.orbitRadius = orbitRadius;
    this.rotationSpeed = rotationSpeed;
    this.parent = parent;
    this.timeOffset = timeOffset ? timeOffset : Math.random() * 1000;
  }
}

const sun = new SpaceObject(particleSun, 0, 0, 0.1);
const mercury = new SpaceObject(particleMercury, 0.1, 2, 0.5, sun);
const venus = new SpaceObject(particleVenus, 0.05, 3.5, 0.25, sun);
const earth = new SpaceObject(particleEarth, 0.04, 6, 0.125, sun);
const moon = new SpaceObject(particleMoon, 0.15, 1, 0.12, earth);
const mars = new SpaceObject(particleMars, 0.035, 9, 0.0625, sun);
const phobos = new SpaceObject(particlePhobos, 0.3, 0.75, 0.12, mars);
const deimos = new SpaceObject(particleDeimos, 0.15, 1, 0.12, mars);
const jupiter = new SpaceObject(particleJupiter, 0.025, 12, 0.03125, sun);
const saturn = new SpaceObject(particleSaturn, 0.02, 14, 0.03125, sun);
const uranus = new SpaceObject(particleUranus, 0.015, 16, 0.3125, sun);
const neptune = new SpaceObject(particleNeptune, 0.01, 18, 0.03125, sun);

const planetArray = [
  sun,
  mercury,
  venus,
  earth,
  moon,
  mars,
  phobos,
  deimos,
  jupiter,
  saturn,
  uranus,
  neptune,
];

let timeMultiplier = {
  timeMultiplier: 1,
};
gui.add(timeMultiplier, "timeMultiplier").min(0).max(100).step(0.1);

let time = clock.getElapsedTime();

const tick = () => {
  time += clock.getDelta() * timeMultiplier.timeMultiplier;
  const elapsedTime = time;

  particles.rotation.y = elapsedTime * 0.001;

  for (const spaceObject of planetArray) {
    const eTime = elapsedTime + spaceObject.timeOffset;
    if (!spaceObject.parent) {
      spaceObject.spaceObject.rotation.y = eTime * spaceObject.rotationSpeed;
      spaceObject.spaceObject.position.x =
        Math.sin(eTime * spaceObject.orbitSpeed) * spaceObject.orbitRadius;
      spaceObject.spaceObject.position.z =
        Math.cos(eTime * spaceObject.orbitSpeed) * spaceObject.orbitRadius;
      continue;
    }

    spaceObject.spaceObject.rotation.y = eTime * spaceObject.rotationSpeed;

    spaceObject.spaceObject.position.x =
      spaceObject.parent.spaceObject.position.x +
      Math.sin(eTime * spaceObject.orbitSpeed) * spaceObject.orbitRadius;
    spaceObject.spaceObject.position.z =
      spaceObject.parent.spaceObject.position.z +
      Math.cos(eTime * spaceObject.orbitSpeed) * spaceObject.orbitRadius;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
