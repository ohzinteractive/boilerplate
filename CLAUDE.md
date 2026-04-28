# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

OHZI Boilerplate is a production-ready template for building high-performance, interactive WebGL/WebGPU web experiences. It is built on Three.js and the internal OHZI library ecosystem.

## Commands

```bash
yarn start          # Dev server at localhost:1234 (HTTP)
yarn start-ssl      # Dev server with HTTPS (port 443)
yarn build          # Production build (cleans cache, copies public/)
yarn fix-syntax     # ESLint auto-fix on app/ folder
yarn create-view MyViewName       # Scaffold a new view
yarn create-scene MySceneName     # Scaffold a new scene
yarn create-component MyComponent # Scaffold a new component
yarn create-modal MyModal         # Scaffold a new modal
```

No test framework is configured. Testing is manual.

## Architecture

### Monorepo Structure

The project uses three git submodules as Yarn workspaces. Vite resolves them as path aliases:

- `core/` → aliased as `ohzi-core` — WebGL foundation: `BaseApplication`, `SceneManager`, `TransitionManager`, `ViewManager`, `ResourceContainer`, `Time`
- `components/` → aliased as `ohzi-components` — Pre-built UI components: modals, audio, scroll, Lottie, `UICollisionLayer`
- `pit/` → aliased as `pit-js` — Pollable input library for mouse/touch/keyboard

### Application Bootstrap

```
index.pug → index.html (Vite Pug plugin)
app/js/init.ts → Api.ts → MainApplication.ts (extends BaseApplication from ohzi-core)
```

`MainApplication.ts` is the central controller. It wires up `ViewManager`, `TransitionManager`, and the render loop.

### View Architecture

Views are the primary structural unit. Each view has three classes:

- `[Name]View.js` — lifecycle orchestrator, extends `CommonView`
- `[Name]SceneController.js` — owns the Three.js `Scene`, sets `SceneManager.current` in `before_enter()`
- `[Name]TransitionController.js` — handles enter/exit animation logic, extends `CommonTransitionController`

View lifecycle: `start() → before_enter() → on_enter() → update() → before_exit() → on_exit()`

To add a new view:
1. Run `yarn create-view MyViewName` to scaffold files
2. Add the route to `app/js/views/Sections.js`
3. Register the view in `MainApplication.ts`
4. Import the new SCSS partial in `app/css/application.scss`

### Key Files

- `app/js/MainApplication.ts` — app controller, view registration, render loop
- `app/js/views/Sections.js` — route definitions (name → URL)
- `app/js/Settings.ts` — app-wide configuration
- `app/js/Preloader.ts` — asset preloading
- `app/js/Layers.ts` — WebGL layer management
- `app/data/sections_meta.json` — per-page metadata (title, description, OG tags)
- `app/data/default_state_data.js` — initial transition state
- `index.pug` — root HTML template

### Styling

SCSS with strict **BEM methodology** enforced by Stylelint. All class names must follow BEM naming conventions. Property ordering is also enforced. Import partials into `app/css/application.scss`.

### Templating

HTML is authored in **Pug** (`.pug` files) and compiled by Vite. View templates live in `app/views/[view-name]/`. The Pug plugin injects `sections_meta.json` as template data.

### Shaders

GLSL shaders are supported via `vite-plugin-glsl`. Import `.glsl` files directly. Three.js is configured WebGPU-first with WebGL fallback. TSL (Three.js Shading Language) is available.

### Build Output

`dist/` is the production output. `yarn build` runs Vite, then copies `public/` into `dist/`. Chunks are split: `three/webgpu` and `ohzi-core` are separate bundles.

## Code Style

- **Indentation**: 2 spaces
- **Quotes**: single
- **Brace style**: Allman (opening brace on its own line)
- **Naming**: `PascalCase` for classes, `snake_case` for file names, method names, and URL paths
- TypeScript is in loose mode (`"strict": false`); JS and TS files coexist
- Environment variables must be prefixed with `OHZI_` to be exposed by Vite
