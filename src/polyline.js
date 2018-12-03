import PathPlugin from './path';
import {parseStringPoints} from './utils';

export default function install({use, utils, registerNodeType}) {
  const {RoughPath} = use(PathPlugin);
  const {attr, parseValue} = utils;

  class RoughPolylineAttr extends RoughPath.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        points: '',
        closed: false,
      });
    }

    @parseValue(parseStringPoints)
    @attr
    set points(val) {
      let d = `M${val[0][0]},${val[0][1]}`;
      for(let i = 1; i < val.length; i++) {
        d += `L${val[i][0]},${val[i][1]}`;
      }
      if(this.closed) {
        d += 'z';
      }
      this.d = d;
      this.set('points', val);
    }

    @attr
    set closed(val) {
      this.set('closed', !!val);
      this.d = `${this.d.replace(/z$/, '')}z`;
    }
  }

  class RoughPolyline extends RoughPath {
    static Attr = RoughPolylineAttr;
  }

  registerNodeType('roughPolyline', RoughPolyline);

  return {RoughPolyline};
}