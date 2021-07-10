let load_json = (file_path) =>
{
  return require(file_path);
};

module.exports = {
  locals: {
    example: load_json('./assets/data/example.json'),
    package: load_json('./app/package.json')
  }
};
