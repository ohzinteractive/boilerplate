import { ResourceBatch } from 'ohzi-core';

let is_mobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
let is_ios = navigator.userAgent.match(/(iPhone|iPod|iPad)/);
let is_ipad = navigator.userAgent.match(/(iPad)/);

let loader = document.querySelector('.loader');
let progress_bar = document.querySelector('.loader__progress-bar-fill');
let second_step = false;

let api_parameters = {
  is_mobile: is_mobile,
  is_ios: is_ios,
  is_ipad: is_ipad
};

let on_api_ready = () =>
{
  loader.classList.add('hidden');

  ViewApi.init(api_parameters);
  ViewApi.resource_loading_completed();
  ViewApi.start();

  let main_canvas = document.getElementById('main-canvas');

  // set the size of the drawingBuffer
  main_canvas.width = window.innerWidth;
  main_canvas.height = window.innerHeight;

  window.addEventListener('resize', function()
  {
    ViewApi.resize_canvas();
  });

  window.addEventListener('orientationchange', function()
  {
    ViewApi.canvas_view.on_orientation_change();
  });
};

let on_config_ready = () =>
{
  second_step = true;

  let config = ViewApi.resource_container.get_resource('config');

  batch = new ResourceBatch();

  // batch.add_texture("fisheye_tex", "textures/snapshot_250.jpg");
  // batch.add_texture("point", "textures/point.png");

  // batch.add_json('cameras_example', 'data/cameras.json')

  batch.load(ViewApi.resource_container);
  check_resource_loading(batch, on_api_ready);
};

let check_resource_loading = (batch, on_resources_loaded) =>
{
  if (second_step)
  {
    progress_bar.style.width = `${batch.get_progress() * 100}%`;
  }

  if (batch.loading_finished)
  {
    if (batch.has_errors)
    {
      batch.print_errors();
    }
    else
    {
      on_resources_loaded();
    }
  }
  else
  {
    setTimeout(function()
    {
      check_resource_loading(batch, on_resources_loaded);
    }, 200);
  }
};

let batch = new ResourceBatch();
batch.add_json('config', 'data/config.json');
batch.load(ViewApi.resource_container);

check_resource_loading(batch, on_config_ready);
