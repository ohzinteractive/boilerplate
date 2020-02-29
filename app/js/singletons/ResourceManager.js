/*

  Resource loader for threejs
  store resources into a name
  load resources with a baseURL + resourceURN

*/
class ResourceManager {
  constructor(parameters = {}) {

    this.baseURL = parameters.baseURL ? parameters.baseURL : './';

    this.textureLoader = new THREE.TextureLoader();
    this.textureLoader.crossOrigin = '';

    //  const FBXLoader = require('three-fbx-loader')(THREE);

    //FBXLoader.prototype.crossOrigin = '':

    //   this.fbxLoader = new THREE.FBXLoader();

    
    // this.daeLoader = this.animationLoader;

    this.resources = { holo: 'asd' };
  }

  setBaseURl(aBaseURL) {
    this.baseURL = aBaseURL;
  }

  getBaseURL() {
    return this.baseURL;
  }

  saveResource(aName, aResource) {
    this.resources[aName] = aResource;
  }

  getResource(aName) {
    return this.resources[aName];
  }

  saveBatch(aResourcesArray) {
    for (let i = 0; i < aResourcesArray; i++) {
      this.resources[aResourcesArray[i].name] = aResourcesArray[i].resource;
    }
  }

  loadNewResource(params) {
    switch (params.type) {
      case 'texture':
        this.loadTexture(params);
        break;

      case 'obj':
        /**/
        console.error('not implementd');
        break;

      case 'animation':
        /**/
        this.loadDaeAnimation(params);
        break;

      case 'fbx':
        /**/
        this.loadFbx(params);
        break;

      case 'gltf':
        /**/
        this.loadglTF(params);
        break;

      case 'dae':
        /**/
        this.loadDae(params);
        break;

      default:
        console.error(params.type + 'is not a valid resource type');
    }
  }

  notLoadedYet(params) {
    //  in the case someone is already required the resource, but that's not loaded yet.
    //  this.saveResource(params.name, true);
  }

  loadDaeAnimation(params) {
    if (this.animationLoader) {
      const AnimationLoader = ColladaLoader2;
      this.animationLoader = new AnimationLoader();

      this.animationLoader.crossOrigin = '';
      this.animationLoader.path = this.baseURL;
    }
    const context = this;
    this.notLoadedYet(params);
    this.animationLoader.load(this.baseURL + params.name, (collada) => {
      context.saveResource(params.name, collada);
      context.provideStored(params);
    }, console.error, console.error);
  }

  loadglTF(params) {
    if (!this.glTFLoader) {
      this.glTFLoader = new THREE.GLTFLoader();
      //this.glTFLoader.crossOrigin = '';
      //this.glTFLoader.path = this.baseURL;
    }
    const context = this;
    this.notLoadedYet(params);
    this.glTFLoader.load(this.baseURL + params.name, (gltf) => {
      context.saveResource(params.name, gltf);
      context.provideStored(params);
    }, params.progress_callback);
  }

  get_dae_loader()
  {
    let daeLoader = new THREE.ColladaLoader();
    daeLoader.crossOrigin = '';
    return daeLoader;
  }
  loadDae(params) {
    const context = this;
    this.notLoadedYet(params);
    this.get_dae_loader().load(this.baseURL + params.name, (collada) => {
      context.saveResource(params.name, collada);
      context.provideStored(params);
    }, params.progress_callback, console.error);
  }

  loadFbx(params) {
    const context = this;
    this.notLoadedYet(params);

    this.fbxLoader.load(this.baseURL + params.name, (fbx) => {
      console.log('as')
      console.log(fbx)
      context.saveResource(params.name, fbx);
      context.provideStored(params);
      //var material = new THREE.MeshNormalMaterial()
      //var mesh = new THREE.Mesh(geometry, material)
    }, console.log, console.error);
  }


  loadTexture(params) {
    const context = this;
    this.textureLoader.load(this.baseURL + params.name, (texture) => {
      const textureI = texture;
      textureI.wrapS = params.wrapping || THREE.ClampToEdgeWrapping;
      textureI.wrapT = params.wrapping || THREE.ClampToEdgeWrapping;
      textureI.generateMipmaps = params.generateMipmaps || false;
      textureI.magFilter = params.magFilter || THREE.LinearFilter;
      textureI.minFilter = params.minFilter || THREE.LinearFilter;
      // textureI.repeat.set(1, 1);
      textureI.needsUpdate = true;

      context.saveResource(params.name, texture);
      context.provideStored(params);
    });
  }

  provideStored(params) {
    const resource = this.getResource(params.name);
    if (params.callback) {
      params.callback(resource);
    }
    if (params.material) {
      params.material[params.bind] = resource;
      params.material.needsUpdate = true;
    }
    return resource;
  }

  provide(params) {
    /*
    provide({name: 'assets/texturita.png', material : material, operation : 'map', type : texture)
    provide({name: 'assets/texturita.png', material : material, operation : 'color', type : color)
      const params = {
        name: 'assets/texture.png',
        callback: function(material) { material.map = texture},
        type: aTexture|aColor|aModel
        operation : anOperation, //the attribute that will be affected of that material
        material: aMaterial, //this material will be appendend if
      }
    */

    if (this.resources[params.name]) {
      return this.provideStored(params);
    }
    return this.loadNewResource(params);
  }
}

const resourceManager = new ResourceManager();
module.exports = resourceManager;
