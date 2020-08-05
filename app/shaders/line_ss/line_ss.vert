uniform float _Thickness;

uniform vec2 _ScreenSize;

attribute vec3 next_position;
attribute vec3 previous_position;
attribute float orientation;


varying float uv_u;


vec2 to_screen_pos(vec4 projected_pos)
{
  return ((projected_pos.xy / projected_pos.w)*0.5 + 0.5) * _ScreenSize;
}

vec2 project(vec3 pos)
{
	return to_screen_pos(projectionMatrix * modelViewMatrix * vec4(pos, 1.0));
}



void main()
{

	vec2 s_current 	= project(position);
	vec2 s_next 		= project(next_position);
	vec2 s_previous = project(previous_position);

	vec2 tangent_1 = normalize(s_current - s_previous);
	vec2 tangent_2 = normalize(s_next 		- s_current);
	vec2 miter_tangent = normalize(tangent_1 + tangent_2);
	vec2 miter = vec2(-miter_tangent.y , miter_tangent.x);

	float thickness = _Thickness / dot(normalize(miter), vec2(-tangent_2.y, tangent_2.x));

  gl_Position = (projectionMatrix * modelViewMatrix * vec4(position, 1.0));

	gl_Position.xy = s_current + miter * orientation * thickness;

  gl_Position.xy = ((gl_Position.xy / _ScreenSize) * 2.0 - vec2(1.0)) * gl_Position.w;


  uv_u = orientation * 0.5 + 0.5;

}