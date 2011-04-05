/* Namespace.js - modular namespaces in JavaScript

   by Mike Koss - placed in the public domain, March 18, 2011

   version 2.2.0 - April 4, 2011 - version checking and add
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
