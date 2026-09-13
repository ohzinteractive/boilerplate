import { BaseApplication, CameraManager, OScreen, ResourceContainer, Time, TransitionManager, ViewManager } from 'ohzi-core';
import type { DevBridge } from 'ohzi-core';

import { HomeView } from './views/home/HomeView';
import { TransitionView } from './views/transition/TransitionView';

// import { ACESFilmicToneMapping } from 'three';
// import { AudioContext, AudioListener } from 'three';

import { Input } from './components/Input';
import { KeyboardInputController } from './components/KeyboardInputController';
import { TweakPane } from './components/TweakPane';
import { Settings } from './Settings';
import { ModalComponent } from './view_components/modal/ModalComponent';
import { Sections } from './views/Sections';

import { UICollisionLayer } from 'ohzi-components';
import components_package from '../../components/package.json';
import core_package from '../../core/package.json';
import pit_package from '../../pit/package.json';
import { default_state_data } from '../data/default_state_data';
import { Router } from './components/Router';
import type { CommonView } from './views/common/CommonView';

export class MainApplication extends BaseApplication
{
  config: any;
  dev_bridge: DevBridge;
  home_view: HomeView;
  input: typeof Input;
  keyboard_input_controller: KeyboardInputController;
  router: Router;
  sections: typeof Sections;
  transition_view: TransitionView;
  tweak_pane: TweakPane;
  ui_collision_layer: typeof UICollisionLayer;
  modal_component: typeof ModalComponent;
  view_manager: typeof ViewManager;

  init()
  {
    this.input = Input;

    TransitionManager.set_default_state_data(default_state_data);

    this.ui_collision_layer = UICollisionLayer;
    this.ui_collision_layer.init(Input, Time);

    this.modal_component = ModalComponent;
    this.modal_component.init(UICollisionLayer, Time);

    // addEventListener('contextmenu', (event) =>
    // {
    //   event.preventDefault();
    // });
  }

  on_enter()
  {
    if (import.meta.env.DEV)
    {
      this.tweak_pane = new TweakPane();

      if (Settings.dev_bridge.enabled)
      {
        void this.start_dev_bridge();
      }
    }

    this.config = ResourceContainer.get_resource('config');

    this.sections = Sections;

    this.keyboard_input_controller = new KeyboardInputController();

    // this.audio_manager = AudioManager;
    // this.audio_manager.init(AudioListener, ResourceContainer, Time);

    // this.audio_unlocker = new AudioUnlocker(OS, AudioContext);

    this.view_manager = ViewManager;
    this.view_manager.set_browser_title_suffix('OHZI Interactive Studio');

    // __COMPONENTS__

    // __SECTIONS__

    this.home_view = new HomeView();
    this.transition_view = new TransitionView();

    this.modal_component.start();

    this.home_view.start();
    this.transition_view.start();

    this.router = new Router();
    this.router.start();
  }

  go_to(section: string, change_url = true, skip = false)
  {
    if (Settings.debug_mode)
    {
      skip = true;
    }

    ViewManager.go_to_view(section, change_url, skip);
  }

  go_to_scene(view_name: string)
  {
    const next_view = ViewManager.get(view_name);

    this.transition_view.set_next_view((next_view as CommonView));
    this.go_to(Sections.TRANSITION, false, false);
  }

  update()
  {
    this.ui_collision_layer.update();
    // this.modal_component.update();

    // this.audio_manager.update();

  }

  // Drains commands the dev bridge queued for a safe frame boundary.
  // Anything that renders or mutates runs here, never part-way through a frame.
  on_frame_end()
  {
    if (this.dev_bridge !== undefined)
    {
      this.dev_bridge.on_frame_end();
    }
  }

  // Dev only. The guard must live INSIDE this method, not only around the
  // call site: class methods are never tree-shaken, so without it the
  // dynamic import below keeps DevBridge in the production bundle.
  async start_dev_bridge()
  {
    if (!import.meta.env.DEV)
    {
      return;
    }

    const { DevBridge } = await import('ohzi-core');

    this.dev_bridge = new DevBridge();

    this.dev_bridge.register('status', 'immediate', () => this.get_dev_bridge_status());

    this.dev_bridge.init({
      port: Settings.dev_bridge.port,
      app_info: () => this.get_dev_bridge_app_info()
    });
  }

  get_dev_bridge_status()
  {
    // get_current_view() returns a ViewState, whose name is 'current_initial'
    // until the first real view is entered.
    return {
      active_view: ViewManager.get_current_view()?.name ?? null,
      has_camera: CameraManager.current !== undefined,
      canvas: {
        width: OScreen.width,
        height: OScreen.height,
        dpr: OScreen.dpr
      }
    };
  }

  get_dev_bridge_app_info()
  {
    return {
      core_version: core_package.version,
      components_version: components_package.version,
      pit_version: pit_package.version,
      ...this.get_dev_bridge_status()
    };
  }
}
