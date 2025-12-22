# Creating Views - OHZI Boilerplate Guide

Views are the main structural elements of your application in the OHZI Boilerplate. They represent different sections or pages of your project and manage scenes, transitions, and UI interactions.

## What is a View?

A **View** is an organized container that:
- Manages a 3D scene
- Handles view-specific transitions and animations
- Controls UI elements and interactions
- Coordinates between scene rendering and UI logic
- Has a lifecycle (initialization, entering, updating, exiting)

## View Lifecycle

Every view goes through the following lifecycle:

```
start() → before_enter() → on_enter() → update() → before_exit() → on_exit()
```

- **start()**: Called once when the view is first initialized
- **before_enter()**: Called before the view becomes active (setup camera, SceneManager, etc.)
- **on_enter()**: Called when the view is now active (start animations, play sounds, etc.)
- **update()**: Called every frame while the view is active
- **before_exit()**: Called before leaving the view (stop animations, cleanup)
- **on_exit()**: Called when the view is no longer active
- **update_enter_transition()**: Called during the transition animation when entering
- **update_exit_transition()**: Called during the transition animation when exiting

## Creating a View Automatically

The boilerplate includes a script to scaffold a new view:

```bash
yarn create-view MyViewName
```

This command will create the necessary folder structure and template files:

```
app/js/views/my_view_name/
├── MyViewView.js
├── MyViewSceneController.js
└── MyViewTransitionController.js

app/views/my_view_name/
└── my_view_name.pug

app/css/my_view_name/
├── _my_view_name.scss
└── components/

app/data/transitions/
└── my_view_name.json
```

## View Structure

### 1. Main View Class

**Location**: `app/js/views/[view-name]/[ViewName]View.js`

```javascript
import { CommonView } from '../common/CommonView';
import { Sections, SectionsURLs } from '../Sections';

import { MyViewSceneController } from './MyViewSceneController';
import { MyViewTransitionController } from './MyViewTransitionController';

import my_view_data from '../../../data/transitions/my_view.json';

export class MyView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.MY_VIEW,                           // Unique identifier
      url: SectionsURLs.MY_VIEW,                        // URL path
      container: document.querySelector('.my_view'),   // DOM container
      transition_data: my_view_data                     // Transition configuration
    });

    this.scene_controller = new MyViewSceneController();
    this.transition_controller = new MyViewTransitionController();
  }

  get scene()
  {
    return this.scene_controller.scene;
  }

  start()
  {
    super.start();
    this.scene_controller.start();
    this.transition_controller.start();
  }

  before_enter()
  {
    super.before_enter();
    this.scene_controller.before_enter();
    this.transition_controller.before_enter();
  }

  on_enter()
  {
    super.on_enter();
    this.scene_controller.on_enter();
    this.transition_controller.on_enter();
  }

  before_exit()
  {
    super.before_exit();
    this.scene_controller.before_exit();
    this.transition_controller.before_exit();
  }

  on_exit()
  {
    super.on_exit();
    this.scene_controller.on_exit();
    this.transition_controller.on_exit();
  }

  update()
  {
    this.scene_controller.update();
    this.transition_controller.update();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}
```

### 2. Scene Controller

**Location**: `app/js/views/[view-name]/[ViewName]SceneController.js`

Manages the 3D scene and all graphics-related logic:

```javascript
import { SceneManager } from 'ohzi-core';
import { MyViewScene } from '../../scenes/MyViewScene';

export class MyViewSceneController
{
  constructor()
  {
  }

  start()
  {
    this.scene = new MyViewScene();
  }

  before_enter()
  {
    // Initialize camera, lighting, etc.
    // this.scene.setup_camera();
    
    // Set as active scene for rendering
    SceneManager.current = this.scene;
  }

  on_enter()
  {
    // Start animations, play sounds
  }

  before_exit()
  {
    // Cleanup before leaving
  }

  on_exit()
  {
    // Final cleanup
  }

  update()
  {
    this.scene.update();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    // Animate scene elements based on transition_progress (0 to 1)
    this.scene.update();
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    // Animate scene elements during exit
  }
}
```

