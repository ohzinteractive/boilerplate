import pugPlugin from '@vituum/vite-plugin-pug';
import fs from 'fs';
import path from 'path';
import sections_meta from './app/data/sections_meta.json';
import packagejson from './package.json';

export default {
  plugins: [
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
  // resolve: {
  //   preserveSymlinks: true // this is the fix!
  //   // 'ohzi-core': path.resolve(__dirname, './core/build')
  // },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certificates', 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certificates', 'localhost.pem'))
    },
    host: true // allows external access
  }
};
