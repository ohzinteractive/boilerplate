exports.config =
  # See http://brunch.io/#documentation for docs.
  files:
    javascripts:{
      entryPoints: {
        'app/main.js': 'main.js',
        'app/api.js': 'api.js'
      }
    },
    stylesheets:
      joinTo: 'app.css'
    templates:
      joinTo: 'app.js'
  plugins:
    babel: {
      ignore: [/vendor/],
      presets: ['latest']
    }


