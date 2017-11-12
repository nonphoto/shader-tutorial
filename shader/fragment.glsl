precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 xy = gl_FragCoord.xy / u_resolution;
	float z = (sin(u_time / 1000.0) + 1.0) * 0.5;
	gl_FragColor = vec4(xy, z, 1.0);
}
