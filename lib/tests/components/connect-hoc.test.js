'use strict';

var _react = _interopRequireDefault(require('react'));

var _connectHoc = _interopRequireDefault(
  require('../../components/connect-hoc')
);

var _reactTestRenderer = _interopRequireDefault(require('react-test-renderer'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

describe('Connect HOC', function() {
  it('should wrap its component argument with connect', function() {
    var Comp = function Comp(args) {
      return _react.default.createElement('div', args);
    };

    var Wrapped = (0, _connectHoc.default)()(Comp); // @ts-ignore

    var component = _reactTestRenderer.default.create(
      // @ts-ignore
      _react.default.createElement(Wrapped, null)
    );

    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should wrap its component argument with connect with functional options', function() {
    var Comp = function Comp(args) {
      return _react.default.createElement('div', args);
    };

    var Wrapped = (0, _connectHoc.default)(function(props) {
      return {
        cache: props.cache,
      };
    })(Comp); // @ts-ignore

    var component = _reactTestRenderer.default.create(
      // @ts-ignore
      _react.default.createElement(Wrapped, {
        cache: false,
      })
    );

    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should wrap its component argument with connect and hoist the statics', function() {
    var Comp =
      /*#__PURE__*/
      (function(_React$Component) {
        _inheritsLoose(Comp, _React$Component);

        function Comp() {
          return _React$Component.apply(this, arguments) || this;
        }

        var _proto = Comp.prototype;

        _proto.render = function render() {
          return _react.default.createElement('div', this.props);
        };

        return Comp;
      })(_react.default.Component);

    Comp.foo = {
      bar: 'foobar',
    };
    var Wrapped = (0, _connectHoc.default)()(Comp); // @ts-ignore

    var component = _reactTestRenderer.default.create(
      // @ts-ignore
      _react.default.createElement(Wrapped, null)
    );

    expect(Wrapped).toHaveProperty('foo', {
      bar: 'foobar',
    });
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
