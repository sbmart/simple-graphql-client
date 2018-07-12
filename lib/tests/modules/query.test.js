"use strict";

var _query = _interopRequireDefault(require("../../modules/query"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('query', function () {
  it('should return a valid query object', function () {
    var val = (0, _query.default)("{ todos { id } }");
    expect(val).toMatchObject({
      query: "{ todos { id } }",
      variables: {}
    });
  });
  it('should return a valid query object with variables', function () {
    var val = (0, _query.default)("{ todos { id } }", {
      test: 5
    });
    expect(val).toMatchObject({
      query: "{ todos { id } }",
      variables: {
        test: 5
      }
    });
  });
});