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

    drawObj(translation, rotation, scale, transformation) {
        translation[0] += transformation[0][0];
        translation[1] += transformation[0][1];
        translation[2] += transformation[0][2];
        rotation[0] += transformation[1][0];
        rotation[1] += transformation[1][1];
        rotation[2] += transformation[1][2];
        scale[0] += transformation[2][0];
        scale[1] += transformation[2][1];
        scale[2] += transformation[2][2];
        
        drawObject(this.gl, this.program, this.buffer, this.model.vertexCount, translation, rotation, scale);
    }
}