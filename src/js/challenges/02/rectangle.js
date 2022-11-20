import * as THREE from 'three';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector('canvas.webgl')
);

const scene = new THREE.Scene();

const light = new THREE.HemisphereLight(0xd6e6ff, 0xa38c08, 1);
scene.add(light);

// Geometry
const geometry = new THREE.PlaneGeometry(20, 20);

// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
  },
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.position.z = 1;
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1500
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 8;
// camera.position.set(0.25, - 0.25, 1)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);

const tick = () => {
  window.requestAnimationFrame(tick);

  renderer.render(scene, camera);
};

tick();
