import rough from 'roughjs';

const RoughCanvasMap = new WeakMap();

export default function install({BaseSprite, Path, utils}) {
  const {parseValue, attr, inherit, parseFont, parseStringFloat, parseColorString} = utils;

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
        labelX: '',
        labelY: '',
        font: 'inherit',
        labelColor: 'inherit',
        labelBg: 'inherit',
      });
    }

    get enableCache() {
      return false;
    }

    @parseValue(parseColorString)
    @attr
    @inherit('rgba(0,0,0,1)')
    set labelColor(val) {
      this.set('labelColor', val);
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

    @parseValue(parseFloat)
    @attr
    set labelX(val) {
      this.set('labelX', val);
    }

    @parseValue(parseFloat)
    @attr
    set labelY(val) {
      this.set('labelY', val);
    }

    @parseValue(parseStringFloat)
    @attr
    set labelXY(val) {
      if(val == null) {
        val = ['', ''];
      }
      const [x, y] = val;
      this.labelX = x;
      this.labelY = y;
    }

    get labelXY() {
      return [this.labelX, this.labelY];
    }

    @parseValue(parseColorString)
    @attr
    @inherit('')
    set labelBg(val) {
      this.set('labelBg', val);
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
          let [cx, cy] = this.attr('labelXY');
          const font = this.attr('font');
          context.font = font;
          context.textBaseline = 'middle';
          const {width} = context.measureText(label);
          const {size} = parseFont(font);
          if(cx === '') cx = rect[2] / 2;
          if(cy === '') cy = rect[3] / 2;
          const labelBg = this.attr('labelBg');
          if(labelBg) {
            const rect = [cx - width / 2 - 6, cy - size / 2 - 6, width + 12, size + 12];
            context.fillStyle = labelBg;
            context.beginPath();
            context.rect(...rect);
            context.fill();
          }
          context.fillStyle = this.attr('labelColor');
          context.fillText(label, cx - width / 2, cy);
        });
      }

      return {context: roughCanvas, options};
    }
  }
  return {Rough};
}