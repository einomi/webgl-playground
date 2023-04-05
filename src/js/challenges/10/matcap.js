import * as THREE from 'three';

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector('canvas.webgl')
);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere geometry
const geometry = new THREE.SphereGeometry(2, 32, 32);

const matcap = new THREE.TextureLoader().load('/matcap.png');

// Create a MeshMatcapMaterial
const material = new THREE.MeshMatcapMaterial({
  color: 0xffffff, // set the color of the material
  matcap, // load the matcap texture
});

// meshbasicmaterial
// const material = new THREE.MeshBasicMaterial({
//   color: 0xffffff, // set the color of the material
//   // map: matcap, // load the matcap texture
// });

// Create a mesh using the sphere geometry and the MeshMatcapMaterial
const mesh = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(mesh);

// Position the camera and render the scene
camera.position.z = 5;
renderer.render(scene, camera);
