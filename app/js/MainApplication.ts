import { BaseApplication, CameraManager, OScreen, ResourceContainer, Time, TransitionManager, ViewManager } from 'ohzi-core';
import type { BaseRender, DevBridge } from 'ohzi-core';

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

    const { CameraBridge, CaptureService, ConsoleBuffer, DebugNormalsRender, DevBridge, Graphics, NormalAORender, NormalRender,
      PerformanceProbe, RenderModeRegistry, SceneEditor, SceneInspector, SceneManager, UnrealBloomRender, VRRender,
      ViewNavigator } = await import('ohzi-core');
    const { Box3 } = await import('three');

    const capture_service = new CaptureService(Graphics, () => CameraManager.current !== undefined);

    // Installed here rather than in init() so it stays inside the dev guard.
    // Consequence: anything logged before on_enter is not captured.
    const console_buffer = new ConsoleBuffer();
    console_buffer.install(console, window);

    this.dev_bridge = new DevBridge();

    this.dev_bridge.register('status', 'immediate', () => this.get_dev_bridge_status());

    this.dev_bridge.register('get_console', 'immediate', (args) => console_buffer.read(args));

    const scene_inspector = new SceneInspector();
    const scene_editor = new SceneEditor();

    this.dev_bridge.register('inspect_scene', 'immediate', (args) => scene_inspector.inspect(SceneManager.current, args));
    this.dev_bridge.register('get_object', 'immediate', (args) => scene_editor.get(SceneManager.current, args));

    // frame_end so a transform change cannot land between update() and render()
    // and tear for a frame. args carries both the selector and the changes;
    // their field names do not overlap.
    this.dev_bridge.register('set_object', 'frame_end', (args) => scene_editor.set(SceneManager.current, args, args));

    const camera_bridge = new CameraBridge();

    // The controller lives on the scene, so it is resolved per call rather than
    // captured: switching views swaps the scene and therefore the controller.
    const controller = () =>
    {
      const scene = SceneManager.current as { camera_controller?: unknown };

      return scene === undefined || scene === null || scene.camera_controller === undefined
        ? null
        : scene.camera_controller;
    };

    this.dev_bridge.register('get_camera', 'immediate', () => camera_bridge.get(CameraManager.current, controller()));

    // frame_end: both of these change what the next frame renders.
    this.dev_bridge.register('set_camera', 'frame_end', (args) => camera_bridge.set(CameraManager.current, controller(), args));

    // A factory per mode, because the render modes do not share a constructor
    // signature. Only the modes core exports from its index are listed here;
    // BloomRender and DeferredRender exist in src but are not exported.
    const render_modes = new RenderModeRegistry([
      {
        name: 'NormalRender',
        description: 'Standard forward rendering.',
        factory: () => new NormalRender()
      },
      {
        name: 'NormalAORender',
        description: 'Forward rendering with SSAO.',
        options: ['use_ssaa'],
        factory: (options) => new NormalAORender(options.use_ssaa === true)
      },
      {
        name: 'UnrealBloomRender',
        description: 'Forward rendering with Unreal-style bloom.',
        options: ['use_antialiasing', 'use_half_float', 'use_high_luminosity_pass', 'use_rendering_size'],
        factory: (options) => new UnrealBloomRender(
          options.use_antialiasing !== false,
          options.use_half_float !== false,
          // core spells this parameter 'use_hight_luminosity_pass'; the option
          // is exposed under the corrected spelling.
          options.use_high_luminosity_pass !== false,
          options.use_rendering_size === true
        )
      },
      {
        name: 'DebugNormalsRender',
        description: 'Visualises surface normals.',
        factory: () => new DebugNormalsRender()
      },
      {
        name: 'VRRender',
        description: 'WebXR stereo rendering. Requires core_attributes.xr_enabled.',
        factory: () => new VRRender()
      }
    ]);

    this.dev_bridge.register('list_render_modes', 'immediate', () => render_modes.list());

    this.dev_bridge.register('set_render_mode', 'frame_end', (args) =>
    {
      const options = typeof args.options === 'object' && args.options !== null
        ? args.options as Record<string, unknown>
        : {};

      // create() validates the name and throws unknown_render_mode listing the
      // valid ones, so by this point it is known good.
      const mode = render_modes.create(args.name, options) as BaseRender;

      Graphics.set_state(mode);

      return { active: typeof args.name === 'string' ? args.name : '' };
    });

    const performance_probe = new PerformanceProbe();

    this.dev_bridge.register('get_performance', 'immediate', () =>
    {
      const renderer = (Graphics as unknown as { _renderer?: { info?: unknown } })._renderer;

      return performance_probe.read(Time, OScreen, renderer === undefined ? undefined : renderer.info);
    });

    const view_navigator = new ViewNavigator();

    this.dev_bridge.register('list_views', 'immediate', () => view_navigator.list(ViewManager));
    this.dev_bridge.register('go_to_view', 'frame_end', (args) => view_navigator.go(ViewManager, args));

    this.dev_bridge.register('frame_object', 'frame_end', (args) => camera_bridge.frame(
      CameraManager.current,
      controller(),
      SceneManager.current,
      args,
      (object) => new Box3().setFromObject(object)
    ));

    // frame_end, never immediate: take_screenshot overrides OScreen and the
    // renderer pixel ratio and pans the camera via setViewOffset, so running it
    // part-way through a frame would corrupt the render.
    this.dev_bridge.register('capture_viewport', 'frame_end', (args) => capture_service.capture(args));

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
