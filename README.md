# OHZI Core


This is a **WebGL** map viewer build with [Three.js](http://threejs.org/) and [ES2015](http://es6-features.org) using [Brunch](http://brunch.io).


## Getting started

* Install (if you don't have them):
  * [Node.js](http://nodejs.org): `brew install node` on OS X
  * [Brunch](http://brunch.io): `npm install -g brunch`

* Download dependencies :
    * `npm run deploy` or `npm install && npm start`


## How to use

* `npm start` or `brunch watch --server` to watch the project with continuous rebuild.
* `npm run prod` or `brunch build --production` to build minified project for production.


## More

* ** project folders :**

  * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.

  * `/app/css/` contains `.css` files to be preprocessed with `sass` and to be places in the app.css file.

  * `/app/js/` contains `.js` files that will be compiled in the APP.

  * `/app/js/components` are standalone components.

  * `/app/js/` contains `.js` files that will be compiled in the APP.

  * `/app/js/shaders` contains each fragments and vertices `.glsl` files.

  * `/app/js/singletons` contains utilities which are global if required and follows the `singleton` pattern.

  * `/app/js/ui_controllers` contains objects that control `HTML` and `CSS` behaviour.

  * This directory `/app/js/core/` contain the classes of setting :
      * `Webgl.js` initializes the 3D scene and the camera.
      * `Loop.js` allows to manage the frame animation for each update of 3Dobjects.
      * custom `.js` like line or text that can be reused on other classes as an extension of THREEJS.

  * `/app/js/main.js` allows to show you how all of this files are using for create and animate a 3D object.

  * `app/assets/` contains textures, 3d models and files to be copied stright into `public/` folder without preprocessing.

## Developers

   - [Juan Agustin Tibaldo](https://github.com/tinotibaldo).

   - [Ramiro Fages De La Canal](https://github.com/ramirofages).
