# Creating Scenes - OHZI Boilerplate Guide

Scenes are the core of your 3D content in the OHZI Boilerplate. A scene contains all 3D objects, lighting, cameras, and visual elements that make up your interactive experience.

## What is a Scene?

A **Scene** in this boilerplate extends three.js `Scene` and includes:
- **3D Objects**: Models, geometries, and meshes
- **Lighting**: Ambient, directional, and point lights
- **Camera Management**: Multiple camera states and controls
- **Asset Loading**: Automatic loading of models, textures, and sounds
- **Lifecycle Hooks**: Initialization and update methods
- **Rendering Pipeline**: Integration with the graphics engine

Scenes are managed through a **SceneController** (defined in your view) which handles the scene lifecycle and updates.

## Creating a Scene Automatically

The boilerplate provides a script to generate scene templates:

```bash
yarn create-scene MySceneName
```

This creates:

```
app/js/scenes/MySceneName.js
app/data/assets/my_scene_name/
├── my_scene_name_objects.js      # 3D models configuration
├── my_scene_name_textures.js      # Textures configuration
├── my_scene_name_sounds.js        # Audio files configuration
└── high/
    ├── my_scene_name_high_objects.js
    ├── my_scene_name_high_textures.js
    └── my_scene_name_high_sounds.js
```

## Scene Structure

### Basic Scene Class

**Location**: `app/js/scenes/[SceneName].js`

```javascript
import { Sections } from '../views/Sections';
import { CommonScene } from './common/CommonScene';
import { CameraController } from '../camera_controller/CameraController';
import { CameraManager, PerspectiveCamera, OScreen } from 'ohzi-core';
import { Color } from 'three';

// Import asset configurations
import { my_scene_objects } from '../../data/assets/my_scene_name/my_scene_name_objects';
import { my_scene_textures } from '../../data/assets/my_scene_name/my_scene_name_textures';
import { my_scene_sounds } from '../../data/assets/my_scene_name/my_scene_name_sounds';

export class MyScene extends CommonScene
{
  constructor()
  {
    super({
      name: Sections.MY_VIEW  // Reference to the view this scene belongs to
    });
  }

  init()
  {
    super.init();

    // Initialize camera and controls
    this.camera_controller = new CameraController();
    this.init_camera();
    this.setup_camera();

    // Load assets
    this.set_assets(my_scene_objects, my_scene_textures, my_scene_sounds);

    // Add debug helpers in development
    if (Settings.debug_mode)
    {
      this.add(Debug.draw_axis());
      this.add(new Grid());
    }
  }

  init_camera()
  {
    // Create and configure camera
    this.camera = new PerspectiveCamera(60, OScreen.aspect_ratio, 0.1, 200);
    this.camera.updateProjectionMatrix();
    this.camera.position.z = 10;

    // Set camera clear color
    this.camera.clear_color.copy(new Color('#181818'));
    this.camera.clear_alpha = 1;
  }

  setup_camera()
  {
    // Register camera globally
    CameraManager.current = this.camera;

    // Configure camera controller
    this.camera_controller.set_camera(this.camera);
    this.camera_controller.set_simple_mode();
    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 40;
  }

  update()
  {
    super.update();
    this.camera_controller.update();
  }

  on_assets_ready()
  {
    // Called when initial assets are loaded
    // Load high-quality assets here
    this.set_high_assets(
      my_scene_high_objects,
      my_scene_high_textures,
      my_scene_high_sounds
    );

    super.on_assets_ready();
  }

  on_high_quality_assets_ready()
  {
    // Called when high-quality assets are loaded
    super.on_high_quality_assets_ready();

    // Initialize audio, animations, interactions, etc.
  }
}
```

## Asset Configuration

Assets are organized in separate JavaScript files that define what needs to be loaded.

### Objects (3D Models)

**Location**: `app/data/assets/[scene-name]/[scene-name]_objects.js`

```javascript
export const my_scene_objects = [
  {
    name: 'main_model',
    url: '/models/main_model.glb',
    draco: false  // Set to true for Draco-compressed models
  },
  {
    name: 'character',
    url: '/models/character.glb',
    draco: true   // Draco compression for smaller file sizes
  }
];
```

### Textures

**Location**: `app/data/assets/[scene-name]/[scene-name]_textures.js`

```javascript
export const my_scene_textures = [
  {
    name: 'floor_texture',
    url: '/textures/floor.jpg'
  },
  {
    name: 'normal_map',
    url: '/textures/normal.png'
  },
  {
    name: 'roughness',
    url: '/textures/roughness.jpg'
  }
];
```

### Sounds (Audio Files)

**Location**: `app/data/assets/[scene-name]/[scene-name]_sounds.js`

```javascript
export const my_scene_sounds = [
  {
    name: 'background_music',
    url: '/sounds/background.mp3',
    loop: true
  },
  {
    name: 'interaction_sound',
    url: '/sounds/click.mp3',
    loop: false
  }
];
```

## Scene Lifecycle

