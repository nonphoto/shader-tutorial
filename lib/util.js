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
        gl.deleteShader(shader)
        throw new Error('Shader compilation failed: ' + gl.getShaderInfoLog(shader))
    }
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