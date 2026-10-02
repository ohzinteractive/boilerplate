import { BloomRender, CameraManager, CameraBridge, CaptureService, ConsoleBuffer, Debug, DebugDrawer, DebugNormalsRender, DeferredRender, DevBridge, Graphics, InputSynthesizer,
  NormalAORender, NormalRender, OScreen, PerformanceProbe, RenderModeRegistry, SceneEditor, SceneInspector, SceneManager, Time,
  UnrealBloomRender, VRRender, ViewManager, ViewNavigator } from 'ohzi-core';
import type { BaseRender } from 'ohzi-core';
import { Box3 } from 'three';

import components_package from '../../../components/package.json';
import core_package from '../../../core/package.json';
import pit_package from '../../../pit/package.json';
import { Settings } from '../Settings';
import { Input } from './Input';

/**
 * Wires the ohzi-core dev bridge to this application so an MCP client can see
 * and drive the running app.
 *
 * DEV ONLY. This module is the lazy boundary: nothing may import it statically.
 * Reach it exclusively through MainApplication.start_dev_bridge(), whose
 * import.meta.env.DEV guard is what keeps this file — and the whole dev bridge
 * behind it — out of the production bundle.
 */
export class DevBridgeController
{
  bridge: DevBridge;

  start(): DevBridge
  {
    const capture_service = new CaptureService(Graphics, () => CameraManager.current !== undefined);

    // Installed here rather than in MainApplication.init() so it stays behind the
    // dev guard. Consequence: anything logged before on_enter is not captured.
    const console_buffer = new ConsoleBuffer();
    console_buffer.install(console, window);

    this.bridge = new DevBridge();

    this.bridge.register('status', 'immediate', () => this.status());

    this.bridge.register('get_console', 'immediate', (args) => console_buffer.read(args));

    this.register_scene();
    this.register_camera();
    this.register_input();
    this.register_render_modes();
    this.register_views();
    this.register_debug();

    // frame_end, never immediate: take_screenshot overrides OScreen and the
    // renderer pixel ratio and pans the camera via setViewOffset, so running it
    // part-way through a frame would corrupt the render.
    this.bridge.register('capture_viewport', 'frame_end', (args) => capture_service.capture(args));

    this.bridge.init({
      port: Settings.dev_bridge.port,
      app_info: () => this.app_info()
    });

    return this.bridge;
  }

  register_scene()
  {
    const scene_inspector = new SceneInspector();
    const scene_editor = new SceneEditor();

    this.bridge.register('inspect_scene', 'immediate', (args) => scene_inspector.inspect(SceneManager.current, args));
    this.bridge.register('get_object', 'immediate', (args) => scene_editor.get(SceneManager.current, args));

    // frame_end so a transform change cannot land between update() and render()
    // and tear for a frame. args carries both the selector and the changes;
    // their field names do not overlap.
    this.bridge.register('set_object', 'frame_end', (args) => scene_editor.set(SceneManager.current, args, args));
  }

  register_camera()
  {
    const camera_bridge = new CameraBridge();

    this.bridge.register('get_camera', 'immediate', () => camera_bridge.get(CameraManager.current, this.camera_controller()));

    // frame_end: both of these change what the next frame renders.
    this.bridge.register('set_camera', 'frame_end', (args) => camera_bridge.set(CameraManager.current, this.camera_controller(), args));

    this.bridge.register('frame_object', 'frame_end', (args) => camera_bridge.frame(
      CameraManager.current,
      this.camera_controller(),
      SceneManager.current,
      args,
      (object) => new Box3().setFromObject(object)
    ));

    const performance_probe = new PerformanceProbe();

    this.bridge.register('get_performance', 'immediate', () =>
    {
      const renderer = (Graphics as unknown as { _renderer?: { info?: unknown } })._renderer;

      return performance_probe.read(Time, OScreen, renderer === undefined ? undefined : renderer.info);
    });
  }

