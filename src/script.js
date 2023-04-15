const canvas = document.getElementById(`gl-canvas`);
const gl = WebGLUtils.setupWebGL(canvas, {
    preserveDrawingBuffer: true,
});

if (!gl) {
    console.error("WebGL isn't available");
    alert("WebGL isn't available");
}

canvas.width = innerHeight;
canvas.height = innerHeight;

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 0.66);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);