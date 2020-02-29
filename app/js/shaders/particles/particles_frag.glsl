uniform float _Time;

varying vec3 vNormal;

void main()
{
	vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
	float x = length(uv * 2.0 - 1.0);

	float point = (1.0 - pow(x+0.75,10.0));
	float halo = pow((1.0-x)*0.6, 2.0);
	float alpha = mix(halo, point, point);

	float diffuse = dot(vec3(0.0, 1.0, 0.0), normalize(vNormal));
	vec3 col = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), diffuse * 0.5+0.5);
  gl_FragColor = vec4(col, max(halo,point));
}