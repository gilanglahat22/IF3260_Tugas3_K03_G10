var data = null;
const Maincanvas = document.getElementById(`canvas-main`);
const Maingl = WebGLUtils.setupWebGL(Maincanvas, {
    preserveDrawingBuffer: true,
});

if (!Maingl) {
    console.error("WebGL isn't available");
    alert("WebGL isn't available");
}

var shadingFragment = FRAGMENT_SHADER_LIGHT;
const Mainprogram = initShaders(Maingl, VERTEX_SHADER);
const defaultMainModel = data;
// console.log("ini debug pertama ",defaultMainModel);
var defaultMainObject = null;
if(defaultMainModel!=null){
    defaultMainObject = createObject(Maingl,Mainprogram,defaultMainModel);
}
const MainRenderer = new Render(Maingl,Mainprogram);
MainRenderer.setObj(defaultMainObject);

requestAnimationFrame(MainRenderer.drawFrame.bind(MainRenderer));
// initShaders(gl, "vertex-shader", "fragment-shader");

Maingl.viewport(0, 0, Maincanvas.width, Maincanvas.height);
Maingl.clearColor(0.0, 0.0, 0.0, 0.66);
Maingl.clear(Maingl.COLOR_BUFFER_BIT | Maingl.DEPTH_BUFFER_BIT);
Maingl.enable(Maingl.DEPTH_TEST);
Maingl.frontFace(Maingl.CCW);
Maingl.cullFace(Maingl.BACK);

// For component object
const ComponentCanvas = document.getElementById(`canvas-object`);
const Componentgl = WebGLUtils.setupWebGL(ComponentCanvas, {
    preserveDrawingBuffer: true,
});

if (!Componentgl) {
    console.error("WebGL isn't available");
    alert("WebGL isn't available");
}

// var shadingFragment = FRAGMENT_SHADER_LIGHT;
const ComponentProgram = initShaders(Componentgl, VERTEX_SHADER);
const defaultComponentModel = data;
var defaultComponentObject = null;
if(defaultComponentModel!=null){
    defaultComponentObject = createObject(Componentgl,ComponentProgram,defaultComponentModel);
}
// const defaultComponentModel = null;
// const defaultComponentObject = null;

const ComponentRenderer = new Render(Componentgl,ComponentProgram);
ComponentRenderer.setObj(defaultComponentObject);

const tree = document.querySelector("#tree-display");
tree.innerHTML = null;
if (MainRenderer.obj != null) tree.innerHTML = MainRenderer.obj.getUI(0, 0);
let chosenIdx = 0;
requestAnimationFrame(ComponentRenderer.drawFrame.bind(ComponentRenderer));
// initShaders(gl, "vertex-shader", "fragment-shader");

Componentgl.viewport(0, 0, ComponentCanvas.width, ComponentCanvas.height);
Componentgl.clearColor(0.0, 0.0, 0.0, 0.66);
Componentgl.clear(Componentgl.COLOR_BUFFER_BIT | Componentgl.DEPTH_BUFFER_BIT);
Componentgl.enable(Componentgl.DEPTH_TEST);
Componentgl.frontFace(Componentgl.CCW);
Componentgl.cullFace(Componentgl.BACK);

// For tree canvas



// const articulatedRender = new Render(gl, program);
// const renderObj = new Render(gl, program);

var isInit = true;

const renderObject = (object) => {
    const shaderProgram = initShaders(Maingl, VERTEX_SHADER);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition:  Maingl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: Maingl.getAttribLocation(shaderProgram, 'aVertexColor'),
            normalLoc: Maingl.getAttribLocation(shaderProgram, 'normal'),
        },
        uniformLocations: {
            projectionMatrix: Maingl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: Maingl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrixLoc: Maingl.getUniformLocation(shaderProgram, "normalMat"),
            lightPosLoc: Maingl.getUniformLocation(shaderProgram, "lightPos"),
            ambientColorLoc: Maingl.getUniformLocation(shaderProgram, "ambientColor"),
            diffuseColorLoc: Maingl.getUniformLocation(shaderProgram, "diffuseColor"),
            specularColorLoc: Maingl.getUniformLocation(shaderProgram, "specularColor"),
            shininessLoc: Maingl.getUniformLocation(shaderProgram, "shininessVal"),
            kaLoc: Maingl.getUniformLocation(shaderProgram, "coefKa"),
            kdLoc: Maingl.getUniformLocation(shaderProgram, "coefKd"),
            ksLoc: Maingl.getUniformLocation(shaderProgram, "coefKs"),
        }
    };
    // document.getElementById("ambient-color").value = document.getElementById("color-picker").value;
    // document.getElementById("diffuse-color").value = document.getElementById("color-picker").value;
    var buffers;
    if (isInit) {
        buffers = initBuffer(Maingl, object);
        isInit = false;
    }
    else {
        buffers = updateBuffer(Maingl, object);
    }
    function render() {
        drawObject(Maingl, programInfo, buffers, object.vertexCount);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    // numRender++;
}

