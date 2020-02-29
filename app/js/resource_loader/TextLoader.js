import ResourceContainer from 'js/core/ResourceContainer';
import AbstractLoader from './AbstractLoader';

export default class TextLoader extends AbstractLoader
{
	constructor(resource_id, url)
	{
		super(resource_id, url);
		this.loader = new THREE.FileLoader();
	}

	load()
	{
		let ctx = this;

		this.loader.load(	this.url, (gltf)=> {
				ResourceContainer.set_resource(ctx.resource_id, gltf);
				ctx.__update_progress(1);
				ctx.__loading_ended()
			},
			(xhr) =>{
				ctx.__update_progress(xhr.loaded/xhr.total);
			},
			(msg) => {
				ctx.__set_error(msg);
				ctx.__loading_ended()
			}
		);
	}

}
