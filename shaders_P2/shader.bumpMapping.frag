#version 330 core

out vec4 outColor;

in vec3 color;
in vec3 Nv;
in vec3 Tv;
in vec3 Pp;
in vec2 texCoord;

uniform sampler2D colorTex;
uniform sampler2D emiTex;
uniform sampler2D normalTex;
uniform sampler2D specularTex;
//uniform sampler2D auxiliarTex;
uniform mat4 view;

uniform mat4 normal;

//Intensidad ambiental
vec3 Ia = vec3(0.01);

//propiedades de la fuente de luz (puntual)
vec3 Il1 = vec3(1.0f);
vec3 PL1 = (/*view*/vec4(0,0,0,1)).xyz; //si quiero que sea estatica, la multiplico por matrix view
vec3 C_atenuacion = vec3(1,0.1,0);

//Propiedades del objeto
vec3 Ka = vec3(1,0,0);
vec3 Kd = vec3(1,0,0);
vec3 Ks = vec3(1);
float n = 10.0;
vec3 Ke = vec3(0);


vec3 N;

vec3 shade()
{	
	float d = distance(Pp,PL1);
	float atenuation_factor = 1.0f/(C_atenuacion.z * d*d + C_atenuacion.y * d + C_atenuacion.x) ;
	float Fatt = min(atenuation_factor,1);
	vec3 cf = vec3(0);

	////Ambiental////
	cf += Ia * Ka;

	////Difuso////
	vec3 L = normalize(PL1 - Pp);
	cf += clamp(Il1*Kd*dot(N,L)*Fatt,0,1);

	////Especular////
	vec3 V = normalize(-Pp); 
	vec3 R = reflect(-L,N);
	float fs = pow(max(0,dot(R,V)),n);
	cf += Il1*Ks*fs*Fatt;
	cf += Ke;
	
	return cf;
}
void main()
{
	Kd = texture(colorTex,texCoord).rgb;
	Ka = Kd;
	Ks = texture(specularTex,texCoord).rgb;
	N = normalize(Nv);
	vec3 T = normalize(Tv);
	vec3 B = cross(N,T);
	mat3 TBN = mat3(T,B,N);

	//Ke = texture(emiTex,texCoord).rgb;
	N = texture(normalTex,texCoord).rgb;
	N = normalize(N * 2.0 - 1.0);
	N = normalize(TBN * N);
	outColor = vec4(shade(),1.0); 
	//outColor = 	vec4(abs(Nv),0.0);
}
