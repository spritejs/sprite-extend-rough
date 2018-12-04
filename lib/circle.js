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

var _ellipse = require('./ellipse');

var _ellipse2 = _interopRequireDefault(_ellipse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

function install(_ref) {
  var _dec, _dec2, _desc, _value, _class, _class2, _temp;

  var use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType;

  var _use = use(_ellipse2.default),
      RoughEllipse = _use.RoughEllipse;

  var parseValue = utils.parseValue,
      attr = utils.attr;
  var RoughCircleAttr = (_dec = parseValue(parseFloat), _dec2 = parseValue(parseFloat), (_class = function (_RoughEllipse$Attr) {
    (0, _inherits3.default)(RoughCircleAttr, _RoughEllipse$Attr);

    function RoughCircleAttr() {
      (0, _classCallCheck3.default)(this, RoughCircleAttr);
      return (0, _possibleConstructorReturn3.default)(this, (RoughCircleAttr.__proto__ || (0, _getPrototypeOf2.default)(RoughCircleAttr)).apply(this, arguments));
    }

    (0, _createClass3.default)(RoughCircleAttr, [{
      key: 'diameter',
      set: function set(val) {
        this.width = val;
        this.height = val;
      },
      get: function get() {
        return this.width;
      }
    }, {
      key: 'radius',
      set: function set(val) {
        this.diameter = 2 * val;
      },
      get: function get() {
        return this.diameter / 2;
      }
    }]);
    return RoughCircleAttr;
  }(RoughEllipse.Attr), (_applyDecoratedDescriptor(_class.prototype, 'diameter', [_dec, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'diameter'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'radius', [_dec2, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'radius'), _class.prototype)), _class));
  var RoughCircle = (_temp = _class2 = function (_RoughEllipse) {
    (0, _inherits3.default)(RoughCircle, _RoughEllipse);

    function RoughCircle() {
      (0, _classCallCheck3.default)(this, RoughCircle);
      return (0, _possibleConstructorReturn3.default)(this, (RoughCircle.__proto__ || (0, _getPrototypeOf2.default)(RoughCircle)).apply(this, arguments));
    }

    return RoughCircle;
  }(RoughEllipse), _class2.Attr = RoughCircleAttr, _temp);


  registerNodeType('roughCircle', RoughCircle);

  return { RoughCircle: RoughCircle };
}