import Client, { defaultCache } from "../../modules/client";
describe('Client', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('should throw without options provided', function () {
    expect(function () {
      new Client();
    }).toThrowError('Please provide configuration object');
  });
  it('should throw without a url provided', function () {
    expect(function () {
      // @ts-ignore
      new Client({});
    }).toThrowError('Please provide a URL for your GraphQL API');
  });
  it('should return a client instance', function () {
    var client = new Client({
      url: 'test'
    });
    expect(client.url).toMatch('test');
  });
  it('should set fetchOptions', function () {
    var client = new Client({
      fetchOptions: {
        test: 5
      },
      url: 'test'
    });
    expect(client.fetchOptions).toMatchObject({
      test: 5
    });
  });
  it('should set fetchOptions to an object if not provided', function () {
    var client = new Client({
      url: 'test'
    });
    expect(client.fetchOptions).toMatchObject({});
  });
  it('should set intialCache if provided', function () {
    var client = new Client({
      url: 'test',
      initialCache: {
        test: 5
      }
    });
    expect(client.store).toMatchObject({
      test: 5
    });
  });
  it('should set cache if provided', function () {
    var myCache = defaultCache({});
    var client = new Client({
      cache: myCache,
      url: 'test'
    });
    expect(client.cache).toMatchObject(myCache);
  });
  describe('cache', function () {
    it('should provide a valid cache by default', function (done) {
      var store = {
        test: 5
      };
      var myCache = defaultCache(store);
      var client = new Client({
        cache: myCache,
        url: 'test'
      });
      expect(client.cache.invalidate).toBeTruthy();
      expect(client.cache.invalidateAll).toBeTruthy();
      expect(client.cache.read).toBeTruthy();
      expect(client.cache.update).toBeTruthy();
      expect(client.cache.write).toBeTruthy();
      Promise.all([client.cache.invalidateAll(), client.cache.read('test'), client.cache.write('test', 5), client.cache.read('test'), client.cache.update(function (acc, key) {
        if (key === 'test') {
          acc[key] = 6;
        }
      }), client.cache.read('test'), client.cache.invalidate('test'), client.cache.read('test')]).then(function (d) {
        expect(d).toMatchObject([undefined, null, 'test', 5, undefined, 6, 'test', null]);
        done();
      });
    });
  });
  describe('updateSubscribers', function () {
    var client;
    beforeAll(function () {
      client = new Client({
        url: 'test'
      });
    });
    it('should call all registered subscribers with typenames and changes', function () {
      var spy = jest.fn();
      client.subscribe(spy);
      var typenames = ['a', 'b'];
      var changes = {
        a: 5
      };
      client.updateSubscribers(typenames, changes);
      expect(spy).toBeCalledWith(typenames, changes);
    });
  });
  describe('refreshAllFromCache', function () {
    var client;
    beforeAll(function () {
      client = new Client({
        url: 'test'
      });
    });
    it('should call all registered subscribers with the last argument of true', function () {
      var spy = jest.fn();
      client.subscribe(spy);
      client.refreshAllFromCache();
      expect(spy).toBeCalledWith(null, null, true);
    });
  });
  describe('subscribe', function () {
    var client;
    beforeAll(function () {
      client = new Client({
        url: 'test'
      });
    });
    it('should return a unique id', function () {
      var callback = function callback() {};

      var id = client.subscribe(callback);
      expect(id).not.toBeNull();
    });
    it('should add function arguments to the internal subscriptions array', function () {
      var callback = function callback() {};

      var id = client.subscribe(callback);
      expect(client.subscriptions[id]).toBe(callback);
    });
  });
  describe('unsubscribe', function () {
    var client;
    beforeAll(function () {
      client = new Client({
        url: 'test'
      });
    });
    it('should remove from subscriptions by id', function () {
      var callback = function callback() {};

      var id = client.subscribe(callback);
      client.unsubscribe(id);
      expect(client.subscriptions[id]).toBeUndefined();
    });
  });
  describe('executeQuery', function () {
    var client;
    it('should return data if there is data', function (done) {
      client = new Client({
        url: 'http://localhost:3000/graphql'
      });
      global.fetch.mockReturnValue(Promise.resolve({
        status: 200,
        json: function json() {
          return {
            data: [{
              id: 5
            }]
          };
        }
      }));
      client.executeQuery({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).then(function (result) {
        expect(result).toMatchObject({
          data: [{
            id: 5
          }],
          typeNames: []
        });
        done();
      });
    });
    it('should return data from the cache if it is present', function (done) {
      global.fetch.mockReturnValue(Promise.resolve({
        status: 200,
        json: function json() {
          return {
            data: [{
              id: 12345
            }]
          };
        }
      }));
      client.executeQuery({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).then(function (data) {
        expect(data).toMatchObject({
          data: [{
            id: 5
          }],
          typeNames: []
        });
        done();
      });
    });
    it('should include fetchOptions', function (done) {
      client = new Client({
        url: 'http://localhost:3000/graphql',
        fetchOptions: {
          test: 5
        }
      });
      global.fetch.mockReturnValue(Promise.resolve({
        status: 200,
        json: function json() {
          return {
            data: [{
              id: 5
            }]
          };
        }
      }));
      client.executeQuery({
        query: ""
      }).then(function () {
        var body = JSON.stringify({
          query: ""
        });
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/graphql', {
          body: body,
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          test: 5
        });
        done();
      });
    });
    it('should return "No Data" if data is not present', function (done) {
      client = new Client({
        url: 'http://localhost:3000/graphql'
      });
      global.fetch.mockReturnValue(Promise.resolve({
        status: 200,
        json: function json() {
          return {
            test: 5
          };
        }
      }));
      client.executeQuery({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).catch(function (e) {
        expect(e).toMatchObject({
          message: 'No data'
        });
        done();
      });
    });
    it('should return an error if fetch throws', function (done) {
      client = new Client({
        url: 'http://localhost:3000/graphql'
      });
      global.fetch.mockReturnValue(Promise.reject(new Error('Nooooo')));
      client.executeQuery({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).catch(function (e) {
        expect(e).toMatchObject(new Error('Nooooo'));
        done();
      });
    });
  });
  describe('executeMutation', function () {
    var client;
    it('should return specified data if present', function (done) {
      client = new Client({
        url: 'http://localhost:3000/graphql'
      });
      global.fetch.mockReturnValue(Promise.resolve({
        status: 200,
        json: function json() {
          return {
            data: {
              test: 5
            }
          };
        }
      }));
      client.executeMutation({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).then(function (data) {
        expect(data).toMatchObject({
          test: 5
        });
        done();
      });
    });
    it('should return "No Data" if data is not present', function (done) {
      client = new Client({
        url: 'http://localhost:3000/graphql'
      });
      global.fetch.mockReturnValue(Promise.resolve({
        status: 200,
        json: function json() {
          return {
            test: 5
          };
        }
      }));
      client.executeMutation({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).catch(function (e) {
        expect(e).toMatchObject({
          message: 'No data'
        });
        done();
      });
    });
    it('should return an error if fetch throws', function (done) {
      client = new Client({
        url: 'http://localhost:3000/graphql'
      });
      global.fetch.mockReturnValue(Promise.reject(new Error('Noooo')));
      client.executeMutation({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).catch(function (e) {
        expect(e).toMatchObject(new Error('Noooo'));
        done();
      });
    });
    it('should return an error with attached response if fetch throws an HTTP error', function () {
      client = new Client({
        url: 'http://localhost:3000/graphql'
      });
      global.fetch.mockReturnValue(Promise.resolve({
        status: 401,
        statusText: "I'm afraid I can't let you do that, Dave"
      }));
      return client.executeMutation({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).catch(function (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('response.statusText', "I'm afraid I can't let you do that, Dave");
        expect(e).toHaveProperty('response.status', 401);
      });
    });
    it('should update subscribers', function (done) {
      client = new Client({
        url: 'http://localhost:3000/graphql'
      });
      global.fetch.mockReturnValue(Promise.resolve({
        status: 200,
        json: function json() {
          return {
            data: {
              test: 5
            }
          };
        }
      }));
      var spy = jest.spyOn(client, 'updateSubscribers');
      client.executeMutation({
        query: "{\n          todos {\n            id\n            name\n          }\n        }"
      }).then(function () {
        expect(spy).toHaveBeenCalledWith([], {
          data: {
            test: 5
          }
        });
        done();
      });
    });
  });
});