#version 330 core

in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;

uniform mat4 modelViewProj;
uniform mat4 normal;
uniform mat4 modelView;

out vec3 color;

//Luz ambiental
vec3 Ia = vec3(0.1);

//Propiedades de la fuente de Luz
vec3 Il1 = vec3(1);
vec3 Pl1 = vec3(0);

//Propiedades del Objeto
vec3 Pp;
vec3 Np;
vec3 Ka = vec3(1,0,0);
vec3 Kd = vec3(1,0,0);
vec3 Ks = vec3(1);
vec3 Ke = vec3(0);
float n=10;
vec3 N;

vec3 shade()
{
	vec3 cf = vec3(0);

	//Ambiental
	cf += Ia*Ka;

	//Difuso
	vec3 L = normalize(Pl1-Pp);
	cf += clamp(Il1*Kd*dot(N,L),0,1);

	//Especular
	vec3 V = normalize(-Pp);
	vec3 R = reflect(-L,N);
	float fs = pow(max(0,dot(R,V)),n);
	cf+= Il1*Ks*fs;
	
	return cf;

}


void main()
{
	Np = (normal * vec4(inNormal,0)).xyz;
	Pp = (modelView * vec4(inPos,1)).xyz;

	N = normalize(Np);

	
	color = shade();
	gl_Position =  modelViewProj * vec4 (inPos,1.0);
}
