let loader = document.querySelector('.loader');
let progress_bar = document.querySelector('.loader__progress-bar-fill');
let second_step = false;

let api_parameters = {
};

let on_api_ready = () =>
{
  loader.classList.add('hidden');

  ViewApi.init(api_parameters);
  ViewApi.resource_loading_completed();
  ViewApi.start();

  window.addEventListener('resize', function()
  {
    ViewApi.on_resize();
  });

  window.addEventListener('orientationchange', function()
  {
    ViewApi.on_orientation_change();
  });
};

let on_config_ready = () =>
{
  second_step = true;

  let config = ViewApi.ResourceContainer.get_resource('config');

  batch = new ViewApi.ResourceBatch();

  // batch.add_texture("fisheye_tex", "textures/snapshot_250.jpg");
  // batch.add_texture("point", "textures/point.png");

  // batch.add_json('cameras_example', 'data/cameras.json')

  batch.load(ViewApi.ResourceContainer);

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

let batch = new ViewApi.ResourceBatch();

batch.add_json('config', 'data/config.json');
batch.load(ViewApi.ResourceContainer);

check_resource_loading(batch, on_config_ready);
