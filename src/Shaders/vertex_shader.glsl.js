// Reference: http://www.cs.toronto.edu/~jacobson/phong-demo/
// Using Gouraud Shading

const VERTEX_SHADER = `
attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 normal;
uniform mat4 uProjectionMatrix, uModelViewMatrix, normalMat;
varying vec3 vertPos;

attribute vec3 vert_tang;
attribute vec3 vert_bitang;
uniform vec3 camera_pos;
attribute vec2 vert_uv;

// Reflect Coefficients
uniform float coefKa, coefKd, coefKs;

// Shinines Value
uniform float shininessVal;

// Material color
uniform vec3 ambientColor,diffuseColor,specularColor;

// Light Position
uniform vec3 lightPos;

// Vector Color
varying vec4 shadingColor; //Shading Color
varying lowp vec3 basicColor; // Color for default (flat shading)

// Bump maping
// varying mat3 v_tbn;
varying vec2 frag_uv;
varying vec3 ts_light_pos; // Tangent space values
varying vec3 ts_view_pos;  //
varying vec3 ts_frag_pos;  //

// Texture mode
uniform int tex_mode;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;

mat3 transpose(in mat3 inMatrix)
{
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];

    mat3 outMatrix = mat3(
        vec3(i0.x, i1.x, i2.x),
        vec3(i0.y, i1.y, i2.y),
        vec3(i0.z, i1.z, i2.z)
    );

    return outMatrix;
}

void main(){
  if (tex_mode == 0) {
    basicColor = aVertexColor;
    vec3 normalInterp = vec3(normalMat * vec4(normal, 0.0));
    vec4 vertPos4 = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;

    vec3 N = normalize(normalInterp),L = normalize(lightPos - vertPos);
    
    // Apply Lambert's cosine law
    float lambert = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambert > 0.0) {
      vec3 R = reflect(-L, N);      // Reflected light vector
      vec3 V = normalize(-vertPos); // Vector to viewer
      specular = pow(max(dot(R, V), 0.0), shininessVal); // Compute the specular value
    }
    
    shadingColor = vec4(coefKa * ambientColor + coefKd * lambert * diffuseColor + coefKs * specular * specularColor, 1.0);
    
    gl_Position = uProjectionMatrix * vertPos4;
  } else if (tex_mode == 1) {
    vec4 vertPos4 = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;

    gl_Position = uProjectionMatrix * vertPos4;
    // Bump mapping variables
    vec3 t = normalize(mat3(normalMat) * vert_tang);
    vec3 b = normalize(mat3(normalMat) * vert_bitang);
    vec3 n = normalize(mat3(normalMat) * normal);
    mat3 tbn = transpose(mat3(t, b, n));

    ts_light_pos = tbn * lightPos;
    ts_view_pos = tbn * camera_pos;
    ts_frag_pos = tbn * vertPos;

    frag_uv = vert_uv;
  } else if (tex_mode == 2) {
    vec4 a_position = vec4(aVertexPosition, 1.0);
    gl_Position = u_projection * uModelViewMatrix * a_position;

    v_worldPosition = (uModelViewMatrix * a_position).xyz;
    v_worldNormal = mat3(uModelViewMatrix) * normal;
  }
}
`;