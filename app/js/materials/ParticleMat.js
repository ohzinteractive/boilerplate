import BaseShaderMaterial from 'js/core/materials/BaseShaderMaterial'

import vert from 'js/shaders/particles/particles_vert';
import frag from 'js/shaders/particles/particles_frag';

export default class ParticleMat extends BaseShaderMaterial
{
	constructor()
	{
		super(vert, frag, {
			_Time: {value: 0}
		});

		this.transparent = true;
		this.depthWrite = false;
	}
}
