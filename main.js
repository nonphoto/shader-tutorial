function createContext(canvas) {
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
  if (gl) {
    return gl
  }
  else {
    throw 'WebGLNotSupported'
  }
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program
  }
  else {
    console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program))
    throw 'ProgramInitializationException'
  }
}

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
        reject(Error('Unable to load path'))
      }
    }

    request.send()
  })
}

const vertexPositions = [
	-1, -1, 0,
	-1, 1, 0,
	1, -1, 0,
	1, 1, 0
]

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById("canvas")
	canvas.width = 800
	canvas.height = 600

  const vertexSource = request('vertex.glsl')
  const fragmentSource = request('fragment.glsl')

	Promise.all([vertexSource, fragmentSource]).then(([vertexSource, fragmentSource]) => {
		const gl = util.createContext(canvas)

		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

		const vertexShader = util.createShader(gl, vertexSource, gl.VERTEX_SHADER)
		const fragmentShader = util.createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

		const program = util.createProgram(gl, vertexShader, fragmentShader)

		gl.useProgram(program)
		gl.clearColor(0.5, 0.5, 0.5, 1.0)

		const vertexPositionAttribute = gl.getAttribLocation(program, "vertexPosition")
		const resolutionUniform = gl.getUniformLocation(program, "resolution")

		const vertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW)

		function draw() {
			gl.clear(gl.COLOR_BUFFER_BIT)

			gl.uniform2f(resolutionUniform, canvas.width, canvas.height)

			gl.enableVertexAttribArray(vertexPositionAttribute)
			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
			requestAnimationFrame(draw)
		}

		draw()
	})
})
