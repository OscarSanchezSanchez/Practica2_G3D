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

//propiedades de la fuente de luz(focal)
vec3 IL = vec3(1);
vec3 PL = vec3(0,0,0);
vec3 DL = vec3(0,0,-1);*******
float cone_angle = radians(10.0);
//vec3 C_atenuacion = vec3(1,0.25,0);


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

	//restriccion de luz focal
	////Ambiental////
	//cf += Ia * Ka;

	////Difuso////
	vec3 aux = PL - Pp;
	vec3 L = normalize(aux);

	bool frag_valid = dot(normalize(DL),-L) > cos(cone_angle);
	if(frag_valid)
	{
		cf += clamp (IL * Kd * dot(N,L),0,1) ;

		vec3 V = normalize(-Pp); 
		vec3 R = reflect(-L,N);
		float fs = pow(max(0,dot(R,V)),n);
		cf += IL*Ks*fs; 

	}

	////Especular////
	//cf += Ke;	

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
