precision mediump float;

uniform vec2 resolution;

void main() {
	vec2 xy = gl_FragCoord.xy / resolution;
	gl_FragColor = vec4(xy, 0.0, 1.0);
}
