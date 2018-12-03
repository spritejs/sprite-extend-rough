import RoughPlugin from './rough';

const _arc = Symbol('arc');

export default function install({use, utils, registerNodeType}) {
  const {Rough} = use(RoughPlugin);
  const {flow, attr, parseValue} = utils;

  class RoughArcAttr extends Rough.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        startAngle: 0,
        stopAngle: 90,
        closed: false,
        bounding: 'path',
      });
    }

    @parseValue(parseFloat)
    @attr
    set startAngle(val) {
      this.set('startAngle', val);
    }

    @parseValue(parseFloat)
    @attr
    set stopAngle(val) {
      this.set('stopAngle', val);
    }

    @attr
    set closed(val) {
      this.set('closed', !!val);
    }

    @attr
    set bounding(val) {
      this.set('bounding', val);
    }
  }

  class RoughArc extends Rough {
    static Attr = RoughArcAttr;

    @flow
    get contentSize() {
      const [width, height] = super.contentSize;
      const lineWidth = this.attr('lineWidth');
      return [width + lineWidth, height + lineWidth];
    }

    pointCollision(evt) {
      const isCollision = super.pointCollision(evt);
      if(isCollision && this.attr('bounding') === 'path') {
        const {offsetX: x, offsetY: y} = evt;
        const [x0, y0, width, height] = super.originalRect;
        const [cx, cy] = [x0 + width / 2, y0 + height / 2];
        const dis = (x - cx) ** 2 / width ** 2 + (y - cy) ** 2 / height ** 2;
        const lw = this.attr('lineWidth');
        const closed = this.attr('closed');

        if(dis > 0.25 || !closed && dis < 0.25 * ((width - 2 * lw) / width) ** 2) {
          return false;
        }
        let {startAngle, stopAngle} = this.attributes;
        if(startAngle > stopAngle) [startAngle, stopAngle] = [stopAngle, startAngle];

        stopAngle += startAngle % 360 - startAngle;
        startAngle %= 360;

        if(startAngle < 0) {
          stopAngle += 360;
          startAngle += 360;
        }

        startAngle = startAngle * Math.PI / 180;
        stopAngle = stopAngle * Math.PI / 180;

        let ang = Math.atan2(y - cy, x - cx);

        if(ang < startAngle) {
          ang += 2 * Math.PI;
        }

        return ang <= stopAngle;
      }
      return isCollision;
    }

    render(t, context) {
      const {context: roughCanvas, options} = super.render(t, context);

      const lw = this.attr('lineWidth') / 2;
      context.save();
      context.translate(lw, lw);

      const [width, height] = this.contentSize;

      let {startAngle, stopAngle} = this.attributes;
      const closed = this.attr('closed');

      if(startAngle > stopAngle) [startAngle, stopAngle] = [stopAngle, startAngle];

      if(!this.generators[_arc]) {
        this.generators[_arc] = roughCanvas.generator.arc(width / 2, height / 2,
          width, height, Math.PI * startAngle / 180, Math.PI * stopAngle / 180, closed, options);
      }
      roughCanvas.draw(this.generators[_arc]);

      context.restore();

      return {context: roughCanvas, options};
    }
  }

  registerNodeType('roughArc', RoughArc);

  return {RoughArc};
}