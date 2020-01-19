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

//Luz ambiental
vec3 Ia = vec3(0.1);

//propiedades de la fuente de luz
vec3 Il1 = vec3(0.0, 0.0, 1.0);
vec3 PL1 = (/*view*/vec4(1,-1,0,1)).xyz; //si quiero que sea estatica, la multiplico por matrix view

//Segunda fuente de luz
vec3 Il2 = vec3(1.0, 0.0, 0.0);
vec3 Pl2 = vec4(-2,1,0,1).xyz; //si quiero que sea estatica, la multiplico por matrix view

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
	float atenuation_factor = 1.0f/(C_atenuacion.z * d*d + C_atenuacion.y * d + C_atenuacion.x);
	float Fatt = min(atenuation_factor,1);

	float d2 = distance(Pp,Pl2);
	atenuation_factor = 1.0f/(C_atenuacion.z * d2*d2 + C_atenuacion.y * d2 + C_atenuacion.x);
	float Fatt2 = min(atenuation_factor,1);

	vec3 cf = vec3(0);
	//Ambiental
	cf += Ia * Ka;

	//Difuso
	vec3 L = normalize(PL1 - Pp);
	cf += clamp(Il1*Kd*dot(Np,L)*Fatt,0,1);
	
	//Difuso 2
	vec3 L2 = normalize(Pl2 - Pp);
	cf += clamp(Il2*Kd*dot(Np,L2)*Fatt2,0,1);

	//Especular
	vec3 V = normalize(-Pp); 
	vec3 R = reflect(-L,N);
	float fs = pow(max(0,dot(R,V)),n);
	cf += Il1*Ks*fs*Fatt;

	//Especular 2
	vec3 R2 = reflect(-L2,N);
	float fs2 = pow(max(0,dot(R2,V)),n);
	cf += Il2*Ks*fs2*Fatt2;

	//Emisiva
	cf += Ke;

	return cf;
}

void main()
{
	Kd = texture(colorTex,texCoord).rgb;
	Ka = Kd;
	Ks = texture(specularTex,texCoord).rgb;
	Ke = texture(emiTex,texCoord).rgb;
	N = normalize(Np);
	outColor = vec4(shade(),1.0);   
}
