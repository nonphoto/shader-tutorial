/**
* Create a new WebGL context. Throws an error if WebGL is not supported.
*/
function createContext(canvas) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
        return gl
    }
    else {
        throw new Error('WebGL is not supported.')
    }
}

/**
* Create a new WebGL program from a vertex and fragment shader pair.
*/
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program
    }
    else {
        throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program))
    }
}

/**
* Create a new WebGL shader object.
*/
function createShader(gl, source, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader
    }
    else {
        const message = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw new Error('Shader compilation failed: ' + message)
    }
}

/**
 * Create a new texture from an image.
 */
function createTexture(gl, sourceImage) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceImage)
    return texture
}

/**
 * Create a new empty texture.
 */
function createEmptyTexture(gl, width, height) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    return texture
}

/**
 * Create a new framebuffer object.
 */
function createFramebuffer(gl, texture) {
    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    return framebuffer
}

/**
* Request the file at the given path. Returns a promise that resolves to
* a string of the file's contents.
*/
function request(path) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('GET', path)
        request.responseType = 'text'

        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response)
            }
            else {
                reject(new Error('Unable to load path: ' + path))
            }
        }

        request.send()
    })
}