attribute vec3 a_vertexPosition;

uniform mat4 u_projection;
uniform float u_time;

varying vec4 v_color;

vec4 model_position;
vec4 translation;
mat4 rotation;

mat4 rotateY(float rad) {
	float s = sin(rad);
	float c = cos(rad);

	return mat4(
		vec4(c, 0, -s, 0),
		vec4(0, 1, 0, 0),
		vec4(s, 0, c, 0),
		vec4(0, 0, 0, 1)
	);
}

void main() {
	v_color = vec4((a_vertexPosition * 0.5) + 0.5, 1.0);

	rotation = rotateY(u_time * 0.001);
	translation = vec4(0, 0, -3, 1);
	model_position = vec4(a_vertexPosition, 1.0);
	gl_Position = ((model_position * rotation) + translation) * u_projection;
}
