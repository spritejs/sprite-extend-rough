import PathPlugin from './path';
import {parseStringPoints, smoothCurve} from './utils';

export default function install({use, utils, registerNodeType}) {
  const {RoughPath} = use(PathPlugin);
  const {attr, parseValue} = utils;

  class RoughCurveAttr extends RoughPath.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        points: '',
      });
    }

    @parseValue(parseStringPoints)
    @attr
    set points(val) {
      const d = smoothCurve(val);
      this.d = d;
      this.set('points', val);
    }
  }

  class RoughCurve extends RoughPath {
    static Attr = RoughCurveAttr;
  }

  registerNodeType('roughPolyline', RoughCurve);

  return {RoughCurve};
}