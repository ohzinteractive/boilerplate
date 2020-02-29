import CameraManager from 'js/core/CameraManager';
import SceneManager from 'js/core/SceneManager';
import Screen from 'js/core/Screen';
import BaseRender from './BaseRender';
import Graphics from 'js/core/Graphics';

export default class NormalRender extends BaseRender
{
	constructor()
	{
		super();
	}


	render()
	{
		Graphics.clear(undefined, CameraManager.current, true, true);
		
		Graphics.render(SceneManager.current, CameraManager.current);
	}

}