import Screen from 'js/core/Screen'
import Configuration from 'js/singletons/Configuration';

class HTMLManager {
  constructor() {
    this.html_font_size = '';
  }

  on_resize() {
    this.html_font_size = 13;
    let font_size = 1;

    font_size = 1 / (700 / document.querySelector('body').clientWidth);

    font_size = THREE.Math.clamp(font_size, 0, 1);

    this.html_font_size = font_size * 16;

    if (Configuration.is_ipad) {
      this.html_font_size = 16;
    }

    $('html').css('font-size', this.html_font_size + 'px');
  }

}

export default new HTMLManager();
