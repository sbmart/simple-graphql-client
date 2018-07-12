function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

import { Component } from 'react';
import { hashString } from '../modules/hash';
import { formatTypeNames } from '../modules/typenames';

var UrqlClient =
  /*#__PURE__*/
  (function(_Component) {
    _inheritsLoose(UrqlClient, _Component);

    function UrqlClient() {
      var _this;

      for (
        var _len = arguments.length, _args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        _args[_key] = arguments[_key];
      }

      _this = _Component.call.apply(_Component, [this].concat(_args)) || this;
      _this.state = {
        data: null,
        error: null,
        fetching: false,
        loaded: false,
      };
      _this.query = null;
      _this.mutations = {};
      _this.typeNames = [];
      _this.subscriptionID = null;

      _this.invalidate = function(queryObject) {
        var cache = _this.props.client.cache;

        if (queryObject) {
          var stringified = JSON.stringify(formatTypeNames(queryObject));
          var hash = hashString(stringified);
          return cache.invalidate(hash);
        } else {
          return Array.isArray(_this.props.query)
            ? Promise.all(
                _this.props.query.map(function(q) {
                  return cache.invalidate(hashString(JSON.stringify(q)));
                })
              )
            : cache.invalidate(hashString(JSON.stringify(_this.query)));
        }
      };

      _this.invalidateAll = function() {
        return _this.props.client.cache.invalidateAll();
      };

      _this.read = function(query) {
        var formatted = formatTypeNames(query);
        var stringified = JSON.stringify(formatted);
        var hash = hashString(stringified);
        return _this.props.client.cache.read(hash);
      };

      _this.updateCache = function(callback) {
        return _this.props.client.cache.update(callback);
      };

      _this.formatProps = function(props) {
        // If query exists
        if (props.query) {
          // Loop through and add typenames
          _this.query = Array.isArray(props.query)
            ? props.query.map(formatTypeNames)
            : formatTypeNames(props.query); // Subscribe to change listener

          _this.subscriptionID = props.client.subscribe(_this.update); // Fetch initial data

          _this.fetch(undefined, true);
        } // If mutation exists and has keys

        if (props.mutation) {
          _this.mutations = {}; // Loop through and add typenames

          Object.keys(props.mutation).forEach(function(key) {
            _this.mutations[key] = formatTypeNames(props.mutation[key]);
          }); // bind to mutate

          Object.keys(_this.mutations).forEach(function(m) {
            var query = _this.mutations[m].query;

            _this.mutations[m] = function(variables) {
              return _this.mutate({
                query: query,
                variables: _extends(
                  {},
                  _this.mutations[m].variables,
                  variables
                ),
              });
            };

            if (!_this.props.query) {
              _this.forceUpdate();
            }
          });
        }
      };

      _this.update = function(changedTypes, response, refresh) {
        if (refresh === true) {
          _this.fetch();
        }

        var invalidated = false;

        if (_this.props.shouldInvalidate) {
          invalidated = _this.props.shouldInvalidate(
            changedTypes,
            _this.typeNames,
            response,
            _this.state.data
          );
        } else if (_this.props.typeInvalidation !== false) {
          // Check connection typenames, derived from query, for presence of mutated typenames
          _this.typeNames.forEach(function(typeName) {
            if (changedTypes.indexOf(typeName) !== -1) {
              invalidated = true;
            }
          });
        } // If it has any of the type names that changed

        if (invalidated) {
          // Refetch the data from the server
          _this.fetch({
            skipCache: true,
          });
        }
      };

      _this.refreshAllFromCache = function() {
        return _this.props.client.refreshAllFromCache();
      };

      _this.fetch = function(opts, initial) {
        if (opts === void 0) {
          opts = {
            skipCache: false,
          };
        }

        var client = _this.props.client;
        var _opts = opts,
          skipCache = _opts.skipCache;

        if (_this.props.cache === false) {
          skipCache = true;
        } // If query is not an array

        if (!Array.isArray(_this.query)) {
          // Start loading state
          _this.setState({
            error: null,
            fetching: true,
          }); // Fetch the query

          client
            .executeQuery(_this.query, skipCache)
            .then(function(result) {
              // Store the typenames
              if (result.typeNames) {
                _this.typeNames = result.typeNames;
              } // Update data

              _this.setState({
                data: result.data,
                fetching: false,
                loaded: initial ? true : _this.state.loaded,
              });
            })
            .catch(function(e) {
              _this.setState({
                error: e,
                fetching: false,
              });
            });
        } else {
          // Start fetching state
          _this.setState({
            error: null,
            fetching: true,
          }); // Iterate over and fetch queries

          var partialData = [];
          return Promise.all(
            _this.query.map(function(query) {
              return client
                .executeQuery(query, skipCache)
                .then(function(result) {
                  if (result.typeNames) {
                    // Add and dedupe typenames
                    _this.typeNames = _this.typeNames
                      .concat(result.typeNames)
                      .filter(function(v, i, a) {
                        return a.indexOf(v) === i;
                      });
                  }

                  partialData.push(result.data);
                  return result.data;
                });
            })
          )
            .then(function(results) {
              _this.setState({
                data: results,
                fetching: false,
                loaded: true,
              });
            })
            .catch(function(e) {
              _this.setState({
                data: partialData,
                error: e,
                fetching: false,
              });
            });
        }
      };

      _this.mutate = function(mutation) {
        var client = _this.props.client; // Set fetching state

        _this.setState({
          error: null,
          fetching: true,
        });

        return new Promise(function(resolve, reject) {
          // Execute mutation
          client
            .executeMutation(mutation)
            .then(function() {
              for (
                var _len2 = arguments.length,
                  args = new Array(_len2),
                  _key2 = 0;
                _key2 < _len2;
                _key2++
              ) {
                args[_key2] = arguments[_key2];
              }

              _this.setState(
                {
                  fetching: false,
                },
                function() {
                  resolve.apply(void 0, args);
                }
              );
            })
            .catch(function(e) {
              _this.setState(
                {
                  error: e,
                  fetching: false,
                },
                function() {
                  reject(e);
                }
              );
            });
        });
      };

      return _this;
    }

    var _proto = UrqlClient.prototype;

    // Change subscription ID
    _proto.componentDidMount = function componentDidMount() {
      this.formatProps(this.props);
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      var nextProps = this.props;

      if (
        prevProps.query !== nextProps.query ||
        prevProps.mutation !== nextProps.mutation
      ) {
        this.formatProps(nextProps);
      }
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      // Unsub from change listener
      this.props.client.unsubscribe(this.subscriptionID);
    };

    _proto.render = function render() {
      var cache = {
        invalidate: this.invalidate,
        invalidateAll: this.invalidateAll,
        read: this.read,
        update: this.updateCache,
      };
      return typeof this.props.children === 'function'
        ? this.props.children(
            _extends({}, this.state, this.mutations, {
              cache: cache,
              client: this.props.client,
              refetch: this.fetch,
              refreshAllFromCache: this.refreshAllFromCache,
            })
          )
        : null;
    };

    return UrqlClient;
  })(Component);

UrqlClient.defaultProps = {
  cache: true,
  typeInvalidation: true,
};
export { UrqlClient as default };
