function initBuffer(gl, data){
    const { vertices, indices, faceColors, faceColorsCount } = data;
    // Buat verticesnya
    const verticesBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Buat index
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);

    // Buat colors
    let colors = [];
    // document.getElementById("color-picker").value = arrayToRGB(faceColors);
    for (let j = 0; j < faceColorsCount; ++j) {
        const c = faceColors;

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let vertexPositions = []
    for (let i = 0; i < indices.length; i++) {
        vertexPositions = vertexPositions.concat(vertices[indices[i]])
    }
    let [vertexNormals, vertexTangents, vertexBitangents] = Vector.getVectorComponents(vertexPositions)

    // buffer

    let vbo_tang = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_tang);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTangents), gl.STATIC_DRAW);

    let vbo_bitang = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_bitang);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexBitangents), gl.STATIC_DRAW);

    return {
        vertices: verticesBuffer,
        indices: indexBuffer,
        colors: colorBuffer,
        tangents: vbo_tang,
        bitangents: vbo_bitang,
    };
}

function updateBuffer(gl, data){
    const { vertices, indices, faceColors, faceColorsCount } = data;
    // Buat verticesnya
    const verticesBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Buat index
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);

    // Buat colors
    let colors = [];
    // const color = document.getElementById("color-picker").value;
    // const rgbcolor = rgbToArray(color);
    for (let j = 0; j < faceColorsCount; ++j) {
        // const c = rgbcolor;
        const c = faceColors;

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return {
        vertices: verticesBuffer,
        indices: indexBuffer,
        colors: colorBuffer,
    };
}

function rgbToArray(rgbString) {
    rgbString = rgbString.substring(1);
  
    var red = parseInt(rgbString.substring(0, 2), 16) / 255;
    var green = parseInt(rgbString.substring(2, 4), 16) / 255;
    var blue = parseInt(rgbString.substring(4, 6), 16) / 255;
  
    return [red, green, blue, 1];
} 

function arrayToRGB(array) {
    var red = Math.round(array[0] * 255);
    var green = Math.round(array[1] * 255);
    var blue = Math.round(array[2] * 255);
    return "#" + red.toString(16) + green.toString(16) + blue.toString(16);
}