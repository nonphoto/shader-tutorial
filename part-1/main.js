const canvas = document.getElementById('canvas')
canvas.width = 1024
canvas.height = 1024

const vertexSource = request('vertex.glsl')
const fragmentSource = request('fragment.glsl')

Promise
.all([vertexSource, fragmentSource])
.then(([vertexSource, fragmentSource]) => {

	// Create a new WebGL context for the canvas element.
	const gl = createContext(canvas)

	// Create new shader objects from the vertex and fragment shader sources.
	const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER)
	const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

	// Create a new program with the two shaders.
	const program = createProgram(gl, vertexShader, fragmentShader)

	// Tell the GPU to use the program we just made.
	gl.useProgram(program)

	// Enable depth testing, important later.
	gl.enable(gl.DEPTH_TEST)

	// Set the clear color to a fetching pink for debugging purposes.
	gl.clearColor(1.0, 0.0, 1.0, 1.0)

	// Clear the canvas. This sets every pixel to the clear color.
	gl.clear(gl.COLOR_BUFFER_BIT)
})
