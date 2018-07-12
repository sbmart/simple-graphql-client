import mutation from "../../modules/mutation";
describe('mutation', function () {
  it('should return a valid mutation object', function () {
    var val = mutation("{ todos { id } }");
    expect(val).toMatchObject({
      query: "{ todos { id } }",
      variables: {}
    });
  });
  it('should return a valid mutation object with variables', function () {
    var val = mutation("{ todos { id } }", {
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