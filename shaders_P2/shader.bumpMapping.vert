#version 330 core

in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;

in vec3 inTangent;//bump
in vec2 inTexCoord;	

uniform mat4 normal;

uniform mat4 model;//bump

uniform mat4 modelView;
uniform mat4 modelViewProj;

uniform sampler2D normalTex;//bump

out vec3 color;
out vec2 texCoord;
out vec3 Pp;

out vec3 Nv;
out vec3 Tv;

void main()
{
	Pp = (modelView * vec4(inPos,1)).xyz;
	color = inColor;
	texCoord = inTexCoord;
	gl_Position =  modelViewProj * vec4 (inPos,1.0);
	
	//   calculo de la matriz TBN   //
	Tv = vec3(modelView * vec4(inTangent, 0.0));
	Nv = vec3(normal * vec4(inNormal,0.0));
}
