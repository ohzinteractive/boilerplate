
uniform vec2 _ScreenSize;
uniform vec2 _TextSize;
uniform vec2 _PixelOffset;
uniform float _DepthOffset;
uniform float _FixedDepth;
uniform float _DepthValue;
uniform float _UseAbsoluteScreenPosition;
uniform vec2 _ScreenPosition;
varying vec2 vUv;

uniform float _WorldTextSize;


void main()
{
  vec3 w_pos;
  w_pos.x = modelMatrix[0][3];
  w_pos.y = modelMatrix[1][3];
  w_pos.z = modelMatrix[2][3];


  mat4 MVP = projectionMatrix * modelViewMatrix;

  vec4 projected_pos = MVP * vec4(w_pos , 1.0);

  vec2 screen_pos = mix(projected_pos.xy / projected_pos.w, _ScreenPosition, _UseAbsoluteScreenPosition);

  vec2 dir = uv * 2.0 - 1.0;

  screen_pos = screen_pos * 0.5 + 0.5;
  screen_pos *= vec2(_ScreenSize.x, _ScreenSize.y);

  screen_pos.x = ceil(screen_pos.x);
  screen_pos.y = ceil(screen_pos.y);

  screen_pos += dir * (_TextSize/2.0) + _PixelOffset ;

  screen_pos /= vec2(_ScreenSize.x,_ScreenSize.y);
  screen_pos = screen_pos * 2.0 - 1.0;

  // gl_Position = vec4(screen_pos, 
  //                   mix(projected_pos.z / projected_pos.w - _DepthOffset, _DepthValue, _FixedDepth), 1.0);
  projected_pos.zw -= 150.0;

  gl_Position = vec4(screen_pos, 
                    projected_pos.z / projected_pos.w, 1.0);


  vUv = uv;

}