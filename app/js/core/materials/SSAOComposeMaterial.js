import BlitMaterial from 'js/core/materials/BlitMaterial';
import frag from 'js/core/shaders/ssao/ssao_compose_frag';

export default class SSAOComposeMaterial extends BlitMaterial
{
	constructor()
	{
		super(frag);
		this.uniforms._AO = {value: undefined};
	}
	
}
