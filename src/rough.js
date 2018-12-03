import rough from 'roughjs';

const RoughCanvasMap = new WeakMap();

export default function install({BaseSprite, Path, utils}) {
  const {parseValue, attr, inherit} = utils;

  class RoughAttr extends Path.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        roughness: 'inherit',
        bowing: 'inherit',
        lineWidth: 'inherit',
        fillStyle: 'inherit',
        fillWeight: 'inherit',
        hachureAngle: 'inherit',
        hachureGap: 'inherit',
      });
    }

    get enableCache() {
      return false;
    }

    @parseValue(parseFloat)
    @attr
    @inherit(1)
    set roughness(val) {
      this.set('roughness', val);
    }

    @parseValue(parseFloat)
    @attr
    @inherit(1)
    set bowing(val) {
      this.set('bowing', val);
    }

    @parseValue(parseFloat)
    @attr
    @inherit(1)
    set lineWidth(val) {
      this.clearFlow();
      this.set('lineWidth', val);
    }

    // hachure, solid, zigzag, cross-hatch, dot
    @attr
    @inherit('hachure')
    set fillStyle(val) {
      this.set('fillStyle', val);
    }

    /*
      Numeric value representing the width of the hachure lines.
      Default value of the fillWeight is set to half the strokeWidth of that shape.
     */
    @parseValue(parseFloat)
    @attr
    @inherit('')
    set fillWeight(val) {
      this.set('fillWeight', val);
    }

    @parseValue(parseFloat)
    @attr
    @inherit(-41)
    set hachureAngle(val) {
      this.set('hachureAngle', val);
    }

    /*
      Numerical value that defines the average gap, in pixels, between two hachure lines.
      Default value of the hachureGap is set to four times the strokeWidth of that shape.
    */
    @parseValue(parseFloat)
    @attr
    @inherit('')
    set hachureGap(val) {
      this.set('hachureGap', val);
    }
  }

  class Rough extends BaseSprite {
    static Attr = RoughAttr;

    constructor(...args) {
      super(...args);
      this.generators = {};
    }

    forceUpdate(clearCache) {
      super.forceUpdate(clearCache);
      this.generators = {};
    }

    render(t, context) {
      super.render(t, context);

      const lineCap = this.attr('lineCap');
      const lineJoin = this.attr('lineJoin');

      context.lineCap = lineCap;
      context.lineJoin = lineJoin;

      let roughCanvas = RoughCanvasMap.get(context);
      if(!roughCanvas) {
        roughCanvas = rough.canvas(context.canvas);
        RoughCanvasMap.set(context, roughCanvas);
      }

      const options = {};
      const {fillWeight, hachureGap, strokeColor: stroke, fillColor: fill} = this.attributes;

      Object.entries({fillWeight, hachureGap, stroke, fill}).forEach(([k, v]) => {
        if(v !== '') {
          options[k] = v;
        }
      });

      const {roughness, bowing, lineWidth: strokeWidth, fillStyle, hachureAngle} = this.attributes;
      Object.assign(options, {
        roughness,
        bowing,
        strokeWidth,
        fillStyle,
        hachureAngle,
      });

      return {context: roughCanvas, options};
    }
  }
  return {Rough};
}