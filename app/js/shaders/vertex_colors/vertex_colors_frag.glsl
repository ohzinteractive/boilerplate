varying vec3 vNormal;
varying vec3 vColor;

void main()
{
	float diffuse = dot(normalize(vNormal), normalize(vec3(1., 1., 1.) ) ) * 0.5+0.5;

  gl_FragColor = vec4(mix(vColor*0.8, vColor, diffuse), 1.0);
  gl_FragColor.x = pow(abs(gl_FragColor.x), 0.4545);
  gl_FragColor.y = pow(abs(gl_FragColor.y), 0.4545);
  gl_FragColor.z = pow(abs(gl_FragColor.z), 0.4545);
}
