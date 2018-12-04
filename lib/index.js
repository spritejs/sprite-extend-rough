'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.install = install;

var _rough = require('./rough');

var _rough2 = _interopRequireDefault(_rough);

var _rect = require('./rect');

var _rect2 = _interopRequireDefault(_rect);

var _ellipse = require('./ellipse');

var _ellipse2 = _interopRequireDefault(_ellipse);

var _circle = require('./circle');

var _circle2 = _interopRequireDefault(_circle);

var _arc = require('./arc');

var _arc2 = _interopRequireDefault(_arc);

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _polyline = require('./polyline');

var _polyline2 = _interopRequireDefault(_polyline);

var _polygon = require('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _curve = require('./curve');

var _curve2 = _interopRequireDefault(_curve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// auto use
if (typeof window !== 'undefined' && window.spritejs) {
  window.spritejs.use(install);
}

function install(_ref) {
  var use = _ref.use;

  return [_rough2.default, _rect2.default, _ellipse2.default, _arc2.default, _circle2.default, _path2.default, _polyline2.default, _polygon2.default, _curve2.default].reduce(function (pkg, Node) {
    return (0, _assign2.default)(pkg, spritejs.use(Node));
  }, {});
}