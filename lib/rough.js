'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

exports.default = install;

var _roughjs = require('roughjs');

var _roughjs2 = _interopRequireDefault(_roughjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

var RoughCanvasMap = new _weakMap2.default();

function install(_ref) {
  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _desc, _value, _class, _class2, _temp;

  var BaseSprite = _ref.BaseSprite,
      Path = _ref.Path,
      utils = _ref.utils;
  var parseValue = utils.parseValue,
      attr = utils.attr,
      inherit = utils.inherit;
  var RoughAttr = (_dec = parseValue(parseFloat), _dec2 = inherit(1), _dec3 = parseValue(parseFloat), _dec4 = inherit(1), _dec5 = parseValue(parseFloat), _dec6 = inherit(1), _dec7 = inherit('hachure'), _dec8 = parseValue(parseFloat), _dec9 = inherit(''), _dec10 = parseValue(parseFloat), _dec11 = inherit(-41), _dec12 = parseValue(parseFloat), _dec13 = inherit(''), (_class = function (_Path$Attr) {
    (0, _inherits3.default)(RoughAttr, _Path$Attr);

    function RoughAttr(subject) {
      (0, _classCallCheck3.default)(this, RoughAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (RoughAttr.__proto__ || (0, _getPrototypeOf2.default)(RoughAttr)).call(this, subject));

      _this.setDefault({
        roughness: 'inherit',
        bowing: 'inherit',
        lineWidth: 'inherit',
        fillStyle: 'inherit',
        fillWeight: 'inherit',
        hachureAngle: 'inherit',
        hachureGap: 'inherit'
      });
      return _this;
    }

    (0, _createClass3.default)(RoughAttr, [{
      key: 'enableCache',
      get: function get() {
        return false;
      }
    }, {
      key: 'roughness',
      set: function set(val) {
        this.set('roughness', val);
      }
    }, {
      key: 'bowing',
      set: function set(val) {
        this.set('bowing', val);
      }
    }, {
      key: 'lineWidth',
      set: function set(val) {
        this.clearFlow();
        this.set('lineWidth', val);
      }

      // hachure, solid, zigzag, cross-hatch, dot

    }, {
      key: 'fillStyle',
      set: function set(val) {
        this.set('fillStyle', val);
      }

      /*
        Numeric value representing the width of the hachure lines.
        Default value of the fillWeight is set to half the strokeWidth of that shape.
       */

    }, {
      key: 'fillWeight',
      set: function set(val) {
        this.set('fillWeight', val);
      }
    }, {
      key: 'hachureAngle',
      set: function set(val) {
        this.set('hachureAngle', val);
      }

      /*
        Numerical value that defines the average gap, in pixels, between two hachure lines.
        Default value of the hachureGap is set to four times the strokeWidth of that shape.
      */

    }, {
      key: 'hachureGap',
      set: function set(val) {
        this.set('hachureGap', val);
      }
    }]);
    return RoughAttr;
  }(Path.Attr), (_applyDecoratedDescriptor(_class.prototype, 'roughness', [_dec, attr, _dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'roughness'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'bowing', [_dec3, attr, _dec4], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'bowing'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'lineWidth', [_dec5, attr, _dec6], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'lineWidth'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fillStyle', [attr, _dec7], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fillStyle'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fillWeight', [_dec8, attr, _dec9], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fillWeight'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'hachureAngle', [_dec10, attr, _dec11], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'hachureAngle'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'hachureGap', [_dec12, attr, _dec13], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'hachureGap'), _class.prototype)), _class));
  var Rough = (_temp = _class2 = function (_BaseSprite) {
    (0, _inherits3.default)(Rough, _BaseSprite);

    function Rough() {
      var _ref2;

      (0, _classCallCheck3.default)(this, Rough);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this2 = (0, _possibleConstructorReturn3.default)(this, (_ref2 = Rough.__proto__ || (0, _getPrototypeOf2.default)(Rough)).call.apply(_ref2, [this].concat(args)));

      _this2.generators = {};
      return _this2;
    }

    (0, _createClass3.default)(Rough, [{
      key: 'forceUpdate',
      value: function forceUpdate(clearCache) {
        (0, _get3.default)(Rough.prototype.__proto__ || (0, _getPrototypeOf2.default)(Rough.prototype), 'forceUpdate', this).call(this, clearCache);
        this.generators = {};
      }
    }, {
      key: 'render',
      value: function render(t, context) {
        (0, _get3.default)(Rough.prototype.__proto__ || (0, _getPrototypeOf2.default)(Rough.prototype), 'render', this).call(this, t, context);

        var lineCap = this.attr('lineCap');
        var lineJoin = this.attr('lineJoin');

        context.lineCap = lineCap;
        context.lineJoin = lineJoin;

        var roughCanvas = RoughCanvasMap.get(context);
        if (!roughCanvas) {
          roughCanvas = _roughjs2.default.canvas(context.canvas);
          RoughCanvasMap.set(context, roughCanvas);
        }

        var options = {};
        var _attributes = this.attributes,
            fillWeight = _attributes.fillWeight,
            hachureGap = _attributes.hachureGap,
            stroke = _attributes.strokeColor,
            fill = _attributes.fillColor;


        (0, _entries2.default)({ fillWeight: fillWeight, hachureGap: hachureGap, stroke: stroke, fill: fill }).forEach(function (_ref3) {
          var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
              k = _ref4[0],
              v = _ref4[1];

          if (v !== '') {
            options[k] = v;
          }
        });

        var _attributes2 = this.attributes,
            roughness = _attributes2.roughness,
            bowing = _attributes2.bowing,
            strokeWidth = _attributes2.lineWidth,
            fillStyle = _attributes2.fillStyle,
            hachureAngle = _attributes2.hachureAngle;

        (0, _assign2.default)(options, {
          roughness: roughness,
          bowing: bowing,
          strokeWidth: strokeWidth,
          fillStyle: fillStyle,
          hachureAngle: hachureAngle
        });

        return { context: roughCanvas, options: options };
      }
    }]);
    return Rough;
  }(BaseSprite), _class2.Attr = RoughAttr, _temp);

  return { Rough: Rough };
}