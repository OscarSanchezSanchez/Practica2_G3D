#version 330 core



in vec3 color;
in vec3 Pp;
in vec3 Np;
in vec2 texCoord;

uniform sampler2D colorTex;
uniform sampler2D emiTex;
//uniform sampler2D normalTex;
uniform sampler2D specularTex;
uniform sampler2D auxiliarTex;

out vec4 outColor;

//Luz ambiental
vec3 Ia = vec3(0.35);

//Propiedades de la fuente de Luz
vec3 Il1 = vec3(0.5);
vec3 Pl1 = vec3(0);

//Propiedades del Objeto
vec3 Ka = vec3(1,0,0);
vec3 Kd = vec3(1,0,0);
vec3 Ks = vec3(1);
vec3 Ke = vec3(0);
float n=100;
vec3 N;
float AO;

vec3 shade()
{
	vec3 cf = vec3(0);

	//Ambiental
	cf += Ia*Ka*AO;

	//Difuso
	vec3 L = normalize(Pl1-Pp);
	cf += clamp(Il1*Kd*dot(N,L),0,1);

	//Especular
	vec3 V = normalize(-Pp);
	vec3 R = reflect(-L,N);
	float fs = pow(max(0,dot(R,V)),n);
	cf+= Il1*Ks*fs;
	
	cf+=Ke;

	return cf;

}



void main()
{
	Kd = texture(colorTex, texCoord).rgb;
	Ka = Kd;
	Ks = texture(specularTex, texCoord).rgb;
	Ke = texture(emiTex, texCoord).rgb;

	AO =texture(auxiliarTex, texCoord).r;
	AO=1;
	

	N = normalize(Np);
	outColor = vec4(shade(), 1.0);   
}
