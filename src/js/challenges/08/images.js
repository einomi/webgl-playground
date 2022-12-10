import { Renderer, Camera, Transform, Box, WireMesh, Vec3 } from 'ogl';

const containerElement = document.querySelector('[data-container]');

const renderer = new Renderer();
const gl = renderer.gl;
containerElement?.appendChild(gl.canvas);
gl.canvas.classList.add('canvas-image-grid');

const camera = new Camera(gl);
camera.position.z = 4;

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.perspective({
    aspect: gl.canvas.width / gl.canvas.height,
  });
};
window.addEventListener('resize', resize, false);
resize();

const scene = new Transform();

const geometry = new Box(gl);

// const program = new Program(gl, {
//   vertex: /* glsl */ `
//             attribute vec3 position;
//
//             uniform mat4 modelViewMatrix;
//             uniform mat4 projectionMatrix;
//
//             void main() {
//                 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//             }
//         `,
//   fragment: /* glsl */ `
//             void main() {
//                 gl_FragColor = vec4(0.2);
//             }
//         `,
// });

const mesh = new WireMesh(gl, {
  geometry,
  wireColor: new Vec3(1, 0.75, 0),
});
mesh.setParent(scene);

const update = () => {
  requestAnimationFrame(update);

  mesh.rotation.y -= 0.01;
  mesh.rotation.x += 0.007;
  renderer.render({ scene, camera });
};
requestAnimationFrame(update);
