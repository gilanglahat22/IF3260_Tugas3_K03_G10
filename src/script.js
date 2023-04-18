var data = [];
const canvas = document.getElementById(`canvas-main`);
const gl = WebGLUtils.setupWebGL(canvas, {
    preserveDrawingBuffer: true,
});

if (!gl) {
    console.error("WebGL isn't available");
    alert("WebGL isn't available");
}

var shadingFragment = FRAGMENT_SHADER_LIGHT;
const program = initShaders(gl, VERTEX_SHADER);

// initShaders(gl, "vertex-shader", "fragment-shader");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 0.66);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);

const articulatedRender = new Render(gl, program);

const changeToLoadFile=(file)=>{
    resetDefault = 1;
    data = JSON.parse(file);
    console.log(data);
    // const articulatedObj = createObject(articulatedRender.gl, articulatedRender.program, data);
    // const objectMain = createObject(renderObj.gl, renderObj.program, data);
    // resetConf();
    // renderObject(object);
}

const loadFile = () =>{
    let selectedFile = document.getElementById("load-file").files;
    if (selectedFile.length == 0) return;
    const file = selectedFile[0]; 

    let reader = new FileReader();

    reader.onload = (e) => changeToLoadFile(e.target.result);
    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}
  
//   const resetConf = () =>{
//     defaultview();
//     document.getElementById('perspectiveOption').value = 'perspective';
//     document.getElementById("translasiX").value = 0;
//     document.getElementById("translasiY").value = 0;
//     document.getElementById("translasiZ").value = 0;
//     document.getElementById("rotasiX").value = 0;
//     document.getElementById("rotasiY").value = 0;
//     document.querySelector("output").value = 0;
//     document.getElementById("rotasiZ").value = 0;
//     document.getElementById("scalingX").value = 1;
//     document.getElementById("scalingY").value = 1;
//     document.getElementById("scalingZ").value = 1;
//     document.getElementById('cam-rotation').value = 60;
//     document.getElementById('cam-radius').value = 0;
//     document.getElementById('shading').checked = true;
//     document.getElementById("output-rot-x").value = 0;
//     document.getElementById("output-rot-y").value = 0;
//     document.getElementById("output-rot-z").value = 0;
//     document.getElementById("output-trans-x").value = 0;
//     document.getElementById("output-trans-y").value = 0;
//     document.getElementById("output-trans-z").value = 0;
//     document.getElementById("output-scale-x").value = 1;
//     document.getElementById("output-scale-y").value = 1;
//     document.getElementById("output-scale-z").value = 1;
//     document.getElementById("output-cam-rad").value = 0;
//     document.getElementById("output-range").value = 60;
//     document.getElementById("color-picker").value = arrayToRGB(tempColorVal);
//     document.getElementById("ka").value = 0.1;
//     document.getElementById("kd").value = 0.8;
//     document.getElementById("ks").value = 1.0;
//     document.getElementById("shininess").value = 10.0;
//     document.getElementById("specular-color").value = arrayToRGB([1.0,1.0,1.0]);
//     document.getElementById("output-ka").value = 0.1;
//     document.getElementById("output-kd").value = 0.8;
//     document.getElementById("output-ks").value = 1;
//     document.getElementById("output-Shininess").value = 10.0;
//     shadingFragment = FRAGMENT_SHADER_LIGHT;
//     resetDefault = 1;
//     angleAnimation = 0;
//     incAngle = 0.5;
//   }
  
// const resetToDefaultView = () => {
//     resetConf();
//     renderObject(object);
// }

const handleClickShading = () => {
    let checkBox = document.getElementById('shading');
    if (checkBox.checked) {
        shadingFragment = FRAGMENT_SHADER_LIGHT;
    } else {
        shadingFragment = FRAGMENT_SHADER_FLAT;
    }
    renderObject(object);
    resetDefault = 0;
}
  