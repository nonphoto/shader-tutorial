
const positions = [].concat(
	[-1.0, -1.0, -1.0],
	[-1.0, -1.0, 1.0],
	[-1.0, 1.0, -1.0],
	[-1.0, 1.0, 1.0],
	[1.0, -1.0, -1.0],
	[1.0, -1.0, 1.0],
	[1.0, 1.0, -1.0],
	[1.0, 1.0, 1.0]
)

const elements = [].concat(
	[0, 1, 3], [0, 2, 3],
	[5, 4, 6], [5, 7, 6],
	[4, 0, 2], [4, 6, 2],
	[1, 5, 7], [1, 3, 7],
	[2, 6, 7], [2, 3, 7],
	[0, 4, 5], [0, 1, 5]
)

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('canvas')
	canvas.width = 1024
	canvas.height = 1024

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
		gl.clear(gl.COLOR_BUFFER_BIT)

		gl.enable(gl.DEPTH_TEST)

		const fieldOfView = Math.PI / 2
		const aspectRatio = canvas.width / canvas.height
		const projectionMatrix = mat4.create()
		mat4.perspective(projectionMatrix, fieldOfView, aspectRatio, 1, 50)

		const vertexPositionAttribute = gl.getAttribLocation(program, 'a_vertexPosition')
		const projectionUniform = gl.getUniformLocation(program, 'u_projection')
		const timeUniform = gl.getUniformLocation(program, 'u_time')

		const vertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

		const elementBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW)

		function draw(t) {
			gl.uniformMatrix4fv(projectionUniform, false, projectionMatrix)
			gl.uniform1f(timeUniform, t)

			gl.enableVertexAttribArray(vertexPositionAttribute)
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)

			gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
			requestAnimationFrame(draw)
		}

		draw(performance.now())
	})
})

