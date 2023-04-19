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

// var isInit = true;

// const renderObjects = () => {
//     // document.getElementById("ambient-color").value = document.getElementById("color-picker").value;
//     // document.getElementById("diffuse-color").value = document.getElementById("color-picker").value;
//     // var buffers;
//     // if (isInit) {
//     //     buffers = initBuffer(Maingl, object);
//     //     isInit = false;
//     // }
//     // else {
//     //     buffers = updateBuffer(Maingl, object);
//     // }
//     function render() {
//         drawObject(Maingl, null, buffers, object.vertexCount);
//         requestAnimationFrame(render);
//     }
//     requestAnimationFrame(render);
//     // numRender++;
// }

Maingl.enable(Maingl.DEPTH_TEST);
Maingl.depthFunc(Maingl.LEQUAL);
Maingl.viewport(0.0, 0.0, Maingl.canvas.clientWidth, Maingl.canvas.clientHeight);
Maingl.clear(Maingl.COLOR_BUFFER_BIT | Maingl.DEPTH_BUFFER_BIT);


// renderObject(test_obj)

// for (let i = 0; i < test_obj.children.length; i++) {
//     renderObject(test_obj.children[i]);
// }
// const obj = createObject(gl, program, x);
// console.log(obj);

const changeToLoadFile = (file) => {
    resetDefault = 1;
    data = JSON.parse(file);
    console.log(data);
    const objectMain = createObject(MainRenderer.gl, MainRenderer.program, data);
    const objectComponent = createObject(ComponentRenderer.gl, ComponentRenderer.program, data);
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
            ComponentRenderer.setObj(returned);
            ComponentRenderer.draw();
            console.log("aaa")
        }
    }
    resetDefaultView();
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

const resetConfig = () => {
    document.getElementById('perspectiveOption').value = 'perspective';
    document.getElementById("translasiX").value = 0;
    document.getElementById("translasiY").value = 0;
    document.getElementById("translasiZ").value = 0;
    document.getElementById("angleX").value = 0;
    document.getElementById("angleY").value = 0;
    document.getElementById("angleZ").value = 0;
    document.getElementById("scaleX").value = 1;
    document.getElementById("scaleY").value = 1;
    document.getElementById("scaleZ").value = 1;
    document.getElementById("cameraRad").value = 0;
    document.getElementById("cameraAngle").value = 0;
    document.getElementById('shading').checked = true;
    document.getElementById("textureOption").value = "bump";
}

const resetDefaultView = () => {
    resetConfig();
    MainRenderer.draw();
    ComponentRenderer.draw();
}