attribute vec2 uv;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;

varying vec2 vUv;
varying float vNoise;

void main() {
  vUv = uv;

  float dist = distance(uv, vec2(0.5, 0.5));

  vec3 newPosition = position;
  newPosition.z += 10.0 * 10.0 * sin(dist * 10.0 + uTime * 10.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}