var data = null;
var dataAnimation = null;
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
// const defaultMainModel = data;
// console.log("ini debug pertama ",defaultMainModel);
var defaultMainObject = null;
// if(defaultMainModel!=null){
//     defaultMainObject = createObject(Maingl,Mainprogram,defaultMainModel);
// }
const MainRenderer = new Render(Maingl, Mainprogram, true);
// MainRenderer.setObj(defaultMainObject);

// requestAnimationFrame(MainRenderer.drawFrame.bind(MainRenderer));
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
if (defaultComponentModel != null) {
    defaultComponentObject = createObject(Componentgl, ComponentProgram, defaultComponentModel);
}
// const defaultComponentModel = null;
// const defaultComponentObject = null;

const ComponentRenderer = new Render(Componentgl, ComponentProgram, false);
ComponentRenderer.setObj(defaultComponentObject);

const tree = document.querySelector("#tree-display");
tree.innerHTML = null;
if (MainRenderer.obj != null) tree.innerHTML = MainRenderer.obj.getUI(0, 0);
let componentSelected = 0;
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
var animation = new Animation();

document.getElementById("play-button").disabled = false;
document.getElementById("pause-button").disabled = true;

const changeAnimationToLoadFIle = (file) => {
    dataAnimation = JSON.parse(file);
    animation = setAnimation(dataAnimation);
}

const loadAnimation = () => {
    let selectedFile = document.getElementById("input-animation").files;
    if (selectedFile.length == 0) return;
    const file = selectedFile[0];

    let reader = new FileReader();

    reader.onload = (e) => changeAnimationToLoadFIle(e.target.result);
    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

const firstFrame = () => {
    animation.indexCurFrame = 0;
    document.getElementById("cur-frame-id").innerHTML = "" + animation.indexCurFrame;
    MainRenderer.obj.setFrame(animation.frames[animation.indexCurFrame]);
}

const prevFrame = () => {
    if(animation.indexCurFrame - 1 >= 0) animation.indexCurFrame--;
    document.getElementById("cur-frame-id").innerHTML = "" + animation.indexCurFrame;
    MainRenderer.obj.setFrame(animation.frames[animation.indexCurFrame]);
}

const nextFrame = () => {
    if(animation.indexCurFrame + 1 <= animation.frames.length-1) animation.indexCurFrame++;
    document.getElementById("cur-frame-id").innerHTML = "" + animation.indexCurFrame;
    MainRenderer.obj.setFrame(animation.frames[animation.indexCurFrame]);
}

const lastFrame = () => {
    animation.indexCurFrame = animation.frames.length-1;
    document.getElementById("cur-frame-id").innerHTML = "" + animation.indexCurFrame;
    MainRenderer.obj.setFrame(animation.frames[animation.indexCurFrame]);
}

const playAnimation = () =>{
    isPlaying = true;
    document.getElementById("play-button").disabled = true;
    document.getElementById("pause-button").disabled = false;
}

const pauseAnimation = () =>{
    isPlaying = false;
    document.getElementById("play-button").disabled = false;
    document.getElementById("pause-button").disabled = true;
}

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
    if (MainRenderer.obj != null) tree.innerHTML = MainRenderer.obj.getUI(0, 0);
    componentSelected = 0;
    for (let i = 0; i < getNumObj(MainRenderer.obj); i++) {
        let button = document.querySelector("#AO-" + i);
        console.log(button);
        button.onclick = () => {
            componentSelected = i;
            let returned = defaultComponentObject.getArticulatedObject(i);
            ComponentRenderer.setObj(returned);
            ComponentRenderer.draw();
            resetConfig();
        }
    }
    resetConfig();
    MainRenderer.draw();
    ComponentRenderer.draw();
    document.getElementById("textureOption").value = getTextureCode(data.texture);
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

translasiX = document.getElementById("translasiX");
translasiY = document.getElementById("translasiY");
translasiZ = document.getElementById("translasiZ");
rotasiX = document.getElementById("angleX");
rotasiY = document.getElementById("angleY");
rotasiZ = document.getElementById("angleZ");
skalaX = document.getElementById("scaleX");
skalaY = document.getElementById("scaleY");
skalaZ = document.getElementById("scaleZ");

translasiX.addEventListener("input", () => {
    let newVal = parseInt(translasiX.value);
    // ComponentRenderer.obj.translation[0] = newVal;
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).translation[0];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[0][0] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

translasiY.addEventListener("input", () => {
    let newVal = parseInt(translasiY.value);
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).translation[1];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[0][1] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

translasiZ.addEventListener("input", () => {
    let newVal = parseInt(translasiZ.value);
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).translation[2];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[0][2] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

rotasiX.addEventListener("input", () => {
    let newVal = parseInt(rotasiX.value);
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).rotation[0];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[1][0] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

rotasiY.addEventListener("input", () => {
    let newVal = parseInt(rotasiY.value);
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).rotation[1];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[1][1] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

rotasiZ.addEventListener("input", () => {
    let newVal = parseInt(rotasiZ.value);
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).rotation[2];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[1][2] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

skalaX.addEventListener("input", () => {
    let newVal = parseFloat(skalaX.value);
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).scale[0];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[2][0] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

skalaY.addEventListener("input", () => {
    let newVal = parseFloat(skalaY.value);
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).scale[1];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[2][1] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

skalaZ.addEventListener("input", () => {
    let newVal = parseFloat(skalaZ.value);
    let diff = newVal - MainRenderer.obj.getArticulatedObject(componentSelected).scale[2];
    MainRenderer.obj.getArticulatedObject(componentSelected).transformation[2][2] += diff;
    MainRenderer.obj.getArticulatedObject(componentSelected).isUpdated = true;
});

const getTextureCode = (name) => {
    if (name == "BUMP") return 1;
    if (name == "ENVIRONMENT") return 2;
    if (name == "CUSTOM") return 3;
    if (name == "NONE") return 0;
}

const getTextureName = (code) => {
    if (code == 1) return "BUMP";
    if (code == 2) return "ENVIRONMENT";
    if (code == 3) return "CUSTOM";
    if (code == 0) return "NONE";
}

const toSaveFormat = (obj) => {

    let code = document.getElementById("textureOption").value;
    let texture = getTextureName(code);

    let toSave = {
        "name": obj.name,
        "texture": texture,
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
    // renderObject(object);
    // resetDefault = 0;
    MainRenderer.draw();
    ComponentRenderer.draw();
}

// add on change check listener
document.getElementById('shading').addEventListener('change', handleClickShading);

const resetConfig = () => {
    // document.getElementById('perspectiveOption').value = 'perspective';
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
    // document.getElementById('shading').checked = true;
    // document.getElementById("textureOption").value = "bump";
}

const resetDefaultView = () => {
    resetConfig();
    loadFile();
}