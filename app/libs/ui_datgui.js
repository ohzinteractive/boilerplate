
var settings = {
  "current_orientation": 7,
  "current_tilt": 10,
  "wrapping_fov" : 180,
  "use_upper_hemisphere": false,
  "new_orientation": 7,
  "new_tilt": 10,
  "texture_rotation_x": "0",
  "texture_rotation_y": "0",
  "texture_rotation_z": "0",
  "marker_orientation" : 0,
  "marker_tilt" : 0
}






var gui = new dat.GUI();



var general = {

  "Apply settings": function(){

  },


}



gui.add(settings,"current_orientation")
gui.add(settings,"current_tilt")
gui.add(settings,"wrapping_fov", 10, 360);
gui.add(settings,"use_upper_hemisphere");
gui.add(settings,"new_orientation", 0, 360);
gui.add(settings,"new_tilt", 0, 90);

gui.add(settings,"texture_rotation_x").onChange(function(val){

});
gui.add(settings,"texture_rotation_y").onChange(function(val){

});
gui.add(settings,"texture_rotation_z").onChange(function(val){

});


gui.add(settings,"marker_orientation")
gui.add(settings,"marker_tilt")

gui.add(general, 'Apply settings')

gui.close()


// gui.add(general, 'Save config')
// gui.add(general, 'Restore default config')
// gui.add(general, 'Export conf to JSON')


// gui.close();
gui.width = 400;

