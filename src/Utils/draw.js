// Buat Draw Object
function drawObject(gl, _programInfo, buffers, vertexCount) {
    const shaderProgram = initShaders(gl, VERTEX_SHADER);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition:  gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            normalLoc: gl.getAttribLocation(shaderProgram, 'normal'),
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
        }
    };

    // gl.enable(gl.DEPTH_TEST);          
    // gl.depthFunc(gl.LEQUAL);           
    // gl.viewport(0.0, 0.0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // const lightPos = [document.getElementById("lightX").value, document.getElementById("lightY").value, document.getElementById("lightZ").value];
    // const tempambientColor = rgbToArray(document.getElementById("ambient-color").value);
    // const tempdiffuseColor = rgbToArray(document.getElementById("diffuse-color").value);
    // const tempspecularColor = rgbToArray(document.getElementById("specular-color").value);
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
    // const cameraAngleRadian = ((document.getElementById('cam-rotation').value  - 50.0) * Math.PI) / 25.0;
    const cameraAngleRadian = 0;
    // const projectionType = document.getElementById('perspectiveOption').value;
    const projectionType = "perspective";
    // let radius = -((document.getElementById('cam-radius').value - 50.0) / 25.0) + 5.5;
    let radius = 5.5;
    // const angleX = document.getElementById("rotasiX").value / 100;
    // const angleY = document.getElementById("rotasiY").value / 100;
    // const angleZ = document.getElementById("rotasiZ").value / 100;
    // const x = document.getElementById("translasiX").value / 100;
    // const y = document.getElementById("translasiY").value / 100;
    // const z = document.getElementById("translasiZ").value / 100;
    // var scalesX = document.getElementById("scalingX").value;
    // var scalesY = document.getElementById("scalingY").value;
    // var scalesZ = document.getElementById("scalingZ").value;
    const angleX = 0;
    const angleY = 10;
    const angleZ = 10;
    const x = 0;
    const y = 0;
    const z = 0;
    var scalesX = 1;
    var scalesY = 1;
    var scalesZ = 1;
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
    
    // if(resetDefault==0){
    //   if(state.animation && state.timeout && angleAnimation<180){
    //     modelViewMatrix = Matrix.rotate(modelViewMatrix,angleAnimation/100,[1,0,0]);
    //     modelViewMatrix = Matrix.rotate(modelViewMatrix,angleAnimation/100,[0,1,0]);
    //     if(angleAnimation + incAngle/numRender >=180){
    //       incAngle = -0.5;
    //       angleAnimation += (incAngle/numRender);
    //     }else if(angleAnimation + incAngle/numRender <=-180){
    //       incAngle = 0.5;
    //       angleAnimation += (incAngle/numRender);
    //     }else{
    //       angleAnimation += (incAngle/numRender);
    //     }
    //   }
    //   else{
    //     modelViewMatrix = Matrix.rotate(modelViewMatrix,angleAnimation/100,[1,0,0]);
    //     modelViewMatrix = Matrix.rotate(modelViewMatrix,angleAnimation/100,[0,1,0]);
    //   }
    // }
  
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
    
    {
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }