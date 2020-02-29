import ResourceContainer from 'js/core/ResourceContainer';
import AbstractLoader from './AbstractLoader';

export default class GLTFLoader extends AbstractLoader
{
	constructor(resource_id, url)
	{
		super(resource_id, url);
		this.loader = new THREE.GLTFLoader();
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
				ctx.__set_error(msg +"\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource");
				ctx.__loading_ended()
			}
		);
	}

}
