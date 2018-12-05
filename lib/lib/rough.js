'use strict';

var _maxSafeInteger = require('babel-runtime/core-js/number/max-safe-integer');

var _maxSafeInteger2 = _interopRequireDefault(_maxSafeInteger);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : (0, _typeof3.default)(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.rough = factory();
})(undefined, function () {
    'use strict';

    function isType(token, type) {
        return token.type === type;
    }
    var PARAMS = {
        A: 7,
        a: 7,
        C: 6,
        c: 6,
        H: 1,
        h: 1,
        L: 2,
        l: 2,
        M: 2,
        m: 2,
        Q: 4,
        q: 4,
        S: 4,
        s: 4,
        T: 4,
        t: 2,
        V: 1,
        v: 1,
        Z: 0,
        z: 0
    };

    var ParsedPath = function () {
        function ParsedPath(d) {
            (0, _classCallCheck3.default)(this, ParsedPath);

            this.COMMAND = 0;
            this.NUMBER = 1;
            this.EOD = 2;
            this.segments = [];
            this.parseData(d);
            this.processPoints();
        }

        (0, _createClass3.default)(ParsedPath, [{
            key: 'tokenize',
            value: function tokenize(d) {
                var tokens = new Array();
                while (d !== '') {
                    if (d.match(/^([ \t\r\n,]+)/)) {
                        d = d.substr(RegExp.$1.length);
                    } else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
                        tokens[tokens.length] = { type: this.COMMAND, text: RegExp.$1 };
                        d = d.substr(RegExp.$1.length);
                    } else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
                        tokens[tokens.length] = { type: this.NUMBER, text: '' + parseFloat(RegExp.$1) };
                        d = d.substr(RegExp.$1.length);
                    } else {
                        console.error('Unrecognized segment command: ' + d);
                        return [];
                    }
                }
                tokens[tokens.length] = { type: this.EOD, text: '' };
                return tokens;
            }
        }, {
            key: 'parseData',
            value: function parseData(d) {
                var tokens = this.tokenize(d);
                var index = 0;
                var token = tokens[index];
                var mode = 'BOD';
                this.segments = new Array();
                while (!isType(token, this.EOD)) {
                    var param_length = void 0;
                    var params = new Array();
                    if (mode === 'BOD') {
                        if (token.text === 'M' || token.text === 'm') {
                            index++;
                            param_length = PARAMS[token.text];
                            mode = token.text;
                        } else {
                            this.parseData('M0,0' + d);
                            return;
                        }
                    } else {
                        if (isType(token, this.NUMBER)) {
                            param_length = PARAMS[mode];
                        } else {
                            index++;
                            param_length = PARAMS[token.text];
                            mode = token.text;
                        }
                    }
                    if (index + param_length < tokens.length) {
                        for (var i = index; i < index + param_length; i++) {
                            var numbeToken = tokens[i];
                            if (isType(numbeToken, this.NUMBER)) {
                                params[params.length] = +numbeToken.text;
                            } else {
                                console.error('Parameter type is not a number: ' + mode + ',' + numbeToken.text);
                                return;
                            }
                        }
                        if (typeof PARAMS[mode] === 'number') {
                            var segment = { key: mode, data: params };
                            this.segments.push(segment);
                            index += param_length;
                            token = tokens[index];
                            if (mode === 'M') mode = 'L';
                            if (mode === 'm') mode = 'l';
                        } else {
                            console.error('Unsupported segment type: ' + mode);
                            return;
                        }
                    } else {
                        console.error('Path data ended before all parameters were found');
                    }
                }
            }
        }, {
            key: 'processPoints',
            value: function processPoints() {
                var first = null;
                var currentPoint = [0, 0];
                for (var i = 0; i < this.segments.length; i++) {
                    var s = this.segments[i];
                    switch (s.key) {
                        case 'M':
                        case 'L':
                        case 'T':
                            s.point = [s.data[0], s.data[1]];
                            break;
                        case 'm':
                        case 'l':
                        case 't':
                            s.point = [s.data[0] + currentPoint[0], s.data[1] + currentPoint[1]];
                            break;
                        case 'H':
                            s.point = [s.data[0], currentPoint[1]];
                            break;
                        case 'h':
                            s.point = [s.data[0] + currentPoint[0], currentPoint[1]];
                            break;
                        case 'V':
                            s.point = [currentPoint[0], s.data[0]];
                            break;
                        case 'v':
                            s.point = [currentPoint[0], s.data[0] + currentPoint[1]];
                            break;
                        case 'z':
                        case 'Z':
                            if (first) {
                                s.point = [first[0], first[1]];
                            }
                            break;
                        case 'C':
                            s.point = [s.data[4], s.data[5]];
                            break;
                        case 'c':
                            s.point = [s.data[4] + currentPoint[0], s.data[5] + currentPoint[1]];
                            break;
                        case 'S':
                            s.point = [s.data[2], s.data[3]];
                            break;
                        case 's':
                            s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
                            break;
                        case 'Q':
                            s.point = [s.data[2], s.data[3]];
                            break;
                        case 'q':
                            s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
                            break;
                        case 'A':
                            s.point = [s.data[5], s.data[6]];
                            break;
                        case 'a':
                            s.point = [s.data[5] + currentPoint[0], s.data[6] + currentPoint[1]];
                            break;
                    }
                    if (s.key === 'm' || s.key === 'M') {
                        first = null;
                    }
                    if (s.point) {
                        currentPoint = s.point;
                        if (!first) {
                            first = s.point;
                        }
                    }
                    if (s.key === 'z' || s.key === 'Z') {
                        first = null;
                    }
                }
            }
        }, {
            key: 'closed',
            get: function get() {
                if (typeof this._closed === 'undefined') {
                    this._closed = false;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = (0, _getIterator3.default)(this.segments), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var s = _step.value;

                            if (s.key.toLowerCase() === 'z') {
                                this._closed = true;
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
                return this._closed;
            }
        }]);
        return ParsedPath;
    }();

    var RoughPath = function () {
        function RoughPath(d) {
            (0, _classCallCheck3.default)(this, RoughPath);

            this._position = [0, 0];
            this._first = null;
            this.bezierReflectionPoint = null;
            this.quadReflectionPoint = null;
            this.parsed = new ParsedPath(d);
        }

        (0, _createClass3.default)(RoughPath, [{
            key: 'setPosition',
            value: function setPosition(x, y) {
                this._position = [x, y];
                if (!this._first) {
                    this._first = [x, y];
                }
            }
        }, {
            key: 'segments',
            get: function get() {
                return this.parsed.segments;
            }
        }, {
            key: 'closed',
            get: function get() {
                return this.parsed.closed;
            }
        }, {
            key: 'linearPoints',
            get: function get() {
                if (!this._linearPoints) {
                    var lp = [];
                    var points = [];
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = (0, _getIterator3.default)(this.parsed.segments), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var s = _step2.value;

                            var key = s.key.toLowerCase();
                            if (key === 'm' || key === 'z') {
                                if (points.length) {
                                    lp.push(points);
                                    points = [];
                                }
                                if (key === 'z') {
                                    continue;
                                }
                            }
                            if (s.point) {
                                points.push(s.point);
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    if (points.length) {
                        lp.push(points);
                        points = [];
                    }
                    this._linearPoints = lp;
                }
                return this._linearPoints;
            }
        }, {
            key: 'first',
            get: function get() {
                return this._first;
            },
            set: function set(v) {
                this._first = v;
            }
        }, {
            key: 'position',
            get: function get() {
                return this._position;
            }
        }, {
            key: 'x',
            get: function get() {
                return this._position[0];
            }
        }, {
            key: 'y',
            get: function get() {
                return this._position[1];
            }
        }]);
        return RoughPath;
    }();
    // Algorithm as described in https://www.w3.org/TR/SVG/implnote.html
    // Code adapted from nsSVGPathDataParser.cpp in Mozilla 
    // https://hg.mozilla.org/mozilla-central/file/17156fbebbc8/content/svg/content/src/nsSVGPathDataParser.cpp#l887


    var RoughArcConverter = function () {
        function RoughArcConverter(from, to, radii, angle, largeArcFlag, sweepFlag) {
            (0, _classCallCheck3.default)(this, RoughArcConverter);

            this._segIndex = 0;
            this._numSegs = 0;
            this._rx = 0;
            this._ry = 0;
            this._sinPhi = 0;
            this._cosPhi = 0;
            this._C = [0, 0];
            this._theta = 0;
            this._delta = 0;
            this._T = 0;
            this._from = from;
            if (from[0] === to[0] && from[1] === to[1]) {
                return;
            }
            var radPerDeg = Math.PI / 180;
            this._rx = Math.abs(radii[0]);
            this._ry = Math.abs(radii[1]);
            this._sinPhi = Math.sin(angle * radPerDeg);
            this._cosPhi = Math.cos(angle * radPerDeg);
            var x1dash = this._cosPhi * (from[0] - to[0]) / 2.0 + this._sinPhi * (from[1] - to[1]) / 2.0;
            var y1dash = -this._sinPhi * (from[0] - to[0]) / 2.0 + this._cosPhi * (from[1] - to[1]) / 2.0;
            var root = 0;
            var numerator = this._rx * this._rx * this._ry * this._ry - this._rx * this._rx * y1dash * y1dash - this._ry * this._ry * x1dash * x1dash;
            if (numerator < 0) {
                var s = Math.sqrt(1 - numerator / (this._rx * this._rx * this._ry * this._ry));
                this._rx = this._rx * s;
                this._ry = this._ry * s;
                root = 0;
            } else {
                root = (largeArcFlag === sweepFlag ? -1.0 : 1.0) * Math.sqrt(numerator / (this._rx * this._rx * y1dash * y1dash + this._ry * this._ry * x1dash * x1dash));
            }
            var cxdash = root * this._rx * y1dash / this._ry;
            var cydash = -root * this._ry * x1dash / this._rx;
            this._C = [0, 0];
            this._C[0] = this._cosPhi * cxdash - this._sinPhi * cydash + (from[0] + to[0]) / 2.0;
            this._C[1] = this._sinPhi * cxdash + this._cosPhi * cydash + (from[1] + to[1]) / 2.0;
            this._theta = this.calculateVectorAngle(1.0, 0.0, (x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry);
            var dtheta = this.calculateVectorAngle((x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry, (-x1dash - cxdash) / this._rx, (-y1dash - cydash) / this._ry);
            if (!sweepFlag && dtheta > 0) {
                dtheta -= 2 * Math.PI;
            } else if (sweepFlag && dtheta < 0) {
                dtheta += 2 * Math.PI;
            }
            this._numSegs = Math.ceil(Math.abs(dtheta / (Math.PI / 2)));
            this._delta = dtheta / this._numSegs;
            this._T = 8 / 3 * Math.sin(this._delta / 4) * Math.sin(this._delta / 4) / Math.sin(this._delta / 2);
        }

        (0, _createClass3.default)(RoughArcConverter, [{
            key: 'getNextSegment',
            value: function getNextSegment() {
                if (this._segIndex === this._numSegs) {
                    return null;
                }
                var cosTheta1 = Math.cos(this._theta);
                var sinTheta1 = Math.sin(this._theta);
                var theta2 = this._theta + this._delta;
                var cosTheta2 = Math.cos(theta2);
                var sinTheta2 = Math.sin(theta2);
                var to = [this._cosPhi * this._rx * cosTheta2 - this._sinPhi * this._ry * sinTheta2 + this._C[0], this._sinPhi * this._rx * cosTheta2 + this._cosPhi * this._ry * sinTheta2 + this._C[1]];
                var cp1 = [this._from[0] + this._T * (-this._cosPhi * this._rx * sinTheta1 - this._sinPhi * this._ry * cosTheta1), this._from[1] + this._T * (-this._sinPhi * this._rx * sinTheta1 + this._cosPhi * this._ry * cosTheta1)];
                var cp2 = [to[0] + this._T * (this._cosPhi * this._rx * sinTheta2 + this._sinPhi * this._ry * cosTheta2), to[1] + this._T * (this._sinPhi * this._rx * sinTheta2 - this._cosPhi * this._ry * cosTheta2)];
                this._theta = theta2;
                this._from = [to[0], to[1]];
                this._segIndex++;
                return {
                    cp1: cp1,
                    cp2: cp2,
                    to: to
                };
            }
        }, {
            key: 'calculateVectorAngle',
            value: function calculateVectorAngle(ux, uy, vx, vy) {
                var ta = Math.atan2(uy, ux);
                var tb = Math.atan2(vy, vx);
                if (tb >= ta) return tb - ta;
                return 2 * Math.PI - (ta - tb);
            }
        }]);
        return RoughArcConverter;
    }();

    var PathFitter = function () {
        function PathFitter(sets, closed) {
            (0, _classCallCheck3.default)(this, PathFitter);

            this.sets = sets;
            this.closed = closed;
        }

        (0, _createClass3.default)(PathFitter, [{
            key: 'fit',
            value: function fit(simplification) {
                var outSets = [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = (0, _getIterator3.default)(this.sets), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var set = _step3.value;

                        var length = set.length;
                        var estLength = Math.floor(simplification * length);
                        if (estLength < 5) {
                            if (length <= 5) {
                                continue;
                            }
                            estLength = 5;
                        }
                        outSets.push(this.reduce(set, estLength));
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                var d = '';
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = (0, _getIterator3.default)(outSets), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _set = _step4.value;

                        for (var i = 0; i < _set.length; i++) {
                            var point = _set[i];
                            if (i === 0) {
                                d += 'M' + point[0] + ',' + point[1];
                            } else {
                                d += 'L' + point[0] + ',' + point[1];
                            }
                        }
                        if (this.closed) {
                            d += 'z ';
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                return d;
            }
        }, {
            key: 'distance',
            value: function distance(p1, p2) {
                return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
            }
        }, {
            key: 'reduce',
            value: function reduce(set, count) {
                if (set.length <= count) {
                    return set;
                }
                var points = set.slice(0);
                while (points.length > count) {
                    var minArea = -1;
                    var minIndex = -1;
                    for (var i = 1; i < points.length - 1; i++) {
                        var a = this.distance(points[i - 1], points[i]);
                        var b = this.distance(points[i], points[i + 1]);
                        var c = this.distance(points[i - 1], points[i + 1]);
                        var s = (a + b + c) / 2.0;
                        var area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
                        if (minArea < 0 || area < minArea) {
                            minArea = area;
                            minIndex = i;
                        }
                    }
                    if (minIndex > 0) {
                        points.splice(minIndex, 1);
                    } else {
                        break;
                    }
                }
                return points;
            }
        }]);
        return PathFitter;
    }();

    var Segment = function () {
        function Segment(p1, p2) {
            (0, _classCallCheck3.default)(this, Segment);

            this.xi = Number.MAX_VALUE;
            this.yi = Number.MAX_VALUE;
            this.px1 = p1[0];
            this.py1 = p1[1];
            this.px2 = p2[0];
            this.py2 = p2[1];
            this.a = this.py2 - this.py1;
            this.b = this.px1 - this.px2;
            this.c = this.px2 * this.py1 - this.px1 * this.py2;
            this._undefined = this.a === 0 && this.b === 0 && this.c === 0;
        }

        (0, _createClass3.default)(Segment, [{
            key: 'isUndefined',
            value: function isUndefined() {
                return this._undefined;
            }
        }, {
            key: 'intersects',
            value: function intersects(otherSegment) {
                if (this.isUndefined() || otherSegment.isUndefined()) {
                    return false;
                }
                var grad1 = Number.MAX_VALUE;
                var grad2 = Number.MAX_VALUE;
                var int1 = 0,
                    int2 = 0;
                var a = this.a,
                    b = this.b,
                    c = this.c;
                if (Math.abs(b) > 0.00001) {
                    grad1 = -a / b;
                    int1 = -c / b;
                }
                if (Math.abs(otherSegment.b) > 0.00001) {
                    grad2 = -otherSegment.a / otherSegment.b;
                    int2 = -otherSegment.c / otherSegment.b;
                }
                if (grad1 === Number.MAX_VALUE) {
                    if (grad2 === Number.MAX_VALUE) {
                        if (-c / a !== -otherSegment.c / otherSegment.a) {
                            return false;
                        }
                        if (this.py1 >= Math.min(otherSegment.py1, otherSegment.py2) && this.py1 <= Math.max(otherSegment.py1, otherSegment.py2)) {
                            this.xi = this.px1;
                            this.yi = this.py1;
                            return true;
                        }
                        if (this.py2 >= Math.min(otherSegment.py1, otherSegment.py2) && this.py2 <= Math.max(otherSegment.py1, otherSegment.py2)) {
                            this.xi = this.px2;
                            this.yi = this.py2;
                            return true;
                        }
                        return false;
                    }
                    this.xi = this.px1;
                    this.yi = grad2 * this.xi + int2;
                    if ((this.py1 - this.yi) * (this.yi - this.py2) < -0.00001 || (otherSegment.py1 - this.yi) * (this.yi - otherSegment.py2) < -0.00001) {
                        return false;
                    }
                    if (Math.abs(otherSegment.a) < 0.00001) {
                        if ((otherSegment.px1 - this.xi) * (this.xi - otherSegment.px2) < -0.00001) {
                            return false;
                        }
                        return true;
                    }
                    return true;
                }
                if (grad2 === Number.MAX_VALUE) {
                    this.xi = otherSegment.px1;
                    this.yi = grad1 * this.xi + int1;
                    if ((otherSegment.py1 - this.yi) * (this.yi - otherSegment.py2) < -0.00001 || (this.py1 - this.yi) * (this.yi - this.py2) < -0.00001) {
                        return false;
                    }
                    if (Math.abs(a) < 0.00001) {
                        if ((this.px1 - this.xi) * (this.xi - this.px2) < -0.00001) {
                            return false;
                        }
                        return true;
                    }
                    return true;
                }
                if (grad1 === grad2) {
                    if (int1 !== int2) {
                        return false;
                    }
                    if (this.px1 >= Math.min(otherSegment.px1, otherSegment.px2) && this.px1 <= Math.max(otherSegment.py1, otherSegment.py2)) {
                        this.xi = this.px1;
                        this.yi = this.py1;
                        return true;
                    }
                    if (this.px2 >= Math.min(otherSegment.px1, otherSegment.px2) && this.px2 <= Math.max(otherSegment.px1, otherSegment.px2)) {
                        this.xi = this.px2;
                        this.yi = this.py2;
                        return true;
                    }
                    return false;
                }
                this.xi = (int2 - int1) / (grad1 - grad2);
                this.yi = grad1 * this.xi + int1;
                if ((this.px1 - this.xi) * (this.xi - this.px2) < -0.00001 || (otherSegment.px1 - this.xi) * (this.xi - otherSegment.px2) < -0.00001) {
                    return false;
                }
                return true;
            }
        }]);
        return Segment;
    }();

    var HachureIterator = function () {
        function HachureIterator(top, bottom, left, right, gap, sinAngle, cosAngle, tanAngle) {
            (0, _classCallCheck3.default)(this, HachureIterator);

            this.deltaX = 0;
            this.hGap = 0;
            this.top = top;
            this.bottom = bottom;
            this.left = left;
            this.right = right;
            this.gap = gap;
            this.sinAngle = sinAngle;
            this.tanAngle = tanAngle;
            if (Math.abs(sinAngle) < 0.0001) {
                this.pos = left + gap;
            } else if (Math.abs(sinAngle) > 0.9999) {
                this.pos = top + gap;
            } else {
                this.deltaX = (bottom - top) * Math.abs(tanAngle);
                this.pos = left - Math.abs(this.deltaX);
                this.hGap = Math.abs(gap / cosAngle);
                this.sLeft = new Segment([left, bottom], [left, top]);
                this.sRight = new Segment([right, bottom], [right, top]);
            }
        }

        (0, _createClass3.default)(HachureIterator, [{
            key: 'nextLine',
            value: function nextLine() {
                if (Math.abs(this.sinAngle) < 0.0001) {
                    if (this.pos < this.right) {
                        var line = [this.pos, this.top, this.pos, this.bottom];
                        this.pos += this.gap;
                        return line;
                    }
                } else if (Math.abs(this.sinAngle) > 0.9999) {
                    if (this.pos < this.bottom) {
                        var _line = [this.left, this.pos, this.right, this.pos];
                        this.pos += this.gap;
                        return _line;
                    }
                } else {
                    var xLower = this.pos - this.deltaX / 2;
                    var xUpper = this.pos + this.deltaX / 2;
                    var yLower = this.bottom;
                    var yUpper = this.top;
                    if (this.pos < this.right + this.deltaX) {
                        while (xLower < this.left && xUpper < this.left || xLower > this.right && xUpper > this.right) {
                            this.pos += this.hGap;
                            xLower = this.pos - this.deltaX / 2;
                            xUpper = this.pos + this.deltaX / 2;
                            if (this.pos > this.right + this.deltaX) {
                                return null;
                            }
                        }
                        var s = new Segment([xLower, yLower], [xUpper, yUpper]);
                        if (this.sLeft && s.intersects(this.sLeft)) {
                            xLower = s.xi;
                            yLower = s.yi;
                        }
                        if (this.sRight && s.intersects(this.sRight)) {
                            xUpper = s.xi;
                            yUpper = s.yi;
                        }
                        if (this.tanAngle > 0) {
                            xLower = this.right - (xLower - this.left);
                            xUpper = this.right - (xUpper - this.left);
                        }
                        var _line2 = [xLower, yLower, xUpper, yUpper];
                        this.pos += this.hGap;
                        return _line2;
                    }
                }
                return null;
            }
        }]);
        return HachureIterator;
    }();

    function lineLength(line) {
        var p1 = line[0];
        var p2 = line[1];
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }
    function getIntersectingLines(line, points) {
        var intersections = [];
        var s1 = new Segment([line[0], line[1]], [line[2], line[3]]);
        for (var i = 0; i < points.length; i++) {
            var s2 = new Segment(points[i], points[(i + 1) % points.length]);
            if (s1.intersects(s2)) {
                intersections.push([s1.xi, s1.yi]);
            }
        }
        return intersections;
    }
    function affine(x, y, cx, cy, sinAnglePrime, cosAnglePrime, R) {
        var A = -cx * cosAnglePrime - cy * sinAnglePrime + cx;
        var B = R * (cx * sinAnglePrime - cy * cosAnglePrime) + cy;
        var C = cosAnglePrime;
        var D = sinAnglePrime;
        var E = -R * sinAnglePrime;
        var F = R * cosAnglePrime;
        return [A + C * x + D * y, B + E * x + F * y];
    }
    function hachureLinesForPolygon(points, o) {
        var ret = [];
        if (points && points.length) {
            var left = points[0][0];
            var right = points[0][0];
            var top = points[0][1];
            var bottom = points[0][1];
            for (var i = 1; i < points.length; i++) {
                left = Math.min(left, points[i][0]);
                right = Math.max(right, points[i][0]);
                top = Math.min(top, points[i][1]);
                bottom = Math.max(bottom, points[i][1]);
            }
            var angle = o.hachureAngle;
            var gap = o.hachureGap;
            if (gap < 0) {
                gap = o.strokeWidth * 4;
            }
            gap = Math.max(gap, 0.1);
            var radPerDeg = Math.PI / 180;
            var hachureAngle = angle % 180 * radPerDeg;
            var cosAngle = Math.cos(hachureAngle);
            var sinAngle = Math.sin(hachureAngle);
            var tanAngle = Math.tan(hachureAngle);
            var it = new HachureIterator(top - 1, bottom + 1, left - 1, right + 1, gap, sinAngle, cosAngle, tanAngle);
            var rect = void 0;
            while ((rect = it.nextLine()) != null) {
                var lines = getIntersectingLines(rect, points);
                for (var _i = 0; _i < lines.length; _i++) {
                    if (_i < lines.length - 1) {
                        var p1 = lines[_i];
                        var p2 = lines[_i + 1];
                        ret.push([p1, p2]);
                    }
                }
            }
        }
        return ret;
    }
    function hachureLinesForEllipse(cx, cy, width, height, o, renderer) {
        var ret = [];
        var rx = Math.abs(width / 2);
        var ry = Math.abs(height / 2);
        rx += renderer.getOffset(-rx * 0.05, rx * 0.05, o);
        ry += renderer.getOffset(-ry * 0.05, ry * 0.05, o);
        var angle = o.hachureAngle;
        var gap = o.hachureGap;
        if (gap <= 0) {
            gap = o.strokeWidth * 4;
        }
        var fweight = o.fillWeight;
        if (fweight < 0) {
            fweight = o.strokeWidth / 2;
        }
        var radPerDeg = Math.PI / 180;
        var hachureAngle = angle % 180 * radPerDeg;
        var tanAngle = Math.tan(hachureAngle);
        var aspectRatio = ry / rx;
        var hyp = Math.sqrt(aspectRatio * tanAngle * aspectRatio * tanAngle + 1);
        var sinAnglePrime = aspectRatio * tanAngle / hyp;
        var cosAnglePrime = 1 / hyp;
        var gapPrime = gap / (rx * ry / Math.sqrt(ry * cosAnglePrime * (ry * cosAnglePrime) + rx * sinAnglePrime * (rx * sinAnglePrime)) / rx);
        var halfLen = Math.sqrt(rx * rx - (cx - rx + gapPrime) * (cx - rx + gapPrime));
        for (var xPos = cx - rx + gapPrime; xPos < cx + rx; xPos += gapPrime) {
            halfLen = Math.sqrt(rx * rx - (cx - xPos) * (cx - xPos));
            var p1 = affine(xPos, cy - halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
            var p2 = affine(xPos, cy + halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
            ret.push([p1, p2]);
        }
        return ret;
    }

    var HachureFiller = function () {
        function HachureFiller(renderer) {
            (0, _classCallCheck3.default)(this, HachureFiller);

            this.renderer = renderer;
        }

        (0, _createClass3.default)(HachureFiller, [{
            key: 'fillPolygon',
            value: function fillPolygon(points, o) {
                return this._fillPolygon(points, o);
            }
        }, {
            key: 'fillEllipse',
            value: function fillEllipse(cx, cy, width, height, o) {
                return this._fillEllipse(cx, cy, width, height, o);
            }
        }, {
            key: '_fillPolygon',
            value: function _fillPolygon(points, o) {
                var connectEnds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                var lines = hachureLinesForPolygon(points, o);
                var ops = this.renderLines(lines, o, connectEnds);
                return { type: 'fillSketch', ops: ops };
            }
        }, {
            key: '_fillEllipse',
            value: function _fillEllipse(cx, cy, width, height, o) {
                var connectEnds = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

                var lines = hachureLinesForEllipse(cx, cy, width, height, o, this.renderer);
                var ops = this.renderLines(lines, o, connectEnds);
                return { type: 'fillSketch', ops: ops };
            }
        }, {
            key: 'renderLines',
            value: function renderLines(lines, o, connectEnds) {
                var ops = [];
                var prevPoint = null;
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = (0, _getIterator3.default)(lines), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var line = _step5.value;

                        ops = ops.concat(this.renderer.doubleLine(line[0][0], line[0][1], line[1][0], line[1][1], o));
                        if (connectEnds && prevPoint) {
                            ops = ops.concat(this.renderer.doubleLine(prevPoint[0], prevPoint[1], line[0][0], line[0][1], o));
                        }
                        prevPoint = line[1];
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                return ops;
            }
        }]);
        return HachureFiller;
    }();

    var ZigZagFiller = function (_HachureFiller) {
        (0, _inherits3.default)(ZigZagFiller, _HachureFiller);

        function ZigZagFiller() {
            (0, _classCallCheck3.default)(this, ZigZagFiller);
            return (0, _possibleConstructorReturn3.default)(this, (ZigZagFiller.__proto__ || (0, _getPrototypeOf2.default)(ZigZagFiller)).apply(this, arguments));
        }

        (0, _createClass3.default)(ZigZagFiller, [{
            key: 'fillPolygon',
            value: function fillPolygon(points, o) {
                return this._fillPolygon(points, o, true);
            }
        }, {
            key: 'fillEllipse',
            value: function fillEllipse(cx, cy, width, height, o) {
                return this._fillEllipse(cx, cy, width, height, o, true);
            }
        }]);
        return ZigZagFiller;
    }(HachureFiller);

    var HatchFiller = function (_HachureFiller2) {
        (0, _inherits3.default)(HatchFiller, _HachureFiller2);

        function HatchFiller() {
            (0, _classCallCheck3.default)(this, HatchFiller);
            return (0, _possibleConstructorReturn3.default)(this, (HatchFiller.__proto__ || (0, _getPrototypeOf2.default)(HatchFiller)).apply(this, arguments));
        }

        (0, _createClass3.default)(HatchFiller, [{
            key: 'fillPolygon',
            value: function fillPolygon(points, o) {
                var set = this._fillPolygon(points, o);
                var o2 = (0, _assign2.default)({}, o, { hachureAngle: o.hachureAngle + 90 });
                var set2 = this._fillPolygon(points, o2);
                set.ops = set.ops.concat(set2.ops);
                return set;
            }
        }, {
            key: 'fillEllipse',
            value: function fillEllipse(cx, cy, width, height, o) {
                var set = this._fillEllipse(cx, cy, width, height, o);
                var o2 = (0, _assign2.default)({}, o, { hachureAngle: o.hachureAngle + 90 });
                var set2 = this._fillEllipse(cx, cy, width, height, o2);
                set.ops = set.ops.concat(set2.ops);
                return set;
            }
        }]);
        return HatchFiller;
    }(HachureFiller);

    var DotFiller = function () {
        function DotFiller(renderer) {
            (0, _classCallCheck3.default)(this, DotFiller);

            this.renderer = renderer;
        }

        (0, _createClass3.default)(DotFiller, [{
            key: 'fillPolygon',
            value: function fillPolygon(points, o) {
                o = (0, _assign2.default)({}, o, { curveStepCount: 4, hachureAngle: 0 });
                var lines = hachureLinesForPolygon(points, o);
                return this.dotsOnLines(lines, o);
            }
        }, {
            key: 'fillEllipse',
            value: function fillEllipse(cx, cy, width, height, o) {
                o = (0, _assign2.default)({}, o, { curveStepCount: 4, hachureAngle: 0 });
                var lines = hachureLinesForEllipse(cx, cy, width, height, o, this.renderer);
                return this.dotsOnLines(lines, o);
            }
        }, {
            key: 'dotsOnLines',
            value: function dotsOnLines(lines, o) {
                var ops = [];
                var gap = o.hachureGap;
                if (gap < 0) {
                    gap = o.strokeWidth * 4;
                }
                gap = Math.max(gap, 0.1);
                var fweight = o.fillWeight;
                if (fweight < 0) {
                    fweight = o.strokeWidth / 2;
                }
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = (0, _getIterator3.default)(lines), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var line = _step6.value;

                        var length = lineLength(line);
                        var dl = length / gap;
                        var count = Math.ceil(dl) - 1;
                        var alpha = Math.atan((line[1][1] - line[0][1]) / (line[1][0] - line[0][0]));
                        for (var i = 0; i < count; i++) {
                            var l = gap * (i + 1);
                            var dy = l * Math.sin(alpha);
                            var dx = l * Math.cos(alpha);
                            var c = [line[0][0] - dx, line[0][1] + dy];
                            var cx = this.renderer.getOffset(c[0] - gap / 4, c[0] + gap / 4, o);
                            var cy = this.renderer.getOffset(c[1] - gap / 4, c[1] + gap / 4, o);
                            var ellipse = this.renderer.ellipse(cx, cy, fweight, fweight, o);
                            ops = ops.concat(ellipse.ops);
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                return { type: 'fillSketch', ops: ops };
            }
        }]);
        return DotFiller;
    }();

    var fillers = {};
    function getFiller(renderer, o) {
        var fillerName = o.fillStyle || 'hachure';
        if (!fillers[fillerName]) {
            switch (fillerName) {
                case 'zigzag':
                    if (!fillers[fillerName]) {
                        fillers[fillerName] = new ZigZagFiller(renderer);
                    }
                    break;
                case 'cross-hatch':
                    if (!fillers[fillerName]) {
                        fillers[fillerName] = new HatchFiller(renderer);
                    }
                    break;
                case 'dots':
                    if (!fillers[fillerName]) {
                        fillers[fillerName] = new DotFiller(renderer);
                    }
                    break;
                case 'hachure':
                default:
                    fillerName = 'hachure';
                    if (!fillers[fillerName]) {
                        fillers[fillerName] = new HachureFiller(renderer);
                    }
                    break;
            }
        }
        return fillers[fillerName];
    }

    var RoughRenderer = function () {
        function RoughRenderer() {
            (0, _classCallCheck3.default)(this, RoughRenderer);
        }

        (0, _createClass3.default)(RoughRenderer, [{
            key: 'line',
            value: function line(x1, y1, x2, y2, o) {
                var ops = this.doubleLine(x1, y1, x2, y2, o);
                return { type: 'path', ops: ops };
            }
        }, {
            key: 'linearPath',
            value: function linearPath(points, close, o) {
                var len = (points || []).length;
                if (len > 2) {
                    var ops = [];
                    for (var i = 0; i < len - 1; i++) {
                        ops = ops.concat(this.doubleLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], o));
                    }
                    if (close) {
                        ops = ops.concat(this.doubleLine(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1], o));
                    }
                    return { type: 'path', ops: ops };
                } else if (len === 2) {
                    return this.line(points[0][0], points[0][1], points[1][0], points[1][1], o);
                }
                return { type: 'path', ops: [] };
            }
        }, {
            key: 'polygon',
            value: function polygon(points, o) {
                return this.linearPath(points, true, o);
            }
        }, {
            key: 'rectangle',
            value: function rectangle(x, y, width, height, o) {
                var points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
                return this.polygon(points, o);
            }
        }, {
            key: 'curve',
            value: function curve(points, o) {
                var o1 = this._curveWithOffset(points, 1 * (1 + o.roughness * 0.2), o);
                var o2 = this._curveWithOffset(points, 1.5 * (1 + o.roughness * 0.22), o);
                return { type: 'path', ops: o1.concat(o2) };
            }
        }, {
            key: 'ellipse',
            value: function ellipse(x, y, width, height, o) {
                var increment = Math.PI * 2 / o.curveStepCount;
                var rx = Math.abs(width / 2);
                var ry = Math.abs(height / 2);
                rx += this.getOffset(-rx * 0.05, rx * 0.05, o);
                ry += this.getOffset(-ry * 0.05, ry * 0.05, o);
                var o1 = this._ellipse(increment, x, y, rx, ry, 1, increment * this.getOffset(0.1, this.getOffset(0.4, 1, o), o), o);
                var o2 = this._ellipse(increment, x, y, rx, ry, 1.5, 0, o);
                return { type: 'path', ops: o1.concat(o2) };
            }
        }, {
            key: 'arc',
            value: function arc(x, y, width, height, start, stop, closed, roughClosure, o) {
                var cx = x;
                var cy = y;
                var rx = Math.abs(width / 2);
                var ry = Math.abs(height / 2);
                rx += this.getOffset(-rx * 0.01, rx * 0.01, o);
                ry += this.getOffset(-ry * 0.01, ry * 0.01, o);
                var strt = start;
                var stp = stop;
                while (strt < 0) {
                    strt += Math.PI * 2;
                    stp += Math.PI * 2;
                }
                if (stp - strt > Math.PI * 2) {
                    strt = 0;
                    stp = Math.PI * 2;
                }
                var ellipseInc = Math.PI * 2 / o.curveStepCount;
                var arcInc = Math.min(ellipseInc / 2, (stp - strt) / 2);
                var o1 = this._arc(arcInc, cx, cy, rx, ry, strt, stp, 1, o);
                var o2 = this._arc(arcInc, cx, cy, rx, ry, strt, stp, 1.5, o);
                var ops = o1.concat(o2);
                if (closed) {
                    if (roughClosure) {
                        ops = ops.concat(this.doubleLine(cx, cy, cx + rx * Math.cos(strt), cy + ry * Math.sin(strt), o));
                        ops = ops.concat(this.doubleLine(cx, cy, cx + rx * Math.cos(stp), cy + ry * Math.sin(stp), o));
                    } else {
                        ops.push({ op: 'lineTo', data: [cx, cy] });
                        ops.push({ op: 'lineTo', data: [cx + rx * Math.cos(strt), cy + ry * Math.sin(strt)] });
                    }
                }
                return { type: 'path', ops: ops };
            }
        }, {
            key: 'svgPath',
            value: function svgPath(path, o) {
                path = (path || '').replace(/\n/g, ' ').replace(/(-\s)/g, '-').replace('/(\s\s)/g', ' ');
                var p = new RoughPath(path);
                if (o.simplification) {
                    var fitter = new PathFitter(p.linearPoints, p.closed);
                    var d = fitter.fit(o.simplification);
                    p = new RoughPath(d);
                }
                var ops = [];
                var segments = p.segments || [];
                for (var i = 0; i < segments.length; i++) {
                    var s = segments[i];
                    var prev = i > 0 ? segments[i - 1] : null;
                    var opList = this._processSegment(p, s, prev, o);
                    if (opList && opList.length) {
                        ops = ops.concat(opList);
                    }
                }
                return { type: 'path', ops: ops };
            }
        }, {
            key: 'solidFillPolygon',
            value: function solidFillPolygon(points, o) {
                var ops = [];
                if (points.length) {
                    var offset = o.maxRandomnessOffset || 0;
                    var len = points.length;
                    if (len > 2) {
                        ops.push({ op: 'move', data: [points[0][0] + this.getOffset(-offset, offset, o), points[0][1] + this.getOffset(-offset, offset, o)] });
                        for (var i = 1; i < len; i++) {
                            ops.push({ op: 'lineTo', data: [points[i][0] + this.getOffset(-offset, offset, o), points[i][1] + this.getOffset(-offset, offset, o)] });
                        }
                    }
                }
                return { type: 'fillPath', ops: ops };
            }
        }, {
            key: 'patternFillPolygon',
            value: function patternFillPolygon(points, o) {
                var filler = getFiller(this, o);
                return filler.fillPolygon(points, o);
            }
        }, {
            key: 'patternFillEllipse',
            value: function patternFillEllipse(cx, cy, width, height, o) {
                var filler = getFiller(this, o);
                return filler.fillEllipse(cx, cy, width, height, o);
            }
        }, {
            key: 'patternFillArc',
            value: function patternFillArc(x, y, width, height, start, stop, o) {
                var cx = x;
                var cy = y;
                var rx = Math.abs(width / 2);
                var ry = Math.abs(height / 2);
                rx += this.getOffset(-rx * 0.01, rx * 0.01, o);
                ry += this.getOffset(-ry * 0.01, ry * 0.01, o);
                var strt = start;
                var stp = stop;
                while (strt < 0) {
                    strt += Math.PI * 2;
                    stp += Math.PI * 2;
                }
                if (stp - strt > Math.PI * 2) {
                    strt = 0;
                    stp = Math.PI * 2;
                }
                var increment = (stp - strt) / o.curveStepCount;
                var points = [];
                for (var angle = strt; angle <= stp; angle = angle + increment) {
                    points.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]);
                }
                points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
                points.push([cx, cy]);
                return this.patternFillPolygon(points, o);
            }
            /// 

        }, {
            key: 'getOffset',
            value: function getOffset(min, max, ops) {
                return ops.roughness * (Math.random() * (max - min) + min);
            }
        }, {
            key: 'doubleLine',
            value: function doubleLine(x1, y1, x2, y2, o) {
                var o1 = this._line(x1, y1, x2, y2, o, true, false);
                var o2 = this._line(x1, y1, x2, y2, o, true, true);
                return o1.concat(o2);
            }
        }, {
            key: '_line',
            value: function _line(x1, y1, x2, y2, o, move, overlay) {
                var lengthSq = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
                var offset = o.maxRandomnessOffset || 0;
                if (offset * offset * 100 > lengthSq) {
                    offset = Math.sqrt(lengthSq) / 10;
                }
                var halfOffset = offset / 2;
                var divergePoint = 0.2 + Math.random() * 0.2;
                var midDispX = o.bowing * o.maxRandomnessOffset * (y2 - y1) / 200;
                var midDispY = o.bowing * o.maxRandomnessOffset * (x1 - x2) / 200;
                midDispX = this.getOffset(-midDispX, midDispX, o);
                midDispY = this.getOffset(-midDispY, midDispY, o);
                var ops = [];
                if (move) {
                    if (overlay) {
                        ops.push({
                            op: 'move', data: [x1 + this.getOffset(-halfOffset, halfOffset, o), y1 + this.getOffset(-halfOffset, halfOffset, o)]
                        });
                    } else {
                        ops.push({
                            op: 'move', data: [x1 + this.getOffset(-offset, offset, o), y1 + this.getOffset(-offset, offset, o)]
                        });
                    }
                }
                if (overlay) {
                    ops.push({
                        op: 'bcurveTo', data: [midDispX + x1 + (x2 - x1) * divergePoint + this.getOffset(-halfOffset, halfOffset, o), midDispY + y1 + (y2 - y1) * divergePoint + this.getOffset(-halfOffset, halfOffset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this.getOffset(-halfOffset, halfOffset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this.getOffset(-halfOffset, halfOffset, o), x2 + this.getOffset(-halfOffset, halfOffset, o), y2 + this.getOffset(-halfOffset, halfOffset, o)]
                    });
                } else {
                    ops.push({
                        op: 'bcurveTo', data: [midDispX + x1 + (x2 - x1) * divergePoint + this.getOffset(-offset, offset, o), midDispY + y1 + (y2 - y1) * divergePoint + this.getOffset(-offset, offset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this.getOffset(-offset, offset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this.getOffset(-offset, offset, o), x2 + this.getOffset(-offset, offset, o), y2 + this.getOffset(-offset, offset, o)]
                    });
                }
                return ops;
            }
        }, {
            key: '_curve',
            value: function _curve(points, closePoint, o) {
                var len = points.length;
                var ops = [];
                if (len > 3) {
                    var b = [];
                    var s = 1 - o.curveTightness;
                    ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
                    for (var i = 1; i + 2 < len; i++) {
                        var cachedVertArray = points[i];
                        b[0] = [cachedVertArray[0], cachedVertArray[1]];
                        b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
                        b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
                        b[3] = [points[i + 1][0], points[i + 1][1]];
                        ops.push({ op: 'bcurveTo', data: [b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]] });
                    }
                    if (closePoint && closePoint.length === 2) {
                        var ro = o.maxRandomnessOffset;
                        ops.push({ op: 'lineTo', data: [closePoint[0] + this.getOffset(-ro, ro, o), closePoint[1] + +this.getOffset(-ro, ro, o)] });
                    }
                } else if (len === 3) {
                    ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
                    ops.push({
                        op: 'bcurveTo', data: [points[1][0], points[1][1], points[2][0], points[2][1], points[2][0], points[2][1]]
                    });
                } else if (len === 2) {
                    ops = ops.concat(this.doubleLine(points[0][0], points[0][1], points[1][0], points[1][1], o));
                }
                return ops;
            }
        }, {
            key: '_ellipse',
            value: function _ellipse(increment, cx, cy, rx, ry, offset, overlap, o) {
                var radOffset = this.getOffset(-0.5, 0.5, o) - Math.PI / 2;
                var points = [];
                points.push([this.getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment), this.getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)]);
                for (var angle = radOffset; angle < Math.PI * 2 + radOffset - 0.01; angle = angle + increment) {
                    points.push([this.getOffset(-offset, offset, o) + cx + rx * Math.cos(angle), this.getOffset(-offset, offset, o) + cy + ry * Math.sin(angle)]);
                }
                points.push([this.getOffset(-offset, offset, o) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5), this.getOffset(-offset, offset, o) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)]);
                points.push([this.getOffset(-offset, offset, o) + cx + 0.98 * rx * Math.cos(radOffset + overlap), this.getOffset(-offset, offset, o) + cy + 0.98 * ry * Math.sin(radOffset + overlap)]);
                points.push([this.getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5), this.getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)]);
                return this._curve(points, null, o);
            }
        }, {
            key: '_curveWithOffset',
            value: function _curveWithOffset(points, offset, o) {
                var ps = [];
                ps.push([points[0][0] + this.getOffset(-offset, offset, o), points[0][1] + this.getOffset(-offset, offset, o)]);
                ps.push([points[0][0] + this.getOffset(-offset, offset, o), points[0][1] + this.getOffset(-offset, offset, o)]);
                for (var i = 1; i < points.length; i++) {
                    ps.push([points[i][0] + this.getOffset(-offset, offset, o), points[i][1] + this.getOffset(-offset, offset, o)]);
                    if (i === points.length - 1) {
                        ps.push([points[i][0] + this.getOffset(-offset, offset, o), points[i][1] + this.getOffset(-offset, offset, o)]);
                    }
                }
                return this._curve(ps, null, o);
            }
        }, {
            key: '_arc',
            value: function _arc(increment, cx, cy, rx, ry, strt, stp, offset, o) {
                var radOffset = strt + this.getOffset(-0.1, 0.1, o);
                var points = [];
                points.push([this.getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment), this.getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)]);
                for (var angle = radOffset; angle <= stp; angle = angle + increment) {
                    points.push([this.getOffset(-offset, offset, o) + cx + rx * Math.cos(angle), this.getOffset(-offset, offset, o) + cy + ry * Math.sin(angle)]);
                }
                points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
                points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
                return this._curve(points, null, o);
            }
        }, {
            key: '_bezierTo',
            value: function _bezierTo(x1, y1, x2, y2, x, y, path, o) {
                var ops = [];
                var ros = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + 0.5];
                var f = [0, 0];
                for (var i = 0; i < 2; i++) {
                    if (i === 0) {
                        ops.push({ op: 'move', data: [path.x, path.y] });
                    } else {
                        ops.push({ op: 'move', data: [path.x + this.getOffset(-ros[0], ros[0], o), path.y + this.getOffset(-ros[0], ros[0], o)] });
                    }
                    f = [x + this.getOffset(-ros[i], ros[i], o), y + this.getOffset(-ros[i], ros[i], o)];
                    ops.push({
                        op: 'bcurveTo', data: [x1 + this.getOffset(-ros[i], ros[i], o), y1 + this.getOffset(-ros[i], ros[i], o), x2 + this.getOffset(-ros[i], ros[i], o), y2 + this.getOffset(-ros[i], ros[i], o), f[0], f[1]]
                    });
                }
                path.setPosition(f[0], f[1]);
                return ops;
            }
        }, {
            key: '_processSegment',
            value: function _processSegment(path, seg, prevSeg, o) {
                var ops = [];
                switch (seg.key) {
                    case 'M':
                    case 'm':
                        {
                            var delta = seg.key === 'm';
                            if (seg.data.length >= 2) {
                                var x = +seg.data[0];
                                var y = +seg.data[1];
                                if (delta) {
                                    x += path.x;
                                    y += path.y;
                                }
                                var ro = 1 * (o.maxRandomnessOffset || 0);
                                x = x + this.getOffset(-ro, ro, o);
                                y = y + this.getOffset(-ro, ro, o);
                                path.setPosition(x, y);
                                ops.push({ op: 'move', data: [x, y] });
                            }
                            break;
                        }
                    case 'L':
                    case 'l':
                        {
                            var _delta = seg.key === 'l';
                            if (seg.data.length >= 2) {
                                var _x3 = +seg.data[0];
                                var _y = +seg.data[1];
                                if (_delta) {
                                    _x3 += path.x;
                                    _y += path.y;
                                }
                                ops = ops.concat(this.doubleLine(path.x, path.y, _x3, _y, o));
                                path.setPosition(_x3, _y);
                            }
                            break;
                        }
                    case 'H':
                    case 'h':
                        {
                            var _delta2 = seg.key === 'h';
                            if (seg.data.length) {
                                var _x4 = +seg.data[0];
                                if (_delta2) {
                                    _x4 += path.x;
                                }
                                ops = ops.concat(this.doubleLine(path.x, path.y, _x4, path.y, o));
                                path.setPosition(_x4, path.y);
                            }
                            break;
                        }
                    case 'V':
                    case 'v':
                        {
                            var _delta3 = seg.key === 'v';
                            if (seg.data.length) {
                                var _y2 = +seg.data[0];
                                if (_delta3) {
                                    _y2 += path.y;
                                }
                                ops = ops.concat(this.doubleLine(path.x, path.y, path.x, _y2, o));
                                path.setPosition(path.x, _y2);
                            }
                            break;
                        }
                    case 'Z':
                    case 'z':
                        {
                            if (path.first) {
                                ops = ops.concat(this.doubleLine(path.x, path.y, path.first[0], path.first[1], o));
                                path.setPosition(path.first[0], path.first[1]);
                                path.first = null;
                            }
                            break;
                        }
                    case 'C':
                    case 'c':
                        {
                            var _delta4 = seg.key === 'c';
                            if (seg.data.length >= 6) {
                                var x1 = +seg.data[0];
                                var y1 = +seg.data[1];
                                var x2 = +seg.data[2];
                                var y2 = +seg.data[3];
                                var _x5 = +seg.data[4];
                                var _y3 = +seg.data[5];
                                if (_delta4) {
                                    x1 += path.x;
                                    x2 += path.x;
                                    _x5 += path.x;
                                    y1 += path.y;
                                    y2 += path.y;
                                    _y3 += path.y;
                                }
                                var ob = this._bezierTo(x1, y1, x2, y2, _x5, _y3, path, o);
                                ops = ops.concat(ob);
                                path.bezierReflectionPoint = [_x5 + (_x5 - x2), _y3 + (_y3 - y2)];
                            }
                            break;
                        }
                    case 'S':
                    case 's':
                        {
                            var _delta5 = seg.key === 's';
                            if (seg.data.length >= 4) {
                                var _x6 = +seg.data[0];
                                var _y4 = +seg.data[1];
                                var _x7 = +seg.data[2];
                                var _y5 = +seg.data[3];
                                if (_delta5) {
                                    _x6 += path.x;
                                    _x7 += path.x;
                                    _y4 += path.y;
                                    _y5 += path.y;
                                }
                                var _x8 = _x6;
                                var _y6 = _y4;
                                var prevKey = prevSeg ? prevSeg.key : '';
                                var ref = null;
                                if (prevKey === 'c' || prevKey === 'C' || prevKey === 's' || prevKey === 'S') {
                                    ref = path.bezierReflectionPoint;
                                }
                                if (ref) {
                                    _x8 = ref[0];
                                    _y6 = ref[1];
                                }
                                var _ob = this._bezierTo(_x8, _y6, _x6, _y4, _x7, _y5, path, o);
                                ops = ops.concat(_ob);
                                path.bezierReflectionPoint = [_x7 + (_x7 - _x6), _y5 + (_y5 - _y4)];
                            }
                            break;
                        }
                    case 'Q':
                    case 'q':
                        {
                            var _delta6 = seg.key === 'q';
                            if (seg.data.length >= 4) {
                                var _x9 = +seg.data[0];
                                var _y7 = +seg.data[1];
                                var _x10 = +seg.data[2];
                                var _y8 = +seg.data[3];
                                if (_delta6) {
                                    _x9 += path.x;
                                    _x10 += path.x;
                                    _y7 += path.y;
                                    _y8 += path.y;
                                }
                                var offset1 = 1 * (1 + o.roughness * 0.2);
                                var offset2 = 1.5 * (1 + o.roughness * 0.22);
                                ops.push({ op: 'move', data: [path.x + this.getOffset(-offset1, offset1, o), path.y + this.getOffset(-offset1, offset1, o)] });
                                var f = [_x10 + this.getOffset(-offset1, offset1, o), _y8 + this.getOffset(-offset1, offset1, o)];
                                ops.push({
                                    op: 'qcurveTo', data: [_x9 + this.getOffset(-offset1, offset1, o), _y7 + this.getOffset(-offset1, offset1, o), f[0], f[1]]
                                });
                                ops.push({ op: 'move', data: [path.x + this.getOffset(-offset2, offset2, o), path.y + this.getOffset(-offset2, offset2, o)] });
                                f = [_x10 + this.getOffset(-offset2, offset2, o), _y8 + this.getOffset(-offset2, offset2, o)];
                                ops.push({
                                    op: 'qcurveTo', data: [_x9 + this.getOffset(-offset2, offset2, o), _y7 + this.getOffset(-offset2, offset2, o), f[0], f[1]]
                                });
                                path.setPosition(f[0], f[1]);
                                path.quadReflectionPoint = [_x10 + (_x10 - _x9), _y8 + (_y8 - _y7)];
                            }
                            break;
                        }
                    case 'T':
                    case 't':
                        {
                            var _delta7 = seg.key === 't';
                            if (seg.data.length >= 2) {
                                var _x11 = +seg.data[0];
                                var _y9 = +seg.data[1];
                                if (_delta7) {
                                    _x11 += path.x;
                                    _y9 += path.y;
                                }
                                var _x12 = _x11;
                                var _y10 = _y9;
                                var _prevKey = prevSeg ? prevSeg.key : '';
                                var _ref = null;
                                if (_prevKey === 'q' || _prevKey === 'Q' || _prevKey === 't' || _prevKey === 'T') {
                                    _ref = path.quadReflectionPoint;
                                }
                                if (_ref) {
                                    _x12 = _ref[0];
                                    _y10 = _ref[1];
                                }
                                var _offset = 1 * (1 + o.roughness * 0.2);
                                var _offset2 = 1.5 * (1 + o.roughness * 0.22);
                                ops.push({ op: 'move', data: [path.x + this.getOffset(-_offset, _offset, o), path.y + this.getOffset(-_offset, _offset, o)] });
                                var _f = [_x11 + this.getOffset(-_offset, _offset, o), _y9 + this.getOffset(-_offset, _offset, o)];
                                ops.push({
                                    op: 'qcurveTo', data: [_x12 + this.getOffset(-_offset, _offset, o), _y10 + this.getOffset(-_offset, _offset, o), _f[0], _f[1]]
                                });
                                ops.push({ op: 'move', data: [path.x + this.getOffset(-_offset2, _offset2, o), path.y + this.getOffset(-_offset2, _offset2, o)] });
                                _f = [_x11 + this.getOffset(-_offset2, _offset2, o), _y9 + this.getOffset(-_offset2, _offset2, o)];
                                ops.push({
                                    op: 'qcurveTo', data: [_x12 + this.getOffset(-_offset2, _offset2, o), _y10 + this.getOffset(-_offset2, _offset2, o), _f[0], _f[1]]
                                });
                                path.setPosition(_f[0], _f[1]);
                                path.quadReflectionPoint = [_x11 + (_x11 - _x12), _y9 + (_y9 - _y10)];
                            }
                            break;
                        }
                    case 'A':
                    case 'a':
                        {
                            var _delta8 = seg.key === 'a';
                            if (seg.data.length >= 7) {
                                var rx = +seg.data[0];
                                var ry = +seg.data[1];
                                var angle = +seg.data[2];
                                var largeArcFlag = +seg.data[3];
                                var sweepFlag = +seg.data[4];
                                var _x13 = +seg.data[5];
                                var _y11 = +seg.data[6];
                                if (_delta8) {
                                    _x13 += path.x;
                                    _y11 += path.y;
                                }
                                if (_x13 === path.x && _y11 === path.y) {
                                    break;
                                }
                                if (rx === 0 || ry === 0) {
                                    ops = ops.concat(this.doubleLine(path.x, path.y, _x13, _y11, o));
                                    path.setPosition(_x13, _y11);
                                } else {
                                    for (var i = 0; i < 1; i++) {
                                        var arcConverter = new RoughArcConverter([path.x, path.y], [_x13, _y11], [rx, ry], angle, largeArcFlag ? true : false, sweepFlag ? true : false);
                                        var segment = arcConverter.getNextSegment();
                                        while (segment) {
                                            var _ob2 = this._bezierTo(segment.cp1[0], segment.cp1[1], segment.cp2[0], segment.cp2[1], segment.to[0], segment.to[1], path, o);
                                            ops = ops.concat(_ob2);
                                            segment = arcConverter.getNextSegment();
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    default:
                        break;
                }
                return ops;
            }
        }]);
        return RoughRenderer;
    }();

    var hasSelf = typeof self !== 'undefined';
    var roughScript = hasSelf && self && self.document && self.document.currentScript && self.document.currentScript.src;
    function createRenderer(config) {
        if (hasSelf && roughScript && self && self.workly && config.async && !config.noWorker) {
            var worklySource = config.worklyURL || 'https://cdn.jsdelivr.net/gh/pshihn/workly/dist/workly.min.js';
            if (worklySource) {
                var code = 'importScripts(\'' + worklySource + '\', \'' + roughScript + '\');\nworkly.expose(self.rough.createRenderer());';
                var ourl = URL.createObjectURL(new Blob([code]));
                return self.workly.proxy(ourl);
            }
        }
        return new RoughRenderer();
    }

    var hasSelf$1 = typeof self !== 'undefined';

    var RoughGeneratorBase = function () {
        function RoughGeneratorBase(config, surface) {
            (0, _classCallCheck3.default)(this, RoughGeneratorBase);

            this.defaultOptions = {
                maxRandomnessOffset: 2,
                roughness: 1,
                bowing: 1,
                stroke: '#000',
                strokeWidth: 1,
                curveTightness: 0,
                curveStepCount: 9,
                fillStyle: 'hachure',
                fillWeight: -1,
                hachureAngle: -41,
                hachureGap: -1,
                lineDash: []
            };
            this.config = config || {};
            this.surface = surface;
            this.renderer = createRenderer(this.config);
            if (this.config.options) {
                this.defaultOptions = this._options(this.config.options);
            }
        }

        (0, _createClass3.default)(RoughGeneratorBase, [{
            key: '_options',
            value: function _options(options) {
                return options ? (0, _assign2.default)({}, this.defaultOptions, options) : this.defaultOptions;
            }
        }, {
            key: '_drawable',
            value: function _drawable(shape, sets, options) {
                return { shape: shape, sets: sets || [], options: options || this.defaultOptions };
            }
        }, {
            key: 'getCanvasSize',
            value: function getCanvasSize() {
                var val = function val(w) {
                    if (w && (typeof w === 'undefined' ? 'undefined' : (0, _typeof3.default)(w)) === 'object') {
                        if (w.baseVal && w.baseVal.value) {
                            return w.baseVal.value;
                        }
                    }
                    return w || 100;
                };
                if (this.surface) {
                    return [val(this.surface.width), val(this.surface.height)];
                }
                return [100, 100];
            }
        }, {
            key: 'computePolygonSize',
            value: function computePolygonSize(points) {
                if (points.length) {
                    var left = points[0][0];
                    var right = points[0][0];
                    var top = points[0][1];
                    var bottom = points[0][1];
                    for (var i = 1; i < points.length; i++) {
                        left = Math.min(left, points[i][0]);
                        right = Math.max(right, points[i][0]);
                        top = Math.min(top, points[i][1]);
                        bottom = Math.max(bottom, points[i][1]);
                    }
                    return [right - left, bottom - top];
                }
                return [0, 0];
            }
        }, {
            key: 'polygonPath',
            value: function polygonPath(points) {
                var d = '';
                if (points.length) {
                    d = 'M' + points[0][0] + ',' + points[0][1];
                    for (var i = 1; i < points.length; i++) {
                        d = d + ' L' + points[i][0] + ',' + points[i][1];
                    }
                }
                return d;
            }
        }, {
            key: 'computePathSize',
            value: function computePathSize(d) {
                var size = [0, 0];
                if (hasSelf$1 && self.document) {
                    try {
                        var ns = 'http://www.w3.org/2000/svg';
                        var svg = self.document.createElementNS(ns, 'svg');
                        svg.setAttribute('width', '0');
                        svg.setAttribute('height', '0');
                        var pathNode = self.document.createElementNS(ns, 'path');
                        pathNode.setAttribute('d', d);
                        svg.appendChild(pathNode);
                        self.document.body.appendChild(svg);
                        var bb = pathNode.getBBox();
                        if (bb) {
                            size[0] = bb.width || 0;
                            size[1] = bb.height || 0;
                        }
                        self.document.body.removeChild(svg);
                    } catch (err) {}
                }
                var canvasSize = this.getCanvasSize();
                if (!(size[0] * size[1])) {
                    size = canvasSize;
                }
                return size;
            }
        }, {
            key: 'toPaths',
            value: function toPaths(drawable) {
                var sets = drawable.sets || [];
                var o = drawable.options || this.defaultOptions;
                var paths = [];
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = (0, _getIterator3.default)(sets), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var drawing = _step7.value;

                        var path = null;
                        switch (drawing.type) {
                            case 'path':
                                path = {
                                    d: this.opsToPath(drawing),
                                    stroke: o.stroke,
                                    strokeWidth: o.strokeWidth,
                                    fill: 'none'
                                };
                                break;
                            case 'fillPath':
                                path = {
                                    d: this.opsToPath(drawing),
                                    stroke: 'none',
                                    strokeWidth: 0,
                                    fill: o.fill || 'none'
                                };
                                break;
                            case 'fillSketch':
                                path = this.fillSketch(drawing, o);
                                break;
                            case 'path2Dfill':
                                path = {
                                    d: drawing.path || '',
                                    stroke: 'none',
                                    strokeWidth: 0,
                                    fill: o.fill || 'none'
                                };
                                break;
                            case 'path2Dpattern':
                                {
                                    var size = drawing.size;
                                    var pattern = {
                                        x: 0, y: 0, width: 1, height: 1,
                                        viewBox: '0 0 ' + Math.round(size[0]) + ' ' + Math.round(size[1]),
                                        patternUnits: 'objectBoundingBox',
                                        path: this.fillSketch(drawing, o)
                                    };
                                    path = {
                                        d: drawing.path,
                                        stroke: 'none',
                                        strokeWidth: 0,
                                        pattern: pattern
                                    };
                                    break;
                                }
                        }
                        if (path) {
                            paths.push(path);
                        }
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                return paths;
            }
        }, {
            key: 'fillSketch',
            value: function fillSketch(drawing, o) {
                var fweight = o.fillWeight;
                if (fweight < 0) {
                    fweight = o.strokeWidth / 2;
                }
                return {
                    d: this.opsToPath(drawing),
                    stroke: o.fill || 'none',
                    strokeWidth: fweight,
                    fill: 'none'
                };
            }
        }, {
            key: 'opsToPath',
            value: function opsToPath(drawing) {
                var path = '';
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = (0, _getIterator3.default)(drawing.ops), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var item = _step8.value;

                        var data = item.data;
                        switch (item.op) {
                            case 'move':
                                path += 'M' + data[0] + ' ' + data[1] + ' ';
                                break;
                            case 'bcurveTo':
                                path += 'C' + data[0] + ' ' + data[1] + ', ' + data[2] + ' ' + data[3] + ', ' + data[4] + ' ' + data[5] + ' ';
                                break;
                            case 'qcurveTo':
                                path += 'Q' + data[0] + ' ' + data[1] + ', ' + data[2] + ' ' + data[3] + ' ';
                                break;
                            case 'lineTo':
                                path += 'L' + data[0] + ' ' + data[1] + ' ';
                                break;
                        }
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }

                return path.trim();
            }
        }, {
            key: 'lib',
            get: function get() {
                return this.renderer;
            }
        }]);
        return RoughGeneratorBase;
    }();

    var RoughGenerator = function (_RoughGeneratorBase) {
        (0, _inherits3.default)(RoughGenerator, _RoughGeneratorBase);

        function RoughGenerator(config, surface) {
            (0, _classCallCheck3.default)(this, RoughGenerator);
            return (0, _possibleConstructorReturn3.default)(this, (RoughGenerator.__proto__ || (0, _getPrototypeOf2.default)(RoughGenerator)).call(this, config, surface));
        }

        (0, _createClass3.default)(RoughGenerator, [{
            key: 'line',
            value: function line(x1, y1, x2, y2, options) {
                var o = this._options(options);
                return this._drawable('line', [this.lib.line(x1, y1, x2, y2, o)], o);
            }
        }, {
            key: 'rectangle',
            value: function rectangle(x, y, width, height, options) {
                var o = this._options(options);
                var paths = [];
                if (o.fill) {
                    var points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
                    if (o.fillStyle === 'solid') {
                        paths.push(this.lib.solidFillPolygon(points, o));
                    } else {
                        paths.push(this.lib.patternFillPolygon(points, o));
                    }
                }
                paths.push(this.lib.rectangle(x, y, width, height, o));
                return this._drawable('rectangle', paths, o);
            }
        }, {
            key: 'ellipse',
            value: function ellipse(x, y, width, height, options) {
                var o = this._options(options);
                var paths = [];
                if (o.fill) {
                    if (o.fillStyle === 'solid') {
                        var shape = this.lib.ellipse(x, y, width, height, o);
                        shape.type = 'fillPath';
                        paths.push(shape);
                    } else {
                        paths.push(this.lib.patternFillEllipse(x, y, width, height, o));
                    }
                }
                paths.push(this.lib.ellipse(x, y, width, height, o));
                return this._drawable('ellipse', paths, o);
            }
        }, {
            key: 'circle',
            value: function circle(x, y, diameter, options) {
                var ret = this.ellipse(x, y, diameter, diameter, options);
                ret.shape = 'circle';
                return ret;
            }
        }, {
            key: 'linearPath',
            value: function linearPath(points, options) {
                var o = this._options(options);
                return this._drawable('linearPath', [this.lib.linearPath(points, false, o)], o);
            }
        }, {
            key: 'arc',
            value: function arc(x, y, width, height, start, stop) {
                var closed = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
                var options = arguments[7];

                var o = this._options(options);
                var paths = [];
                if (closed && o.fill) {
                    if (o.fillStyle === 'solid') {
                        var shape = this.lib.arc(x, y, width, height, start, stop, true, false, o);
                        shape.type = 'fillPath';
                        paths.push(shape);
                    } else {
                        paths.push(this.lib.patternFillArc(x, y, width, height, start, stop, o));
                    }
                }
                paths.push(this.lib.arc(x, y, width, height, start, stop, closed, true, o));
                return this._drawable('arc', paths, o);
            }
        }, {
            key: 'curve',
            value: function curve(points, options) {
                var o = this._options(options);
                return this._drawable('curve', [this.lib.curve(points, o)], o);
            }
        }, {
            key: 'polygon',
            value: function polygon(points, options) {
                var o = this._options(options);
                var paths = [];
                if (o.fill) {
                    if (o.fillStyle === 'solid') {
                        paths.push(this.lib.solidFillPolygon(points, o));
                    } else {
                        var size = this.computePolygonSize(points);
                        var fillPoints = [[0, 0], [size[0], 0], [size[0], size[1]], [0, size[1]]];
                        var shape = this.lib.patternFillPolygon(fillPoints, o);
                        shape.type = 'path2Dpattern';
                        shape.size = size;
                        shape.path = this.polygonPath(points);
                        paths.push(shape);
                    }
                }
                paths.push(this.lib.linearPath(points, true, o));
                return this._drawable('polygon', paths, o);
            }
        }, {
            key: 'path',
            value: function path(d, options) {
                var o = this._options(options);
                var paths = [];
                if (!d) {
                    return this._drawable('path', paths, o);
                }
                if (o.fill) {
                    if (o.fillStyle === 'solid') {
                        var shape = { type: 'path2Dfill', path: d, ops: [] };
                        paths.push(shape);
                    } else {
                        var size = this.computePathSize(d);
                        var points = [[0, 0], [size[0], 0], [size[0], size[1]], [0, size[1]]];
                        var _shape = this.lib.patternFillPolygon(points, o);
                        _shape.type = 'path2Dpattern';
                        _shape.size = size;
                        _shape.path = d;
                        paths.push(_shape);
                    }
                }
                paths.push(this.lib.svgPath(d, o));
                return this._drawable('path', paths, o);
            }
        }]);
        return RoughGenerator;
    }(RoughGeneratorBase);

    var hasDocument = typeof document !== 'undefined';

    var RoughCanvasBase = function () {
        function RoughCanvasBase(canvas) {
            (0, _classCallCheck3.default)(this, RoughCanvasBase);

            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
        }

        (0, _createClass3.default)(RoughCanvasBase, [{
            key: 'draw',
            value: function draw(drawable) {
                var sets = drawable.sets || [];
                var o = drawable.options || this.getDefaultOptions();
                var ctx = this.ctx;
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = (0, _getIterator3.default)(sets), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var drawing = _step9.value;

                        switch (drawing.type) {
                            case 'path':
                                ctx.save();
                                ctx.setLineDash(o.lineDash);
                                ctx.strokeStyle = o.stroke;
                                ctx.lineWidth = o.strokeWidth;
                                this._drawToContext(ctx, drawing);
                                ctx.restore();
                                break;
                            case 'fillPath':
                                ctx.save();
                                ctx.fillStyle = o.fill || '';
                                this._drawToContext(ctx, drawing);
                                ctx.restore();
                                break;
                            case 'fillSketch':
                                this.fillSketch(ctx, drawing, o);
                                break;
                            case 'path2Dfill':
                                {
                                    this.ctx.save();
                                    this.ctx.fillStyle = o.fill || '';
                                    var p2d = new Path2D(drawing.path);
                                    this.ctx.fill(p2d);
                                    this.ctx.restore();
                                    break;
                                }
                            case 'path2Dpattern':
                                {
                                    var doc = this.canvas.ownerDocument || hasDocument && document;
                                    if (doc) {
                                        var size = drawing.size;
                                        var hcanvas = doc.createElement('canvas');
                                        var hcontext = hcanvas.getContext('2d');
                                        var bbox = this.computeBBox(drawing.path);
                                        if (bbox && (bbox.width || bbox.height)) {
                                            hcanvas.width = this.canvas.width;
                                            hcanvas.height = this.canvas.height;
                                            hcontext.translate(bbox.x || 0, bbox.y || 0);
                                        } else {
                                            hcanvas.width = size[0];
                                            hcanvas.height = size[1];
                                        }
                                        this.fillSketch(hcontext, drawing, o);
                                        this.ctx.save();
                                        this.ctx.fillStyle = this.ctx.createPattern(hcanvas, 'repeat');
                                        var _p2d = new Path2D(drawing.path);
                                        this.ctx.fill(_p2d);
                                        this.ctx.restore();
                                    } else {
                                        console.error('Cannot render path2Dpattern. No defs/document defined.');
                                    }
                                    break;
                                }
                        }
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }
            }
        }, {
            key: 'computeBBox',
            value: function computeBBox(d) {
                if (hasDocument) {
                    try {
                        var ns = 'http://www.w3.org/2000/svg';
                        var svg = document.createElementNS(ns, 'svg');
                        svg.setAttribute('width', '0');
                        svg.setAttribute('height', '0');
                        var pathNode = self.document.createElementNS(ns, 'path');
                        pathNode.setAttribute('d', d);
                        svg.appendChild(pathNode);
                        document.body.appendChild(svg);
                        var bbox = pathNode.getBBox();
                        document.body.removeChild(svg);
                        return bbox;
                    } catch (err) {}
                }
                return null;
            }
        }, {
            key: 'fillSketch',
            value: function fillSketch(ctx, drawing, o) {
                var fweight = o.fillWeight;
                if (fweight < 0) {
                    fweight = o.strokeWidth / 2;
                }
                ctx.save();
                ctx.strokeStyle = o.fill || '';
                ctx.lineWidth = fweight;
                this._drawToContext(ctx, drawing);
                ctx.restore();
            }
        }, {
            key: '_drawToContext',
            value: function _drawToContext(ctx, drawing) {
                ctx.beginPath();
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = (0, _getIterator3.default)(drawing.ops), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var item = _step10.value;

                        var data = item.data;
                        switch (item.op) {
                            case 'move':
                                ctx.moveTo(data[0], data[1]);
                                break;
                            case 'bcurveTo':
                                ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
                                break;
                            case 'qcurveTo':
                                ctx.quadraticCurveTo(data[0], data[1], data[2], data[3]);
                                break;
                            case 'lineTo':
                                ctx.lineTo(data[0], data[1]);
                                break;
                        }
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }

                if (drawing.type === 'fillPath') {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
            }
        }], [{
            key: 'createRenderer',
            value: function createRenderer() {
                return new RoughRenderer();
            }
        }]);
        return RoughCanvasBase;
    }();

    var RoughCanvas = function (_RoughCanvasBase) {
        (0, _inherits3.default)(RoughCanvas, _RoughCanvasBase);

        function RoughCanvas(canvas, config) {
            (0, _classCallCheck3.default)(this, RoughCanvas);

            var _this4 = (0, _possibleConstructorReturn3.default)(this, (RoughCanvas.__proto__ || (0, _getPrototypeOf2.default)(RoughCanvas)).call(this, canvas));

            _this4.gen = new RoughGenerator(config || null, _this4.canvas);
            return _this4;
        }

        (0, _createClass3.default)(RoughCanvas, [{
            key: 'getDefaultOptions',
            value: function getDefaultOptions() {
                return this.gen.defaultOptions;
            }
        }, {
            key: 'line',
            value: function line(x1, y1, x2, y2, options) {
                var d = this.gen.line(x1, y1, x2, y2, options);
                this.draw(d);
                return d;
            }
        }, {
            key: 'rectangle',
            value: function rectangle(x, y, width, height, options) {
                var d = this.gen.rectangle(x, y, width, height, options);
                this.draw(d);
                return d;
            }
        }, {
            key: 'ellipse',
            value: function ellipse(x, y, width, height, options) {
                var d = this.gen.ellipse(x, y, width, height, options);
                this.draw(d);
                return d;
            }
        }, {
            key: 'circle',
            value: function circle(x, y, diameter, options) {
                var d = this.gen.circle(x, y, diameter, options);
                this.draw(d);
                return d;
            }
        }, {
            key: 'linearPath',
            value: function linearPath(points, options) {
                var d = this.gen.linearPath(points, options);
                this.draw(d);
                return d;
            }
        }, {
            key: 'polygon',
            value: function polygon(points, options) {
                var d = this.gen.polygon(points, options);
                this.draw(d);
                return d;
            }
        }, {
            key: 'arc',
            value: function arc(x, y, width, height, start, stop) {
                var closed = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
                var options = arguments[7];

                var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
                this.draw(d);
                return d;
            }
        }, {
            key: 'curve',
            value: function curve(points, options) {
                var d = this.gen.curve(points, options);
                this.draw(d);
                return d;
            }
        }, {
            key: 'path',
            value: function path(d, options) {
                var drawing = this.gen.path(d, options);
                this.draw(drawing);
                return drawing;
            }
        }, {
            key: 'generator',
            get: function get() {
                return this.gen;
            }
        }]);
        return RoughCanvas;
    }(RoughCanvasBase);

    var RoughGeneratorAsync = function (_RoughGeneratorBase2) {
        (0, _inherits3.default)(RoughGeneratorAsync, _RoughGeneratorBase2);

        function RoughGeneratorAsync() {
            (0, _classCallCheck3.default)(this, RoughGeneratorAsync);
            return (0, _possibleConstructorReturn3.default)(this, (RoughGeneratorAsync.__proto__ || (0, _getPrototypeOf2.default)(RoughGeneratorAsync)).apply(this, arguments));
        }

        (0, _createClass3.default)(RoughGeneratorAsync, [{
            key: 'line',
            value: function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(x1, y1, x2, y2, options) {
                    var o;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    o = this._options(options);
                                    _context.t0 = this;
                                    _context.next = 4;
                                    return this.lib.line(x1, y1, x2, y2, o);

                                case 4:
                                    _context.t1 = _context.sent;
                                    _context.t2 = [_context.t1];
                                    _context.t3 = o;
                                    return _context.abrupt('return', _context.t0._drawable.call(_context.t0, 'line', _context.t2, _context.t3));

                                case 8:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function line(_x16, _x17, _x18, _x19, _x20) {
                    return _ref2.apply(this, arguments);
                }

                return line;
            }()
        }, {
            key: 'rectangle',
            value: function () {
                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(x, y, width, height, options) {
                    var o, paths, points;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    o = this._options(options);
                                    paths = [];

                                    if (!o.fill) {
                                        _context2.next = 17;
                                        break;
                                    }

                                    points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];

                                    if (!(o.fillStyle === 'solid')) {
                                        _context2.next = 12;
                                        break;
                                    }

                                    _context2.t0 = paths;
                                    _context2.next = 8;
                                    return this.lib.solidFillPolygon(points, o);

                                case 8:
                                    _context2.t1 = _context2.sent;

                                    _context2.t0.push.call(_context2.t0, _context2.t1);

                                    _context2.next = 17;
                                    break;

                                case 12:
                                    _context2.t2 = paths;
                                    _context2.next = 15;
                                    return this.lib.patternFillPolygon(points, o);

                                case 15:
                                    _context2.t3 = _context2.sent;

                                    _context2.t2.push.call(_context2.t2, _context2.t3);

                                case 17:
                                    _context2.t4 = paths;
                                    _context2.next = 20;
                                    return this.lib.rectangle(x, y, width, height, o);

                                case 20:
                                    _context2.t5 = _context2.sent;

                                    _context2.t4.push.call(_context2.t4, _context2.t5);

                                    return _context2.abrupt('return', this._drawable('rectangle', paths, o));

                                case 23:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function rectangle(_x21, _x22, _x23, _x24, _x25) {
                    return _ref3.apply(this, arguments);
                }

                return rectangle;
            }()
        }, {
            key: 'ellipse',
            value: function () {
                var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(x, y, width, height, options) {
                    var o, paths, shape;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    o = this._options(options);
                                    paths = [];

                                    if (!o.fill) {
                                        _context3.next = 16;
                                        break;
                                    }

                                    if (!(o.fillStyle === 'solid')) {
                                        _context3.next = 11;
                                        break;
                                    }

                                    _context3.next = 6;
                                    return this.lib.ellipse(x, y, width, height, o);

                                case 6:
                                    shape = _context3.sent;

                                    shape.type = 'fillPath';
                                    paths.push(shape);
                                    _context3.next = 16;
                                    break;

                                case 11:
                                    _context3.t0 = paths;
                                    _context3.next = 14;
                                    return this.lib.patternFillEllipse(x, y, width, height, o);

                                case 14:
                                    _context3.t1 = _context3.sent;

                                    _context3.t0.push.call(_context3.t0, _context3.t1);

                                case 16:
                                    _context3.t2 = paths;
                                    _context3.next = 19;
                                    return this.lib.ellipse(x, y, width, height, o);

                                case 19:
                                    _context3.t3 = _context3.sent;

                                    _context3.t2.push.call(_context3.t2, _context3.t3);

                                    return _context3.abrupt('return', this._drawable('ellipse', paths, o));

                                case 22:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));

                function ellipse(_x26, _x27, _x28, _x29, _x30) {
                    return _ref4.apply(this, arguments);
                }

                return ellipse;
            }()
        }, {
            key: 'circle',
            value: function () {
                var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(x, y, diameter, options) {
                    var ret;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    _context4.next = 2;
                                    return this.ellipse(x, y, diameter, diameter, options);

                                case 2:
                                    ret = _context4.sent;

                                    ret.shape = 'circle';
                                    return _context4.abrupt('return', ret);

                                case 5:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));

                function circle(_x31, _x32, _x33, _x34) {
                    return _ref5.apply(this, arguments);
                }

                return circle;
            }()
        }, {
            key: 'linearPath',
            value: function () {
                var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(points, options) {
                    var o;
                    return _regenerator2.default.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    o = this._options(options);
                                    _context5.t0 = this;
                                    _context5.next = 4;
                                    return this.lib.linearPath(points, false, o);

                                case 4:
                                    _context5.t1 = _context5.sent;
                                    _context5.t2 = [_context5.t1];
                                    _context5.t3 = o;
                                    return _context5.abrupt('return', _context5.t0._drawable.call(_context5.t0, 'linearPath', _context5.t2, _context5.t3));

                                case 8:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this);
                }));

                function linearPath(_x35, _x36) {
                    return _ref6.apply(this, arguments);
                }

                return linearPath;
            }()
        }, {
            key: 'arc',
            value: function () {
                var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(x, y, width, height, start, stop) {
                    var closed = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
                    var options = arguments[7];
                    var o, paths, shape;
                    return _regenerator2.default.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    o = this._options(options);
                                    paths = [];

                                    if (!(closed && o.fill)) {
                                        _context6.next = 16;
                                        break;
                                    }

                                    if (!(o.fillStyle === 'solid')) {
                                        _context6.next = 11;
                                        break;
                                    }

                                    _context6.next = 6;
                                    return this.lib.arc(x, y, width, height, start, stop, true, false, o);

                                case 6:
                                    shape = _context6.sent;

                                    shape.type = 'fillPath';
                                    paths.push(shape);
                                    _context6.next = 16;
                                    break;

                                case 11:
                                    _context6.t0 = paths;
                                    _context6.next = 14;
                                    return this.lib.patternFillArc(x, y, width, height, start, stop, o);

                                case 14:
                                    _context6.t1 = _context6.sent;

                                    _context6.t0.push.call(_context6.t0, _context6.t1);

                                case 16:
                                    _context6.t2 = paths;
                                    _context6.next = 19;
                                    return this.lib.arc(x, y, width, height, start, stop, closed, true, o);

                                case 19:
                                    _context6.t3 = _context6.sent;

                                    _context6.t2.push.call(_context6.t2, _context6.t3);

                                    return _context6.abrupt('return', this._drawable('arc', paths, o));

                                case 22:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, this);
                }));

                function arc(_x38, _x39, _x40, _x41, _x42, _x43) {
                    return _ref7.apply(this, arguments);
                }

                return arc;
            }()
        }, {
            key: 'curve',
            value: function () {
                var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(points, options) {
                    var o;
                    return _regenerator2.default.wrap(function _callee7$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    o = this._options(options);
                                    _context7.t0 = this;
                                    _context7.next = 4;
                                    return this.lib.curve(points, o);

                                case 4:
                                    _context7.t1 = _context7.sent;
                                    _context7.t2 = [_context7.t1];
                                    _context7.t3 = o;
                                    return _context7.abrupt('return', _context7.t0._drawable.call(_context7.t0, 'curve', _context7.t2, _context7.t3));

                                case 8:
                                case 'end':
                                    return _context7.stop();
                            }
                        }
                    }, _callee7, this);
                }));

                function curve(_x44, _x45) {
                    return _ref8.apply(this, arguments);
                }

                return curve;
            }()
        }, {
            key: 'polygon',
            value: function () {
                var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(points, options) {
                    var o, paths, size, fillPoints, shape;
                    return _regenerator2.default.wrap(function _callee8$(_context8) {
                        while (1) {
                            switch (_context8.prev = _context8.next) {
                                case 0:
                                    o = this._options(options);
                                    paths = [];

                                    if (!o.fill) {
                                        _context8.next = 20;
                                        break;
                                    }

                                    if (!(o.fillStyle === 'solid')) {
                                        _context8.next = 11;
                                        break;
                                    }

                                    _context8.t0 = paths;
                                    _context8.next = 7;
                                    return this.lib.solidFillPolygon(points, o);

                                case 7:
                                    _context8.t1 = _context8.sent;

                                    _context8.t0.push.call(_context8.t0, _context8.t1);

                                    _context8.next = 20;
                                    break;

                                case 11:
                                    size = this.computePolygonSize(points);
                                    fillPoints = [[0, 0], [size[0], 0], [size[0], size[1]], [0, size[1]]];
                                    _context8.next = 15;
                                    return this.lib.patternFillPolygon(fillPoints, o);

                                case 15:
                                    shape = _context8.sent;

                                    shape.type = 'path2Dpattern';
                                    shape.size = size;
                                    shape.path = this.polygonPath(points);
                                    paths.push(shape);

                                case 20:
                                    _context8.t2 = paths;
                                    _context8.next = 23;
                                    return this.lib.linearPath(points, true, o);

                                case 23:
                                    _context8.t3 = _context8.sent;

                                    _context8.t2.push.call(_context8.t2, _context8.t3);

                                    return _context8.abrupt('return', this._drawable('polygon', paths, o));

                                case 26:
                                case 'end':
                                    return _context8.stop();
                            }
                        }
                    }, _callee8, this);
                }));

                function polygon(_x46, _x47) {
                    return _ref9.apply(this, arguments);
                }

                return polygon;
            }()
        }, {
            key: 'path',
            value: function () {
                var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(d, options) {
                    var o, paths, shape, size, points, _shape2;

                    return _regenerator2.default.wrap(function _callee9$(_context9) {
                        while (1) {
                            switch (_context9.prev = _context9.next) {
                                case 0:
                                    o = this._options(options);
                                    paths = [];

                                    if (d) {
                                        _context9.next = 4;
                                        break;
                                    }

                                    return _context9.abrupt('return', this._drawable('path', paths, o));

                                case 4:
                                    if (!o.fill) {
                                        _context9.next = 19;
                                        break;
                                    }

                                    if (!(o.fillStyle === 'solid')) {
                                        _context9.next = 10;
                                        break;
                                    }

                                    shape = { type: 'path2Dfill', path: d, ops: [] };

                                    paths.push(shape);
                                    _context9.next = 19;
                                    break;

                                case 10:
                                    size = this.computePathSize(d);
                                    points = [[0, 0], [size[0], 0], [size[0], size[1]], [0, size[1]]];
                                    _context9.next = 14;
                                    return this.lib.patternFillPolygon(points, o);

                                case 14:
                                    _shape2 = _context9.sent;

                                    _shape2.type = 'path2Dpattern';
                                    _shape2.size = size;
                                    _shape2.path = d;
                                    paths.push(_shape2);

                                case 19:
                                    _context9.t0 = paths;
                                    _context9.next = 22;
                                    return this.lib.svgPath(d, o);

                                case 22:
                                    _context9.t1 = _context9.sent;

                                    _context9.t0.push.call(_context9.t0, _context9.t1);

                                    return _context9.abrupt('return', this._drawable('path', paths, o));

                                case 25:
                                case 'end':
                                    return _context9.stop();
                            }
                        }
                    }, _callee9, this);
                }));

                function path(_x48, _x49) {
                    return _ref10.apply(this, arguments);
                }

                return path;
            }()
        }]);
        return RoughGeneratorAsync;
    }(RoughGeneratorBase);

    var RoughCanvasAsync = function (_RoughCanvasBase2) {
        (0, _inherits3.default)(RoughCanvasAsync, _RoughCanvasBase2);

        function RoughCanvasAsync(canvas, config) {
            (0, _classCallCheck3.default)(this, RoughCanvasAsync);

            var _this6 = (0, _possibleConstructorReturn3.default)(this, (RoughCanvasAsync.__proto__ || (0, _getPrototypeOf2.default)(RoughCanvasAsync)).call(this, canvas));

            _this6.genAsync = new RoughGeneratorAsync(config || null, _this6.canvas);
            return _this6;
        }

        (0, _createClass3.default)(RoughCanvasAsync, [{
            key: 'getDefaultOptions',
            value: function getDefaultOptions() {
                return this.genAsync.defaultOptions;
            }
        }, {
            key: 'line',
            value: function () {
                var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(x1, y1, x2, y2, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee10$(_context10) {
                        while (1) {
                            switch (_context10.prev = _context10.next) {
                                case 0:
                                    _context10.next = 2;
                                    return this.genAsync.line(x1, y1, x2, y2, options);

                                case 2:
                                    d = _context10.sent;

                                    this.draw(d);
                                    return _context10.abrupt('return', d);

                                case 5:
                                case 'end':
                                    return _context10.stop();
                            }
                        }
                    }, _callee10, this);
                }));

                function line(_x50, _x51, _x52, _x53, _x54) {
                    return _ref11.apply(this, arguments);
                }

                return line;
            }()
        }, {
            key: 'rectangle',
            value: function () {
                var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(x, y, width, height, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee11$(_context11) {
                        while (1) {
                            switch (_context11.prev = _context11.next) {
                                case 0:
                                    _context11.next = 2;
                                    return this.genAsync.rectangle(x, y, width, height, options);

                                case 2:
                                    d = _context11.sent;

                                    this.draw(d);
                                    return _context11.abrupt('return', d);

                                case 5:
                                case 'end':
                                    return _context11.stop();
                            }
                        }
                    }, _callee11, this);
                }));

                function rectangle(_x55, _x56, _x57, _x58, _x59) {
                    return _ref12.apply(this, arguments);
                }

                return rectangle;
            }()
        }, {
            key: 'ellipse',
            value: function () {
                var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(x, y, width, height, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee12$(_context12) {
                        while (1) {
                            switch (_context12.prev = _context12.next) {
                                case 0:
                                    _context12.next = 2;
                                    return this.genAsync.ellipse(x, y, width, height, options);

                                case 2:
                                    d = _context12.sent;

                                    this.draw(d);
                                    return _context12.abrupt('return', d);

                                case 5:
                                case 'end':
                                    return _context12.stop();
                            }
                        }
                    }, _callee12, this);
                }));

                function ellipse(_x60, _x61, _x62, _x63, _x64) {
                    return _ref13.apply(this, arguments);
                }

                return ellipse;
            }()
        }, {
            key: 'circle',
            value: function () {
                var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(x, y, diameter, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee13$(_context13) {
                        while (1) {
                            switch (_context13.prev = _context13.next) {
                                case 0:
                                    _context13.next = 2;
                                    return this.genAsync.circle(x, y, diameter, options);

                                case 2:
                                    d = _context13.sent;

                                    this.draw(d);
                                    return _context13.abrupt('return', d);

                                case 5:
                                case 'end':
                                    return _context13.stop();
                            }
                        }
                    }, _callee13, this);
                }));

                function circle(_x65, _x66, _x67, _x68) {
                    return _ref14.apply(this, arguments);
                }

                return circle;
            }()
        }, {
            key: 'linearPath',
            value: function () {
                var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(points, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee14$(_context14) {
                        while (1) {
                            switch (_context14.prev = _context14.next) {
                                case 0:
                                    _context14.next = 2;
                                    return this.genAsync.linearPath(points, options);

                                case 2:
                                    d = _context14.sent;

                                    this.draw(d);
                                    return _context14.abrupt('return', d);

                                case 5:
                                case 'end':
                                    return _context14.stop();
                            }
                        }
                    }, _callee14, this);
                }));

                function linearPath(_x69, _x70) {
                    return _ref15.apply(this, arguments);
                }

                return linearPath;
            }()
        }, {
            key: 'polygon',
            value: function () {
                var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(points, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee15$(_context15) {
                        while (1) {
                            switch (_context15.prev = _context15.next) {
                                case 0:
                                    _context15.next = 2;
                                    return this.genAsync.polygon(points, options);

                                case 2:
                                    d = _context15.sent;

                                    this.draw(d);
                                    return _context15.abrupt('return', d);

                                case 5:
                                case 'end':
                                    return _context15.stop();
                            }
                        }
                    }, _callee15, this);
                }));

                function polygon(_x71, _x72) {
                    return _ref16.apply(this, arguments);
                }

                return polygon;
            }()
        }, {
            key: 'arc',
            value: function () {
                var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(x, y, width, height, start, stop) {
                    var closed = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
                    var options = arguments[7];
                    var d;
                    return _regenerator2.default.wrap(function _callee16$(_context16) {
                        while (1) {
                            switch (_context16.prev = _context16.next) {
                                case 0:
                                    _context16.next = 2;
                                    return this.genAsync.arc(x, y, width, height, start, stop, closed, options);

                                case 2:
                                    d = _context16.sent;

                                    this.draw(d);
                                    return _context16.abrupt('return', d);

                                case 5:
                                case 'end':
                                    return _context16.stop();
                            }
                        }
                    }, _callee16, this);
                }));

                function arc(_x74, _x75, _x76, _x77, _x78, _x79) {
                    return _ref17.apply(this, arguments);
                }

                return arc;
            }()
        }, {
            key: 'curve',
            value: function () {
                var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(points, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee17$(_context17) {
                        while (1) {
                            switch (_context17.prev = _context17.next) {
                                case 0:
                                    _context17.next = 2;
                                    return this.genAsync.curve(points, options);

                                case 2:
                                    d = _context17.sent;

                                    this.draw(d);
                                    return _context17.abrupt('return', d);

                                case 5:
                                case 'end':
                                    return _context17.stop();
                            }
                        }
                    }, _callee17, this);
                }));

                function curve(_x80, _x81) {
                    return _ref18.apply(this, arguments);
                }

                return curve;
            }()
        }, {
            key: 'path',
            value: function () {
                var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(d, options) {
                    var drawing;
                    return _regenerator2.default.wrap(function _callee18$(_context18) {
                        while (1) {
                            switch (_context18.prev = _context18.next) {
                                case 0:
                                    _context18.next = 2;
                                    return this.genAsync.path(d, options);

                                case 2:
                                    drawing = _context18.sent;

                                    this.draw(drawing);
                                    return _context18.abrupt('return', drawing);

                                case 5:
                                case 'end':
                                    return _context18.stop();
                            }
                        }
                    }, _callee18, this);
                }));

                function path(_x82, _x83) {
                    return _ref19.apply(this, arguments);
                }

                return path;
            }()
        }, {
            key: 'generator',
            get: function get() {
                return this.genAsync;
            }
        }]);
        return RoughCanvasAsync;
    }(RoughCanvasBase);

    var hasDocument$1 = typeof document !== 'undefined';

    var RoughSVGBase = function () {
        function RoughSVGBase(svg) {
            (0, _classCallCheck3.default)(this, RoughSVGBase);

            this.svg = svg;
        }

        (0, _createClass3.default)(RoughSVGBase, [{
            key: 'draw',
            value: function draw(drawable) {
                var sets = drawable.sets || [];
                var o = drawable.options || this.getDefaultOptions();
                var doc = this.svg.ownerDocument || hasDocument$1 && document;
                var g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = (0, _getIterator3.default)(sets), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var drawing = _step11.value;

                        var path = null;
                        switch (drawing.type) {
                            case 'path':
                                {
                                    path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                                    path.setAttribute('d', this.opsToPath(drawing));
                                    path.style.stroke = o.stroke;
                                    path.style.strokeWidth = o.strokeWidth + '';
                                    path.style.fill = 'none';
                                    if (o.lineDash && o.lineDash.length > 0) {
                                        path.style.strokeDasharray = o.lineDash.join(' ');
                                    }
                                    break;
                                }
                            case 'fillPath':
                                {
                                    path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                                    path.setAttribute('d', this.opsToPath(drawing));
                                    path.style.stroke = 'none';
                                    path.style.strokeWidth = '0';
                                    path.style.fill = o.fill || null;
                                    break;
                                }
                            case 'fillSketch':
                                {
                                    path = this.fillSketch(doc, drawing, o);
                                    break;
                                }
                            case 'path2Dfill':
                                {
                                    path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                                    path.setAttribute('d', drawing.path || '');
                                    path.style.stroke = 'none';
                                    path.style.strokeWidth = '0';
                                    path.style.fill = o.fill || null;
                                    break;
                                }
                            case 'path2Dpattern':
                                {
                                    if (!this.defs) {
                                        console.error('Cannot render path2Dpattern. No defs/document defined.');
                                    } else {
                                        var size = drawing.size;
                                        var pattern = doc.createElementNS('http://www.w3.org/2000/svg', 'pattern');
                                        var id = 'rough-' + Math.floor(Math.random() * (_maxSafeInteger2.default || 999999));
                                        pattern.setAttribute('id', id);
                                        pattern.setAttribute('x', '0');
                                        pattern.setAttribute('y', '0');
                                        pattern.setAttribute('width', '1');
                                        pattern.setAttribute('height', '1');
                                        pattern.setAttribute('height', '1');
                                        pattern.setAttribute('viewBox', '0 0 ' + Math.round(size[0]) + ' ' + Math.round(size[1]));
                                        pattern.setAttribute('patternUnits', 'objectBoundingBox');
                                        var patternPath = this.fillSketch(doc, drawing, o);
                                        pattern.appendChild(patternPath);
                                        this.defs.appendChild(pattern);
                                        path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                                        path.setAttribute('d', drawing.path || '');
                                        path.style.stroke = 'none';
                                        path.style.strokeWidth = '0';
                                        path.style.fill = 'url(#' + id + ')';
                                    }
                                    break;
                                }
                        }
                        if (path) {
                            g.appendChild(path);
                        }
                    }
                } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }
                    } finally {
                        if (_didIteratorError11) {
                            throw _iteratorError11;
                        }
                    }
                }

                return g;
            }
        }, {
            key: 'fillSketch',
            value: function fillSketch(doc, drawing, o) {
                var fweight = o.fillWeight;
                if (fweight < 0) {
                    fweight = o.strokeWidth / 2;
                }
                var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', this.opsToPath(drawing));
                path.style.stroke = o.fill || null;
                path.style.strokeWidth = fweight + '';
                path.style.fill = 'none';
                return path;
            }
        }, {
            key: 'defs',
            get: function get() {
                var doc = this.svg.ownerDocument || hasDocument$1 && document;
                if (doc) {
                    if (!this._defs) {
                        var dnode = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
                        if (this.svg.firstChild) {
                            this.svg.insertBefore(dnode, this.svg.firstChild);
                        } else {
                            this.svg.appendChild(dnode);
                        }
                        this._defs = dnode;
                    }
                }
                return this._defs || null;
            }
        }], [{
            key: 'createRenderer',
            value: function createRenderer() {
                return new RoughRenderer();
            }
        }]);
        return RoughSVGBase;
    }();

    var RoughSVG = function (_RoughSVGBase) {
        (0, _inherits3.default)(RoughSVG, _RoughSVGBase);

        function RoughSVG(svg, config) {
            (0, _classCallCheck3.default)(this, RoughSVG);

            var _this7 = (0, _possibleConstructorReturn3.default)(this, (RoughSVG.__proto__ || (0, _getPrototypeOf2.default)(RoughSVG)).call(this, svg));

            _this7.gen = new RoughGenerator(config || null, _this7.svg);
            return _this7;
        }

        (0, _createClass3.default)(RoughSVG, [{
            key: 'getDefaultOptions',
            value: function getDefaultOptions() {
                return this.gen.defaultOptions;
            }
        }, {
            key: 'opsToPath',
            value: function opsToPath(drawing) {
                return this.gen.opsToPath(drawing);
            }
        }, {
            key: 'line',
            value: function line(x1, y1, x2, y2, options) {
                var d = this.gen.line(x1, y1, x2, y2, options);
                return this.draw(d);
            }
        }, {
            key: 'rectangle',
            value: function rectangle(x, y, width, height, options) {
                var d = this.gen.rectangle(x, y, width, height, options);
                return this.draw(d);
            }
        }, {
            key: 'ellipse',
            value: function ellipse(x, y, width, height, options) {
                var d = this.gen.ellipse(x, y, width, height, options);
                return this.draw(d);
            }
        }, {
            key: 'circle',
            value: function circle(x, y, diameter, options) {
                var d = this.gen.circle(x, y, diameter, options);
                return this.draw(d);
            }
        }, {
            key: 'linearPath',
            value: function linearPath(points, options) {
                var d = this.gen.linearPath(points, options);
                return this.draw(d);
            }
        }, {
            key: 'polygon',
            value: function polygon(points, options) {
                var d = this.gen.polygon(points, options);
                return this.draw(d);
            }
        }, {
            key: 'arc',
            value: function arc(x, y, width, height, start, stop) {
                var closed = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
                var options = arguments[7];

                var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
                return this.draw(d);
            }
        }, {
            key: 'curve',
            value: function curve(points, options) {
                var d = this.gen.curve(points, options);
                return this.draw(d);
            }
        }, {
            key: 'path',
            value: function path(d, options) {
                var drawing = this.gen.path(d, options);
                return this.draw(drawing);
            }
        }, {
            key: 'generator',
            get: function get() {
                return this.gen;
            }
        }]);
        return RoughSVG;
    }(RoughSVGBase);

    var RoughSVGAsync = function (_RoughSVGBase2) {
        (0, _inherits3.default)(RoughSVGAsync, _RoughSVGBase2);

        function RoughSVGAsync(svg, config) {
            (0, _classCallCheck3.default)(this, RoughSVGAsync);

            var _this8 = (0, _possibleConstructorReturn3.default)(this, (RoughSVGAsync.__proto__ || (0, _getPrototypeOf2.default)(RoughSVGAsync)).call(this, svg));

            _this8.genAsync = new RoughGeneratorAsync(config || null, _this8.svg);
            return _this8;
        }

        (0, _createClass3.default)(RoughSVGAsync, [{
            key: 'getDefaultOptions',
            value: function getDefaultOptions() {
                return this.genAsync.defaultOptions;
            }
        }, {
            key: 'opsToPath',
            value: function opsToPath(drawing) {
                return this.genAsync.opsToPath(drawing);
            }
        }, {
            key: 'line',
            value: function () {
                var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(x1, y1, x2, y2, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee19$(_context19) {
                        while (1) {
                            switch (_context19.prev = _context19.next) {
                                case 0:
                                    _context19.next = 2;
                                    return this.genAsync.line(x1, y1, x2, y2, options);

                                case 2:
                                    d = _context19.sent;
                                    return _context19.abrupt('return', this.draw(d));

                                case 4:
                                case 'end':
                                    return _context19.stop();
                            }
                        }
                    }, _callee19, this);
                }));

                function line(_x85, _x86, _x87, _x88, _x89) {
                    return _ref20.apply(this, arguments);
                }

                return line;
            }()
        }, {
            key: 'rectangle',
            value: function () {
                var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(x, y, width, height, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee20$(_context20) {
                        while (1) {
                            switch (_context20.prev = _context20.next) {
                                case 0:
                                    _context20.next = 2;
                                    return this.genAsync.rectangle(x, y, width, height, options);

                                case 2:
                                    d = _context20.sent;
                                    return _context20.abrupt('return', this.draw(d));

                                case 4:
                                case 'end':
                                    return _context20.stop();
                            }
                        }
                    }, _callee20, this);
                }));

                function rectangle(_x90, _x91, _x92, _x93, _x94) {
                    return _ref21.apply(this, arguments);
                }

                return rectangle;
            }()
        }, {
            key: 'ellipse',
            value: function () {
                var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(x, y, width, height, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee21$(_context21) {
                        while (1) {
                            switch (_context21.prev = _context21.next) {
                                case 0:
                                    _context21.next = 2;
                                    return this.genAsync.ellipse(x, y, width, height, options);

                                case 2:
                                    d = _context21.sent;
                                    return _context21.abrupt('return', this.draw(d));

                                case 4:
                                case 'end':
                                    return _context21.stop();
                            }
                        }
                    }, _callee21, this);
                }));

                function ellipse(_x95, _x96, _x97, _x98, _x99) {
                    return _ref22.apply(this, arguments);
                }

                return ellipse;
            }()
        }, {
            key: 'circle',
            value: function () {
                var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22(x, y, diameter, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee22$(_context22) {
                        while (1) {
                            switch (_context22.prev = _context22.next) {
                                case 0:
                                    _context22.next = 2;
                                    return this.genAsync.circle(x, y, diameter, options);

                                case 2:
                                    d = _context22.sent;
                                    return _context22.abrupt('return', this.draw(d));

                                case 4:
                                case 'end':
                                    return _context22.stop();
                            }
                        }
                    }, _callee22, this);
                }));

                function circle(_x100, _x101, _x102, _x103) {
                    return _ref23.apply(this, arguments);
                }

                return circle;
            }()
        }, {
            key: 'linearPath',
            value: function () {
                var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23(points, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee23$(_context23) {
                        while (1) {
                            switch (_context23.prev = _context23.next) {
                                case 0:
                                    _context23.next = 2;
                                    return this.genAsync.linearPath(points, options);

                                case 2:
                                    d = _context23.sent;
                                    return _context23.abrupt('return', this.draw(d));

                                case 4:
                                case 'end':
                                    return _context23.stop();
                            }
                        }
                    }, _callee23, this);
                }));

                function linearPath(_x104, _x105) {
                    return _ref24.apply(this, arguments);
                }

                return linearPath;
            }()
        }, {
            key: 'polygon',
            value: function () {
                var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(points, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee24$(_context24) {
                        while (1) {
                            switch (_context24.prev = _context24.next) {
                                case 0:
                                    _context24.next = 2;
                                    return this.genAsync.polygon(points, options);

                                case 2:
                                    d = _context24.sent;
                                    return _context24.abrupt('return', this.draw(d));

                                case 4:
                                case 'end':
                                    return _context24.stop();
                            }
                        }
                    }, _callee24, this);
                }));

                function polygon(_x106, _x107) {
                    return _ref25.apply(this, arguments);
                }

                return polygon;
            }()
        }, {
            key: 'arc',
            value: function () {
                var _ref26 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25(x, y, width, height, start, stop) {
                    var closed = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
                    var options = arguments[7];
                    var d;
                    return _regenerator2.default.wrap(function _callee25$(_context25) {
                        while (1) {
                            switch (_context25.prev = _context25.next) {
                                case 0:
                                    _context25.next = 2;
                                    return this.genAsync.arc(x, y, width, height, start, stop, closed, options);

                                case 2:
                                    d = _context25.sent;
                                    return _context25.abrupt('return', this.draw(d));

                                case 4:
                                case 'end':
                                    return _context25.stop();
                            }
                        }
                    }, _callee25, this);
                }));

                function arc(_x109, _x110, _x111, _x112, _x113, _x114) {
                    return _ref26.apply(this, arguments);
                }

                return arc;
            }()
        }, {
            key: 'curve',
            value: function () {
                var _ref27 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26(points, options) {
                    var d;
                    return _regenerator2.default.wrap(function _callee26$(_context26) {
                        while (1) {
                            switch (_context26.prev = _context26.next) {
                                case 0:
                                    _context26.next = 2;
                                    return this.genAsync.curve(points, options);

                                case 2:
                                    d = _context26.sent;
                                    return _context26.abrupt('return', this.draw(d));

                                case 4:
                                case 'end':
                                    return _context26.stop();
                            }
                        }
                    }, _callee26, this);
                }));

                function curve(_x115, _x116) {
                    return _ref27.apply(this, arguments);
                }

                return curve;
            }()
        }, {
            key: 'path',
            value: function () {
                var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27(d, options) {
                    var drawing;
                    return _regenerator2.default.wrap(function _callee27$(_context27) {
                        while (1) {
                            switch (_context27.prev = _context27.next) {
                                case 0:
                                    _context27.next = 2;
                                    return this.genAsync.path(d, options);

                                case 2:
                                    drawing = _context27.sent;
                                    return _context27.abrupt('return', this.draw(drawing));

                                case 4:
                                case 'end':
                                    return _context27.stop();
                            }
                        }
                    }, _callee27, this);
                }));

                function path(_x117, _x118) {
                    return _ref28.apply(this, arguments);
                }

                return path;
            }()
        }, {
            key: 'generator',
            get: function get() {
                return this.genAsync;
            }
        }]);
        return RoughSVGAsync;
    }(RoughSVGBase);

    var rough = {
        canvas: function canvas(_canvas, config) {
            if (config && config.async) {
                return new RoughCanvasAsync(_canvas, config);
            }
            return new RoughCanvas(_canvas, config);
        },
        svg: function svg(_svg, config) {
            if (config && config.async) {
                return new RoughSVGAsync(_svg, config);
            }
            return new RoughSVG(_svg, config);
        },
        createRenderer: function createRenderer() {
            return RoughCanvas.createRenderer();
        },
        generator: function generator(config, surface) {
            if (config && config.async) {
                return new RoughGeneratorAsync(config, surface);
            }
            return new RoughGenerator(config, surface);
        }
    };

    return rough;
});