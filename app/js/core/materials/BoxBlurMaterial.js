import BlitMaterial from 'js/core/materials/BlitMaterial';
import frag from 'js/core/shaders/box_blur/box_blur_frag';

export default class BoxBlurMaterial extends BlitMaterial
{
	constructor()
	{
		super(frag);
		this.uniforms._SampleDir = { value: new THREE.Vector2()};
	}
	
}
