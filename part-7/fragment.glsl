// Set the precision.
precision mediump float;

// Get the color varying from the vertex shader.
varying vec4 v_color;

void main() {

    // Set the fragment color to the color given by the surrounding vertices.
	gl_FragColor = v_color;
}