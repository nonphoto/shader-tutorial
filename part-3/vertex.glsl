// Declare a new attribute for the vertex position.
attribute vec3 a_vertexPosition;

void main() {

    // Pass our vertex attribute to the output vector by creating a new vec4.
    gl_Position = vec4(a_vertexPosition, 1.0);
}
