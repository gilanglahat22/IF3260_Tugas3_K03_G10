// Reference: http://www.cs.toronto.edu/~jacobson/phong-demo/
// Using Gouraud Shading

const VERTEX_SHADER = `
attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 normal;
uniform mat4 uProjectionMatrix, uModelViewMatrix, normalMat;
varying vec3 vertPos;

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

void main(){
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
}
`;