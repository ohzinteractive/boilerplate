varying vec3 vNormal;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position ,1.0);
    gl_PointSize = 20.0;
    vNormal = normal;
}
