uniform float _Time;
uniform sampler2D _MainTex;
uniform sampler2D _Background;

varying vec2 vUv;


vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}


void main()
{
	vec2 _RadarBounds = vec2(0.0, 125.0);
  vec2 center = vec2(0.5, 0.5);
  float _RadarAngle = _Time*-20.0 ;

  vec2 dir = rotate(vUv*2.0-1.0,_RadarAngle*0.01745329252)*0.5+0.5 - center;
  float dist = length(dir);
  vec4 col = texture2D(_MainTex, vUv);
  col.rgb *= col.a;

  vec4 RADAR_OUTTER_COLOR = vec4(0.0);

  vec2 RADAR_ANG = _RadarBounds.xy;

  float RING_SPACING = 0.2;
  float RING_WIDTH    = 0.01;

  if(dist<0.479)
  {
      float ang = (180.0 + atan(dir.y,dir.x) * 57.325);

      if(ang > 0.0 && ang < RADAR_ANG.y)
      {
          float t = 1.0-(ang/RADAR_ANG.y) ;

          vec4 GREEN = vec4(vec3(178.0, 253.0, 178.0)/255.0, 1.0);

          col+= GREEN * t;
      }
      else
      {
          col+= RADAR_OUTTER_COLOR;
      }
  }

  // col.a = 1.0;
  // col.r = 1.0;
  gl_FragColor = col;
}
