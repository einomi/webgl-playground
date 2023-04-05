import * as THREE from 'three';
import gsap from 'gsap';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector('canvas.webgl')
);

document.addEventListener('DOMContentLoaded', () => {
  const listItems = document.querySelectorAll('[data-list-item]');
  gsap.to(canvas, {
    duration: 1.5,
    autoAlpha: 1,
    ease: 'sine.out',
  });

  gsap.fromTo(
    listItems,
    {
      autoAlpha: 0,
      x: 20,
    },
    {
      duration: 1,
      autoAlpha: 1,
      x: 0,
      stagger: 0.15,
      ease: 'sine.out',
      delay: 0.3,
    }
  );
});

const loader = new THREE.TextureLoader();
const scene = new THREE.Scene();
// set perspective camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cameraDistance = 600;
camera.position.z = cameraDistance;
// set fov as in pixels
camera.fov =
  2 * Math.atan(window.innerHeight / 2 / cameraDistance) * (180 / Math.PI);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
// set device pixel ratio
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(window.innerWidth, window.innerHeight);

const clock = new THREE.Clock();

const geometry = new THREE.PlaneGeometry(
  window.innerWidth / 1.5,
  window.innerHeight + 100
);

// change position of plane to right side
geometry.translate(window.innerWidth / 5, 0, 0);

// eslint-disable-next-line sonarjs/prefer-object-literal
const uniforms = {
  u_texture: { value: loader.load('/menu.png') },
  u_time: { value: 0.0 },
  u_resolution: { value: new THREE.Vector2() },
  u_mouse: { value: { x: 0.0, y: 0.0 } },
  u_duration: { value: 8.0 },
};

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true,
  side: THREE.FrontSide,
  depthWrite: false,
});

// fix transparent invisible bug

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

onWindowResize();
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
