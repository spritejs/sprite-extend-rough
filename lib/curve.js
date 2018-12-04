'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = install;

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

function install(_ref) {
  var _dec, _desc, _value, _class, _class2, _temp;

  var use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType;

  var _use = use(_path2.default),
      RoughPath = _use.RoughPath;

  var attr = utils.attr,
      parseValue = utils.parseValue;
  var RoughCurveAttr = (_dec = parseValue(_utils.parseStringPoints), (_class = function (_RoughPath$Attr) {
    (0, _inherits3.default)(RoughCurveAttr, _RoughPath$Attr);

    function RoughCurveAttr(subject) {
      (0, _classCallCheck3.default)(this, RoughCurveAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (RoughCurveAttr.__proto__ || (0, _getPrototypeOf2.default)(RoughCurveAttr)).call(this, subject));

      _this.setDefault({
        points: ''
      });
      return _this;
    }

    (0, _createClass3.default)(RoughCurveAttr, [{
      key: 'points',
      set: function set(val) {
        var d = (0, _utils.smoothCurve)(val);
        this.d = d;
        this.set('points', val);
      }
    }]);
    return RoughCurveAttr;
  }(RoughPath.Attr), (_applyDecoratedDescriptor(_class.prototype, 'points', [_dec, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'points'), _class.prototype)), _class));
  var RoughCurve = (_temp = _class2 = function (_RoughPath) {
    (0, _inherits3.default)(RoughCurve, _RoughPath);

    function RoughCurve() {
      (0, _classCallCheck3.default)(this, RoughCurve);
      return (0, _possibleConstructorReturn3.default)(this, (RoughCurve.__proto__ || (0, _getPrototypeOf2.default)(RoughCurve)).apply(this, arguments));
    }

    return RoughCurve;
  }(RoughPath), _class2.Attr = RoughCurveAttr, _temp);


  registerNodeType('roughPolyline', RoughCurve);

  return { RoughCurve: RoughCurve };
}