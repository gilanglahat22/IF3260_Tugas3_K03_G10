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
        this.transformation = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
        this.isUpdated = false;
    }

    addChild(newObj) {
        this.child.push(newObj);
    }

    setIsUpdated() {
        this.isUpdated = true;
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

    updateChild(transformation){
        if (!this.isUpdated) return;
        console.log("update child");
        this.transformation = transformation;
        for (let i = 0; i < this.child.length; i++) {
            this.child[i].isUpdated = true;
            this.child[i].updateChild(this.transformation);
        }
    }

    setFrame(inputFrame, index=0){
        additionMoveX = inputFrame.transformations[index].move_obj[0];
        additionMoveY  = inputFrame.transformations[index].move_obj[1];
        additionMoveZ = inputFrame.transformations[index].move_obj[2];
        additionAngleX = toRadian(inputFrame.transformations[index].rotation_obj[0]);
        additionAngleY = toRadian(inputFrame.transformations[index].rotation_obj[1]);
        additionAngleZ = toRadian(inputFrame.transformations[index].rotation_obj[2]);
        additionScaleX = inputFrame.transformations[index].scale_obj[0];
        additionScaleY = inputFrame.transformations[index].scale_obj[1];
        additionScaleZ = inputFrame.transformations[index].scale_obj[2];
    }

    getArticulatedObject(dfsId) {
        if (dfsId == 0) {
            return this;
        } dfsId--;
        for (let i = 0; i < this.child.length; i++) {
            let returned = this.child[i].getArticulatedObject(dfsId);
            dfsId -= getNumObj(this.child[i]);
            if (returned != null) {
                return returned;
            }
        }
        return null;
    }

    draw(recurse) {
        this.updateChild(this.transformation)
        this.isUpdated = false;
        this.obj.drawObj(this.translation, this.rotation, this.scale, this.transformation);
        this.transformation = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
        if (recurse) {
            for (let i = 0; i < this.child.length; i++) {
                this.child[i].draw(recurse);
            }
        }
        recurse = false;
    }
}