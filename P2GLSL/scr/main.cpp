#include "BOX.h"
#include <IGL/IGlib.h>

#define GLM_FORCE_RADIANS
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <iostream>

//Idenficadores de los objetos de la escena
int objId =-1;

//Declaración de CB
void resizeFunc(int width, int height);
void idleFunc();
void keyboardFunc(unsigned char key, int x, int y);
void mouseFunc(int button, int state, int x, int y);
void mouseMotionFunc(int x, int y);

//Matriz de vista
//Se ajusta la camara
//Si no se da valor se cogen valores por defecto
glm::mat4 view = glm::mat4(1.0f);

//Matriz de proyeccion
glm::mat4 proj = glm::mat4(0.0f);

//Traslación por teclado
float displacement = 0.1f;

//Giro de cámara por teclado
float yaw_angle = 0.01f;

//Movimiento de cámara con el ratón
const float orbitAngle = 0.1f;
float lastX = 0.0f;
float lastY = 0.0f;
float yaw = 0.0f;
float pitch = 0.0f;


int main(int argc, char** argv)
{
	std::locale::global(std::locale("spanish"));// acentos ;)
	if (!IGlib::init("../shaders_P2/shader.bumpMapping.vert", "../shaders_P2/shader.bumpMapping.frag"))
		return -1;

	//Se ajusta la cámara
	view[3].z = -5;

	proj = glm::mat4(1.0);
	float f = 1.0f / tan(3.141592f / 6.0f);
	float far = 10.0f;
	float near = 0.1f;

	proj[0].x = f;
	proj[1].y = f;
	proj[2].z = (far + near) / (near - far);
	proj[2].w = -1.0f;
	proj[3].z = (2.0f * far * near) / (near - far);
	proj[3].w = 0.0f;
	IGlib::setProjMat(proj);
	IGlib::setViewMat(view);

	//Creamos el objeto que vamos a visualizar
	objId = IGlib::createObj(cubeNTriangleIndex, cubeNVertex, cubeTriangleIndex, 
			cubeVertexPos, cubeVertexColor, cubeVertexNormal,cubeVertexTexCoord, cubeVertexTangent);
	IGlib::addColorTex(objId, "../img/color2.png");
	IGlib::addSpecularTex(objId, "../img/specMap.png");
	IGlib::addEmissiveTex(objId, "../img/emissive.png");
	IGlib::addNormalTex(objId, "../img/normal.png");
		
	glm::mat4 modelMat = glm::mat4(1.0f);
	IGlib::setModelMat(objId, modelMat);
	
	//CBs
	IGlib::setIdleCB(idleFunc);
	IGlib::setResizeCB(resizeFunc);
	IGlib::setKeyboardCB(keyboardFunc);
	IGlib::setMouseCB(mouseFunc);
	IGlib::setMouseMoveCB(mouseMotionFunc);
	
	//Mainloop
	IGlib::mainLoop();
	IGlib::destroy();
	return 0;
}

void resizeFunc(int width, int height)
{
	float aspectRatio = (float)width / (float)height;

	proj[0].x = 1 / (glm::tan(glm::radians(30.0f)) * aspectRatio);

	IGlib::setProjMat(proj);
}

void idleFunc()
{
	glm::mat4 modelMat(1.0f);
	static float angle = 0.0f;
	angle = (angle > 3.141592f * 2.0f) ? 0 : angle + 0.01f;
	
	modelMat = glm::rotate(modelMat, angle, glm::vec3(1.0f, 1.0f, 0.0f));

	IGlib::setModelMat(objId, modelMat);
}

void keyboardFunc(unsigned char key, int x, int y)
{
	std::cout << "Se ha pulsado la tecla " << key << std::endl << std::endl;

	glm::mat4 rotation(1.0f);

	switch (key)
	{
	case 'w':
		view = glm::translate(view, glm::vec3(0.0f, 0.0f, displacement));
		break;
	case 's':
		view = glm::translate(view, glm::vec3(0.0f, 0.0f, -displacement));
		break;
	case 'a':
		view = glm::translate(view, glm::vec3(displacement, 0.0f, 0.0f));
		break;
	case 'd':
		view = glm::translate(view, glm::vec3(-displacement, 0.0f, 0.0f));
		break;
	case 'q':
		rotation = glm::rotate(rotation, -yaw_angle, glm::vec3(0.0f, 1.0f, 0.0f));
		view = rotation * view;
		break;
	case 'e':
		rotation = glm::rotate(rotation, yaw_angle, glm::vec3(0.0f, 1.0f, 0.0f));
		view = rotation * view;
		break;
	default:
		break;
	}

	IGlib::setViewMat(view);

}

void mouseFunc(int button, int state, int x, int y)
{
	if (state == 0)
		std::cout << "Se ha pulsado el boton ";
	else
		std::cout << "Se ha soltado el boton ";

	if (button == 0) std::cout << "de la izquierda del raton " << std::endl;
	if (button == 1) std::cout << "central del raton " << std::endl;
	if (button == 2) std::cout << "de la derecha del raton " << std::endl;

	std::cout << "en la posicion " << x << " " << y << std::endl << std::endl;

	mouseMotionFunc(x, y);
}

void mouseMotionFunc(int x, int y)
{

	float xOffset = (float)x - lastX;
	float yOffset = (float)y - lastY;

	lastX = (float)x;
	lastY = (float)y;

	yaw += xOffset;
	pitch += yOffset;

	view = glm::rotate(view, orbitAngle, glm::vec3(yaw, pitch, 0.0));

	IGlib::setViewMat(view);
}
