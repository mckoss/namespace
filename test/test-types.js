/*globals test, ok, equal */
namespace.lookup('org.startpad.types.test').define(function (exports, require) {
    var types = require('org.startpad.types');

    module('types');

    test("version", function () {
        var version = types.VERSION.split('.');
        equal(version.length, 3, "VERSION has 3 parts");
        ok(version[0] == 0 && version[1] == 1, "tests for version 0.1");
        equal();
    });

    test("isType", function() {
        var tests = [
            ['', 'string'],
            [1, 'number'],
            [1.1, 'number'],
            [Infinity, 'number'],
            [false, 'boolean'],
            [function() {}, 'function'],
            [Number(1), 'number'],
            [String('hi'), 'string'],
            [null, 'null'],
            [undefined, 'undefined'],
            [{}, 'object'],
            [[], 'array'],
            [new Date(), 'date'],
            [arguments, 'arguments'],
            [/x/, 'regexp'],
            [window, 'object']
        ];
        for (var i = 0; i < tests.length; i++) {
            var t = tests[i];
            equal(types.typeOf(t[0]), t[1]);
            ok(types.isType(t[0], t[1]), "type of " + t[0]);
        }
    });

});