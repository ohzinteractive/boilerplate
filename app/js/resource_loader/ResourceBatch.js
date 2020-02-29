import TextureLoader from 'js/resource_loader/TextureLoader';
import GLTFLoader from 'js/resource_loader/GLTFLoader';
import DAELoader from 'js/resource_loader/DAELoader';
import TextLoader from 'js/resource_loader/TextLoader';
import CubemapLoader from 'js/resource_loader/CubemapLoader';
import AudioLoader from 'js/resource_loader/AudioLoader';

export default class ResourceBatch
{
	constructor(batch_name)
	{
		this.resource_loaders = [];
		this.batch_name = batch_name || "unnamed batch";
	}

	add_texture(resource_id, url)
	{
		this.resource_loaders.push(new TextureLoader(resource_id, url));
	}

	add_gltf(resource_id, url)
	{
		this.resource_loaders.push(new GLTFLoader(resource_id, url));
	}
	add_dae(resource_id, url)
	{
		this.resource_loaders.push(new DAELoader(resource_id, url));
	}
	add_text(resource_id, url)
	{
		this.resource_loaders.push(new TextLoader(resource_id, url));
	}
	add_cubemap(resource_id, url)
	{
		this.resource_loaders.push(new CubemapLoader(resource_id, url));
	}
	add_audio(resource_id, url, listener, loop, volume) {
		this.resource_loaders.push(new AudioLoader(resource_id, url, listener, loop, volume));
	}

	load()
	{
		for(let i=0; i< this.resource_loaders.length; i++)
		{
			this.resource_loaders[i].load();
		}
	}

	get loading_finished()
	{
		let finished = true;
		for(let i=0; i< this.resource_loaders.length; i++)
		{
			finished = finished && this.resource_loaders[i].has_finished;
		}
		return finished;
	}

	get has_errors()
	{
		let has_error = false;
		for(let i=0; i< this.resource_loaders.length; i++)
		{
			has_error = has_error || this.resource_loaders[i].has_error;
		}
		return has_error;
	}

	print_errors()
	{
		console.error("Batch <"+this.batch_name+"> could not load successfully")
		for(let i=0; i< this.resource_loaders.length; i++)
		{
			if(this.resource_loaders[i].has_error)
				this.resource_loaders[i].print_error();
		}
	}

	get_progress()
	{
		let progress = 0;
		for(let i=0; i< this.resource_loaders.length; i++)
		{
			progress+=this.resource_loaders[i].progress;
		}
		return progress/this.resource_loaders.length;
	}
}