uniform float uTime;
uniform float aspectRatio;
uniform vec2 hover;
uniform float hoverState;

varying vec2 vUv;
varying float vNoise;

void main() {
  vUv = uv;

  float dist = distance(uv, hover);

  vec3 newPosition = position;
  newPosition.z += hoverState * 10.0 * sin(dist * 10.0 + uTime);

  vNoise = hoverState * sin(dist * 10.0 - uTime * 10.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
