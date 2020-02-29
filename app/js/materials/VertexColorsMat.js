import BaseShaderMaterial from 'js/core/materials/BaseShaderMaterial'

import vert from 'js/shaders/vertex_colors/vertex_colors_vert';
import frag from 'js/shaders/vertex_colors/vertex_colors_frag';

export default class VertexColorsMat extends BaseShaderMaterial
{
	constructor()
	{
		super(vert, frag, {
		});
		this.vertexColors = THREE.VertexColors;

	}
}
