#version 330 core

out vec4 outColor;

in vec3 color;
in vec3 Np;
in vec3 Pp;

//Luz ambiental
vec3 Ia = vec3(0.1);

//propiedades de la fuente de luz
vec3 Il1 = vec3(1);
vec3 PL1 = vec3(0);//si quiero que sea estatica, la multiplico por matrix view

//Propiedades del objeto
vec3 Ka = vec3(1,0,0);
vec3 Kd = vec3(1,0,0);
vec3 Ks = vec3(1);
float n = 100.0;
vec3 Ke = vec3(0);

vec3 C_atenuacion = vec3(1,0,0);

vec3 N;

vec3 shade()
{
	float d = distance(PL1,Pp);
	float atenuation_factor = (C_atenuacion.z * pow(d,2) + C_atenuacion.y * d + C_atenuacion.x) * 0.5;
	vec3 cf = vec3(0);
	//Ambiental
	cf += Ia * Ka;

	//Difuso
	vec3 L = normalize(PL1 - Pp);
	cf += clamp(Il1*Kd*dot(Np,L),0,1);

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
	outColor = vec4(shade(),1.0);   
}
