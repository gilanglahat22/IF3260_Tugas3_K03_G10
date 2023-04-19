function texture_map(gl){
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    
    const faceInfos = [
    {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
        url: '../assets/pos-x.jpg',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
        url: '../assets/neg-x.jpg',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
        url: '../assets/pos-y.jpg',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
        url: '../assets/neg-y.jpg',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
        url: '../assets/pos-z.jpg',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
        url: '../assets/neg-z.jpg',
    },
    ];
    faceInfos.forEach((faceInfo) => {
    const {target, url} = faceInfo;
    
    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    
    // setup each face so it's immediately renderable
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
    
    // Asynchronously load an image
    const image = new Image();
    image.src = url;
    image.addEventListener('load', function() {
        // Now that the image has loaded upload it to the texture.
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(target, level, internalFormat, format, type, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}
