import * as THREE from 'three';

import testVertexShader from '../shaders/test/vertex.glsl';
import testFragmentShader from '../shaders/test/fragment.glsl';

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector('canvas.webgl')
);

const scene = new THREE.Scene();

// Geometry
const geometry = new THREE.PlaneGeometry(4.5, 3.4, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
});

// const material = new THREE.MeshBasicMaterial()

// material.color = new THREE.Color('#444');

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -0.1;
mesh.rotation.y = -0.2;
mesh.position.x = -0.25;
scene.add(mesh);

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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1;
// camera.position.set(0.25, - 0.25, 1)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // controls.update()

  mesh.rotation.z = -0.2 * elapsedTime;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
