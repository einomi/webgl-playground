#define PI (3.14159265359)
#define PI2 (6.28318530718)

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;
uniform float u_duration;

varying vec2 v_uv;
varying vec3 v_position;

void main() {
  vec2 center = vec2(-0.105, -0.042);
  vec2 p = v_position.xy + center;
  float len = length(p);
  vec2 ripple = v_uv + p / len * 0.04 * cos(len * 20.0 - u_time * 4.0);
  float delta = sin(mod(u_time, u_duration) * (PI2 / u_duration) + 1.0) / 2.0;
  vec2 uv = mix(ripple, v_uv, delta);
  vec3 color = texture2D(u_texture, uv).ggg;

  gl_FragColor = vec4(color, 1.0);
}
