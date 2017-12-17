const vertexPositions = [].concat(
	[-1, -1, 0],
	[-1, 1, 0],
	[1, -1, 0],
	[1, 1, 0]
)

const lightPosition = [10.0, 10.0, 5.0]

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('canvas')
	canvas.width = 800
	canvas.height = 600

	const vertexSource = request('vertex.glsl')
	const fragmentSource = request('fragment.glsl')

	Promise.all([vertexSource, fragmentSource]).then(([vertexSource, fragmentSource]) => {
		const gl = createContext(canvas)

		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

		const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER)
		const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

		const program = createProgram(gl, vertexShader, fragmentShader)

		gl.useProgram(program)
		gl.clearColor(1.0, 0.0, 1.0, 1.0)

		const vertexPositionAttribute = gl.getAttribLocation(program, 'a_vertexPosition')
		const resolutionUniform = gl.getUniformLocation(program, 'u_resolution')
		const lightPositionUniform = gl.getUniformLocation(program, 'u_lightPosition')

		const vertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW)

		function draw(t) {

			gl.uniform2f(resolutionUniform, canvas.width, canvas.height)
			gl.uniform3f(lightPositionUniform, Math.sin(t * 0.001) * 20, 20, Math.cos(t * 0.001) * 20)

			gl.enableVertexAttribArray(vertexPositionAttribute)
			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
			requestAnimationFrame(draw)
		}

		draw(performance.now())
	})
})
