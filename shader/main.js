// Vertex coordinates corresponding to the edges of the canvas in shader-space.
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
		const gl = createContext(canvas)

		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

		const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER)
		const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

		const program = createProgram(gl, vertexShader, fragmentShader)

		gl.useProgram(program)
		gl.clearColor(0.5, 0.5, 0.5, 1.0)

		const vertexPositionAttribute = gl.getAttribLocation(program, "vertexPosition")
		const resolutionUniform = gl.getUniformLocation(program, "resolution")

		gl.uniform2f(resolutionUniform, canvas.width, canvas.height)

		gl.enableVertexAttribArray(vertexPositionAttribute)

		const vertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW)

		function draw() {
			gl.clear(gl.COLOR_BUFFER_BIT)

			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
			requestAnimationFrame(draw)
		}

		draw()
	})
})
