import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import testVertexShader from '../shaders/test/vertex.glsl';
import testFragmentShader from '../shaders/test/fragment.glsl';

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector('canvas.webgl')
);

const scene = new THREE.Scene();

const light = new THREE.HemisphereLight(0xd6e6ff, 0xa38c08, 1);
scene.add(light);

// Geometry
const geometry = new THREE.PlaneGeometry(600, 600, 128, 128);

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
  },
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
// mesh.rotation.x = -0.03;
// mesh.rotation.y = -0.01;
// mesh.rotation.z = -0.03;
// mesh.position.x = -0.25;
mesh.position.z = 400;
scene.add(mesh);

const smokeTexture = new THREE.TextureLoader().load('/smoke.png');
// scene.background = smokeTexture;
smokeTexture.encoding = THREE.sRGBEncoding;
const smokeGeometry = new THREE.PlaneGeometry(300, 300);
const smokeMaterial = new THREE.MeshLambertMaterial({
  map: smokeTexture,
  emissive: 0x111,
  opacity: 0.1,
  transparent: true,
});

/** @type {THREE.Mesh[]} */
const smokeElements = [];

for (let smokeIndex = 0; smokeIndex < 70; smokeIndex += 1) {
  const smokeElement = new THREE.Mesh(smokeGeometry, smokeMaterial);
  const scale = Math.max(3, Math.random() * 9);
  smokeElement.scale.set(scale, scale, scale);
  smokeElement.position.set(
    Math.random() * 1800 - 900,
    Math.random() * 1800 - 900,
    Math.random() * 1000 - 500
  );
  smokeElement.rotation.z = Math.random() * 360;
  scene.add(smokeElement);
  smokeElements.push(smokeElement);
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1500
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1000;
// camera.position.set(0.25, - 0.25, 1)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();
let elapsedTime = 0;

scene.fog = new THREE.Fog(0xdfe9f3, 0.0, 500.0);

const tick = () => {
  // controls.update()
  window.requestAnimationFrame(tick);
  elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  // const scale = Math.sin(elapsedTime) * 0.05 + 1;
  // mesh.scale.x = scale;
  // mesh.scale.y = scale;

  smokeElements.forEach((smokeElement) => {
    smokeElement.rotation.z = elapsedTime * 0.12;
  });

  renderer.render(scene, camera);
};

tick();
