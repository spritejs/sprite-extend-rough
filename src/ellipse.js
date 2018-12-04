import RoughPlugin from './rough';

const _ellipse = Symbol('ellipse');

export default function install({use, utils, registerNodeType}) {
  const {Rough} = use(RoughPlugin);
  const {flow, attr, parseValue} = utils;

  class RoughEllipseAttr extends Rough.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        bounding: 'path',
        curveStepCount: 9,
      });
    }

    @attr
    set bounding(val) {
      this.set('bounding', val);
    }

    @parseValue(parseInt)
    @attr
    set curveStepCount(val) {
      this.set('curveStepCount', val);
    }
  }

  class RoughEllipse extends Rough {
    static Attr = RoughEllipseAttr;

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
        return (x - cx) ** 2 / width ** 2 + (y - cy) ** 2 / height ** 2 <= 0.25;
      }
      return isCollision;
    }

    render(t, context) {
      const {context: roughCanvas, options} = super.render(t, context);

      options.curveStepCount = this.attr('curveStepCount');

      const lw = this.attr('lineWidth') / 2;
      context.save();
      context.translate(lw, lw);

      const [width, height] = this.contentSize;

      if(!this.generators[_ellipse]) {
        this.generators[_ellipse] = roughCanvas.generator.ellipse(width / 2, height / 2, width, height, options);
      }
      roughCanvas.draw(this.generators[_ellipse]);

      context.restore();

      return {context: roughCanvas, options};
    }
  }

  registerNodeType('roughEllipse', RoughEllipse);

  return {RoughEllipse};
}
