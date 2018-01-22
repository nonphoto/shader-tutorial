// These are the vertex positions for a cube.
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

// These are the indices to use when drawing the cube as a group of triangles.
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

	// Create a new buffer and fill it with our vertices.
	const vertexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

	// Create a new buffer and fill it with our element indices.
	const elementBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW)
})
