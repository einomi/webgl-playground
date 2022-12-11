precision highp float;

uniform sampler2D tMap;
uniform float aspectRatio;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  float c = cos(0.0);
  float s = sin(0.0);

  vec2 center = vec2(0.5);

  vec2 textureCoord =
    (vUv - center) * mat2(aspectRatio * c, -aspectRatio * s, 1.0 * s, 1.0 * c);
  vec3 texture = texture2D(tMap, textureCoord + center).rgb;
  gl_FragColor = vec4(texture, 1.0);
}
