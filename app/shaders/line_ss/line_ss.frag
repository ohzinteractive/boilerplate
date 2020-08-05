// varying float uv_u;
// varying float line_coverage;


// #include <logdepthbuf_pars_fragment>


// float aastep(float threshold, float value) {
//   #ifdef GL_OES_standard_derivatives
//     float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
//     return smoothstep(threshold-afwidth, threshold+afwidth, value);
//   #else
//     return step(threshold, value);
//   #endif  
// }

void main()
{
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);


// #include <logdepthbuf_fragment>
	
}