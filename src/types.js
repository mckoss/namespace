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
