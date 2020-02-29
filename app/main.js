import ResourceBatch from 'js/resource_loader/ResourceBatch';

module.exports = (parameters) => {
    const ViewApi = parameters.ViewApi;


    let batch = new ResourceBatch();

    // batch.add_texture("radar_base",    				"textures/radar_base.png");

    batch.load();

    let check_resource_loading = ()=>{
      if(batch.loading_finished)
      {
        if(batch.has_errors)
        {
          batch.print_errors();
        }
        else
        {
          ViewApi.resource_loading_completed();
          ViewApi.start();
        }
      }
      else
      {
        setTimeout(check_resource_loading, 200);
      }
    }

    check_resource_loading();
};
