/* Namespace.js - modular namespaces in javascript

   by Mike Koss - placed in the public domain, March 18, 2011
*/

this['namespace'] = (function() {
    var globalNamespace;

    if (this['namespace']) {
        return this['namespace'];
    }

    /** @constructor */
    function Namespace() {}

    Namespace.prototype['define'] = function(closure) {
        closure(this);
        return this;
    };

    Namespace.prototype['export'] = function(exports) {
        for (var sym in exports) {
            this[sym] = exports[sym];
        }
    };

    globalNamespace = new Namespace();
    globalNamespace['VERSION'] = '2.1.2';

    globalNamespace['lookup'] = function(path) {
        path = path.replace(/-/g, '_');
        var parts = path.split('.');
        var ns = globalNamespace;
        for (var i = 0; i < parts.length; i++) {
            if (ns[parts[i]] === undefined) {
                ns = new Namespace();
            }
            else {
                ns = ns[parts[i]];
            }
        }
        return ns;
    };

    return globalNamespace;
}());
