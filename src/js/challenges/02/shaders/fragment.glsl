#define PI (3.1415926535897932384626433832795)

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;

// returns 1.0 when point pt is inside a rectangle
// defined by size and center
float inRect(vec2 size, vec2 center) {
  vec2 squarePos = vPosition.xy - center;
  float horz = step(-size.x, squarePos.x) - step(size.x, squarePos.x);
  float vert = step(-size.y, squarePos.y) - step(size.y, squarePos.y);
  return horz * vert;
}

void main(void ) {
  vec3 square1 = vec3(1.0, 1.0, 0.0) * inRect(vec2(0.7), vec2(-2.0, 0.0));
  vec3 square2 = vec3(0.0, 0.0, 1.0) * inRect(vec2(1.0), vec2(3.0, -1.0));
  gl_FragColor = vec4(square1 + square2, 1.0);
}
