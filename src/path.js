import RoughPlugin from './rough';

const _path = Symbol('path');

export default function install({use, utils, registerNodeType, Path}) {
  const {Rough} = use(RoughPlugin);
  const {parseValue, attr, flow} = utils;

  class RoughPathAttr extends Rough.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        simplification: 0,
        bounding: 'path',
      });
    }

    @parseValue(parseFloat)
    @attr
    set simplification(val) {
      this.set('simplification', val);
    }
  }

  class RoughPath extends Rough {
    static Attr = RoughPathAttr

    constructor(attr) {
      if(typeof attr === 'string') {
        attr = {d: attr};
      }
      super(attr);
    }

    set path(val) {
      this.attr('path', val);
    }

    get path() {
      return this.attr('path');
    }

    getPointAtLength(length) {
      if(this.svg) {
        return this.svg.getPointAtLength(length);
      }
      return [0, 0];
    }

    getPathLength() {
      if(this.svg) {
        return this.svg.getTotalLength();
      }
      return 0;
    }

    findPath(offsetX, offsetY) {
      const rect = this.originalRect;
      const pathOffset = this.pathOffset;
      const point = [offsetX - rect[0] - pathOffset[0], offsetY - rect[1] - pathOffset[1]];
      if(this.svg && this.svg.isPointInPath(...point)) {
        return [this.svg];
      }
      if(this.path2D_) {
        this.context.save();
        this.context.lineWidth = this.attr('lineWidth');
        this.context.lineCap = this.attr('lineCap');
        this.context.lineJoin = this.attr('lineJoin');
        if(this.context.isPointInStroke(this.path2D_, ...point)) {
          return [this.svg];
        }
        this.context.restore();
      }
      return [];
    }

    get pathOffset() {
      const lw = Math.round(this.attr('lineWidth'));
      return [lw, lw];
    }

    get pathSize() {
      return this.svg ? this.svg.size : [0, 0];
    }

    @flow
    get contentSize() {
      if(!this.svg) return super.contentSize;

      const bounds = this.svg.bounds;
      let [width, height] = this.attrSize;

      const pathOffset = this.pathOffset;

      if(width === '') {
        width = bounds[2] - Math.min(0, bounds[0]) + 2 * pathOffset[0];
      }
      if(height === '') {
        height = bounds[3] - Math.min(0, bounds[1]) + 2 * pathOffset[1];
      }

      return [width, height].map(Math.ceil);
    }


    @flow
    get originalRect() {
      const svg = this.svg;
      if(svg) {
        const bounds = svg.bounds,
          offset = this.pathOffset;
        const [width, height] = this.offsetSize,
          [anchorX, anchorY] = this.attr('anchor');

        const rect = [0, 0, width, height],
          offsetX = Math.min(0, bounds[0]),
          offsetY = Math.min(0, bounds[1]);

        rect[0] = offsetX - offset[0] - anchorX * (width + offsetX - 2 * offset[0]);
        rect[1] = offsetY - offset[1] - anchorY * (height + offsetY - 2 * offset[1]);
        return rect;
      }

      return super.originalRect;
    }

    pointCollision(evt) {
      if(super.pointCollision(evt)) {
        let {offsetX, offsetY} = evt;
        if(offsetX == null && offsetY == null) return true;

        const svg = this.svg;
        if(svg) {
          const bounds = svg.bounds;
          offsetX += Math.min(0, bounds[0]);
          offsetY += Math.min(0, bounds[1]);
        }
        evt.targetPaths = this.findPath(offsetX, offsetY);
        if(this.attr('bounding') === 'path') {
          return evt.targetPaths.length > 0;
        }
        return true;
      }
      return false;
    }

    render(t, context) {
      const {context: roughCanvas, options} = super.render(t, context);
      const d = this.attr('d');

      if(d) {
        options.simplification = this.attr('simplification');
        const svg = this.svg;
        const [ox, oy, ow, oh] = svg.bounds;
        const [px, py] = this.pathOffset;
        const [w, h] = this.contentSize;
        if(w < ow || h < oh) {
          context.beginPath();
          context.rect(0, 0, w, h);
          context.clip();
        }
        if(ox < 0 || oy < 0) {
          context.translate(-Math.min(0, ox), -Math.min(0, oy));
        }
        context.translate(px, py);

        if(typeof Path2D !== 'undefined') {
          this.path2D_ = new Path2D(d);
        }

        if(!this.generators[_path]) {
          this.generators[_path] = roughCanvas.generator.path(d, options);
        }
        roughCanvas.draw(this.generators[_path]);
      }

      return {context: roughCanvas, options};
    }
  }

  const symbols = Object.getOwnPropertySymbols(Path.prototype);
  symbols.forEach((symbol) => {
    if(symbol.toString() === 'Symbol(effects)') {
      const {d, path} = Path.prototype[symbol];
      RoughPath.setAttributeEffects({
        d,
        path,
      });
    }
  });

  registerNodeType('roughPath', RoughPath);

  return {RoughPath};
}