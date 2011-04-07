namespace.lookup('org.startpad.funcs.test').define(function (exports, require) {
    var types = require('org.startpad.types');
    var funcs = require('org.startpad.funcs');

    module('funcs');

    test("version", function () {
        var version = funcs.VERSION.split('.');
        equal(version.length, 3, "VERSION has 3 parts");
        ok(version[0] == 0 && version[1] == 1, "tests for version 0.1");
    });

    test("monkeyPatch", function () {
        equal(Function.methods, undefined, "methods not patched by default");
        funcs.monkeyPatch();
        equal(types.typeOf(Function.methods), 'function', "monkey patched");
    });

    test("methods", function () {
        function Foo() {
        }

        Foo.methods({
            t1: function () { return 1; }
        });

        var f = new Foo();
        equal(f.t1(), 1);
    });

});
