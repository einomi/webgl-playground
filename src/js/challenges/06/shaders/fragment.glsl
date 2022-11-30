#define PI (3.14159265359)
#define PI2 (6.28318530718)

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_LightColor;
uniform vec3 u_DarkColor;
uniform float u_Frequency;
uniform float u_NoiseScale;
uniform float u_RingScale;
uniform float u_Contrast;

varying vec2 v_uv;
varying vec3 v_position;

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289((x * 34.0 + 10.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// Classic Perlin noise
float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);

  vec4 norm = taylorInvSqrt(
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11))
  );
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Classic Perlin noise, periodic variant
float pnoise(vec2 P, vec2 rep) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);

  vec4 norm = taylorInvSqrt(
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11))
  );
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

float hash(float x, float y) {
  return fract(abs(sin(sin(123.321 + x) * (y + 321.123)) * 456.654));
}

float lerp(float a, float b, float t) {
  return a * (1.0 - t) + b * t;
}

float perlin(float x, float y) {
  float col = 0.0;
  for (int i = 0; i < 8; i++) {
    float fx = floor(x);
    float fy = floor(y);
    float cx = ceil(x);
    float cy = ceil(y);
    float a = hash(fx, fy);
    float b = hash(fx, cy);
    float c = hash(cx, fy);
    float d = hash(cx, cy);
    col += lerp(lerp(a, b, fract(y)), lerp(c, d, fract(y)), fract(x));
    col /= 2.0;
    x /= 2.0;
    y /= 2.0;
  }
  return col;
}

void main() {
  vec2 p = v_position.xy;
  float scale = 400.0;
  vec3 color;
  bool marble = true;

  p *= scale;

  if (marble) {
    float d = perlin(p.x, p.y) * scale;
    float u = p.x + d;
    float v = p.y + d;
    d = perlin(u, v) * scale;
    float noise = perlin(p.x + d, p.y + d);
    color = vec3(
      0.6 *
        (vec3(2.0 * noise) -
          vec3(
            noise * 0.1,
            noise * 0.2 - sin(u / 30.0) * 0.1,
            noise * 0.3 + sin(v / 40.0) * 0.2
          ))
    );
  } else {
    color = vec3(perlin(p.x, p.y));
  }
  gl_FragColor = vec4(color, 1.0);
}
