attribute vec3 a_vertexPosition;

vec4 model_position;

// Declare translation vector.
vec4 translation;

// Declare projection matrix.
mat4 projection;

/*
Calculate a new projection matrix with perspective.
float fovy - The vertical field of view in radians.
float aspect - The aspect ratio of the canvas.
float near - The distance to the near clipping plane.
float far - The distance to the far clipping plane.
*/
mat4 perspective(float fovy, float aspect, float near, float far) {
	float f = 1.0 / tan(fovy / 2.0);
	float nf = 1.0 / (near - far);

	vec4 col0 = vec4(f / aspect, 0, 0, 0);
	vec4 col1 = vec4(0, f, 0, 0);
	vec4 col2 = vec4(0, 0, (far + near) * nf, -1.0);
	vec4 col3 = vec4(0, 0, 2.0 * far * near * nf, 0);

	return mat4(col0, col1, col2, col3);
}

void main() {
	model_position = vec4(a_vertexPosition, 1.0);

	// Create a new translation vector.
	translation = vec4(0.0, 0.0, -4.0, 1.0);

	// Create a new projection matrix.
	projection = perspective(0.8, 1.0, 1.0, 50.0);


    gl_Position = (model_position + translation) * projection;
}
