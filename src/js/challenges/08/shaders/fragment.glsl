precision highp float;

uniform sampler2D tMap;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 texture = texture2D(tMap, vUv).rgb;
  gl_FragColor = vec4(texture, 1.0);
}
