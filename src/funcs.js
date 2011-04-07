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
    function monkeyPatch() {
        methods(Function, {
            'methods': function (obj) { methods(this, obj); },
            'bind': function (self) {
                Array.prototype.shift.call(arguments);
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
            presets = types.copyArray(arguments[2]);
        } else {
            presets = types.copyArray(arguments).slice(2);
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

});
