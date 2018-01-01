let frame = 0
let totalTime = 0

function logTime(callback) {
	const start = performance.now()

	callback()

	const end = performance.now()
	const time = end - start
	totalTime += time

	if (frame % 30 === 0) {
		console.log(totalTime / frame)
	}

	frame += 1
}

class BlurProgram {
	constructor(gl, vertexShader, fragmentShader) {
		this.program = createProgram(gl, vertexShader, fragmentShader)
		gl.useProgram(this.program)


		const vertices = [].concat(
			[-1, -1],
			[-1, 1],
			[1, -1],
			[1, 1]
		)

		// Create the vertex buffer.
		this.vertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

		// Enable vertex attribute array.
		this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'a_vertexPosition')
		gl.enableVertexAttribArray(this.vertexPositionAttribute)
		gl.vertexAttribPointer(this.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0)

		this.textureUniform = gl.getUniformLocation(this.program, 'u_texture')
		this.resolutionUniform = gl.getUniformLocation(this.program, 'u_resolution')
		this.radiusUniform = gl.getUniformLocation(this.program, 'u_radius')
		this.directionUniform = gl.getUniformLocation(this.program, 'u_direction')

	}

	apply(gl, texture, framebuffer, resolution, radius, direction) {
		gl.useProgram(this.program)

		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
		gl.bindTexture(gl.TEXTURE_2D, texture)

		gl.uniform1i(this.textureUniform, 0)
		gl.uniform1f(this.resolutionUniform, resolution)
		gl.uniform1f(this.radiusUniform, radius)
		gl.uniform2fv(this.directionUniform, direction)

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	}
}

let mouse = { x: 0, y: 0 }

document.addEventListener('mousemove', (event) => {
	mouse.x = event.clientX
	mouse.y = event.clientY
})

document.addEventListener('DOMContentLoaded', () => {
	const sourceImage = document.getElementById('source-image')
	const canvas = document.getElementById('canvas')

	canvas.width = canvas.clientWidth
	canvas.height = canvas.clientHeight

	const gl = createContext(canvas)
	gl.clearColor(1.0, 0.0, 1.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const TEXTURE_SIZE = 512

	const vertexSource = request('vertex.glsl')
	const fragmentSource = request('fragment.glsl')

	Promise.all([vertexSource, fragmentSource]).then(([vertexSource, fragmentSource]) => {

		// Create shaders.
		const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER)
		const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

		// Create source texture from image.
		const sourceTexture = createTexture(gl, sourceImage)

		const frontTexture = createEmptyTexture(gl, TEXTURE_SIZE, TEXTURE_SIZE)
		const frontBuffer = createFramebuffer(gl, frontTexture)

		const backTexture = createEmptyTexture(gl, TEXTURE_SIZE, TEXTURE_SIZE)
		const backBuffer = createFramebuffer(gl, backTexture)

		// Initialize blur program.
		const blur = new BlurProgram(gl, vertexShader, fragmentShader)

		function draw(t) {

			const radius = Math.abs((mouse.x / window.innerWidth) - 0.5)

			logTime(() => {
				blur.apply(gl, sourceTexture, frontBuffer, TEXTURE_SIZE, radius, [0, 1])
				blur.apply(gl, frontTexture, null, canvas.width, radius, [1, 0])
			})

			requestAnimationFrame(draw)
		}

		requestAnimationFrame(draw)
	})
})