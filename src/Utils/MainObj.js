class MainObj{
    constructor(gl, program, model){
        this.gl = gl;
        this.program = program;
        this.translation = [0,0,0];
        this.rotation = [0,0,0];
        this.scale = [1,1,1];
        this.model = {
            ...model,
            vertexCount: model.indices.length,
            faceColorsCount: model.indices.length / 4,
        };
        this.buffer = initBuffer(gl, this.model);
        // this.vertexPos = [];
        // this.vertexColors = [];
        // this.vertexTextures = [];
        // this.buffer = [];
        // this.textureMode = -1;
        // this.translation = [0,0,0];
        // this.rotation = [0,0,0];
        // this.scale = [1,1,1];
        
        // Initialize buffer with position buffer, color buffer, texture buffer, normal buffer, tangent buffer, and bitangent buffer
        // for(let i = 0; i<6; i++) this.buffer.push(this.gl.createBuffer());
        // let vertices = this.model.vertices;
        // let lengthIndices = this.model.indices.length/4;
        // let indicesIndx = [1,2,3,0,1,3];
        // let textureUnit = [0,0,0,1,1,1,1,0,0,0,1,1];
        // for(let i = 0; i<lengthIndices; i++){
        //     let indices = this.model.indices[i];
        //     for(let k = 0; k< indicesIndx.length; k++){
        //         this.vertexPos.concat(vertices[indices[i*4 + indicesIndx[k]]]);
        //     }

        //     for(let j = 0; j<lengthIndices; j++){
        //         this.vertexColors = this.vertexColors.concat(this.model.colors);
        //     }

        //     this.vertexTextures = this.vertexTextures.concat(textureUnit);
        // }
        // this.numVertices = this.vertexPos.length/3;
        // this.position = this.vertexPos;
        // this.color = this.vertexColors;
        // let vec = Vector.getVectorComponents(this.vertexPos);
        // this.normal = vec[0];
        // this.tangent = vec[1];
        // this.bitangent = vec[2];
        // this.textureCoord = this.vertexTextures;

        // Create texture.
        // Implement here

        this.textures = [Textures.image(this.gl), Textures.environment(this.gl), Textures.bump(this.gl)];
    }

    bind(){
        var gl = gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[1]);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(this.color), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[2]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoord), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[3]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[4]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[5]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bitangent), gl.STATIC_DRAW);
    }

    // drawObj(projectMat, viewMat, modelMat, cameraPosition, shading){
    drawObj() {
        // console.log("drawObj");
        this.translation = [document.getElementById("translasiX").value / 100, document.getElementById("translasiY").value / 100, document.getElementById("translasiZ").value / 100];
        this.rotation = [document.getElementById("angleX").value / 100,document.getElementById("angleY").value / 100,document.getElementById("angleZ").value / 100];
        this.scale = [document.getElementById("scaleX").value,document.getElementById("scaleY").value,document.getElementById("scaleZ").value];
        drawObject(this.gl, this.program, this.buffer, this.model.vertexCount, this.translation, this.rotation, this.scale);
    }
}