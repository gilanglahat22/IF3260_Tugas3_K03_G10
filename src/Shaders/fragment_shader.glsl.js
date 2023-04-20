const FRAGMENT_SHADER_FLAT = `
precision mediump float;
varying lowp vec3 basicColor;

void main(void) {
  gl_FragColor = vec4(basicColor, 1.0);
}
`;

const FRAGMENT_SHADER_LIGHT = `
precision highp float;

uniform sampler2D tex_norm;
uniform sampler2D tex_diffuse;
uniform sampler2D tex_depth;
uniform samplerCube u_texture;
uniform sampler2D uSampler;

varying highp vec2 vTextureCoord;

varying vec2 frag_uv;
varying vec3 ts_light_pos;
varying vec3 ts_view_pos;
varying vec3 ts_frag_pos;

uniform highp int tex_mode; // 0: no texture, 1: bump, 2: env

varying vec4 shadingColor;

// Passed in from the vertex shader.
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;

// The texture.
// uniform samplerCube u_texture;

// The position of the camera
uniform vec3 u_worldCameraPosition;

vec2 parallax_uv(vec2 uv, vec3 view_dir)
{
  float depth_scale = 0.01;
  float num_layers = 1.00;

  float layer_depth = 1.0 / num_layers;
  float cur_layer_depth = 0.0;
  vec2 delta_uv = view_dir.xy * depth_scale / (view_dir.z * num_layers);
  vec2 cur_uv = uv;

  float depth_from_tex = texture2D(tex_depth, cur_uv).r;

  for (int i = 0; i < 32; i++) {
      cur_layer_depth += layer_depth;
      cur_uv -= delta_uv;
      depth_from_tex = texture2D(tex_depth, cur_uv).r;
      if (depth_from_tex < cur_layer_depth) {
          break;
      }
  }

  // Parallax occlusion mapping
  vec2 prev_uv = cur_uv + delta_uv;
  float next = depth_from_tex - cur_layer_depth;
  float prev = texture2D(tex_depth, prev_uv).r - cur_layer_depth
                + layer_depth;
  float weight = next / (next - prev);
  return mix(cur_uv, prev_uv, weight);
}

void main(void)
{
    if (tex_mode == 0) {
      gl_FragColor = shadingColor;
    } else if (tex_mode == 1) {
      vec3 light_dir = normalize(ts_light_pos - ts_frag_pos);
      vec3 view_dir = normalize(ts_view_pos - ts_frag_pos);

      vec2 uv = parallax_uv(frag_uv, view_dir);

      vec3 albedo = texture2D(tex_diffuse, uv).rgb;
      // if (show_tex == 0) { albedo = vec3(1,1,1); }
      vec3 ambient = 0.3 * albedo;

      vec3 norm = normalize(texture2D(tex_norm, uv).rgb * 2.0 - 1.0);
      float diffuse = max(dot(light_dir, norm), 0.0);
      gl_FragColor = vec4(diffuse * albedo + ambient, 1.0);
    } else if (tex_mode == 2) {
      vec3 worldNormal = normalize(v_worldNormal);
      vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
      vec3 direction = reflect(eyeToSurfaceDir,worldNormal);

      gl_FragColor = textureCube(u_texture, direction);
    } else if (tex_mode == 3) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
}
`
