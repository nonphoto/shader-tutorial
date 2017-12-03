const positions = [
	-1.0, -1.0, -1.0,
	-1.0, -1.0, 1.0,
	-1.0, 1.0, -1.0,
	-1.0, 1.0, 1.0,
	1.0, -1.0, -1.0,
	1.0, -1.0, 1.0,
	1.0, 1.0, -1.0,
	1.0, 1.0, 1.0
];

const colors = [
	0.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 1.0, 1.0,
	0.0, 1.0, 0.0, 1.0,
	0.0, 1.0, 1.0, 1.0,
	1.0, 0.0, 0.0, 1.0,
	1.0, 0.0, 1.0, 1.0,
	1.0, 1.0, 0.0, 1.0,
	1.0, 1.0, 1.0, 1.0,
];

const elements = [
	0, 1, 3, 0, 2, 3,
	5, 4, 6, 5, 7, 6,
	4, 0, 2, 4, 6, 2,
	1, 5, 7, 1, 3, 7,
	2, 6, 7, 2, 3, 7,
	0, 4, 5, 0, 1, 5
];

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const gl = util.createContext(canvas);
	const vertexShader = util.createShader(gl, 'vertex.glsl', gl.VERTEX_SHADER);
	const fragmentShader = util.createShader(gl, 'fragment.glsl', gl.FRAGMENT_SHADER);

	Promise.all([vertexShader, fragmentShader]).then(([vertexShader, fragmentShader]) => {
		const program = util.createProgram(gl, vertexShader, fragmentShader);
		gl.useProgram(program);
		gl.enable(gl.DEPTH_TEST);

		var t0 = Date.now();

		var modelMatrix = mat4.create();
		mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(5, 5, 5));

		const viewMatrix = mat4.create();
		mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, 20));
		mat4.invert(viewMatrix, viewMatrix);

		const fov = Math.PI * 0.5;
		const aspectRatio = window.innerWidth / window.innerHeight;
		const projectionMatrix = util.createProjectionMatrix(fov, aspectRatio, 1, 50);

		const vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
		const vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
		const modelUniform = gl.getUniformLocation(program, "uModel");
		const viewUniform = gl.getUniformLocation(program, "uView");
		const projectionUniform = gl.getUniformLocation(program, "uProjection");

		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		const colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

		const elementBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW);

		function draw() {
			const t1 = Date.now();
			const dt = t1 - t0;
			t0 = t1;

			mat4.rotateY(modelMatrix, modelMatrix, dt * 0.0003);
			mat4.rotateX(modelMatrix, modelMatrix, dt * 0.0005);
			gl.uniformMatrix4fv(modelUniform, false, new Float32Array(modelMatrix));
			gl.uniformMatrix4fv(viewUniform, false, new Float32Array(viewMatrix));
			gl.uniformMatrix4fv(projectionUniform, false, new Float32Array(projectionMatrix));

			gl.enableVertexAttribArray(vertexPositionAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(vertexColorAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);

			gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
			requestAnimationFrame(draw);
		}

		draw();
	});
})

