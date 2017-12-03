attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

varying vec4 vColor;

void main() {
	vColor = aVertexColor;
	gl_Position = uProjection * uView * uModel * vec4(aVertexPosition, 1);
}
