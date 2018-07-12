"use strict";

var _mutation = _interopRequireDefault(require("../../modules/mutation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('mutation', function () {
  it('should return a valid mutation object', function () {
    var val = (0, _mutation.default)("{ todos { id } }");
    expect(val).toMatchObject({
      query: "{ todos { id } }",
      variables: {}
    });
  });
  it('should return a valid mutation object with variables', function () {
    var val = (0, _mutation.default)("{ todos { id } }", {
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