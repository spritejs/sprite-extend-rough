import Rough from './rough';
import RoughRect from './rect';
import RoughEllipse from './ellipse';
import RoughCircle from './circle';
import RoughArc from './arc';
import RoughPath from './path';
import RoughPolyline from './polyline';
import RoughPolygon from './polygon';
import RoughCurve from './curve';

export function install({use}) {
  return [
    Rough,
    RoughRect,
    RoughEllipse,
    RoughArc,
    RoughCircle,
    RoughPath,
    RoughPolyline,
    RoughPolygon,
    RoughCurve,
  ].reduce((pkg, Node) => {
    return Object.assign(pkg, spritejs.use(Node));
  }, {});
}
