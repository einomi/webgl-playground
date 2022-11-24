#define PI (3.1415926535897932384626433832795)

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;

// returns 1.0 when point pt is inside a rectangle
// defined by size and center
float inRect(vec2 pt, vec2 size, vec2 center) {
  vec2 squarePos = pt - center;
  float horz = step(-size.x, squarePos.x) - step(size.x, squarePos.x);
  float vert = step(-size.y, squarePos.y) - step(size.y, squarePos.y);
  return horz * vert;
}

mat2 getRotationMatrix(float theta) {
  float s = sin(theta);
  float c = cos(theta);
  return mat2(c, -s, s, c);
}

mat2 getScaleMatrix(float scale) {
  return mat2(scale, 0, 0, scale);
}

void main(void ) {
  mat2 rotationMatrix = getRotationMatrix(uTime);
  mat2 scaleMatrix = getScaleMatrix((sin(uTime) + 1.0) / 3.0 + 0.5);
  vec2 center1 = vec2(-3.0, 0.0);
  vec2 pt1 = rotationMatrix * scaleMatrix * (vPosition.xy - center1) + center1;
  mat2 rotationMatrix2 = getRotationMatrix(-uTime);
  vec2 center2 = vec2(3.0, -1.0);
  vec2 pt2 = rotationMatrix2 * (vPosition.xy - center2) + center2;
  vec3 square1 = vec3(1.0, 1.0, 0.0) * inRect(pt1, vec2(0.7), center1);
  vec3 square2 = vec3(0.0, 0.0, 1.0) * inRect(pt2, vec2(1.0), center2);
  gl_FragColor = vec4(square1 + square2, 1.0);
}
