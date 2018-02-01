const positions = [
	-1.0, -1.0, -1.0,
	-1.0, -1.0, 1.0,
	-1.0, 1.0, -1.0,
	-1.0, 1.0, 1.0,
	1.0, -1.0, -1.0,
	1.0, -1.0, 1.0,
	1.0, 1.0, -1.0,
	1.0, 1.0, 1.0
]

const elements = [
	0, 1, 3,
	0, 2, 3,
	5, 4, 6,
	5, 7, 6,
	4, 0, 2,
	4, 6, 2,
	1, 5, 7,
	1, 3, 7,
	2, 6, 7,
	2, 3, 7,
	0, 4, 5,
	0, 1, 5
]

const canvas = document.getElementById('canvas')
canvas.width = 1024
canvas.height = 1024

const vertexSource = request('vertex.glsl')
const fragmentSource = request('fragment.glsl')

Promise
.all([vertexSource, fragmentSource])
.then(([vertexSource, fragmentSource]) => {

	const gl = createContext(canvas)

	const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER)
	const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

	const program = createProgram(gl, vertexShader, fragmentShader)
	gl.useProgram(program)
	gl.clearColor(1.0, 0.0, 1.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

 	const vertexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

	const elementBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW)

	// Get the memory location allocated to our vertex position attribute in the vertex shader.
	const vertexPositionAttribute = gl.getAttribLocation(program, 'a_vertexPosition')

	// Enable the vertex attribute array. This tells the vertex shader to iterate over our vertex attributes.
	gl.enableVertexAttribArray(vertexPositionAttribute)

	// Bind the vertex buffer so we can edit it.
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

	// Specify the memory layout. In this case our vertices each have 3 float components.
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

	// Bind the element array buffer before drawing.
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)

	// Draw each of our triangles to the frame.
	gl.drawElements(gl.TRIANGLES, elements.length, gl.UNSIGNED_SHORT, 0)
})
