import ResourceContainer from 'js/core/ResourceContainer';
import AbstractLoader from './AbstractLoader';

export default class AudioLoader extends AbstractLoader
{
	constructor(resource_id, url, listener, loop, volume)
	{
		super(resource_id, url);
		this.loader = new THREE.AudioLoader();
		this.loop = loop;
		this.listener = listener;
		this.voluem = volume;
	}

	load()
	{
		let ctx = this;
		let sound = new THREE.Audio(this.listener);

		this.loader.load(this.url, (audio)=> {
			sound.setBuffer(audio);
			sound.setLoop(this.loop);
			sound.setVolume(this.voluem);

			ResourceContainer.set_resource(ctx.resource_id, sound);

			if (!ResourceContainer.get_resource('audio_listener')) {
				ResourceContainer.set_resource('audio_listener', this.listener);
			}

			ctx.__update_progress(1);
			ctx.__loading_ended()
		},
		undefined,
		(error) => {
			ctx.__set_error("Audio could not be loaded. Maybe wrong name or path, I don't know" + '¯\\_(ツ)_/¯', error);
			ctx.__loading_ended()
		});
	}

}