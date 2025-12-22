# OHZI Boilerplate - Introduction

## Purpose

The OHZI Boilerplate is a production-ready template for building high-performance, interactive web experiences using **WebGL**. It serves as a complete starting point for developers who want to create visually stunning and performant web applications with modern 3D graphics capabilities.

This boilerplate is built and maintained by **OHZI Interactive Studio**, combining battle-tested libraries and best practices to jumpstart your next web project.

## What Problems Does It Solve

1. **Complex Setup Complexity**: Building a modern WebGL application from scratch involves managing multiple dependencies, build tools, and configurations. This boilerplate eliminates that overhead.

2. **Performance Optimization**: Creating performant interactive experiences requires careful architecture. The boilerplate includes pre-configured optimization patterns for rendering, memory management, and asset loading.

3. **Code Organization**: It provides a structured approach to organizing views, scenes, transitions, and components, making it easy to scale your project as it grows.

4. **Development Workflow**: Includes tools for rapid development (hot module replacement, asset size monitoring, development tools like TweakPane) and production builds.

5. **Reusable Components**: Integrates pre-built, battle-tested components for common UI patterns like modals, audio handling, animations, and performance monitoring.

## Main Functionalities

### Core Architecture
- **Graphics Foundation**: Built on top of **three.js** and **OHZI Core**, providing a robust WebGL rendering layer
- **Application State Management**: Includes transition and view management systems for handling complex application states
- **Resource Management**: Built-in resource container for efficient asset and configuration management

### Key Features

#### 1. **Multi-View System**
- Support for multiple views with smooth transitions between them
- Extensible architecture for creating new views
- Example views included: Home

#### 2. **Scene and Component Management**
- Organized structure for managing 3D scenes
- Reusable component system for building UI and interactive elements
- Support for custom transitions between scenes

#### 3. **UI Components Library** (via OHZI Components)
- **UICollisionLayer**: For interactive UI collision detection
- **Modal Component**: Pre-built modal dialogs
- **Lottie Animation**: Support for Lottie animations
- **Text Scrambler**: Dynamic text animation effects
- **Audio Management**: Audio playback and control
- **Performance Controller**: Built-in performance monitoring
- **Request Manager**: Centralized HTTP request handling
- **Scroll Management**: Custom scroll behavior handling

#### 4. **Input System**
- Unified input handling for keyboard and mouse/touch events
- Built-in keyboard input controller
- Router component for navigation management

#### 5. **Development Tools**
- **TweakPane Integration**: Visual debugging and parameter adjustment in development mode
- **Asset Size Calculator**: Monitors and reports on asset file sizes
- **Performance Monitoring**: Built-in performance tracking capabilities

#### 6. **Build and Deployment**
- **Vite-based Build System**: Fast development server and optimized production builds
- **Multi-format Support**: 
  - Pug templating for HTML
  - SCSS for styling
  - GLSL shader support
  - Static asset management (3D models, textures, sounds, videos)
- **SSL Support**: Built-in development server with HTTPS support
- **Asset Packaging**: Automatic build and distribution packaging

### Project Structure
```
app/                    # Main application code
├── js/                 # JavaScript/TypeScript application logic
├── css/                # Styling (SCSS)
├── views/              # View templates
└── data/               # Configuration and metadata

core/                   # OHZI Core library (WebGL foundation)
components/            # OHZI Components library (pre-built UI components)
pit/                    # PIT.js library (JavaScript utilities)
public/                 # Static assets (models, textures, sounds, fonts)
dist/                   # Production build output
```

## Technology Stack

- **Runtime**: Node.js 18.x
- **Package Manager**: Yarn 1.22.x
- **Build Tool**: Vite
- **Graphics**: three.js + OHZI Core
- **Templating**: Pug
- **Styling**: SCSS
- **Utilities**: PIT.js
- **Shader Language**: GLSL

## Getting Started

The boilerplate comes with pre-configured scripts for:
- **Development**: `yarn start` - Local development with hot reload
- **Production**: `yarn build` - Optimized build for deployment
- **Code Generation**: Tools to scaffold new views, scenes, components, and transitions
- **Code Style**: `yarn fix-syntax` - Automatic code formatting

## Next Steps

To dive deeper into specific areas:
- **Building Views**: Explore the [view creation guide](creating-views.md)
- **Working with Components**: Check the [components documentation](../components/docs/)
- **Core Library Features**: Review the [core library documentation](../core/README.md)
- **Performance**: Learn about [performance optimization](performance.md)

---

**License**: MIT  
**Contact**: support@ohzi.io
