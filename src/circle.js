import EllipsePlugin from './ellipse';

export default function install({use, utils, registerNodeType}) {
  const {RoughEllipse} = use(EllipsePlugin);
  const {parseValue, attr} = utils;

  class RoughCircleAttr extends RoughEllipse.Attr {
    @parseValue(parseFloat)
    @attr
    set diameter(val) {
      this.width = val;
      this.height = val;
    }

    get diameter() {
      return this.width;
    }

    @parseValue(parseFloat)
    @attr
    set radius(val) {
      this.diameter = 2 * val;
    }

    get radius() {
      return this.diameter / 2;
    }
  }

  class RoughCircle extends RoughEllipse {
    static Attr = RoughCircleAttr;
  }

  registerNodeType('roughCircle', RoughCircle);

  return {RoughCircle};
}
