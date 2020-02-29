import ResourceContainer from 'js/core/ResourceContainer';
import AbstractLoader from './AbstractLoader';

export default class TextureLoader extends AbstractLoader
{
	constructor(resource_id, url)
	{
		super(resource_id, url);
		this.loader = new THREE.TextureLoader();
	}

	load()
	{
		let ctx = this;

		this.loader.load(	this.url, (image)=> {
				ResourceContainer.set_resource(ctx.resource_id, image);
				ctx.__update_progress(1);
				ctx.__loading_ended()
			},
			undefined,
			() => {
				ctx.__set_error("Image could not  be loaded. Maybe wrong name or path, I don't know" + '¯\\_(ツ)_/¯');
				ctx.__loading_ended()
			}
		);
	}

}