'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _get4 = require('babel-runtime/helpers/get');

var _get5 = _interopRequireDefault(_get4);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

exports.default = install;

var _rough = require('./rough');

var _rough2 = _interopRequireDefault(_rough);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

var _rect = (0, _symbol2.default)('rect');

function install(_ref) {
  var _desc, _value, _class;

  var use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType;

  var _use = use(_rough2.default),
      Rough = _use.Rough;

  var flow = utils.flow;
  var RoughRect = (_class = function (_Rough) {
    (0, _inherits3.default)(RoughRect, _Rough);

    function RoughRect() {
      (0, _classCallCheck3.default)(this, RoughRect);
      return (0, _possibleConstructorReturn3.default)(this, (RoughRect.__proto__ || (0, _getPrototypeOf2.default)(RoughRect)).apply(this, arguments));
    }

    (0, _createClass3.default)(RoughRect, [{
      key: 'render',
      value: function render(t, context) {
        var _get$call = (0, _get5.default)(RoughRect.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughRect.prototype), 'render', this).call(this, t, context),
            roughCanvas = _get$call.context,
            options = _get$call.options;

        var lw = this.attr('lineWidth') / 2;
        context.save();
        context.translate(lw, lw);

        var _contentSize = (0, _slicedToArray3.default)(this.contentSize, 2),
            width = _contentSize[0],
            height = _contentSize[1];

        if (!this.generators[_rect]) {
          this.generators[_rect] = roughCanvas.generator.rectangle(0, 0, width, height, options);
        }
        roughCanvas.draw(this.generators[_rect]);

        context.restore();

        return { context: roughCanvas, options: options };
      }
    }, {
      key: 'contentSize',
      get: function get() {
        var _get2 = (0, _get5.default)(RoughRect.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughRect.prototype), 'contentSize', this),
            _get3 = (0, _slicedToArray3.default)(_get2, 2),
            width = _get3[0],
            height = _get3[1];

        var lineWidth = this.attr('lineWidth');
        return [width + lineWidth, height + lineWidth];
      }
    }]);
    return RoughRect;
  }(Rough), (_applyDecoratedDescriptor(_class.prototype, 'contentSize', [flow], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'contentSize'), _class.prototype)), _class);


  registerNodeType('roughRect', RoughRect);

  return { RoughRect: RoughRect };
}