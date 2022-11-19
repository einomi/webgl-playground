#define PI (3.1415926535897932384626433832795)

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;

void main(void ) {
  //  vec3 color = vec3(vPosition.x, vPosition.y, 0.0);
  float size = 2.0;
  float strengthX =
    step(-size, 1.0 - vPosition.x) + step(size, 1.0 - vPosition.x);
  float strengthY =
    step(-size, 1.0 - vPosition.y) + step(size, 1.0 - vPosition.y);
  gl_FragColor = vec4(vec2(strengthX * strengthY), 0.0, 1.0);
}
