function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Unable to compile shaders: ${gl.getShaderInfoLog(shader)}`);
        throw new Error(
        `Unable to compile shaders: ${gl.getShaderInfoLog(shader)}`
        );
    }

    return shader;
}
  
  function initShaders(gl, vsSource = VERTEX_SHADER) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = null;
    if(shadingFragment==FRAGMENT_SHADER_LIGHT) fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_LIGHT);
    else fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_FLAT);
  
    const shaderProgram = gl.createProgram();
  
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
  
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        `Unable to initialize shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
      throw new Error(
        `Unable to initialize shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
    }
  
    gl.validateProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
      console.error(
        `Unable to validate shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
      throw new Error(
        `Unable to validate shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
    }
  
    return shaderProgram;
  }