import ParticleStorageMaterial from 'js/core/materials/gpu_particles/ParticleStorageMaterial';
import vert from 'js/core/shaders/gpu_particles/store/store_position_vert';

export default class PositionStorageMaterial extends ParticleStorageMaterial
{
	constructor()
	{
		super(vert);
	}
}