'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var query = function query(q, vars) {
  return {
    query: q,
    variables: vars || {},
  };
};

var _default = query;
exports.default = _default;
