'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _get6 = require('babel-runtime/helpers/get');

var _get7 = _interopRequireDefault(_get6);

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

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

exports.default = install;

var _rough = require('./rough');

var _rough2 = _interopRequireDefault(_rough);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

var _ellipse = (0, _symbol2.default)('ellipse');

function install(_ref) {
  var _dec, _desc, _value, _class, _desc2, _value2, _class2, _class3, _temp;

  var use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType;

  var _use = use(_rough2.default),
      Rough = _use.Rough;

  var flow = utils.flow,
      attr = utils.attr,
      parseValue = utils.parseValue;
  var RoughEllipseAttr = (_dec = parseValue(parseInt), (_class = function (_Rough$Attr) {
    (0, _inherits3.default)(RoughEllipseAttr, _Rough$Attr);

    function RoughEllipseAttr(subject) {
      (0, _classCallCheck3.default)(this, RoughEllipseAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (RoughEllipseAttr.__proto__ || (0, _getPrototypeOf2.default)(RoughEllipseAttr)).call(this, subject));

      _this.setDefault({
        bounding: 'path',
        curveStepCount: 9
      });
      return _this;
    }

    (0, _createClass3.default)(RoughEllipseAttr, [{
      key: 'bounding',
      set: function set(val) {
        this.set('bounding', val);
      }
    }, {
      key: 'curveStepCount',
      set: function set(val) {
        this.set('curveStepCount', val);
      }
    }]);
    return RoughEllipseAttr;
  }(Rough.Attr), (_applyDecoratedDescriptor(_class.prototype, 'bounding', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'bounding'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'curveStepCount', [_dec, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'curveStepCount'), _class.prototype)), _class));
  var RoughEllipse = (_class2 = (_temp = _class3 = function (_Rough) {
    (0, _inherits3.default)(RoughEllipse, _Rough);

    function RoughEllipse() {
      (0, _classCallCheck3.default)(this, RoughEllipse);
      return (0, _possibleConstructorReturn3.default)(this, (RoughEllipse.__proto__ || (0, _getPrototypeOf2.default)(RoughEllipse)).apply(this, arguments));
    }

    (0, _createClass3.default)(RoughEllipse, [{
      key: 'pointCollision',
      value: function pointCollision(evt) {
        var isCollision = (0, _get7.default)(RoughEllipse.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughEllipse.prototype), 'pointCollision', this).call(this, evt);
        if (isCollision && this.attr('bounding') === 'path') {
          var x = evt.offsetX,
              y = evt.offsetY;

          var _get2 = (0, _get7.default)(RoughEllipse.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughEllipse.prototype), 'originalRect', this),
              _get3 = (0, _slicedToArray3.default)(_get2, 4),
              x0 = _get3[0],
              y0 = _get3[1],
              width = _get3[2],
              height = _get3[3];

          var cx = x0 + width / 2,
              cy = y0 + height / 2;

          return Math.pow(x - cx, 2) / Math.pow(width, 2) + Math.pow(y - cy, 2) / Math.pow(height, 2) <= 0.25;
        }
        return isCollision;
      }
    }, {
      key: 'render',
      value: function render(t, context) {
        var _get$call = (0, _get7.default)(RoughEllipse.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughEllipse.prototype), 'render', this).call(this, t, context),
            roughCanvas = _get$call.context,
            options = _get$call.options;

        options.curveStepCount = this.attr('curveStepCount');

        var lw = this.attr('lineWidth') / 2;
        context.save();
        context.translate(lw, lw);

        var _contentSize = (0, _slicedToArray3.default)(this.contentSize, 2),
            width = _contentSize[0],
            height = _contentSize[1];

        if (!this.generators[_ellipse]) {
          this.generators[_ellipse] = roughCanvas.generator.ellipse(width / 2, height / 2, width, height, options);
        }
        roughCanvas.draw(this.generators[_ellipse]);

        context.restore();

        return { context: roughCanvas, options: options };
      }
    }, {
      key: 'contentSize',
      get: function get() {
        var _get4 = (0, _get7.default)(RoughEllipse.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughEllipse.prototype), 'contentSize', this),
            _get5 = (0, _slicedToArray3.default)(_get4, 2),
            width = _get5[0],
            height = _get5[1];

        var lineWidth = this.attr('lineWidth');
        return [width + lineWidth, height + lineWidth];
      }
    }]);
    return RoughEllipse;
  }(Rough), _class3.Attr = RoughEllipseAttr, _temp), (_applyDecoratedDescriptor(_class2.prototype, 'contentSize', [flow], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'contentSize'), _class2.prototype)), _class2);


  registerNodeType('roughEllipse', RoughEllipse);

  return { RoughEllipse: RoughEllipse };
}