const test_obj = {
    "type": "CUBE",
    "vertices": [
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
    ],
    "indices": [
        0, 1, 2,
        0, 2, 3,
        0, 3, 7,
        0, 7, 4,
        0, 4, 5,
        0, 5, 1,
        1, 5, 6,
        1, 6, 2,
        2, 6, 7,
        2, 7, 3,
        4, 7, 6,
        4, 6, 5
    ],
    "faceColors": [0.529, 0.424, 0.075, 1.0],
    "vertexCount": 36,
    "faceColorsCount": 20,
    "children": [{
        "type": "PRISM",
        "vertices": [
            0.25, 1, 0.25,
            -0.25, 1, 0.25,
            -0.25, -1, 0.25,
            0.25, -1, 0.25,
            0.25, 1, -0.25,
            -0.25, 1, -0.25,
            -0.25, -1, -0.25,
            0.25, -1, -0.25
        ],
        "indices": [
            0, 1, 2,
            0, 2, 3,
            0, 3, 7,
            0, 7, 4,
            0, 4, 5,
            0, 5, 1,
            1, 5, 6,
            1, 6, 2,
            2, 6, 7,
            2, 7, 3,
            4, 7, 6,
            4, 6, 5
        ],
        "faceColors": [0.529, 0.424, 0.075, 1.0],
        "vertexCount": 36,
        "faceColorsCount": 20,
    }]
}

Maingl.enable(Maingl.DEPTH_TEST);
Maingl.depthFunc(Maingl.LEQUAL);
Maingl.viewport(0.0, 0.0, Maingl.canvas.clientWidth, Maingl.canvas.clientHeight);
Maingl.clear(Maingl.COLOR_BUFFER_BIT | Maingl.DEPTH_BUFFER_BIT);

renderObject(test_obj)

for (let i = 0; i < test_obj.children.length; i++) {
    renderObject(test_obj.children[i]);
}
// const obj = createObject(gl, program, x);
// console.log(obj);

const changeToLoadFile = (file) => {
    resetDefault = 1;
    data = JSON.parse(file);
    console.log(data);
    const objectMain = createObject(MainRenderer.gl, MainRenderer.program, data);
    const objectComponent = createObject(ComponentRenderer.gl, ComponentRenderer.program, data);
    // resetConf();
    // renderObject(object);
    MainRenderer.clearObj();
    ComponentRenderer.clearObj();

    MainRenderer.setObj(objectMain);
    defaultComponentObject = objectComponent;
    ComponentRenderer.setObj(objectComponent);
    tree.innerHTML = null;
    if(MainRenderer.obj != null) tree.innerHTML = MainRenderer.obj.getUI(0, 0);
    chosenIdx = 0;
    for (let i = 0; i < getNumObj(MainRenderer.obj); i++) {
        let button = document.querySelector("#AO-" + i);
        console.log(button);
        button.onclick = () => {
            chosenIdx = i;
            let returned = defaultComponentObject.getArticulatedObject(i);
            renderer.setObject(returned);

            //Resetting object sliders
            refreshSliders();
        }
    }
}

const loadFile = () => {
    let selectedFile = document.getElementById("load-file").files;
    if (selectedFile.length == 0) return;
    const file = selectedFile[0];

    let reader = new FileReader();

    reader.onload = (e) => changeToLoadFile(e.target.result);
    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

const btn = document.querySelector("#saveBtn");

btn.onclick = function (event) {
    let data = toSaveFormat(MainRenderer.obj);
    saveFile(data);
};

const toSaveFormat = (obj) => {

    let toSave = {
        "name": obj.name,
        "texture": obj.obj.textureMode,
        "move_obj": obj.obj.translation,
        "rotation_obj": obj.obj.rotation,
        "scale_obj": obj.obj.scale,
        "move_subtr": obj.translation,
        "rotation_subtr": obj.rotation,
        "scale_subtr": obj.scale,
        "obj": obj.obj.model,
        "child": []
    }

    for (let i = 0; i < obj.child.length; i++) {
        toSave.child.push(toSaveFormat(obj.child[i]));
    }

    return toSave;
}

const saveFile = (data) => {
    const anchor = document.createElement('a');

    const file = new Blob([JSON.stringify(data, null, 4)], { type: 'text/plain' });

    anchor.href = URL.createObjectURL(file);
    anchor.download = "saved-" + MainRenderer.obj.name + ".json";
    anchor.click();
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
