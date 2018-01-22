attribute vec3 a_vertexPosition;

vec4 model_position;
vec4 translation;

void main() {
	model_position = vec4(a_vertexPosition, 1.0);
	translation = vec4(0, 0, -4.0, 1.0);

    gl_Position = model_position + translation;
}
