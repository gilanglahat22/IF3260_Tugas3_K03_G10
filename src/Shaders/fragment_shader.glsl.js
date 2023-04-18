const FRAGMENT_SHADER_LIGHT = `
precision mediump float;

varying vec4 shadingColor;
void main() {
  gl_FragColor = shadingColor;
}
`;

const FRAGMENT_SHADER_FLAT = `
precision mediump float;
varying lowp vec3 basicColor;

void main(void) {
  gl_FragColor = vec4(basicColor, 1.0);
}
`;
