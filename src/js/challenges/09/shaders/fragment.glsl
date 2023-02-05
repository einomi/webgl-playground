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
  // length of the vector
  float length = sqrt(
    v_position.x * v_position.x + v_position.y * v_position.y
  );

  vec3 color1 = vec3(1.0);
  float radius1 = 0.4;

  vec3 color2 = vec3(0.0, 1.0, 0.0);
  float radius2 = 0.3;

  float smoothVal = 0.01;

  vec3 result = vec3(0.0);

  if (length < radius2) {
    result = color2;
  } else if (length < radius1) {
    result = color1;
  }

  gl_FragColor = vec4(result, 1.0);
}
