import MeshSampler from 'js/core/utilities/MeshSampler'
module.exports = () => {

  function CoreUtils() {
    return {
      
      MeshSampler: MeshSampler

    };
  }

  module.exports = CoreUtils;

  return new CoreUtils();
};
