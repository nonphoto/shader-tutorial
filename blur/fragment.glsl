precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture;
uniform float u_resolution;
uniform float u_radius;
uniform vec2 u_direction;

void main() {
	vec4 sum = vec4(0.0);
	vec2 step = (u_radius / u_resolution) * u_direction;

	sum += texture2D(u_texture, v_texCoord - (step * 4.0)) * 0.0162162162;
	sum += texture2D(u_texture, v_texCoord - (step * 3.0)) * 0.0540540541;
	sum += texture2D(u_texture, v_texCoord - (step * 2.0)) * 0.1216216216;
	sum += texture2D(u_texture, v_texCoord - step) * 0.1945945946;
	sum += texture2D(u_texture, v_texCoord) * 0.2270270270;
	sum += texture2D(u_texture, v_texCoord + step) * 0.1945945946;
	sum += texture2D(u_texture, v_texCoord + (step * 2.0)) * 0.1216216216;
	sum += texture2D(u_texture, v_texCoord + (step * 3.0)) * 0.0540540541;
	sum += texture2D(u_texture, v_texCoord + (step * 4.0)) * 0.0162162162;

	gl_FragColor = vec4(sum.rgb, 1.0);
}
