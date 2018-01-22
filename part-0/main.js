// Get the canvas element.
const canvas = document.getElementById('canvas')
canvas.width = 1024
canvas.height = 1024

// Request shader source files.
const vertexSource = request('vertex.glsl')
const fragmentSource = request('fragment.glsl')

// Wait for shader files to load.
Promise
.all([vertexSource, fragmentSource])
.then(([vertexSource, fragmentSource]) => {

	// Initialize some things here.

	function draw(t) {

		// Draw some things in here.

		window.requestAnimationFrame(draw)
	}

	draw(performance.now())
})