### Initialization Flow

```
constructor() → init() → init_camera() → setup_camera() → set_assets()
      ↓
on_assets_ready() → set_high_assets() → update() [every frame]
      ↓
on_high_quality_assets_ready()
```

### Key Lifecycle Methods

| Method | Purpose |
|--------|---------|
| `init()` | Initialize scene, camera, assets |
| `init_camera()` | Create and configure camera |
| `setup_camera()` | Register camera and controls |
| `set_assets()` | Load initial (low-quality) assets |
| `on_assets_ready()` | Called when initial assets load |
| `set_high_assets()` | Load high-quality replacement assets |
| `on_high_quality_assets_ready()` | Called when high-quality assets load |
| `update()` | Called every frame |

## Working with Assets

### Progressive Asset Loading

The boilerplate supports progressive asset loading for better user experience:

1. **Initial Assets**: Fast-loading, lower quality
2. **High-Quality Assets**: Loaded after initial assets
3. **Audio**: Loaded separately with sound management

```javascript
on_assets_ready()
{
  // Initial assets are loaded, start showing content
  this.set_high_assets(
    my_scene_high_objects,
    my_scene_high_textures,
    my_scene_high_sounds
  );

  super.on_assets_ready();
}

on_high_quality_assets_ready()
{
  // High-quality assets now available
  // Replace textures, models, or enable effects
  super.on_high_quality_assets_ready();
}
```

### Accessing Loaded Assets

Assets are compiled and accessible through the scene:

```javascript
update()
{
  super.update();

  // Access compiled objects
  const model = this.compiled_scene_compilator.get('main_model');
  if (model) {
    model.rotation.y += 0.01;
  }

  // Access textures
  const texture = this.compiled_textures_compilator.get('floor_texture');

  // Access audio manager
  this.compiled_audios_compilator.play('background_music');
}
```

## Camera Management

### Camera Controller

The `CameraController` provides multiple camera modes:

```javascript
// Simple mode - basic orbit camera
this.camera_controller.set_simple_mode();

// Idle mode - no interaction
this.camera_controller.set_idle();

// Custom mode - full control
this.camera_controller.set_camera(camera);
```

### Camera Configuration

```javascript
setup_camera()
{
  CameraManager.current = this.camera;

  this.camera_controller.set_camera(this.camera);
  this.camera_controller.set_simple_mode();

  // Set zoom limits
  this.camera_controller.min_zoom = 1;
  this.camera_controller.max_zoom = 40;

  // Set initial orientation and tilt
  this.camera_controller.orientation = 27;  // degrees
  this.camera_controller.tilt = 70;          // degrees
}
```

## Lighting

### Adding Lights

```javascript
import { AmbientLight, DirectionalLight } from 'three';

add_lights()
{
  // Ambient light for base illumination
  const ambient = new AmbientLight('#FFFFFF', 0.9);
  this.add(ambient);

  // Directional light for shadows and highlights
  const directional = new DirectionalLight('#FFFFFF', 0.5);
  directional.position.set(0, 10, 20);
  this.add(directional);
}
```

Call `add_lights()` in your lifecycle hooks:

```javascript
on_assets_ready()
{
  this.set_high_assets(...);
  super.on_assets_ready();
  
  this.add_lights();
}
```

## Debugging Scenes

### Development Tools

Enable debug features:

```javascript
import { Debug, Grid } from 'ohzi-core';
import { Settings } from '../Settings';

init()
{
  super.init();

  if (Settings.debug_mode)
  {
    // Draw axis helper
    this.add(Debug.draw_axis());
    
    // Add grid
    this.add(new Grid());
  }
}
```

### TweakPane Integration

Use TweakPane in development mode to adjust parameters:

```javascript
// In MainApplication (dev mode)
if (import.meta.env.DEV)
{
  this.tweak_pane = new TweakPane();
  
  // Add camera parameters
  this.tweak_pane.addBinding(camera.position, 'z', { min: 0, max: 50 });
}
```

## Best Practices

1. **Progressive Loading**: Always implement both initial and high-quality asset loading
2. **Camera Setup**: Always set `CameraManager.current` in `setup_camera()`
3. **Asset Organization**: Keep asset configs organized by scene
4. **Memory Management**: Properly dispose of geometries and textures when scenes are unloaded
5. **Draco Compression**: Use Draco for large models (> 1MB)
6. **Asset Size**: Monitor asset file sizes with `yarn calculate-assets-sizes`
7. **Update Performance**: Keep `update()` fast - avoid heavy calculations
8. **Error Handling**: Implement fallbacks for missing assets

## Example: Complete Scene

Check [HomeScene.js](../app/js/scenes/HomeScene.js)


## Related Topics

- [Creating Views](creating-views.md) - Learn how scenes integrate with views
- [Performance Optimization](performance.md) - Optimize scene rendering
- [Camera System](camera-system.md) - Deep dive into camera controls

---

For more information about three.js, see the [three.js documentation](https://threejs.org/docs/).
