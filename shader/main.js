// Vertex coordinates corresponding to the edges of the canvas in shader-space.
const vertexPositions = [
	-1, -1, 0,
	-1, 1, 0,
	1, -1, 0,
	1, 1, 0
]

// Wait for the document to load.
document.addEventListener('DOMContentLoaded', () => {

	// Grab the canvas element from the document and set its resolution.
	const canvas = document.getElementById('canvas')
	canvas.width = 800
	canvas.height = 600

	// Request the vertex and fragment shader files, they get returned as strings.
	const vertexSource = request('vertex.glsl')
	const fragmentSource = request('fragment.glsl')

	// Wait for both shaders to finish loading.
	Promise.all([vertexSource, fragmentSource]).then(([vertexSource, fragmentSource]) => {

		// Create a new WebGL context for the canvas element.
		const gl = createContext(canvas)

		// Set the dimensions of the viewport equal to the resolution. For example pixels
		// will be numbered horizontally from 0 to 800 instead of -1 to 1.
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

		// Create new shader objects from the vertex and fragment shader strings.
		const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER)
		const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

		// Create a new program with the two shaders. This is what actually runs on the GPU.
		const program = createProgram(gl, vertexShader, fragmentShader)
		gl.useProgram(program)

		// Set the clear color to a fetching magenta for debugging purposes.
		gl.clearColor(1.0, 0.0, 1.0, 1.0)

		// Clear the canvas. This sets every pixel to the clear color.
		gl.clear(gl.COLOR_BUFFER_BIT)

		// Create a new vertex buffer. This tells WebGL what geometry data we are using.
		// In this case, we only have four vertices, one at each corner of the screen.
		const vertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW)

		// Grab locations of our shader's uniforms and attributes in memory so we can
		// write values to them.
		const vertexPositionAttribute = gl.getAttribLocation(program, 'a_vertexPosition')
		const resolutionUniform = gl.getUniformLocation(program, 'u_resolution')
		const timeUniform = gl.getUniformLocation(program, 'u_time')

		// Set our vertex position attribute as the destination for values from the vertex
		// buffer. The vertex shader processes these vertices one at a time.
		gl.enableVertexAttribArray(vertexPositionAttribute)

		// Write the canvas's resolution to the resolution uniform location so we can reference
		// it in the shader program. We have two separate float values, so we use `uniform2f`.
		gl.uniform2f(resolutionUniform, canvas.width, canvas.height)

		// This is our draw function. We will call it on every animation frame.
		function draw(t) {

			// Write the current time to the time uniform memory location.
			// There's only one float value, so we use `uniform1f`.
			gl.uniform1f(timeUniform, t)

			// Pass in the vertex positions. We have to do this every frame, but in this demo
			// They never change. The 3 indicates that each vertex is a group
			// of 3 values in our array.
			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

			// Draw the frame. We're using the TRIANGLE_STRIP algorithm to
			// iterate over the vertex array.
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

			// Request a new animation frame. It tells the browser to call `draw` when the
			// next animation frame is ready, roughly 60 times per second.
			requestAnimationFrame(draw)
		}

		// Start the animation loop by drawing the first frame.
		draw(performance.now())
	})
})
