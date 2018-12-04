'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOwnPropertySymbols = require('babel-runtime/core-js/object/get-own-property-symbols');

var _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

exports.default = install;

var _rough = require('./rough');

var _rough2 = _interopRequireDefault(_rough);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

var _path = (0, _symbol2.default)('path');

function install(_ref) {
  var _dec, _dec2, _desc, _value, _class, _desc2, _value2, _class2, _class3, _temp;

  var use = _ref.use,
      utils = _ref.utils,
      registerNodeType = _ref.registerNodeType,
      Path = _ref.Path;

  var _use = use(_rough2.default),
      Rough = _use.Rough;

  var parseValue = utils.parseValue,
      attr = utils.attr,
      flow = utils.flow;
  var RoughPathAttr = (_dec = parseValue(parseFloat), _dec2 = parseValue(parseFloat), (_class = function (_Rough$Attr) {
    (0, _inherits3.default)(RoughPathAttr, _Rough$Attr);

    function RoughPathAttr(subject) {
      (0, _classCallCheck3.default)(this, RoughPathAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (RoughPathAttr.__proto__ || (0, _getPrototypeOf2.default)(RoughPathAttr)).call(this, subject));

      _this.setDefault({
        simplification: 0,
        tolerance: 6,
        bounding: 'path'
      });
      return _this;
    }

    (0, _createClass3.default)(RoughPathAttr, [{
      key: 'tolerance',
      set: function set(val) {
        this.set('tolerance', val);
      }
    }, {
      key: 'simplification',
      set: function set(val) {
        this.set('simplification', val);
      }
    }]);
    return RoughPathAttr;
  }(Rough.Attr), (_applyDecoratedDescriptor(_class.prototype, 'tolerance', [_dec, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'tolerance'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'simplification', [_dec2, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'simplification'), _class.prototype)), _class));
  var RoughPath = (_class2 = (_temp = _class3 = function (_Rough) {
    (0, _inherits3.default)(RoughPath, _Rough);

    function RoughPath(attr) {
      (0, _classCallCheck3.default)(this, RoughPath);

      if (typeof attr === 'string') {
        attr = { d: attr };
      }
      return (0, _possibleConstructorReturn3.default)(this, (RoughPath.__proto__ || (0, _getPrototypeOf2.default)(RoughPath)).call(this, attr));
    }

    (0, _createClass3.default)(RoughPath, [{
      key: 'getPointAtLength',
      value: function getPointAtLength(length) {
        if (this.svg) {
          return this.svg.getPointAtLength(length);
        }
        return [0, 0];
      }
    }, {
      key: 'getPathLength',
      value: function getPathLength() {
        if (this.svg) {
          return this.svg.getTotalLength();
        }
        return 0;
      }
    }, {
      key: 'findPath',
      value: function findPath(offsetX, offsetY) {
        var _svg;

        var rect = this.originalRect;
        var pathOffset = this.pathOffset;
        var point = [offsetX - rect[0] - pathOffset[0], offsetY - rect[1] - pathOffset[1]];
        if (this.svg && (_svg = this.svg).isPointInPath.apply(_svg, point)) {
          return [this.svg];
        }
        if (this.path2D_) {
          var _context;

          this.context.save();
          this.context.lineWidth = this.attr('lineWidth') + this.attr('tolerance');
          this.context.lineCap = this.attr('lineCap');
          this.context.lineJoin = this.attr('lineJoin');
          if ((_context = this.context).isPointInStroke.apply(_context, [this.path2D_].concat(point))) {
            return [this.svg];
          }
          this.context.restore();
        }
        return [];
      }
    }, {
      key: 'pointCollision',
      value: function pointCollision(evt) {
        if ((0, _get3.default)(RoughPath.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughPath.prototype), 'pointCollision', this).call(this, evt)) {
          var offsetX = evt.offsetX,
              offsetY = evt.offsetY;

          if (offsetX == null && offsetY == null) return true;

          var svg = this.svg;
          if (svg) {
            var bounds = svg.bounds;
            offsetX += Math.min(0, bounds[0]);
            offsetY += Math.min(0, bounds[1]);
          }
          evt.targetPaths = this.findPath(offsetX, offsetY);
          if (this.attr('bounding') === 'path') {
            return evt.targetPaths.length > 0;
          }
          return true;
        }
        return false;
      }
    }, {
      key: 'render',
      value: function render(t, context) {
        var _get$call = (0, _get3.default)(RoughPath.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughPath.prototype), 'render', this).call(this, t, context),
            roughCanvas = _get$call.context,
            options = _get$call.options;

        var d = this.attr('d');

        if (d) {
          options.simplification = this.attr('simplification');
          var svg = this.svg;

          var _svg$bounds = (0, _slicedToArray3.default)(svg.bounds, 4),
              ox = _svg$bounds[0],
              oy = _svg$bounds[1],
              ow = _svg$bounds[2],
              oh = _svg$bounds[3];

          var _pathOffset = (0, _slicedToArray3.default)(this.pathOffset, 2),
              px = _pathOffset[0],
              py = _pathOffset[1];

          var _contentSize = (0, _slicedToArray3.default)(this.contentSize, 2),
              w = _contentSize[0],
              h = _contentSize[1];

          if (w < ow || h < oh) {
            context.beginPath();
            context.rect(0, 0, w, h);
            context.clip();
          }
          if (ox < 0 || oy < 0) {
            context.translate(-Math.min(0, ox), -Math.min(0, oy));
          }
          context.translate(px, py);

          if (typeof Path2D !== 'undefined') {
            this.path2D_ = new Path2D(d);
          }

          if (!this.generators[_path]) {
            this.generators[_path] = roughCanvas.generator.path(d, options);
          }
          roughCanvas.draw(this.generators[_path]);
        }

        return { context: roughCanvas, options: options };
      }
    }, {
      key: 'path',
      set: function set(val) {
        this.attr('path', val);
      },
      get: function get() {
        return this.attr('path');
      }
    }, {
      key: 'pathOffset',
      get: function get() {
        var lw = Math.round(this.attr('lineWidth'));
        return [lw, lw];
      }
    }, {
      key: 'pathSize',
      get: function get() {
        return this.svg ? this.svg.size : [0, 0];
      }
    }, {
      key: 'contentSize',
      get: function get() {
        if (!this.svg) return (0, _get3.default)(RoughPath.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughPath.prototype), 'contentSize', this);

        var bounds = this.svg.bounds;

        var _attrSize = (0, _slicedToArray3.default)(this.attrSize, 2),
            width = _attrSize[0],
            height = _attrSize[1];

        var pathOffset = this.pathOffset;

        if (width === '') {
          width = bounds[2] - Math.min(0, bounds[0]) + 2 * pathOffset[0];
        }
        if (height === '') {
          height = bounds[3] - Math.min(0, bounds[1]) + 2 * pathOffset[1];
        }

        return [width, height].map(Math.ceil);
      }
    }, {
      key: 'originalRect',
      get: function get() {
        var svg = this.svg;
        if (svg) {
          var bounds = svg.bounds,
              offset = this.pathOffset;

          var _offsetSize = (0, _slicedToArray3.default)(this.offsetSize, 2),
              width = _offsetSize[0],
              height = _offsetSize[1],
              _attr = this.attr('anchor'),
              _attr2 = (0, _slicedToArray3.default)(_attr, 2),
              anchorX = _attr2[0],
              anchorY = _attr2[1];

          var rect = [0, 0, width, height],
              offsetX = Math.min(0, bounds[0]),
              offsetY = Math.min(0, bounds[1]);

          rect[0] = offsetX - offset[0] - anchorX * (width + offsetX - 2 * offset[0]);
          rect[1] = offsetY - offset[1] - anchorY * (height + offsetY - 2 * offset[1]);
          return rect;
        }

        return (0, _get3.default)(RoughPath.prototype.__proto__ || (0, _getPrototypeOf2.default)(RoughPath.prototype), 'originalRect', this);
      }
    }]);
    return RoughPath;
  }(Rough), _class3.Attr = RoughPathAttr, _temp), (_applyDecoratedDescriptor(_class2.prototype, 'contentSize', [flow], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'contentSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'originalRect', [flow], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'originalRect'), _class2.prototype)), _class2);


  var symbols = (0, _getOwnPropertySymbols2.default)(Path.prototype);
  symbols.forEach(function (symbol) {
    if (symbol.toString() === 'Symbol(effects)') {
      var _Path$prototype$symbo = Path.prototype[symbol],
          d = _Path$prototype$symbo.d,
          path = _Path$prototype$symbo.path;

      RoughPath.setAttributeEffects({
        d: d,
        path: path
      });
    }
  });

  registerNodeType('roughPath', RoughPath);

  return { RoughPath: RoughPath };
}