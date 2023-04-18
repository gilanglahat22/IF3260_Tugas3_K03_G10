class Matrix {
    constructor(matrix){
      this.matrix = matrix;
    }
    static createIdentityMatrix(){
      return [1,0,0,0,
              0,1,0,0,
              0,0,1,0,
              0,0,0,1];
    }

    static multiply(matrix_l, matrix_r){
      if (matrix_l.cols !== matrix_r.rows) {
        throw new Error("Matrix dimensions don't match");
      }
  
      let result_matrix = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) {
            sum += matrix_l[i*4 + k] * matrix_r[k*4 + j];
          }
          result_matrix.push(sum);
        }
      }
      return result_matrix;
    }
    
    static transpose(matrix){
      return [matrix[0],matrix[4],matrix[8],matrix[12],
              matrix[1],matrix[5],matrix[9],matrix[13],
              matrix[2],matrix[6],matrix[10],matrix[14],
              matrix[3],matrix[7],matrix[11],matrix[15]];
    }
    
    static translate(matrix,transVal){
      var moved12 = matrix[12]+(matrix[0]*transVal[0] + matrix[4]*transVal[1] + matrix[8]*transVal[2]);
      var moved13 = matrix[13]+(matrix[1]*transVal[0] + matrix[5]*transVal[1] + matrix[9]*transVal[2]);
      var moved14 = matrix[14]+(matrix[2]*transVal[0] + matrix[6]*transVal[1] + matrix[10]*transVal[2]);
      var moved15 = matrix[15]+(matrix[3]*transVal[0] + matrix[7]*transVal[1] + matrix[11]*transVal[2]);
      return [matrix[0],matrix[1],matrix[2],matrix[3],
              matrix[4],matrix[5],matrix[6],matrix[7],
              matrix[8],matrix[9],matrix[10],matrix[11],
              moved12,moved13,moved14,moved15];
    }

    static lookAt(camera, target, u){
      var zAxis = Matrix.normalizeMatrix(Vector.subtract(camera,target));
      var xAxis = Matrix.normalizeMatrix(Vector.cross(u, zAxis));
      var yAxis = Matrix.normalizeMatrix(Vector.cross(zAxis, xAxis));
      return [
        xAxis[0], xAxis[1], xAxis[2], 0,
        yAxis[0], yAxis[1], yAxis[2], 0,
        zAxis[0], zAxis[1], zAxis[2], 0,
        camera[0], camera[1], camera[2], 1
      ]
    }
    
    static rotate(matrix, rad, axis){
      let length = Math.hypot(axis[0],axis[1],axis[2]);
      if(length<0.000001) return null;
      let coorX = axis[0]/length,coorY=axis[1]/length,coorZ=axis[2]/length;
      let s = Math.sin(rad);
      let c = Math.cos(rad);
      let t = 1-c;
      let b00 = coorX * coorX * t + c;
      let b01 = coorY * coorX * t + coorZ * s;
      let b02 = coorZ * coorX * t - coorY * s;
      let b10 = coorX * coorY * t - coorZ * s;
      let b11 = coorY * coorY * t + c;
      let b12 = coorZ * coorY * t + coorX * s;
      let b20 = coorX * coorZ * t + coorY * s;
      let b21 = coorY * coorZ * t - coorX * s;
      let b22 = coorZ * coorZ * t + c;
      return [ matrix[0] * b00 + matrix[4] * b01 + matrix[8] * b02, 
               matrix[1] * b00 + matrix[5] * b01 + matrix[9] * b02,
               matrix[2] * b00 + matrix[6] * b01 + matrix[10] * b02,
               matrix[3] * b00 + matrix[7] * b01 + matrix[11] * b02,
               matrix[0] * b10 + matrix[4] * b11 + matrix[8] * b12, 
               matrix[1] * b10 + matrix[5] * b11 + matrix[9] * b12,
               matrix[2] * b10 + matrix[6] * b11 + matrix[10] * b12,
               matrix[3] * b10 + matrix[7] * b11 + matrix[11] * b12,
               matrix[0] * b20 + matrix[4] * b21 + matrix[8] * b22, 
               matrix[1] * b20 + matrix[5] * b21 + matrix[9] * b22,
               matrix[2] * b20 + matrix[6] * b21 + matrix[10] * b22,
               matrix[3] * b20 + matrix[7] * b21 + matrix[11] * b22,
               matrix[12],matrix[13],matrix[14],matrix[15]];
    }
    
    static scale(matrix, scale){
      return [ matrix[0]*scale[0],matrix[1]*scale[0],matrix[2]*scale[0],matrix[3]*scale[0],
               matrix[4]*scale[1],matrix[5]*scale[1],matrix[6]*scale[1],matrix[7]*scale[1],
               matrix[8]*scale[2],matrix[9]*scale[2],matrix[10]*scale[2],matrix[11]*scale[2],
               matrix[12],matrix[13],matrix[14],matrix[15]];
    }
    
    static perspective(fovy, aspect, near, far){
      let f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
      let matrix = [f / aspect, 0, 0, 0,
                    0, f, 0, 0,
                    0, 0, (far + near) * nf, -1,
                    0, 0, 2 * far * near * nf, 0];
      if (far==null||far==Infinity){
          matrix[10] = -1;
          matrix[14] = -2 * near;
      }
      return matrix;
    }
  
    static orthographic(left, right, bottom, top, near, far){
      let lr = 1 / (right-left), bt = 1 / (top-bottom), nf = 1 / (far-near);
      let matrix = [2 * lr, 0, 0, 0,
                    0, 2 * bt, 0, 0,
                    0, 0, 2*nf, 0,
                    0,0,0,1];
      return matrix;
    }
    
    static oblique(theta){
      //  Cabinet Projection
      let matrix = [1, 0, -Math.cos(toRadian(theta))/2, 0,
                    0, 1, Math.sin(toRadian(theta))/2, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1];
      
      matrix = Matrix.transpose(matrix);
      return matrix;
    }
  
    static inverseMatrix(m){
      let inv = [m[5]*m[10]*m[15]-m[5]*m[11]*m[14]-m[9]*m[6]*m[15]+m[9]*m[7]*m[14]+m[13]*m[6]*m[11]-m[13]*m[7]*m[10],
                    -m[1]*m[10]*m[15]+m[1]*m[11]*m[14]+m[9]*m[2]*m[15]-m[9]*m[3]*m[14]-m[13]*m[2]*m[11]+m[13]*m[3]*m[10],
                    m[1]*m[6]*m[15]-m[1]*m[7]*m[14]-m[5]*m[2]*m[15]+m[5]*m[3]*m[14]+m[13]*m[2]*m[7]-m[13]*m[3]*m[6],
                    -m[1]*m[6]*m[11]+m[1]*m[7]*m[10]+m[5]*m[2]*m[11]-m[5]*m[3]*m[10]-m[9]*m[2]*m[7]+m[9]*m[3]*m[6],
                    -m[4]*m[10]*m[15]+m[4]*m[11]*m[14]+m[8]*m[6]*m[15]-m[8]*m[7]*m[14]-m[12]*m[6]*m[11]+m[12]*m[7]*m[10],
                    m[0]*m[10]*m[15]-m[0]*m[11]*m[14]-m[8]*m[2]*m[15]+m[8]*m[3]*m[14]+m[12]*m[2]*m[11]-m[12]*m[3]*m[10],
                    -m[0]*m[6]*m[15]+m[0]*m[7]*m[14]+m[4]*m[2]*m[15]-m[4]*m[3]*m[14]-m[12]*m[2]*m[7]+m[12]*m[3]*m[6],
                    m[0]*m[6]*m[11]-m[0]*m[7]*m[10]-m[4]*m[2]*m[11]+m[4]*m[3]*m[10]+m[8]*m[2]*m[7]-m[8]*m[3]*m[6],
                    m[4]*m[9]*m[15]-m[4]*m[11]*m[13]-m[8]*m[5]*m[15]+m[8]*m[7]*m[13]+m[12]*m[5]*m[11]-m[12]*m[7]*m[9],
                    -m[0]*m[9]*m[15]+m[0]*m[11]*m[13]+m[8]*m[1]*m[15]-m[8]*m[3]*m[13]-m[12]*m[1]*m[11]+m[12]*m[3]*m[9],
                    m[0]*m[5]*m[15]-m[0]*m[7]*m[13]-m[4]*m[1]*m[15]+m[4]*m[3]*m[13]+m[12]*m[1]*m[7]-m[12]*m[3]*m[5],
                    -m[0]*m[5]*m[11]+m[0]*m[7]*m[9]+m[4]*m[1]*m[11]-m[4]*m[3]*m[9]-m[8]*m[1]*m[7]+m[8]*m[3]*m[5],
                    -m[4]*m[9]*m[14]+m[4]*m[10]*m[13]+m[8]*m[5]*m[14]-m[8]*m[6]*m[13]-m[12]*m[5]*m[10]+m[12]*m[6]*m[9],
                    m[0]*m[9]*m[14]-m[0]*m[10]*m[13]-m[8]*m[1]*m[14]+m[8]*m[2]*m[13]+m[12]*m[1]*m[10]-m[12]*m[2]*m[9],
                    -m[0]*m[5]*m[14]+m[0]*m[6]*m[13]+m[4]*m[1]*m[14]-m[4]*m[2]*m[13]-m[12]*m[1]*m[6]+m[12]*m[2]*m[5],
                    m[0]*m[5]*m[10]-m[0]*m[6]*m[9]-m[4]*m[1]*m[10]+m[4]*m[2]*m[9]+m[8]*m[1]*m[6]-m[8]*m[2]*m[5]];
      var det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];
      
      // Ignore when case det = 0;
      det = 1.0/det;
      for(var i = 0; i<16; i++) inv[i] *= det;
      return inv;
    }
  
    static normalizeMatrix(m){
      return this.transpose(this.inverseMatrix(m));
    }
  }