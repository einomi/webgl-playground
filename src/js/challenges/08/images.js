// @ts-nocheck
import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from 'ogl';

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

const containerElement = document.querySelector('[data-container]');

const renderer = new Renderer();
const gl = renderer.gl;
containerElement?.appendChild(gl.canvas);
gl.canvas.classList.add('canvas-image-grid');

gl.clearColor(0, 0, 0, 1);

const cameraDistance = 600;

const camera = new Camera(gl, { fov: 35, near: 0.01, far: 1000 });
camera.position.set(0, 0, cameraDistance);

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.perspective({
    aspect: gl.canvas.width / gl.canvas.height,
    fov:
      2 * Math.atan(window.innerHeight / 2 / cameraDistance) * (180 / Math.PI),
  });
};
window.addEventListener('resize', resize, false);
resize();

const scene = new Transform();

let time = 0;

/** @return {Object[]} */
function createImages() {
  const imgElements = /** @type {NodeListOf<HTMLElement> | null} */ (
    document.querySelectorAll('[data-image]')
  );

  if (!imgElements) {
    return [];
  }

  return Array.from(imgElements).map((image) => {
    const bounds = image.getBoundingClientRect();

    const geometry = new Plane(gl, {
      width: bounds.width,
      height: bounds.height,
    });

    const texture = new Texture(gl);
    texture.image = image;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: texture },
        uTime: { value: time },
      },
    });

    const mesh = new Mesh(gl, {
      geometry,
      program,
    });

    mesh.setParent(scene);

    return {
      image,
      mesh,
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
    };
  });
}

/** @param {Object[]} imagesData */
function setImagesPositions(imagesData) {
  imagesData.forEach(({ mesh, width, height, top, left }) => {
    mesh.position.x = -gl.canvas.width / 2 + width / 2 + left;
    mesh.position.y = -gl.canvas.height / 2 + height / 2 + top;
    // console.log('left', left);
  });
}

let imagesData = [];

window.addEventListener('load', () => {
  imagesData = createImages();
  setImagesPositions(imagesData);
});

function render() {
  renderer.render({ scene, camera });
}

const update = () => {
  time += 0.001;

  requestAnimationFrame(update);

  imagesData.forEach(({ mesh }) => {
    mesh.program.uniforms.uTime.value = time;
  });

  render();
};
requestAnimationFrame(update);
