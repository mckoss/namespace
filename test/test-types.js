namespace.module('org.startpad.types.test', function (exports, require) {
    var ut = require('com.jquery.qunit');
    var utCoverage = require('org.startpad.qunit.coverage');
    var types = require('org.startpad.types');

    ut.module('org.startpad.types');

    var coverage;

    coverage = new utCoverage.Coverage('org.startpad.types');

    ut.test("version", function () {
        var version = types.VERSION.split('.');
        ut.equal(version.length, 3, "VERSION has 3 parts");
        ut.ok(version[0] == 0 && version[1] == 2, "tests for version 0.2");
        ut.equal();
    });

    ut.test("copyArray", function() {
        var a = [1, 2, 3];

        function tester() {
            return types.copyArray(arguments);
        }

        ut.deepEqual(types.copyArray(a), a, "copy simple array");
        var a2 = types.copyArray(tester(1, 2, 3));
        ut.deepEqual(a2, a, "copy arguments");
        ut.equal(types.typeOf(a2), 'array');
    });

    ut.test("isType", function() {
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
            [/x/, 'regexp']
        ];
        for (var i = 0; i < tests.length; i++) {
            var t = tests[i];
            ut.equal(types.typeOf(t[0]), t[1]);
            ut.ok(types.isType(t[0], t[1]), "type of " + t[0]);
        }
    });

    ut.test("extend", function () {
        var tests = [
            [{}, {a: 1}, {a: 1}],
            [{a: 1}, {a: 2}, {a: 2}],
            [{a: undefined}, {a: 2}, {a: 2}],
            [{}, {toString: 1}, {toString: 1}]
        ];
        for (var i = 0; i < tests.length; i++) {
            var t = tests[i];
            ut.deepEqual(types.extend(t[0], t[1]), t[2]);
        }
    });

    ut.test("getFunctionName", function() {
        function foo() {}
        var x = function () {};

        ut.equal(types.getFunctionName(1), undefined, "not a function");
        ut.equal(types.getFunctionName(foo), 'foo', "named function");
        ut.equal(types.getFunctionName(x), '', "anonymous function");
    });

    ut.test("isArguments", function () {
        ut.ok(types.isArguments(arguments), "arguments verified");
        ut.ok(!types.isArguments([]), "arrays are not arguments");
    });

    ut.test("isArray", function () {
        ut.ok(types.isArray([]), "array verified");
        ut.ok(!types.isArray(arguments), "arguments are not arrays");
        var arrayLike = {};
        arrayLike[0] = 2;
        arrayLike.length = 1;
        ut.ok(!types.isArray(arrayLike), "objects are not arrays");
    });

    ut.test("project", function() {
        var tests = [
            [{a: 1, b: 2}, ['a'], {a: 1}],
            [{a: 1, b: 2}, ['c'], {}],
            [undefined, ['a'], {}],
            [{a: 1, b: 2}, [], {}]
        ];
        for (var i = 0; i < tests.length; i++) {
            var t = tests[i];
            ut.deepEqual(types.project(t[0], t[1]), t[2]);
        }
    });

    ut.test("keys", function () {
        var tests = [
            [{}, []],
            [{a: 1}, ['a']],
            [{_a: 1}, ['_a']]
        ];
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            ut.deepEqual(types.keys(test[0]), test[1], JSON.stringify(test[0]));
        }
    });

    ut.test("patch", function() {
        ut.strictEqual(types.patch(), types);
    });

    coverage.testCoverage();

});
