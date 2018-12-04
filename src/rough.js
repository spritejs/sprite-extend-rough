import rough from 'roughjs';

const RoughCanvasMap = new WeakMap();

export default function install({BaseSprite, Path, utils}) {
  const {parseValue, attr, inherit, parseFont} = utils;

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
        label: '',
        font: 'inherit',
      });
    }

    get enableCache() {
      return false;
    }

    @attr
    @inherit('normal normal normal 32px "Hannotate SC"')
    set font(val) {
      this.set('font', val);
    }

    @attr
    set fontSize(val) {
      if(val == null) val = '16px';
      let unit = 'px';
      if(typeof val === 'string') {
        const unitReg = /^([\d.]+)(\w+)/;
        const matches = val.match(unitReg);
        if(!matches) {
          return null;
        }
        val = parseFloat(matches[1]);
        unit = matches[2];
      }
      const font = this.font;
      const {style, variant, weight, family} = parseFont(font);
      const fontValue = `${style} ${variant} ${weight} ${val}${unit} ${family}`;
      this.font = fontValue;
    }

    get fontSize() {
      const font = this.font;
      const {size0, unit} = parseFont(font);
      return `${size0}${unit}`;
    }

    @attr
    set fontFamily(val) {
      if(val == null) val = 'Arial';
      const font = this.font;
      const {style, variant, weight, size0, unit} = parseFont(font);
      const fontValue = `${style} ${variant} ${weight} ${size0}${unit} ${val}`;
      this.font = fontValue;
    }

    get fontFamily() {
      return parseFont(this.font).family;
    }

    @attr
    set fontStyle(val) {
      if(val == null) val = 'normal';
      const font = this.font;
      const {variant, weight, size0, unit, family} = parseFont(font);
      const fontValue = `${val} ${variant} ${weight} ${size0}${unit} ${family}`;
      this.font = fontValue;
    }

    get fontStyle() {
      return parseFont(this.font).style;
    }

    @attr
    set fontVariant(val) {
      if(val == null) val = 'normal';
      const font = this.font;
      const {style, weight, size0, unit, family} = parseFont(font);
      const fontValue = `${style} ${val} ${weight} ${size0}${unit} ${family}`;
      this.font = fontValue;
    }

    get fontVariant() {
      return parseFont(this.font).variant;
    }

    @attr
    set fontWeight(val) {
      if(val == null) val = 'normal';
      const font = this.font;
      const {style, variant, size0, unit, family} = parseFont(font);
      const fontValue = `${style} ${variant} ${val} ${size0}${unit} ${family}`;
      this.font = fontValue;
    }

    get fontWeight() {
      return parseFont(this.font).weight;
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

    @attr
    set label(val) {
      this.set('label', val);
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

      const label = this.attr('label');
      if(label) {
        this.once('afterdraw', ({target, context}) => {
          const rect = target.originalRect;
          const [cx, cy] = [rect[2] / 2, rect[3] / 2];
          context.font = this.attr('font');
          const {width} = context.measureText(label);
          context.fillStyle = 'red';
          context.fillText(label, cx - width / 2, cy);
        });
      }

      return {context: roughCanvas, options};
    }
  }
  return {Rough};
}