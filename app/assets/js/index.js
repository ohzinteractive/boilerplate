var is_mobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
var is_ios = navigator.userAgent.match(/(iPhone|iPod|iPad)/);
var is_ipad = navigator.userAgent.match(/(iPad)/);

let parameters = {
    is_mobile: is_mobile,
    is_ios: is_ios,
    is_ipad: is_ipad
};

let main_canvas = document.getElementById("main-canvas");

// main_canvas.style.width = window.innerWidth + 'px';
// main_canvas.style.height = window.innerHeight + 'px';

// set the size of the drawingBuffer
main_canvas.width = window.innerWidth;
main_canvas.height = window.innerHeight;

let ViewApi = require('api')(parameters);

window.addEventListener('resize', function () {
    // main_canvas.style.width = window.innerWidth + 'px';
    // main_canvas.style.height = window.innerHeight + 'px';
    ViewApi.resize_canvas();
});

window.addEventListener('orientationchange', function () {
    ViewApi.resize_canvas();
});

const main_parameters = {
    ViewApi: ViewApi
}

require('main')(main_parameters);

// (function ()
//   {
//     var script = document.createElement('script');
//     script.src="//cdn.jsdelivr.net/npm/eruda";
//     document.body.appendChild(script);
//     script.onload = function () {
//       eruda.init()
//     }
//   })
// ();
