attribute vec2 a_vertexPosition;

varying vec2 v_texCoord;

void main() {
	v_texCoord = (a_vertexPosition + vec2(1, 1)) / 2.0;
	gl_Position = vec4(a_vertexPosition, 0, 1);
}