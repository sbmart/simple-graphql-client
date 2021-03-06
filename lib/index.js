'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
var _exportNames = {
  Client: true,
  Provider: true,
  Connect: true,
  ConnectHOC: true,
  query: true,
  mutation: true,
};
Object.defineProperty(exports, 'Client', {
  enumerable: true,
  get: function get() {
    return _client.default;
  },
});
Object.defineProperty(exports, 'Provider', {
  enumerable: true,
  get: function get() {
    return _provider.default;
  },
});
Object.defineProperty(exports, 'Connect', {
  enumerable: true,
  get: function get() {
    return _connect.default;
  },
});
Object.defineProperty(exports, 'ConnectHOC', {
  enumerable: true,
  get: function get() {
    return _connectHoc.default;
  },
});
Object.defineProperty(exports, 'query', {
  enumerable: true,
  get: function get() {
    return _query.default;
  },
});
Object.defineProperty(exports, 'mutation', {
  enumerable: true,
  get: function get() {
    return _mutation.default;
  },
});

var _client = _interopRequireDefault(require('./modules/client'));

Object.keys(_client).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _client[key];
    },
  });
});

var _provider = _interopRequireDefault(require('./components/provider'));

Object.keys(_provider).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _provider[key];
    },
  });
});

var _connect = _interopRequireDefault(require('./components/connect'));

Object.keys(_connect).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _connect[key];
    },
  });
});

var _connectHoc = _interopRequireDefault(require('./components/connect-hoc'));

Object.keys(_connectHoc).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _connectHoc[key];
    },
  });
});

var _query = _interopRequireDefault(require('./modules/query'));

var _mutation = _interopRequireDefault(require('./modules/mutation'));

var _index = require('./interfaces/index');

Object.keys(_index).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _index[key];
    },
  });
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
