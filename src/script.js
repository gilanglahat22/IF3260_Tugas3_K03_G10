var data = null;
var dataAnimation = null;
var additionMoveX = 0;
var additionMoveY = 0;
var additionMoveZ = 0;
var additionAngleX = 0;
var additionAngleY = 0;
var additionAngleZ = 0;
var additionScaleX = 0;
var additionScaleY = 0;
var additionScaleZ = 0;
var isPlaying = false;

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

var defaultMainObject = null;

const MainRenderer = new Render(Maingl, Mainprogram, true);

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

const ComponentProgram = initShaders(Componentgl, VERTEX_SHADER);
const defaultComponentModel = data;
var defaultComponentObject = null;
if (defaultComponentModel != null) {
    defaultComponentObject = createObject(Componentgl, ComponentProgram, defaultComponentModel);
}

const ComponentRenderer = new Render(Componentgl, ComponentProgram, false);
ComponentRenderer.setObj(defaultComponentObject);

const tree = document.querySelector("#tree-display");
tree.innerHTML = null;
if (MainRenderer.obj != null) tree.innerHTML = MainRenderer.obj.getUI(0, 0);
let chosenIdx = 0;
requestAnimationFrame(ComponentRenderer.drawFrame.bind(ComponentRenderer));

Componentgl.viewport(0, 0, ComponentCanvas.width, ComponentCanvas.height);
Componentgl.clearColor(0.0, 0.0, 0.0, 0.66);
Componentgl.clear(Componentgl.COLOR_BUFFER_BIT | Componentgl.DEPTH_BUFFER_BIT);
Componentgl.enable(Componentgl.DEPTH_TEST);
Componentgl.frontFace(Componentgl.CCW);
Componentgl.cullFace(Componentgl.BACK);


Maingl.enable(Maingl.DEPTH_TEST);
Maingl.depthFunc(Maingl.LEQUAL);
Maingl.viewport(0.0, 0.0, Maingl.canvas.clientWidth, Maingl.canvas.clientHeight);
Maingl.clear(Maingl.COLOR_BUFFER_BIT | Maingl.DEPTH_BUFFER_BIT);

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

var shutterSpeed = 0.5;

let globalTimer = 0;
setInterval(function () {
    globalTimer++;
    if(isPlaying){
        if(globalTimer % Math.round(shutterSpeed * 10) == 0){
        animation.indexCurFrame = Math.min(animation.frames.length - 1, animation.indexCurFrame + 1);
        document.querySelector("#cur-frame-id").innerHTML = "" + animation.indexCurFrame;
        MainRenderer.obj.setFrame(animation.frames[animation.indexCurFrame]);
        };
    }
}, 100);

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
    chosenIdx = 0;
    for (let i = 0; i < getNumObj(MainRenderer.obj); i++) {
        let button = document.querySelector("#AO-" + i);
        console.log(button);
        button.onclick = () => {
            chosenIdx = i;
            let returned = defaultComponentObject.getArticulatedObject(i);
            ComponentRenderer.setObj(returned);
            ComponentRenderer.draw();
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
    MainRenderer.draw();
    ComponentRenderer.draw();
}

// add on change check listener
document.getElementById('shading').addEventListener('change', handleClickShading);

const resetConfig = () => {
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
}

const resetDefaultView = () => {
    resetConfig();
    MainRenderer.draw();
    ComponentRenderer.draw();
}