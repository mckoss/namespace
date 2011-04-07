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
        'isArguments': function (obj) { return isType('arguments'); },
        'isArray': function (obj) { return isType('array'); },
        'isType': isType,
        'typeOf': typeOf
    });

    function toString(obj) {
        return Object.prototype.toString.call(obj);
    }

    function isType(value, type) {
        return typeOf(value) == type;
    }

    // Return one of:
    // number, string, boolean, object, array, date, error, function, arguments, undefined, null
    // regexp
    function typeOf(value) {
        if (value === undefined) {
            return 'undefined';
        }
        if (value === null) {
            return 'null';
        }
        var type = toString(value).match(/\[object (.*)\]/)[1].toLowerCase();
        if (type == 'global') {
            return typeof(value);
        }
        return type;
    }
});
namespace.lookup('org.startpad.meta').define(function (exports, require) {
    var types = require('org.startpad.types');

    exports.extend({
        'VERSION': '0.1.0',
        'extend': extend,
        'methods': methods,
        'patchFunction': patchFunction,
        'decorate': decorate
    });

    // Monkey-patch the Function object if that is your syntactic preference
    function patchFunction() {
        methods(Function, {
            'methods': function (obj) { methods(this, obj); },
            'bind': function (self) { return fnMethod(this, self); },
            'curry': function () { return curry(this, arguments); },
            'decorate': function (decorator) { return decorate(this, decorator); }
        });
    }

    var enumBug = !{toString: true}.propertyIsEnumerable('toString');
    var internalNames = ['toString', 'toLocaleString', 'valueOf',
                         'constructor', 'isPrototypeOf'];

    // Copy methods to a Constructor Function's prototype
    function methods(ctor, obj) {
        extend(ctor.prototype, obj);
    }

    // Function wrapper for binding 'this'
    // Similar to Protoype.bind - but does no argument mangling
    function bind(fn, self) {
        return function() {
            return fn.apply(self, arguments);
        };
    }

    // Function wrapper for appending parameters (currying)
    // Similar to Prototype.curry
    function curry(fn) {
        var presets;

        // Handle the monkey-patched and in-line forms of curry
        if (arguments.length == 2 && types.isArguments(arguments[1])) {
            presets = copyArray(arguments[2]);
        } else {
            presets = copyArray(arguments);
        }

        return function () {
            return fn.apply(this, presets.concat(arguments));
        };
    }

    // Wrap the fn function with a generic decorator like:
    //
    // function decorator(fn, arguments, fnWrapper) {
    //   if (fn == undefined) { ... init ...; return;}
    //   ...
    //   result = fn.apply(this, arguments);
    //   ...
    //   return result;
    // }
    //
    // The fnWrapper function is a created for each call
    // of the decorate function.  In addition to wrapping
    // the decorated function, it can be used to save state
    // information between calls by adding properties to it.
    function decorate(fn, decorator) {
        var fnWrapper = function() {
            return decorator.call(this, fn, arguments, fnWrapper);
        };
        // Init call - pass undefined fn - but available in this
        // if needed.
        decorator.call(this, undefined, arguments, fnWrapper);
        return fnWrapper;
    }

    function extend(dest, args) {
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

});
