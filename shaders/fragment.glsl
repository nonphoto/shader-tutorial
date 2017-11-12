precision mediump float;

uniform vec2 resolution;

void main() {
	gl_FragColor = vec4(gl_FragCoord.xy, 1.0, 1.0);
}
