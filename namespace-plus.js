/* Namespace.js - modular namespaces in JavaScript

   by Mike Koss - placed in the public domain, March 18, 2011

   version 2.2.0 - April 4, 2011 - version checking and require support
*/

(function(global) {
    var globalNamespace = global['namespace'];
    var Namespace;
    var VERSION = '2.2.0';

    function numeric(s) {
        if (!s) {
            return 0;
        }
        var a = s.split('.');
        return 10000 * parseInt(a[0]) + 100 * parseInt(a[1]) + parseInt(a[2]);
    }

    if (globalNamespace) {
        if (numeric(VERSION) <= numeric(globalNamespace['VERSION'])) {
            return;
        }
        Namespace = globalNamespace.constructor;
    } else {
        Namespace = function () {};
        global['namespace'] = globalNamespace = new Namespace();
    }
    globalNamespace['VERSION'] = VERSION;

    function lookup(path) {
        path = path.replace(/-/g, '_');
        var parts = path.split('.');
        var ns = globalNamespace;
        for (var i = 0; i < parts.length; i++) {
            if (ns[parts[i]] === undefined) {
                ns[parts[i]] = new Namespace();
            }
            ns = ns[parts[i]];
        }
        return ns;
    }

    var proto = Namespace.prototype;

    proto['define'] = function(closure) {
        closure(this, lookup);
        return this;
    };

    proto['extend'] = function(exports) {
        for (var sym in exports) {
            this[sym] = exports[sym];
        }
    };

    globalNamespace['lookup'] = lookup;
}(this));
namespace.lookup('org.startpad.types').define(function (exports, require) {
    exports.extend({
        'VERSION': '0.1.0',
        'isArguments': function (value) { return isType(value, 'arguments'); },
        'isArray': function (value) { return isType(value, 'array'); },
        'copyArray': copyArray,
        'isType': isType,
        'typeOf': typeOf,
        'extend': extend,
        'project': project,
        'getFunctionName': getFunctionName
    });

    // Can be used to copy Arrays and Arguments into an Array
    function copyArray(arg) {
        return Array.prototype.slice.call(arg);
    }

    var baseTypes = ['number', 'string', 'boolean', 'array', 'function', 'date',
                     'regexp', 'arguments', 'undefined', 'null'];

    function internalType(value) {
        return Object.prototype.toString.call(value).match(/\[object (.*)\]/)[1].toLowerCase();
    }

    function isType(value, type) {
        return typeOf(value) == type;
    }

    // Return one of the baseTypes as a string
    function typeOf(value) {
        if (value === undefined) {
            return 'undefined';
        }
        if (value === null) {
            return 'null';
        }
        var type = internalType(value);
        if (baseTypes.indexOf(type) == -1) {
            type = typeof(value);
        }
        return type;
    }

    // IE 8 has bug that does not enumerates even own properties that have
    // these internal names.
    var enumBug = !{toString: true}.propertyIsEnumerable('toString');
    var internalNames = ['toString', 'toLocaleString', 'valueOf',
                         'constructor', 'isPrototypeOf'];

    // Copy the (own) properties of all the arguments into the first one (in order).
    function extend(dest) {
        var i, j;
        var source;
        var prop;

        if (dest === undefined) {
            dest = {};
        }
        for (i = 1; i < arguments.length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    dest[prop] = source[prop];
                }
            }
            if (!enumBug) {
                continue;
            }
            for (j = 0; j < internalNames.length; j++) {
                prop = internalNames[j];
                if (source.hasOwnProperty(prop)) {
                    dest[prop] = source[prop];
                }
            }
        }
        return dest;
    }

    // Return new object with just the listed properties "projected"
    // into the new object.  Ignore undefined properties.
    function project(obj, props) {
        var result = {};
        for (var i = 0; i < props.length; i++) {
            var name = props[i];
            if (obj && obj.hasOwnProperty(name)) {
                result[name] = obj[name];
            }
        }
        return result;
    }

    function getFunctionName(fn) {
        if (typeof fn != 'function') {
            return undefined;
        }
        var result = fn.toString().match(/function\s*(\S+)\s*\(/);
        if (!result) {
            return '';
        }
        return result[1];
    }

});
namespace.lookup('org.startpad.funcs').define(function (exports, require) {
    var types = require('org.startpad.types');

    exports.extend({
        'VERSION': '0.1.0',
        'methods': methods,
        'bind': bind,
        'decorate': decorate,
        'monkeyPatch': monkeyPatch
    });

    // Monkey-patch the Function object if that is your syntactic preference
    // REVIEW: Allow unpatch?
    function monkeyPatch() {
        methods(Function, {
            'methods': function (obj) { methods(this, obj); },
            'bind': function (self) {
                return bind(this, self, arguments);
            },
            'curry': function () { return bind(this, undefined, arguments); },
            'decorate': function (decorator) { return decorate(this, decorator); }
        });
    }

    // Copy methods to a Constructor Function's prototype
    function methods(ctor, obj) {
        types.extend(ctor.prototype, obj);
    }

    // Bind 'this' and/or arguments and return new function.
    function bind(fn, self) {
        var presets;

        // Handle the monkey-patched and in-line forms of curry
        if (arguments.length == 3 && types.isArguments(arguments[2])) {
            presets = Array.prototype.slice.call(arguments[2], 1);
        } else {
            presets = Array.prototype.slice.call(arguments, 2);
        }

        function merge(a1, a2) {
            var merged = types.copyArray(a1);
            a2 = types.copyArray(a2);
            for (var i = 0; i < merged.length; i++) {
                if (merged[i] === undefined) {
                    merged[i] = a2.shift();
                }
            }
            return merged.concat(a2);
        }

        return function curried() {
            return fn.apply(self || this, merge(presets, arguments));
        };
    }

    // Wrap the fn function with a generic decorator like:
    //
    // function decorator(fn, arguments, wrapper) {
    //   if (fn == undefined) { ... init ...; return;}
    //   ...
    //   result = fn.apply(this, arguments);
    //   ...
    //   return result;
    // }
    //
    // The decorated function is created for each call
    // of the decorate function.  In addition to wrapping
    // the decorated function, it can be used to save state
    // information between calls by adding properties to it.
    function decorate(fn, decorator) {
        function decorated() {
            return decorator.call(this, fn, arguments, decorated);
        }
        // Init call - pass undefined fn - but available in this
        // if needed.
        decorator.call(fn, undefined, arguments, decorated);
        return decorated;
    }

});
