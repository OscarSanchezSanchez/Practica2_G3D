#version 330 core

out vec4 outColor;
in vec3 color;
in vec3 Pp;
in vec3 Np;


//Luz ambiental
vec3 Ia = vec3(0.1);

//Propiedades de la fuente de Luz
vec3 Il1 = vec3(1);
vec3 Pl1 = vec3(0);

//Propiedades del Objeto
vec3 Ka = vec3(1,0,0);
vec3 Kd = vec3(1,0,0);
vec3 Ks = vec3(1);
vec3 Ke = vec3(0);
float n=100;
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
	Kd = color;
	Ka = color;
	N = normalize(Np);
	outColor = vec4(shade(), 1.0);   
}
