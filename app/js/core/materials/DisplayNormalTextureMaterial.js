import BlitMaterial from 'js/core/materials/BlitMaterial';
import frag from 'js/core/shaders/depth_normals/debug_normals_frag';
import depth_normals_vert from 'js/core/shaders/ssao/ssao_vert';

export default class DisplayNormalTextureMaterial extends BlitMaterial
{
	constructor()
	{
		super(frag, depth_normals_vert);
		this.uniforms._FarPlane						= { value: 1};
		this.uniforms._InverseProjMatrix	= { value: new THREE.Matrix4()};
	}
	
}
