document.getElementById("load-file").onchange = () => {loadFile();}
document.querySelector("#saveBtn").onclick = function (event) {
    let data = toSaveFormat(MainRenderer.obj);
    saveFile(data);
};
document.querySelector("#reset").onclick = () => {resetDefaultView();}
document.getElementById("play-button").onclick = () => {playAnimation();}
document.getElementById("pause-button").onclick = () => {pauseAnimation();}