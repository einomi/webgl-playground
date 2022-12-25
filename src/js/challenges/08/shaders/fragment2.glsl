uniform sampler2D tMap; // the texture to be distorted
uniform vec2 uScale; // the scale factor for the texture
uniform float uTime; // the current time (used to animate the scaling and distortion)

varying vec2 vUv;

void main() {
  float uScale = 1.0;

  // Scale up the texture coordinates over time using the sine function
  float scale = uScale * (sin(uTime) + 1.0);

  // Wait for a short period of time before starting the distortion effect
  if (uTime < 1.0) {
    scale = 0.0;
  }

  vec2 center = vec2(0.5);
  vec2 texCoord = (vUv - center) * scale;

  // Calculate the distortion factor using the cosine function
  float distortion = 0.1 * cos(texCoord.x + uTime * 2.0);

  // Distort the texture coordinates using the distortion factor
  texCoord.y += distortion * 0.1;

  // Sample the texture at the distorted texture coordinates
  vec4 texColor = texture(tMap, texCoord + center);

  // Set the output color of the fragment
  gl_FragColor = texColor;
}
