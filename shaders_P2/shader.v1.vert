#version 330 core

in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;

uniform mat4 modelViewProj;
uniform mat4 normal;
uniform mat4 modelView;

out vec3 color;
out vec3 Pp;
out vec3 Np;



void main()
{
	Np = (normal * vec4(inNormal,0)).xyz;
	Pp = (modelView * vec4(inPos,1)).xyz;
	color = inColor;
	

	gl_Position =  modelViewProj * vec4 (inPos,1.0);
}
