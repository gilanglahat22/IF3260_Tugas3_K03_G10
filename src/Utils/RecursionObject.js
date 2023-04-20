class RecursionObj {
    constructor(gl, program, objectModel) {
        this.gl = gl;
        this.obj = new MainObj(gl, program, objectModel);
        this.program = program;
        this.name = "";
        this.translation = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.child = [];
    }

    addChild(newObj) {
        this.child.push(newObj);
    }

    getUI(depth, dfsId) {
        let toReturn = "<div class='horizontal-box justify-start'>";
        for (let i = 0; i < depth; i++) {
            toReturn += "&nbsp;&nbsp;&nbsp;&nbsp;"
        }
        toReturn += "<button id='AO-" + dfsId + "'>" + this.name + "</button></div>";
        dfsId++;
        for (let i = 0; i < this.child.length; i++) {
            toReturn += this.child[i].getUI(depth + 1, dfsId);
            dfsId += getNumObj(this.child[i]);
        }
        return toReturn;
    }

    getArticulatedObject(dfsId) {
        if (dfsId == 0) {
            return this;
        } dfsId--;
        for (let i = 0; i < this.child.length; i++) {
            //console.log("sebelum", dfsId);
            let returned = this.child[i].getArticulatedObject(dfsId);
            dfsId -= getNumObj(this.child[i]);
            //console.log("sesudah", dfsId);
            if (returned != null) {
                return returned;
            }
        }
        return null;
    }

    draw(recurse) {
        this.obj.drawObj();

        if (recurse) {
            for (let i = 0; i < this.child.length; i++) {
                this.child[i].draw();
            }
        }
    }

    setFrame(inputFrame, index=0){
        document.getElementById("translasiX").value = inputFrame.transformations[index].move_obj[0];
        document.getElementById("translasiY").value = inputFrame.transformations[index].move_obj[1];
        document.getElementById("translasiZ").value = inputFrame.transformations[index].move_obj[2];
        document.getElementById("angleX").value = toRadian(inputFrame.transformations[index].rotation_obj[0]);
        document.getElementById("angleY").value = toRadian(inputFrame.transformations[index].rotation_obj[1]);
        document.getElementById("angleZ").value = toRadian(inputFrame.transformations[index].rotation_obj[2]);
        document.getElementById("scaleX").value = inputFrame.transformations[index].scale_obj[0];
        document.getElementById("scaleY").value = inputFrame.transformations[index].scale_obj[1];
        document.getElementById("scaleZ").value = inputFrame.transformations[index].scale_obj[2];

    }

    getFrame(loadFrame){
        let transformation = new Transformation();
        transformation.move_obj = this.obj.translation;
        transformation.rotation_obj = toRadian(this.obj.rotation);
        transformation.scale_obj = this.obj.scale;
        transformation.move_subtr = this.translation;
        transformation.rotation_subtr = toRadian(this.rotation);
        transformation.scale_subtr = this.scale;
        loadFrame.transformations.push(transformation);
        for(let i = 0; i<this.child.length; i++){
            this.child[i].getFrame(loadFrame);
        }
    }
}