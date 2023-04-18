class Rendering{
    constructor(gl, program){
        this.gl = gl;
        this.program = program;
        this.setProjection("Orthographic");
        this.projectionMtrix = [1,0,0,0,
                                0,1,0,0,
                                0,0,0,1];
        this.obj = null;
        this.next = 0;
    }

    setProjection(type){
        const left = 0;
        const top = gl.canvas.clientHeight;
        const right = gl.canvas.clientWidth;
        const bottom = 0;
        const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        const near = 850;
        const far = -850;
        const zNear = 0.1;
        const zFar = 1000.0;
        if(type == "Orthographic"){
            this.projectionMtrix = Matrix.orthographic(left, right, bottom, top, near, far);
        }else if(type=="Oblique"){
            this.projectionMtrix = Matrix.orthographic(left, right, bottom, top, near, far);
            const oblique = Matrix.multiply(Matrix.oblique(45), Matrix.orthographic(left,right,bottom,top,near,far));
            oblique = Matrix.translate(oblique, [0,0,500]);
            this.projectionMtrix = oblique;
        }else{
            this.projectionMtrix = Matrix.perspective(fov, aspect, zNear, zFar);
        }
    }

    setDefault(){
        this.cameraRadius = 500;
        this.cameraAngle = toRadian(0);
        this.shadingMode = false;
        this.setProjection("Orthographic");
    }

    setObj(obj){
        this.obj = obj;
        this.setDefault();
    }

    drawFrame(){
        const displayWidth  = this.gl.canvas.clientWidth;
        const displayHeight = this.gl.canvas.clientHeight;
        const needResize = (this.gl.canvas.width != displayWidth || this.gl.canvas.height != displayHeight);
    
        if (needResize) {
            this.gl.canvas.width  = displayWidth;
            this.gl.canvas.height = displayHeight;
        }

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.CULL_FACE);

        this.gl.enable(this.gl.DEPTH_TEST);

        if (!this.object) {
        return
        }

        const projectionMatrix = this.projectionMatrix.clone();

        let cameraMatrix = Matrix4.identity();
        cameraMatrix.rotateY(this.cameraAngle);
        cameraMatrix.translate(0, 0, this.cameraRadius);

        var cameraPosition = [
        cameraMatrix.get(3, 0),
        cameraMatrix.get(3, 1),
        cameraMatrix.get(3, 2),
        ];
        var target = [0, 0, 0];
        var up = [0, 1, 0];
        cameraMatrix = Matrix4.lookAt(cameraPosition, target, up);
        const viewMatrix = cameraMatrix.clone().inverse();
        this.object.draw(projectionMatrix, viewMatrix, Matrix4.identity(), cameraPosition, this.shadingMode);
        requestAnimationFrame(this.drawFrame.bind(this));
    }

    clearObj(){
        this.obj = null;
    }

}