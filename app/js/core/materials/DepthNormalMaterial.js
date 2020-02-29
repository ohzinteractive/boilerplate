import vert from 'js/core/shaders/depth_normals/depth_normals_vert';
import frag from 'js/core/shaders/depth_normals/depth_normals_frag';

export default class DepthNormalMaterial extends THREE.ShaderMaterial
{
	constructor()
	{
		super({
      uniforms: {
      	_FarPlane: {value: 1}
      },
      vertexShader: vert,
      fragmentShader: frag
    });
	}

	set far_plane(value)
	{
		this.uniforms._FarPlane.value = value;
	}
	
}
