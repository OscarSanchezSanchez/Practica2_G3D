#version 330 core

out vec4 outColor;

in vec3 color;
in vec3 Np;
in vec3 Pp;
in vec2 texCoord;


uniform sampler2D colorTex;
uniform sampler2D emiTex;
//uniform sampler2D normalTex;
uniform sampler2D specularTex;
//uniform sampler2D auxiliarTex;
uniform mat4 view;

//Intensidad ambiental
vec3 Ia = vec3(0.1);

//propiedades de la fuente de luz
vec3 Il1 = vec3(0.75f);
vec3 PL1 = (/*view*/vec4(0,0,0,1)).xyz; //si quiero que sea estatica, la multiplico por matrix view

//segunda fuente de luz (direccional)
vec3 IL_direccional = vec3(1);
vec3 DL_direccional = vec4(1,0,0,0).xyz; //el 0 en w significa que es luz direccional, no tiene posicion en el espacio
//preguntar a marcos como posicionar bien la luz


//Propiedades del objeto
vec3 Ka = vec3(1,0,0);
vec3 Kd = vec3(1,0,0);
vec3 Ks = vec3(1);
float n = 100.0;
vec3 Ke = vec3(0);

vec3 C_atenuacion = vec3(1,0.25,0);

vec3 N;

vec3 shade()
{	
	float d = distance(Pp,PL1);
	float atenuation_factor = 1.0f/(C_atenuacion.z * d*d + C_atenuacion.y * d + C_atenuacion.x) ;
	float Fatt = min(atenuation_factor,1);
	vec3 cf = vec3(0);
	//Ambiental
	cf += Ia * Ka;

	//Difuso

	//puntual
	vec3 L = normalize(PL1 - Pp);
	cf += clamp(Il1*Kd*dot(Np,L)*Fatt,0,1);

	//direccional
	vec3 L_direccional = normalize(-DL_direccional/mod(DL_direccional.x,DL_direccional.y));//aqui creo q es negativo para simular que la luz esta en el infinto
	cf += clamp(IL_direccional*Kd*dot(Np,L_direccional),0,1);

	//Especular

	//puntual
	vec3 V = normalize(-Pp); 
	vec3 R = reflect(-L,N);
	float fs = pow(max(0,dot(R,V)),n);
	cf += Il1*Ks*fs*Fatt;
	cf += Ke;

	//direccional
	vec3 R_direccional = reflect(-L_direccional,N);
	fs = pow(max(0,dot(R_direccional,V)),n);
	cf += IL_direccional*Ks*fs;    

	return cf;
}

void main()
{
	Kd = color;
	Ka = color;
	N = normalize(Np);
	outColor = vec4(shade(),1.0); //para direccional se supone que tiene q ser un 0 en w.  
}
