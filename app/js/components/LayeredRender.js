import CameraManager from 'js/core/CameraManager';
import SceneManager from 'js/core/SceneManager';
import Screen from 'js/core/Screen';
import BaseRender from 'js/core/render_mode/BaseRender';
import Graphics from 'js/core/Graphics';
import RenderLayers from 'js/core/RenderLayers';

export default class LayeredRender extends BaseRender
{
	constructor(layers)
	{
		super();
		this.layers = layers;
	}


	render()
	{
		Graphics.clear(undefined, CameraManager.current, true, true);
		Graphics.render(SceneManager.current, CameraManager.current);

		for(let i=0; i< this.layers.length; i++)
		{
			Graphics._renderer.setViewport(this.layers[i].viewport.x, this.layers[i].viewport.y, this.layers[i].viewport.z, this.layers[i].viewport.w);
			Graphics.clear(undefined, undefined, true, undefined);
			Graphics.render(this.layers[i].scene, this.layers[i].camera);
			Graphics._renderer.setViewport(0,0, Screen.width, Screen.height);
		}

	}

}
