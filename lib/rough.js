'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _desc, _value, _class, _class2, _temp;

  var BaseSprite = _ref.BaseSprite,
      Path = _ref.Path,
      utils = _ref.utils;
  var parseValue = utils.parseValue,
      attr = utils.attr,
      inherit = utils.inherit,
      parseFont = utils.parseFont,
      parseStringFloat = utils.parseStringFloat,
      parseColorString = utils.parseColorString;
  var RoughAttr = (_dec = parseValue(parseColorString), _dec2 = inherit('rgba(0,0,0,1)'), _dec3 = inherit('normal normal normal 32px "Hannotate SC"'), _dec4 = parseValue(parseFloat), _dec5 = inherit(1), _dec6 = parseValue(parseFloat), _dec7 = inherit(1), _dec8 = parseValue(parseFloat), _dec9 = inherit(1), _dec10 = inherit('hachure'), _dec11 = parseValue(parseFloat), _dec12 = inherit(''), _dec13 = parseValue(parseFloat), _dec14 = inherit(-41), _dec15 = parseValue(parseFloat), _dec16 = inherit(''), _dec17 = parseValue(parseFloat), _dec18 = parseValue(parseFloat), _dec19 = parseValue(parseStringFloat), _dec20 = parseValue(parseColorString), _dec21 = inherit(''), (_class = function (_Path$Attr) {
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
        hachureGap: 'inherit',
        label: '',
        labelX: '',
        labelY: '',
        font: 'inherit',
        labelColor: 'inherit',
        labelBg: 'inherit'
      });
      return _this;
    }

    (0, _createClass3.default)(RoughAttr, [{
      key: 'enableCache',
      get: function get() {
        return false;
      }
    }, {
      key: 'labelColor',
      set: function set(val) {
        this.set('labelColor', val);
      }
    }, {
      key: 'font',
      set: function set(val) {
        this.set('font', val);
      }
    }, {
      key: 'fontSize',
      set: function set(val) {
        if (val == null) val = '16px';
        var unit = 'px';
        if (typeof val === 'string') {
          var unitReg = /^([\d.]+)(\w+)/;
          var matches = val.match(unitReg);
          if (!matches) {
            return null;
          }
          val = parseFloat(matches[1]);
          unit = matches[2];
        }
        var font = this.font;

        var _parseFont = parseFont(font),
            style = _parseFont.style,
            variant = _parseFont.variant,
            weight = _parseFont.weight,
            family = _parseFont.family;

        var fontValue = style + ' ' + variant + ' ' + weight + ' ' + val + unit + ' ' + family;
        this.font = fontValue;
      },
      get: function get() {
        var font = this.font;

        var _parseFont2 = parseFont(font),
            size0 = _parseFont2.size0,
            unit = _parseFont2.unit;

        return '' + size0 + unit;
      }
    }, {
      key: 'fontFamily',
      set: function set(val) {
        if (val == null) val = 'Arial';
        var font = this.font;

        var _parseFont3 = parseFont(font),
            style = _parseFont3.style,
            variant = _parseFont3.variant,
            weight = _parseFont3.weight,
            size0 = _parseFont3.size0,
            unit = _parseFont3.unit;

        var fontValue = style + ' ' + variant + ' ' + weight + ' ' + size0 + unit + ' ' + val;
        this.font = fontValue;
      },
      get: function get() {
        return parseFont(this.font).family;
      }
    }, {
      key: 'fontStyle',
      set: function set(val) {
        if (val == null) val = 'normal';
        var font = this.font;

        var _parseFont4 = parseFont(font),
            variant = _parseFont4.variant,
            weight = _parseFont4.weight,
            size0 = _parseFont4.size0,
            unit = _parseFont4.unit,
            family = _parseFont4.family;

        var fontValue = val + ' ' + variant + ' ' + weight + ' ' + size0 + unit + ' ' + family;
        this.font = fontValue;
      },
      get: function get() {
        return parseFont(this.font).style;
      }
    }, {
      key: 'fontVariant',
      set: function set(val) {
        if (val == null) val = 'normal';
        var font = this.font;

        var _parseFont5 = parseFont(font),
            style = _parseFont5.style,
            weight = _parseFont5.weight,
            size0 = _parseFont5.size0,
            unit = _parseFont5.unit,
            family = _parseFont5.family;

        var fontValue = style + ' ' + val + ' ' + weight + ' ' + size0 + unit + ' ' + family;
        this.font = fontValue;
      },
      get: function get() {
        return parseFont(this.font).variant;
      }
    }, {
      key: 'fontWeight',
      set: function set(val) {
        if (val == null) val = 'normal';
        var font = this.font;

        var _parseFont6 = parseFont(font),
            style = _parseFont6.style,
            variant = _parseFont6.variant,
            size0 = _parseFont6.size0,
            unit = _parseFont6.unit,
            family = _parseFont6.family;

        var fontValue = style + ' ' + variant + ' ' + val + ' ' + size0 + unit + ' ' + family;
        this.font = fontValue;
      },
      get: function get() {
        return parseFont(this.font).weight;
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
    }, {
      key: 'label',
      set: function set(val) {
        this.set('label', val);
      }
    }, {
      key: 'labelX',
      set: function set(val) {
        this.set('labelX', val);
      }
    }, {
      key: 'labelY',
      set: function set(val) {
        this.set('labelY', val);
      }
    }, {
      key: 'labelXY',
      set: function set(val) {
        if (val == null) {
          val = ['', ''];
        }

        var _val = val,
            _val2 = (0, _slicedToArray3.default)(_val, 2),
            x = _val2[0],
            y = _val2[1];

        this.labelX = x;
        this.labelY = y;
      },
      get: function get() {
        return [this.labelX, this.labelY];
      }
    }, {
      key: 'labelBg',
      set: function set(val) {
        this.set('labelBg', val);
      }
    }]);
    return RoughAttr;
  }(Path.Attr), (_applyDecoratedDescriptor(_class.prototype, 'labelColor', [_dec, attr, _dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelColor'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'font', [attr, _dec3], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'font'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontSize', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontSize'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontFamily', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontFamily'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontStyle', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontStyle'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontVariant', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontVariant'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fontWeight', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fontWeight'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'roughness', [_dec4, attr, _dec5], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'roughness'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'bowing', [_dec6, attr, _dec7], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'bowing'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'lineWidth', [_dec8, attr, _dec9], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'lineWidth'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fillStyle', [attr, _dec10], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fillStyle'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fillWeight', [_dec11, attr, _dec12], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fillWeight'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'hachureAngle', [_dec13, attr, _dec14], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'hachureAngle'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'hachureGap', [_dec15, attr, _dec16], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'hachureGap'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'label', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'label'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelX', [_dec17, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelX'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelY', [_dec18, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelY'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelXY', [_dec19, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelXY'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'labelBg', [_dec20, attr, _dec21], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'labelBg'), _class.prototype)), _class));
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
        var _this3 = this;

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

        var label = this.attr('label');
        if (label) {
          this.once('afterdraw', function (_ref5) {
            var target = _ref5.target,
                context = _ref5.context;

            var rect = target.originalRect;

            var _attr = _this3.attr('labelXY'),
                _attr2 = (0, _slicedToArray3.default)(_attr, 2),
                cx = _attr2[0],
                cy = _attr2[1];

            var font = _this3.attr('font');
            context.font = font;
            context.textBaseline = 'middle';

            var _context$measureText = context.measureText(label),
                width = _context$measureText.width;

            var _parseFont7 = parseFont(font),
                size = _parseFont7.size;

            if (cx === '') cx = rect[2] / 2;
            if (cy === '') cy = rect[3] / 2;
            var labelBg = _this3.attr('labelBg');
            if (labelBg) {
              var _rect = [cx - width / 2 - 6, cy - size / 2 - 6, width + 12, size + 12];
              context.fillStyle = labelBg;
              context.beginPath();
              context.rect.apply(context, _rect);
              context.fill();
            }
            context.fillStyle = _this3.attr('labelColor');
            context.fillText(label, cx - width / 2, cy);
          });
        }

        return { context: roughCanvas, options: options };
      }
    }]);
    return Rough;
  }(BaseSprite), _class2.Attr = RoughAttr, _temp);

  return { Rough: Rough };
}