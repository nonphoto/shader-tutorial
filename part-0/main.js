// Get the canvas element and set the resolution.
const canvas = document.getElementById('canvas')
canvas.width = 1024
canvas.height = 1024

// Request the shdaer source files, they get returned as strings.
const vertexSource = request('vertex.glsl')
const fragmentSource = request('fragment.glsl')

// Wait for the source files to load.
Promise
.all([vertexSource, fragmentSource])
.then(([vertexSource, fragmentSource]) => {

	// Draw something in here eventually.

})

