importScripts('js/three.js');
importScripts('core_utilities.js');

const utils = require("core_utilities")();

self.addEventListener('message', function(event) {
    console.log("la data", event.data);

    let geo = new THREE.CircleGeometry( 10, 32 );
    geo.rotateX(-Math.PI/2);
    let sampled_data = utils.MeshSampler.sample(geo, 50000, true);

    let vertices = [];
    let normals = [];

    for(let i=0; i< sampled_data.points.length; i++)
    {
      vertices.push(sampled_data.points[i].x);
      vertices.push(sampled_data.points[i].y);
      vertices.push(sampled_data.points[i].z);

      normals.push(sampled_data.normals[i].x);
      normals.push(sampled_data.normals[i].y);
      normals.push(sampled_data.normals[i].z);
    }

    let result = {
      positions: vertices,
      normals: normals
    }
    // console.log(result);

    self.postMessage(result);
})

