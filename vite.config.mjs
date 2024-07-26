import pugPlugin from '@vituum/vite-plugin-pug';
// import fs from 'fs';
import path from 'path';
import glsl from 'vite-plugin-glsl';
import sections_meta from './app/data/sections_meta.json';
import packagejson from './package.json';

export default {
  plugins: [
    glsl(),
    pugPlugin({
      globals: {
        sections_meta,
        package: packagejson
      }
    }),
    // watch({
    //   pattern: "./core/**/*.js",
    //   command: "cd core && yarn build",
    // }),
  ],
  build: {
    target: 'esnext', // browsers can handle the latest ES features
    rollupOptions: {
      input: ['index.pug.html'],
      output: {
        manualChunks: {
          'ohzi-core': ['ohzi-core'],
          three: ['three']
        }
      },
    },
    chunkSizeWarningLimit: 700
  },
  resolve: {
    alias: {
      'ohzi-components': path.resolve(__dirname, './components/src'),
      'ohzi-core': path.resolve(__dirname, './core/src'),
      'pit-js': path.resolve(__dirname, './pit/src'),
      'three': path.resolve(__dirname, './node_modules/three')
    }
  },
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'certificates', 'localhost-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'certificates', 'localhost.pem'))
    // },
    host: true // allows external access
  }
};
