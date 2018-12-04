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
  var RoughPolylineAttr = (_dec = parseValue(_utils.parseStringPoints), (_class = function (_RoughPath$Attr) {
    (0, _inherits3.default)(RoughPolylineAttr, _RoughPath$Attr);

    function RoughPolylineAttr(subject) {
      (0, _classCallCheck3.default)(this, RoughPolylineAttr);

      var _this = (0, _possibleConstructorReturn3.default)(this, (RoughPolylineAttr.__proto__ || (0, _getPrototypeOf2.default)(RoughPolylineAttr)).call(this, subject));

      _this.setDefault({
        points: '',
        closed: false
      });
      return _this;
    }

    (0, _createClass3.default)(RoughPolylineAttr, [{
      key: 'points',
      set: function set(val) {
        var d = 'M' + val[0][0] + ',' + val[0][1];
        for (var i = 1; i < val.length; i++) {
          d += 'L' + val[i][0] + ',' + val[i][1];
        }
        if (this.closed) {
          d += 'z';
        }
        this.d = d;
        this.set('points', val);
      }
    }, {
      key: 'closed',
      set: function set(val) {
        this.set('closed', !!val);
        this.d = this.d.replace(/z$/, '') + 'z';
      }
    }]);
    return RoughPolylineAttr;
  }(RoughPath.Attr), (_applyDecoratedDescriptor(_class.prototype, 'points', [_dec, attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'points'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'closed', [attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'closed'), _class.prototype)), _class));
  var RoughPolyline = (_temp = _class2 = function (_RoughPath) {
    (0, _inherits3.default)(RoughPolyline, _RoughPath);

    function RoughPolyline() {
      (0, _classCallCheck3.default)(this, RoughPolyline);
      return (0, _possibleConstructorReturn3.default)(this, (RoughPolyline.__proto__ || (0, _getPrototypeOf2.default)(RoughPolyline)).apply(this, arguments));
    }

    return RoughPolyline;
  }(RoughPath), _class2.Attr = RoughPolylineAttr, _temp);


  registerNodeType('roughPolyline', RoughPolyline);

  return { RoughPolyline: RoughPolyline };
}