// @ts-nocheck
import * as THREE from 'three';

// import vertexShader from './shaders/vertex.glsl';
// import fragmentShader from './shaders/fragment.glsl';

const canvas = document.querySelector('[data-canvas]');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();

const cameraDistance = 600;
const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
camera.position.z = cameraDistance;

function textureFitCover(texture, aspect) {
  const imageAspect = texture.image.width / texture.image.height;

  if (aspect < imageAspect) {
    texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
  } else {
    texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
  }

  return texture;
}

/** @return {Object[]} */
function createImages() {
  const imgElements = /** @type {NodeListOf<HTMLElement> | null} */ (
    document.querySelectorAll('[data-image]')
  );

  const imgElementsResized = /** @type {NodeListOf<HTMLElement> | null} */ (
    document.querySelectorAll('[data-resized-image]')
  );

  if (!imgElements || !imgElementsResized) {
    return [];
  }

  // const shaderMaterial = new THREE.ShaderMaterial({
  //   vertexShader,
  //   fragmentShader,
  //   uniforms: {
  //     tMap: { value: 0 },
  //     uTime: { value: time },
  //   },
  // });

  const data = Array.from(imgElements).map((image, index) => {
    const imageResized = imgElementsResized[index];
    const bounds = imageResized.getBoundingClientRect();

    const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height, 1, 1);

    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    texture.matrixAutoUpdate = false;
    const textureCover = textureFitCover(
      texture,
      imageResized.offsetWidth / imageResized.offsetHeight
    );

    // const material = shaderMaterial.clone();
    const material = new THREE.MeshBasicMaterial({
      map: textureCover,
    });
    // material.uniforms.tMap.value = textureCover;

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    return {
      image: imageResized,
      mesh,
      texture: textureCover,
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
    };
  });

  imgElements.forEach((element) => (element.style.opacity = '0'));

  return data;
}

/** @param {Object[]} imagesData */
function setImagesPositions(imagesData) {
  imagesData.forEach(({ mesh, width, height, top, left }) => {
    mesh.position.x = -window.innerWidth / 2 + width / 2 + left;
    mesh.position.y = -window.innerHeight / 2 + height / 2 + top;
  });
}

let imagesData = [];

window.addEventListener('load', () => {
  imagesData = createImages();
  setImagesPositions(imagesData);
  resize();
});

function render() {
  renderer.render(scene, camera);
}

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov =
    2 * Math.atan(window.innerHeight / 2 / cameraDistance) * (180 / Math.PI);
  camera.updateProjectionMatrix();

  imagesData.forEach(({ texture }) => {
    textureFitCover(texture, 1 / 1.5);
  });
};
window.addEventListener('resize', resize, false);

// let time = 0;

const update = () => {
  // time += 0.001;

  requestAnimationFrame(update);

  // imagesData.forEach(({ mesh }) => {
  //   mesh.material.uniforms.uTime.value = time;
  // });

  render();
};
requestAnimationFrame(update);
