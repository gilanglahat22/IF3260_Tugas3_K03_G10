class Vector{
    constructor(vector){
        this.vector = vector;
    }
    static subtract(v1, v2){
        return [v1[0]-v2[0],v1[1]-v2[1],v1[2]-v2[2]];
    }
    static cross(v1, v2){
        return [v1[1]*v2[2] - v1[2]*v2[1],
                v1[2]*v2[0] - v1[0]*v2[2],
                v1[0]*v2[1] - v1[1]*v2[0]];            
    }
    static normalize(v){
        var length = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
        if(length<=0.00001){
            return [0,0,0];
        }else{
            return [v[0] / length, v[1] / length, v[2] / length];
        }
    }
    static getVectorComponents(vertexPositions) {
        const n = vertexPositions.length;
        var vertexNormals = [];
        var vertexTangents = [];
        var vertexBitangents = [];
        for (let i = 0; i < n; i += 18){
          const p1 = [vertexPositions[i], vertexPositions[i+1], vertexPositions[i+2]];
          const p2 = [vertexPositions[i+3], vertexPositions[i+4], vertexPositions[i+5]];
          const p3 = [vertexPositions[i+6], vertexPositions[i+7], vertexPositions[i+8]];
      
          const vec1 = Vector.subtract(p2, p1);
          const vec2 = Vector.subtract(p3, p1);
          const normalDirection = Vector.cross(vec1, vec2);
      
          const vecNormal  = Vector.normalize(normalDirection);
          const vecTangent = Vector.normalize(vec1);
          const vecBitangent = Vector.normalize(vec2);
      
          for (let j = 0; j < 6; j++){
            vertexNormals = vertexNormals.concat(vecNormal);
            vertexTangents = vertexTangents.concat(vecTangent);
            vertexBitangents = vertexBitangents.concat(vecBitangent);
          }
        }
        return [vertexNormals, vertexTangents, vertexBitangents];
    }
}