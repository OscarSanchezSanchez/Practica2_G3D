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
uniform mat4 modelView;

//Intensidad ambiental
vec3 Ia = vec3(0.1);

//propiedades de la fuente de luz (direccional)
vec3 IL = vec3(1);
vec4 DL = vec4(-1,0,0,0); 


//Propiedades del objeto
vec3 Ka = vec3(1,0,0);
vec3 Kd = vec3(1,0,0);
vec3 Ks = vec3(1);
float n = 100.0;
vec3 Ke = vec3(0);

vec3 N;

vec3 shade()
{	
	vec3 cf = vec3(0);

	////Ambiental////
	cf += Ia * Ka;

	////Difuso////
	vec3 L = normalize(DL.xyz);
	cf += clamp(IL*Kd*dot(Np,L),0,1);

	////Especular////
	vec3 V = normalize(-Pp); 
	vec3 R = reflect(-L,N);
	float fs = pow(max(0,dot(R,V)),n);
	cf += IL*Ks*fs;    
	
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
