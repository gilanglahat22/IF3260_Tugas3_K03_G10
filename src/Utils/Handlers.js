document.getElementById("load-file").onchange = () => {loadFile();}
document.querySelector("#saveBtn").onclick = function (event) {
    let data = toSaveFormat(MainRenderer.obj);
    saveFile(data);
};