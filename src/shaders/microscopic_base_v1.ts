export const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const fragmentShaderSource = `
// MOBILE FIX: Check for high precision support, fallback to medium if unsupported
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_complexity;
  uniform float u_chaos;
  uniform float u_density;
  uniform float u_viscosity;
  uniform float u_crystallize;
  uniform float u_merge;
  uniform float u_speed;
  uniform float u_warpScale;
  uniform int u_style;
  
  // NEW: Custom Colors & Retro Rendering
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_pixelSize;

  #define MAX_COMPLEXITY 10

  // 4x4 Bayer Dither Matrix for parallel GPU rendering
  float getBayer(vec2 p) {
    vec2 grid = floor(mod(p, 4.0));
    float x = grid.x;
    float y = grid.y;
    // Approximating the Bayer threshold values mathematically
    float a = mod(x, 2.0);
    float b = mod(y, 2.0);
    float c = mod(floor(x / 2.0), 2.0);
    float d = mod(floor(y / 2.0), 2.0);
    return (a * 8.0 + b * 4.0 + c * 2.0 + d * 1.0) / 15.0;
  }

  void main() {
    // 1. Pixelation (UV Snapping)
    vec2 fragCoord = gl_FragCoord.xy;
    if (u_pixelSize > 1.0) {
      fragCoord = floor(fragCoord / u_pixelSize) * u_pixelSize;
    }

    vec2 st = fragCoord / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    vec2 X = st * 6.28318 * u_density;
    vec2 Y = st * 6.28318 * u_density;

    float noise_A = 0.0;
    float noise_B = 0.0;
    float t = u_time * u_speed;

    for(int i = 1; i <= MAX_COMPLEXITY; i++) {
      if(float(i) > u_complexity) break;
      float f1 = float(i);
      float f2 = (f1 * 2.0) - 1.0;
      
      float wave_A = sin(X.x * f1 + cos(Y.y * f2 + t));
      float wave_B = cos(Y.y * f1 + sin(X.x * f2 - t));
      
      float smooth_abs_A = sqrt(wave_A * wave_A + 0.05) * 2.0 - 1.0;
      float smooth_abs_B = sqrt(wave_B * wave_B + 0.05) * 2.0 - 1.0;
      
      wave_A = mix(wave_A, smooth_abs_A, u_crystallize);
      wave_B = mix(wave_B, smooth_abs_B, u_crystallize);

      noise_A += wave_A / f1;
      noise_B += wave_B / f1;
    }

    vec2 distorted_X = X + vec2(noise_A) * (u_chaos * 0.15);
    vec2 distorted_Y = Y + vec2(noise_B) * (u_chaos * 0.15);

    float blob_field = sin(distorted_X.x * u_warpScale) + cos(distorted_Y.y * u_warpScale);
    blob_field += noise_A * 1.5;
    blob_field = blob_field * 0.3 + 0.5;

    float center = mix(0.7, 0.3, u_merge); 
    float edge = mix(0.4, 0.01, u_viscosity);
    float quantum = smoothstep(center - edge, center + edge, blob_field);

    noise_A = noise_A * 0.5 + 0.5;
    vec3 color = vec3(0.0);

    // 2. Color Application
    if (u_style == 1) { 
      color = vec3(clamp(quantum * 1.3 - 0.15, 0.0, 1.0));
    } else if (u_style == 2) { 
      color = vec3((quantum * 0.4) + (noise_A * 0.3), abs(sin(quantum * 3.1415)) * 0.8 + (noise_A * 0.2), 0.05);
    } else if (u_style == 3) { 
      color = vec3(clamp(noise_A * 0.2, 0.0, 1.0), sin(quantum * 3.1415) * 0.55 + (noise_A * 0.35), sin(quantum * 3.1415 * 0.5) * 0.4 + 0.6);
    } else { 
      // CUSTOM NEON MIX
      float mix_R = clamp((sin(quantum * 6.283) * 0.5 + 0.5) * 1.3, 0.0, 1.0);
      float mix_G = clamp((abs(cos(noise_A * 9.424)) * 0.7 + (quantum * 0.3)) * 0.95, 0.0, 1.0);
      float mix_B = clamp((sin(quantum * 4.712 + noise_A * 3.1415) * 0.5 + 0.5) * 1.4, 0.0, 1.0);
      
      color = u_color1 * mix_R + u_color2 * mix_G + u_color3 * mix_B;
    }

    // 3. Ordered Dithering Application
    if (u_pixelSize > 1.0) {
      float ditherThreshold = getBayer(fragCoord / u_pixelSize) - 0.5;
      // Spread the dither mathematically across the color channels
      color += ditherThreshold * 0.4; 
      // Quantize to create the harsh 8-bit retro look
      color = floor(color * 4.0) / 3.0; 
    }

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;