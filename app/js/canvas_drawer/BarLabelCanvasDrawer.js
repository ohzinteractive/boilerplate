
export default class BarLabelCanvasDrawer {



  constructor () 
  {
    this.textWidth = null;
    this.textHeight = null;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    // document.getElementsByTagName('body')[0].appendChild(this.canvas);
  }

  getFontHeight (fontStyle) {

    var body = document.getElementsByTagName('body')[0];
    var dummy = document.createElement('div');

    var dummyText = document.createTextNode('MÉq');
    dummy.appendChild(dummyText);
    dummy.setAttribute('style', `font:${ fontStyle };position:absolute;top:0;left:0`);
    body.appendChild(dummy);
    let result = dummy.offsetHeight;
    body.removeChild(dummy);

    return result;
      
  }

  drawText (text, ctxOptions) 
  {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = ctxOptions.font;

    this.textWidth = Math.ceil(this.ctx.measureText(text).width);
    this.textHeight = this.getFontHeight(this.ctx.font);


    let square_rect = this.textHeight*2.75;


    this.canvas.width = square_rect;
    this.canvas.height = square_rect;


    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = ctxOptions.fillStyle;

    this.roundRect(this.ctx, 1.5, 1.5, this.canvas.width-1.5*2, this.canvas.height-1.5*2, 17, true,false);
    

    // this.ctx.globalAlpha = 1;
    this.ctx.font = ctxOptions.font
    this.ctx.fillStyle = "#FFFFFF"
    // this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.shadowColor = ctxOptions.shadowColor || 'rgba(0, 0, 0, 0)';
    this.ctx.shadowBlur = ctxOptions.shadowBlur || 0;
    this.ctx.shadowOffsetX = ctxOptions.shadowOffsetX || 0;
    this.ctx.shadowOffsetY = ctxOptions.shadowOffsetY || 0;


    this.ctx.fillText(text, this.canvas.width/2-this.textWidth/2, this.canvas.height/2 - this.textHeight/2 );

    return this.canvas
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      if (typeof stroke == 'undefined') {
        stroke = true;
      }
      if (typeof radius === 'undefined') {
        radius = 5;
      }
      if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
      } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }
      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();
      if (fill) {
        ctx.fill();
      }
      if (stroke) {
        ctx.stroke();
      }

    }

}
