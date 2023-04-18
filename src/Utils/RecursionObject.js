class RecursionObj{
    constructor(gl, program, obkectModel){
        this.gl = gl;
        this.obj = new MainObj(gl, program, obkectModel);
        this.program = program;
        this.name = "";
        this.translation = [0,0,0];
        this.rotation = [0,0,0];
        this.scale = [1,1,1];
        this.child = [];
    }

    addChild(newObj){
        this.child.push(newObj);
    }
    draw(projectMat, viewMat, modelMat, cameraPosition, shading){
        var tempModelMat = modelMat;
        tempModelMat = Matrix.translate(tempModelMat, this.translation);
        tempModelMat = Matrix.rotate(tempModelMat, this.rotation[0], [1,0,0]);
        tempModelMat = Matrix.rotate(tempModelMat, this.rotation[1], [0,1,0]);
        tempModelMat = Matrix.rotate(tempModelMat, this.rotation[2], [0,0,1]);
        tempModelMat = Matrix.scale(tempModelMat, this.scale);
        // Draw object
        this.obj.draw(projectMat, view, newModel, cameraPosition, shading);
        // Do recursion for draw the child
        this.DFSDraw(projectMat,viewMat,tempModelMat,cameraPosition,shading);
    }

    DFSDraw(projectMat, viewMat, modelMat, cameraPosition, shading){
        for(let i = 0; i<this.child.length; i++) this.child[i].draw(projectMat, viewMat, modelMat, cameraPosition, shading);
    }

    getUI(depth, dfsId){
        let toReturn = "<div class='horizontal-box justify-start'>";
        for(let i=0; i<depth; i++){
            toReturn += "&nbsp;&nbsp;&nbsp;&nbsp;"
        }
        toReturn += "<button id='AO-" + dfsId + "'>" + this.name +  "</button></div>";
        dfsId++;
        for(let i=0; i<this.child.length; i++){
            toReturn += this.child[i].getUI(depth+1, dfsId);
            dfsId += getNumObj(this.child[i]);
        }
        return toReturn;
    }

    getArticulatedObject(dfsId) {
        if(dfsId == 0){t
            return this;
        }dfsId--;
        for(let i=0; i<this.child.length; i++){
            //console.log("sebelum", dfsId);
            let returned = this.child[i].getArticulatedObject(dfsId);
            dfsId -= getNumObj(this.child[i]);
            //console.log("sesudah", dfsId);
            if(returned != null){
                return returned;
            }
        }
        return null;
    }
}