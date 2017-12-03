precision mediump float;

uniform vec2 resolution;
uniform vec3 lightPosition;

struct Sphere {
	vec3 p;
	float r;
};

struct Light {
	vec3 p;
	float kd;
	float ka;
};

struct Ray {
	vec3 p;
	vec3 d;
};

const Sphere A = Sphere(vec3(0.0, 0.0, 10.0), 2.0);

Light L = Light(lightPosition, 0.99, 0.2);

vec3 traceRay(in Ray R) {
	float a = dot(R.d, R.d);
	float b = dot(R.d, R.p - A.p) * 2.0;
	float c = dot(A.p, A.p) + dot(R.p, R.p) - (2.0 * dot(A.p, R.p)) - (A.r * A.r);

	float d = (b * b) - (4.0 * a * c);
	if (d >= 0.0) {
		float t = (-b - sqrt(d)) / 2.0 * a;
		vec3 Q = R.p + (t * R.d);
		vec3 N = (Q - A.p) / A.r;
		vec3 D = normalize(L.p - Q);
		float e = dot(N, D);
		return vec3((L.kd * e) + L.ka);
	}
	else {
		return vec3(0.0, 0.0, 1.0);
	}
}

void main() {
	float scaling = min(resolution.x, resolution.y);
	vec3 origin = vec3(0.0, 0.0, 0.0);
	vec3 direction = normalize(vec3((gl_FragCoord.xy - (resolution / 2.0)) / scaling, 1.0));
	Ray R = Ray(origin, direction);
	vec3 light = traceRay(R);
	gl_FragColor = vec4(light, 1.0);
}