  register_input()
  {
    // Dispatches genuine DOM events at the elements PIT and KeyboardInput are
    // already listening on, so synthetic input travels the exact same path as a
    // real user's. Keyboard events go to the keyboard container, everything
    // else to the input controller's element.
    const input_synthesizer = new InputSynthesizer(
      (type, init) =>
      {
        const keyboard = type === 'keydown' || type === 'keyup';
        const target = keyboard ? Input.keyboard.container : Input.dom_element;

        if (keyboard)
        {
          target.dispatchEvent(new KeyboardEvent(type, init as KeyboardEventInit));
          return;
        }

        if (type === 'wheel')
        {
          target.dispatchEvent(new WheelEvent(type, init as WheelEventInit));
          return;
        }

        target.dispatchEvent(new MouseEvent(type, init as MouseEventInit));
      },
      (ms) => new Promise<void>((resolve) => window.setTimeout(resolve, ms)),
      (x, y, space) =>
      {
        const rect = Graphics.canvas.getBoundingClientRect();

        if (space === 'ndc')
        {
          return {
            x: rect.left + ((x + 1) / 2) * rect.width,
            y: rect.top + ((1 - y) / 2) * rect.height
          };
        }

        return { x: rect.left + x, y: rect.top + y };
      }
    );

    // immediate, not frame_end: these drive themselves over real time via their
    // own waits and never touch render state directly.
    this.bridge.register('pointer', 'immediate', (args) => input_synthesizer.pointer(args));
    this.bridge.register('drag', 'immediate', (args) => input_synthesizer.drag(args));
    this.bridge.register('scroll', 'immediate', (args) => input_synthesizer.scroll(args));
    this.bridge.register('key', 'immediate', (args) => input_synthesizer.key(args));
  }

  register_render_modes()
  {
    // A factory per mode, because the render modes do not share a constructor
    // signature. Only the modes core exports from its index are listed here.
    const render_modes = new RenderModeRegistry([
      {
        name: 'NormalRender',
        description: 'Standard forward rendering.',
        factory: () => new NormalRender()
      },
      {
        name: 'NormalAORender',
        description: 'Forward rendering with SSAO. Works on WebGPU and WebGL2. use_exact_depth (default on) avoids banding on flat surfaces; off is about half the SSAO cost.',
        options: ['use_ssaa', 'use_exact_depth'],
        factory: (options) => new NormalAORender(options.use_ssaa === true, options.use_exact_depth !== false)
      },
      {
        name: 'BloomRender',
        description: 'Forward rendering with a box blur bloom. Works on WebGPU and WebGL2. use_dual_filtering swaps the box blur for the dual filtering (Kawase) blur, whose glow spreads much wider.',
        options: ['use_dual_filtering'],
        factory: (options) => new BloomRender(options.use_dual_filtering === true)
      },
      {
        name: 'UnrealBloomRender',
        description: 'Forward rendering with Unreal-style bloom. Works on WebGPU and WebGL2.',
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
        description: 'Visualises world space surface normals. Works on WebGPU and WebGL2.',
        factory: () => new DebugNormalsRender()
      },
      {
        name: 'DeferredRender',
        description: 'Deferred point lights over a depth and normals buffer. Works on WebGPU and WebGL2.',
        factory: () => new DeferredRender()
      },
      {
        name: 'VRRender',
        description: 'WebXR stereo rendering. Requires core_attributes.xr_enabled.',
        factory: () => new VRRender()
      }
    ]);

    this.bridge.register('list_render_modes', 'immediate', () => render_modes.list());

    this.bridge.register('set_render_mode', 'frame_end', (args) =>
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
  }

  register_views()
  {
    const view_navigator = new ViewNavigator();

    this.bridge.register('list_views', 'immediate', () => view_navigator.list(ViewManager));
    this.bridge.register('go_to_view', 'frame_end', (args) => view_navigator.go(ViewManager, args));
  }

  register_debug()
  {
    // sdf_text draws with this font unless the request names another one. It is Lato
    // (SIL Open Font License, see Lato-OFL.txt), printable ASCII, generated with
    // msdf-atlas-gen -chars "[32, 126]" -type msdf -size 32 -pxrange 4 -yorigin bottom.
    const debug_drawer = new DebugDrawer({ sdf_font: '/fonts/sdf/lato_msdf.json' });

    // frame_end: both change what the next frame renders. Helpers stay until
    // debug_clear, which only removes what debug_draw added. Only cube, sphere,
    // plane, label and sdf_text live in the Debug overlay scene and survive view
    // changes; math_sphere and bounding_box stay in the scene of the view they were
    // drawn in.
    this.bridge.register('debug_draw', 'frame_end', (args) => debug_drawer.draw(Debug, SceneManager.current, args));
    this.bridge.register('debug_clear', 'frame_end', (args) => debug_drawer.clear(args));
  }

  // The controller lives on the scene, so it is resolved per call rather than
  // captured: switching views swaps the scene and therefore the controller.
  camera_controller()
  {
    const scene = SceneManager.current as { camera_controller?: unknown };

    return scene === undefined || scene === null || scene.camera_controller === undefined
      ? null
      : scene.camera_controller;
  }

  status()
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

  app_info()
  {
    return {
      core_version: core_package.version,
      components_version: components_package.version,
      pit_version: pit_package.version,
      ...this.status()
    };
  }
}
