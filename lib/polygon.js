'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = install;

var _polyline = require('./polyline');

var _polyline2 = _interopRequireDefault(_polyline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function install(_ref) {
  var _class, _temp;

  var use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType;

  var _use = use(_polyline2.default),
      RoughPolyline = _use.RoughPolyline;

  var RoughPolygonAttr = function (_RoughPolyline$Attr) {
    (0, _inherits3.default)(RoughPolygonAttr, _RoughPolyline$Attr);

    function RoughPolygonAttr(subject) {
      (0, _classCallCheck3.default)(this, RoughPolygonAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (RoughPolygonAttr.__proto__ || (0, _getPrototypeOf2.default)(RoughPolygonAttr)).call(this, subject));

      _this.setDefault({
        closed: true
      });
      return _this;
    }

    return RoughPolygonAttr;
  }(RoughPolyline.Attr);

  var RoughPolygon = (_temp = _class = function (_RoughPolyline) {
    (0, _inherits3.default)(RoughPolygon, _RoughPolyline);

    function RoughPolygon() {
      (0, _classCallCheck3.default)(this, RoughPolygon);
      return (0, _possibleConstructorReturn3.default)(this, (RoughPolygon.__proto__ || (0, _getPrototypeOf2.default)(RoughPolygon)).apply(this, arguments));
    }

    return RoughPolygon;
  }(RoughPolyline), _class.Attr = RoughPolygonAttr, _temp);


  registerNodeType('roughPolygon', RoughPolygon);

  return { RoughPolygon: RoughPolygon };
}