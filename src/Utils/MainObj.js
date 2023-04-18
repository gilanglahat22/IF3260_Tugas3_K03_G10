class MainObj{
    constructor(gl, program, model){
        this.gl = gl;
        this.program = program;
        this.model = model;
        this.vertexPos = [];
        this.vertexColors = [];
        this.vertexTextures = [];
        this.buffer = [];
        this.textureMode = -1;
        this.translation = [0,0,0];
        this.rotation = [0,0,0];
        this.scale = [1,1,1];
        
        // Initialize buffer with position buffer, color buffer, texture buffer, normal buffer, tangent buffer, and bitangent buffer
        for(let i = 0; i<6; i++) this.buffer.push(this.gl.createBuffer());
        let vertices = this.model.vertices;
        let lengthIndices = this.model.indices.length/4;
        let indicesIndx = [1,2,3,0,1,3];
        let textureUnit = [0,0,0,1,1,1,1,0,0,0,1,1];
        for(let i = 0; i<lengthIndices; i++){
            for(let k = 0; k<indicesIndx.length; k++) this.vertexPos.concat(vertices[indices[i*4 + indicesIndx[k]]]);

            for(j = 0; j<lengthIndices; j++){
                this.vertexColors = this.vertexColors.concat(this.model.colors);
            }

            this.vertexTextures = this.vertexTextures.concat(textureUnit);
        }
        this.numVertices = this.vertexPos.length/3;
        this.position = this.vertexPos;
        this.color = this.vertexColors;
        let vec = Vector.getVectorComponents(this.vertexPos);
        this.normal = vec[0];
        this.tangent = vec[1];
        this.bitangent = vec[2];
        this.textureCoord = this.vertexTextures;

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

    drawObj(projectMat, viewMat, modelMat, cameraPosition, shading){
        this.gl.useProgram(this.program);
        this.bind();
        var gl = this.gl;
        var positionLoc = this.gl.getAttribLocation(this.program, "a_position");
        var colorLoc = this.gl.getAttribLocation(this.program, "a_color");
        var normalLoc = this.gl.getAttribLocation(this.program, "a_normal");
        var tangentLoc = this.gl.getAttribLocation(this.program, "a_tangent");
        var bitangentLoc = this.gl.getAttribLocation(this.program, "a_bitangent");
        var textureCoordLoc = this.gl.getAttribLocation(this.program, "a_textureCoord");
        var projectionMatrixLoc = this.gl.getUniformLocation(this.program, "u_projectionMatrix");
        var viewMatrixLoc = this.gl.getUniformLocation(this.program, "u_viewMatrix");
        var modelMatrixLoc = this.gl.getUniformLocation(this.program, "u_modelMatrix");
        var normalMatrixLoc = this.gl.getUniformLocation(this.program, "u_normalMatrix");
        var reverseLightDirectionLoc = this.gl.getUniformLocation(program, "u_reverseLightDirection");
        var worldCameraPositionLoc = this.gl.getUniformLocation(program, "u_worldCameraPosition");
        var shadingOnLoc = this.gl.getUniformLocation(this.program, "u_shadingOn");
        var textureModeLoc = this.gl.getUniformLocation(this.program, "u_textureMode");
        var textureImageLoc = this.gl.getUniformLocation(program, "u_texture_image");
        var textureEnvironmentLoc = this.gl.getUniformLocation(program, "u_texture_environment");
        var textureBumpLoc = this.gl.getUniformLocation(program, "u_texture_bump");
        
        gl.enableVertexAttribArray(positionLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[0]);
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(colorLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[1]);
        gl.vertexAttribPointer(colorLoc, 4, gl.UNSIGNED_BYTE, true, 0, 0);

        gl.enableVertexAttribArray(textureCoordLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[2]);
        gl.vertexAttribPointer(textureCoordLoc, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(normalLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[3]);
        gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(tangentLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[4]);
        gl.vertexAttribPointer(tangentLoc, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(bitangentLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[5]);
        gl.vertexAttribPointer(bitangentLoc, 3, gl.FLOAT, false, 0, 0);

        var tempModelMat = modelMat;
        tempModelMat = Matrix.translate(tempModelMat, this.translation);
        tempModelMat = Matrix.rotate(tempModelMat, this.rotation[0], [1,0,0]);
        tempModelMat = Matrix.rotate(tempModelMat, this.rotation[1], [0,1,0]);
        tempModelMat = Matrix.rotate(tempModelMat, this.rotation[2], [0,0,1]);
        tempModelMat = Matrix.scale(tempModelMat, this.scale);
    
        this.gl.uniformMatrix4fv(projectionMatrixLoc, false, projectMat);
        this.gl.uniformMatrix4fv(viewMatrixLoc, false, viewMat);
        this.gl.uniformMatrix4fv(modelMatrixLoc, false, modelMat);
        this.gl.uniform3fv(reverseLightDirectionLoc, normalize([0.1, 0.3, 1]));

        const normalMatrix = Matrix.normalizeMatrix(Matrix.multiply(viewMat, modelMat));
        this.gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);
        this.gl.uniform3fv(worldCameraPositionLoc, cameraPosition);
        this.gl.uniform1i(shadingOnLoc, shading);
        this.gl.uniform1i(textureModeLoc, this.textureMode);
        this.gl.uniform1i(textureImageLoc, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);

        this.gl.uniform1i(textureEnvironmentLoc, 1);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textures[1]);

        this.gl.uniform1i(textureBumpLoc, 2);
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[2]);

        // Draw the component of the object
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices);   
    }
}