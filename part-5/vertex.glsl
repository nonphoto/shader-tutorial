attribute vec3 a_vertexPosition;

vec4 model_position;
vec4 translation;
mat4 projection;

// Declare a rotation matrix.
mat4 rotation;

mat4 perspective(float fovy, float aspect, float near, float far) {
	float f = 1.0 / tan(fovy / 2.0);
	float nf = 1.0 / (near - far);

	vec4 col0 = vec4(f / aspect, 0, 0, 0);
	vec4 col1 = vec4(0, f, 0, 0);
	vec4 col2 = vec4(0, 0, (far + near) * nf, -1.0);
	vec4 col3 = vec4(0, 0, 2.0 * far * near * nf, 0);

	return mat4(col0, col1, col2, col3);
}

/*
Calculate a new rotation matrix around the Y axis.
float rad - The radians to rotate by.
*/
mat4 rotateY(float rad) {
	float s = sin(rad);
	float c = cos(rad);

	vec4 col0 = vec4(c, 0, -s, 0);
	vec4 col1 = vec4(0, 1, 0, 0);
	vec4 col2 = vec4(s, 0, c, 0);
	vec4 col3 = vec4(0, 0, 0, 1);

	return mat4(col0, col1, col2, col3);
}

void main() {
	model_position = vec4(a_vertexPosition, 1.0);
	translation = vec4(0.0, 0.0, -4.0, 1.0);
	projection = perspective(0.8, 1.0, 1.0, 50.0);

	// Create a new rotation matrix.
	rotation = rotateY(1.0);

	// Rotate the original model vertices.
    gl_Position = ((model_position * rotation) + translation) * projection;
}
