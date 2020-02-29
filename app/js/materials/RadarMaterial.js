import BaseShaderMaterial from 'js/core/materials/BaseShaderMaterial'
import Time from 'js/core/Time';

import vert from 'js/shaders/radar/radar_vert';
import frag from 'js/shaders/radar/radar_frag';
import ResourceContainer from 'js/core/ResourceContainer';

export default class RadarMaterial extends BaseShaderMaterial
{
	constructor()
	{
		super(vert, frag, {
			_Time: {value: 0},
			_MainTex: {value: ResourceContainer.get_resource("radar_base")}
		});

		this.transparent = true;
		this.depthWrite = false;

		this.elapsed_time = 0;
	}

	update()
	{
		this.uniforms._Time.value = Time.elapsed_time * 2;
	}

}