### 3. Transition Controller

**Location**: `app/js/views/[view-name]/[ViewName]TransitionController.js`

Manages view transitions, animations, and state changes:

```javascript
import { SectionTransitionController } from '../common/SectionTransitionController';

export class MyViewTransitionController extends SectionTransitionController
{
  start()
  {
    super.start();
    // Initialize custom transitions
  }

  before_enter()
  {
    super.before_enter();
    // Customize transition state data
    // TransitionManager.current_state_data.my_view_opacity = 1;
  }

  on_enter()
  {
    super.on_enter();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    // Custom transition logic here
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}
```

## Registering Your View

You need to register your view so the application knows about it:

### 1. Add to Sections

Edit `app/js/views/Sections.js`:

```javascript
const Sections = {
  INITIAL: 'initial',
  TRANSITION: 'transition',
  LOADER: 'loader',
  HOME: 'home',
  MY_VIEW: 'my_view'  // Add this
};

const SectionsURLs = {
  INITIAL: '/initial',
  TRANSITION: '/transition',
  LOADER: '/loader',
  HOME: '/',
  MY_VIEW: '/my-view'  // Add this
};

export { Sections, SectionsURLs };
```

### 2. Import and Register in MainApplication

Edit `app/js/MainApplication.js`:

```javascript
import { MyView } from './views/my_view/MyView';

// In on_enter() or where views are registered:
this.sections = Sections;
// The view will be automatically instantiated by the ViewManager
```

## Templates and Styling

### HTML Template (Pug)

**Location**: `app/views/[view-name]/[view-name].pug`

```pug
.my_view
  .container
    h1 Welcome to My View
    p This is the content of my view
```

### Styling (SCSS)

**Location**: `app/css/[view-name]/_[view-name].scss`

```scss
.my_view {
  width: 100%;
  height: 100vh;
  background: #000;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
}
```

### Import Styles

Add your SCSS import to the main stylesheet to ensure it loads:

```scss
@import '../my_view/my_view';
```

## Creating a Scene

Scenes are 3D canvas content. Create a scene class:

**Location**: `app/js/scenes/MyViewScene.js`

```javascript
import { Scene, Group } from 'three';

export class MyViewScene extends Scene
{
  constructor()
  {
    super();
    
    this.background_group = new Group();
    this.add(this.background_group);
    
    // Add lights, models, etc.
  }

  setup_camera()
  {
    // Setup camera if needed
  }

  update()
  {
    // Called every frame
    // Update animations, positions, etc.
  }
}
```

## Transition Data

Transition data is configured in a JSON file that drives the animation between views:

**Location**: `app/data/transitions/[view-name].json`

```json
{
  "duration": 1000,
  "easing": "easeInOutQuad",
  "states": {
    "opacity": 1,
    "scale": 1,
    "custom_property": 0
  }
}
```

## Best Practices

1. **Keep Concerns Separated**: Use SceneController for 3D logic and TransitionController for transitions
2. **Use the Lifecycle**: Don't perform expensive operations in `update()`, use the appropriate lifecycle hooks
3. **Clean Up**: Always clean up resources (remove listeners, dispose geometries) in exit methods
4. **Consistent Naming**: Follow camelCase for classes and snake_case for file names and URL paths
5. **Manage Scene Manager**: Always set `SceneManager.current` in `before_enter()` to enable rendering
6. **Input Handling**: Use the global `Input` object for keyboard/mouse events

## Example: Complete View

Check [HomeView.js](../app/js/views/home/HomeView.js)

## Debugging Views

- Use TweakPane (available in dev mode) to debug view parameters
- Check browser console for any errors in lifecycle hooks
- Use `SceneManager.current` to verify the active scene
- Monitor performance with the built-in performance controller

---

For more information about scenes, see the [Creating Scenes guide](creating-scenes.md).
