varying vec3 vNormal;
varying vec3 vColor;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vNormal = normal;
    vColor = color;

}
