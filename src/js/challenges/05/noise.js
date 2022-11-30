import * as THREE from 'three';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector('canvas.webgl')
);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const clock = new THREE.Clock();

const geometry = new THREE.PlaneGeometry(2, 2);

// eslint-disable-next-line sonarjs/prefer-object-literal
const uniforms = {
  u_time: { value: 0.0 },
  u_resolution: { value: new THREE.Vector2() },
  u_LightColor: { value: new THREE.Color('#bb905d') },
  u_DarkColor: { value: new THREE.Color('#7d490b') },
  u_Frequency: { value: 2.0 },
  u_NoiseScale: { value: 6.0 },
  u_RingScale: { value: 0.6 },
  u_Contrast: { value: 4.0 },
  u_mouse: { value: { x: 0.0, y: 0.0 } },
};

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 1;

// onWindowResize();
if ('ontouchstart' in window) {
  document.addEventListener('touchmove', handleTouchMove);
} else {
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove);
}

/** @param {MouseEvent} event */
function handleMouseMove(event) {
  uniforms.u_mouse.value.x = event.clientX;
  uniforms.u_mouse.value.y = event.clientY;
}

/** @param {TouchEvent} event */
function handleTouchMove(event) {
  uniforms.u_mouse.value.x = event.touches[0].clientX;
  uniforms.u_mouse.value.y = event.touches[0].clientY;
}

animate();

function onWindowResize() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  let width, height;
  if (aspectRatio >= 1) {
    width = 1;
    height = (window.innerHeight / window.innerWidth) * width;
  } else {
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = window.innerWidth;
  uniforms.u_resolution.value.y = window.innerHeight;
}

function animate() {
  requestAnimationFrame(animate);
  uniforms.u_time.value += clock.getDelta();
  renderer.render(scene, camera);
}
