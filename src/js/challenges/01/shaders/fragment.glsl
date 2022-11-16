#define PI (3.1415926535897932384626433832795)

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;

void main(void ) {
  //  vec3 color = vec3(vPosition.x, vPosition.y, 0.0);
  float strength = step(0.5, 1.0 - length(vPosition.xy));
  gl_FragColor = vec4(vec2(strength), 0.0, 1.0);
}
