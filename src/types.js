namespace.lookup('org.startpad.types').define(function (exports, require) {
    exports.extend({
        'VERSION': '0.1.0',
        'isArguments': function (obj) { return isType('arguments'); },
        'isArray': function (obj) { return isType('array'); },
        'copyArray': copyArray,
        'isType': isType,
        'typeOf': typeOf
    });

    // Can be used to copy Arrays and Arguments into an Array
    function copyArray(arg) {
        return Array.prototype.slice.call(arg, 0);
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
});
