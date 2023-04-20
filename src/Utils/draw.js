// Buat Draw Object

function drawObject(gl, _programInfo, buffers, vertexCount, translation, rotation, scale) {
// function drawObject(gl, _programInfo, buffers, vertexCount) {
    const shaderProgram = initShaders(gl, VERTEX_SHADER);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition:  gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            normalLoc: gl.getAttribLocation(shaderProgram, 'normal'),
            tangentLoc: gl.getAttribLocation(shaderProgram, 'vert_tang'),
            bitangentLoc: gl.getAttribLocation(shaderProgram, 'vert_bitang'),
            uvLoc: gl.getAttribLocation(shaderProgram, 'vert_uv'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrixLoc: gl.getUniformLocation(shaderProgram, "normalMat"),
            lightPosLoc: gl.getUniformLocation(shaderProgram, "lightPos"),
            ambientColorLoc: gl.getUniformLocation(shaderProgram, "ambientColor"),
            diffuseColorLoc: gl.getUniformLocation(shaderProgram, "diffuseColor"),
            specularColorLoc: gl.getUniformLocation(shaderProgram, "specularColor"),
            shininessLoc: gl.getUniformLocation(shaderProgram, "shininessVal"),
            kaLoc: gl.getUniformLocation(shaderProgram, "coefKa"),
            kdLoc: gl.getUniformLocation(shaderProgram, "coefKd"),
            ksLoc: gl.getUniformLocation(shaderProgram, "coefKs"),
            tex_normLoc: gl.getUniformLocation(shaderProgram, "tex_norm"),
            tex_diffuseLoc: gl.getUniformLocation(shaderProgram, "tex_diffuse"),
            tex_depthLoc: gl.getUniformLocation(shaderProgram, "tex_depth"),
            cameraPosLoc: gl.getUniformLocation(shaderProgram, 'camera_pos'),
            tex_modeLoc: gl.getUniformLocation(shaderProgram, 'tex_mode'),
            projectionLocation: gl.getUniformLocation(shaderProgram, "u_projection"),
            viewLocation: gl.getUniformLocation(shaderProgram, "u_view"),
            worldLocation: gl.getUniformLocation(shaderProgram, "u_world"),
            worldCameraPositionLocation: gl.getUniformLocation(shaderProgram, "u_worldCameraPosition"),
        }
    };

    
    const lightPos = [0.0, 0.0, 0.0];
    const tempambientColor = [0.2, 0.2, 0.2];
    const tempdiffuseColor = [0.8, 0.8, 0.8];
    const tempspecularColor = [1.0, 1.0, 1.0];
    const fieldOfView = 45 * Math.PI / 180;
    const left = 0;
    const top = 0;
    const right = gl.canvas.clientWidth;
    const bottom = gl.canvas.clientHeight;
    const aspect = (right - left) / (bottom - top);
    const zNear = 0.1;
    const zFar = 1000.0;
    var projectionMatrix = Matrix.createIdentityMatrix();
    var modelViewMatrix = Matrix.createIdentityMatrix();
    let cameraAngleRadian = ((document.getElementById('cameraAngle').value  - 50.0) * Math.PI) / 25.0;
    let radius = -((document.getElementById('cameraRad').value - 50.0) / 25.0) + 5.5;
    let projectionType = document.getElementById('perspectiveOption').value;
    let angleX = rotation[0]/ 100;
    let angleY = rotation[1]/ 100;
    let angleZ = rotation[2]/ 100;
    let x = translation[0]/ 100;
    let y = translation[1]/ 100;
    let z = translation[2]/ 100;
    let scalesX = scale[0];
    let scalesY = scale[1];
    let scalesZ = scale[2];

    if (projectionType === "perspective") {
      projectionMatrix = Matrix.perspective(fieldOfView,aspect,zNear,zFar);
    }else if(projectionType === "oblique"){
      //  Cabinet Projection with alpha and beta equal 45 degree
      projectionMatrix = Matrix.oblique(45,45);
      projectionMatrix = Matrix.multiply(projectionMatrix, Matrix.orthographic(-aspect,aspect,-1.0,1.0,zNear,zFar));
      projectionMatrix = Matrix.translate(projectionMatrix,[-0.94, 0.94, 0.0]);
      radius *= (1.90 / 5.5);
      scalesX *= 0.32, scalesY *= 0.32, scalesZ *= 0.32;
    }else if(projectionType === "orthographic"){
      projectionMatrix = Matrix.orthographic(-aspect,aspect,-1.0,1.0,zNear,zFar);
      radius *= (1.85 / 5.5);
      scalesX *= 0.34, scalesY *= 0.34, scalesZ *= 0.34;
    }
  
    modelViewMatrix = Matrix.translate(modelViewMatrix,[0.0, 0.0, -radius]);  
    modelViewMatrix = Matrix.rotate(modelViewMatrix,cameraAngleRadian,[0, 1, 0]);       
    
    {
        var cameraPosition = [modelViewMatrix[3 * 3 + 0], modelViewMatrix[3 * 3 + 1], modelViewMatrix[3 * 3 + 2]];
        // gl.uniform3fv(programInfo.uniformLocations.cameraPosLoc,  cameraPosition);
    }
  
    modelViewMatrix = Matrix.translate(modelViewMatrix,[x,y,z]);
    modelViewMatrix = Matrix.rotate(modelViewMatrix,angleX,[1,0,0]);
    modelViewMatrix = Matrix.rotate(modelViewMatrix,angleY,[0,1,0]);
    modelViewMatrix = Matrix.rotate(modelViewMatrix,angleZ,[0,0,1]);
    modelViewMatrix = Matrix.scale(modelViewMatrix,[scalesX, scalesY, scalesZ]); 
  
    var normalMatrix = Matrix.createIdentityMatrix();
    normalMatrix = Matrix.normalizeMatrix(modelViewMatrix);
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition, 
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
  
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexColor,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexColor);
    }
  
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
      gl.vertexAttribPointer(
          programInfo.attribLocations.normalLoc,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.normalLoc);
    }
  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix,false,projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,false,modelViewMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrixLoc,false,normalMatrix);
    gl.uniform3fv(programInfo.uniformLocations.cameraPosLoc,  cameraPosition);
    let texture_mode =  document.getElementById("textureOption").value;
    gl.uniform1i(programInfo.uniformLocations.tex_modeLoc, texture_mode);
    // gl.uniform1f(programInfo.uniformLocations.kaLoc,document.getElementById("ka").value);
    // gl.uniform1f(programInfo.uniformLocations.kdLoc,document.getElementById("kd").value);
    // gl.uniform1f(programInfo.uniformLocations.ksLoc,document.getElementById("ks").value);
    // gl.uniform1f(programInfo.uniformLocations.shininessLoc,document.getElementById("shininess").value);
    const ka = 0.1;
    const kd = 0.8;
    const ks = 1;
    const shininess = 10;
    
    gl.uniform1f(programInfo.uniformLocations.kaLoc,ka);
    gl.uniform1f(programInfo.uniformLocations.kdLoc,kd);
    gl.uniform1f(programInfo.uniformLocations.ksLoc,ks);
    gl.uniform1f(programInfo.uniformLocations.shininessLoc,shininess);
    gl.uniform3fv(programInfo.uniformLocations.lightPosLoc,lightPos);
    gl.uniform3fv(programInfo.uniformLocations.ambientColorLoc,[tempambientColor[0],tempambientColor[1],tempambientColor[2]]);
    gl.uniform3fv(programInfo.uniformLocations.diffuseColorLoc,[tempdiffuseColor[0],tempdiffuseColor[1],tempdiffuseColor[2]]);
    gl.uniform3fv(programInfo.uniformLocations.specularColorLoc,[tempspecularColor[0],tempspecularColor[1],tempspecularColor[2]]);

    projectionMatrix = Matrix.perspective(fieldOfView, aspect, zNear, zFar);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionLocation,false,projectionMatrix);
    var cameraPosition = [0,0,2];
    var cameraTarget = [0,0,0];
    var up = [0,1,0];
    var cameraMatrix = Matrix.lookAt(cameraPosition,cameraTarget,up);
    var viewMatrix = Matrix.inverseMatrix(cameraMatrix);

    gl.uniformMatrix4fv(programInfo.uniformLocations.viewLocation,false,viewMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.worldLocation,false,viewMatrix);
    gl.uniform3fv(programInfo.uniformLocations.worldCameraPositionLocation,cameraPosition);

    // var textureLocation = gl.getUniformLocation(shaderProgram, "u_texture");
    // gl.uniform1i(textureLocation, 0);

    // Init textures
    {
        if (typeof tex_norm == 'undefined') {
            tex_norm = load_texture(gl, "./img/bump_normal.png");
            tex_diffuse = load_texture(gl, "./img/bump_diffuse.png");
            tex_depth = load_texture(gl, "./img/bump_depth.png");
            tex_cust = load_texture(gl, "./img/custom.png");
        }
    }

    {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex_norm);
        var uni = gl.getUniformLocation(shaderProgram, "tex_norm");
        gl.uniform1i(uni, 0);
    }

    {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, tex_diffuse);
        // gl.uniform1i(programInfo.uniformLocations.tex_diffuseLoc, 1);
        var uni = gl.getUniformLocation(shaderProgram, "tex_diffuse");
        gl.uniform1i(uni, 1);
    }

    {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, tex_depth);
        // gl.uniform1i(programInfo.uniformLocations.tex_depthLoc, 2);
        var uni = gl.getUniformLocation(shaderProgram, "tex_depth");
        gl.uniform1i(uni, 2);
    }

    if (first_init) {
      tex_env = texture_map(gl)
      first_init = false;
    }

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex_env);

    var textureLocation = gl.getUniformLocation(shaderProgram, "u_texture");
    gl.uniform1i(textureLocation, 3);

    {
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, tex_cust);
      // gl.uniform1i(programInfo.uniformLocations.tex_depthLoc, 2);
      var uni = gl.getUniformLocation(shaderProgram, "uSampler");
      gl.uniform1i(uni, 4);
  }

    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangents);
        gl.vertexAttribPointer(programInfo.attribLocations.tangentLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.tangentLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.bitangents);
        gl.vertexAttribPointer(programInfo.attribLocations.bitangentLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.bitangentLoc);
    }

    let vbo_uv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_uv);
    var uvs = [
      0, 1, 1, 0, 0, 0, 1, 1, // Front
      1, 1, 0, 0, 1, 0, 0, 1, // Back
      1, 1, 0, 0, 0, 1, 1, 0, // Right
      0, 1, 1, 0, 1, 1, 0, 0, // Left
      0, 0, 1, 1, 0, 1, 1, 0, // Top
      0, 1, 1, 0, 0, 0, 1, 1, // Bottom
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programInfo.attribLocations.uvLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.uvLoc);

    {
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }

  function load_texture(gl, img_path) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([255, 0, 0, 255])); // red

    var img = new Image();
    img.onload = function () {
        console.log("binded")
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    img.src = img_path;
    return tex;
}
