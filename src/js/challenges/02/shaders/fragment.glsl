#define PI (3.1415926535897932384626433832795)

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;

void main(void ) {
  vec2 size = vec2(1.0);
  vec2 center = vec2(3.0);
  vec2 squarePos = vPosition.xy - center;
  float horz = step(-size.x, squarePos.x) - step(size.x, squarePos.x);
  float vert = step(-size.y, squarePos.y) - step(size.y, squarePos.y);
  float result = horz * vert;
  gl_FragColor = vec4(vec3(1.0, 1.0, 0.0) * result, 1.0);
}
