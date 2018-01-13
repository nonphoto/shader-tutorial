attribute vec3 a_vertexPosition;
attribute vec4 a_vertexColor;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

varying vec4 v_color;

vec3 color;

void main() {
	color = (a_vertexPosition * 0.5) + 0.5;
	v_color = vec4(color, 1.0);
	gl_Position = u_projection * u_view * u_model * vec4(a_vertexPosition, 1.0);
}
