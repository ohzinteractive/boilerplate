import blobToHash from 'blob-to-hash'
import Graphics from 'js/core/Graphics';

class Test {

  constructor() {}

  test_core() {
    let _valid_image_hashes = {
      'test_1': '51b47d6cdae653de9447d8eeba5264060f60ab8f0c463ec5efb20cb2a25db4db',
      'test_2': '51b47d6cdae653de9447d8eeba5264060f60ab8f0c463ec5efb20cb2a25db4db',
      'test_3': '51b47d6cdae653de9447d8eeba5264060f60ab8f0c463ec5efb20cb2a25db4db'
    }

    Object.keys(_valid_image_hashes).forEach(function (key) {
      let screenshot_callback = (blob) => {
        console.log("el blob 2", blob);

        blobToHash('sha256', blob).then(function (value) {
          console.log(value);
          let test = value === _valid_image_hashes[key];
          console.log(`Test success: ${test}`)
        });

      }

      Graphics.take_screenshot(screenshot_callback)
    })
  }

}

const test = new Test();
module.exports = test;
