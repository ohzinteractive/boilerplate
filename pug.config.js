const load_json = (file_path) =>
{
  return require(file_path);
};

module.exports = {
  locals: {
    sections_meta: load_json('./app/data/sections_meta.json'),
    package: load_json('./package.json')
  }
};
