import { Camera, Mesh, Plane, Program, Renderer, Transform } from 'ogl';

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

const geometry = new Plane(gl, {
  width: 100,
  height: 100,
});

const program = new Program(gl, {
  vertex: /* glsl */ `
            attribute vec3 position;

            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;

            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
  fragment: /* glsl */ `
            void main() {
                gl_FragColor = vec4(1.0);
            }
        `,
});

const mesh = new Mesh(gl, {
  geometry,
  program,
});
mesh.setParent(scene);

const update = () => {
  requestAnimationFrame(update);

  renderer.render({ scene, camera });
};
requestAnimationFrame(update);
