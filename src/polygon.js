import PolylinePlugin from './polyline';

export default function install({use, utils, registerNodeType}) {
  const {RoughPolyline} = use(PolylinePlugin);

  class RoughPolygonAttr extends RoughPolyline.Attr {
    constructor(subject) {
      super(subject);
      this.setDefault({
        closed: true,
      });
    }
  }

  class RoughPolygon extends RoughPolyline {
    static Attr = RoughPolygonAttr;
  }

  registerNodeType('roughPolygon', RoughPolygon);

  return {RoughPolygon};
}