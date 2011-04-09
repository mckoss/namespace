namespace.lookup('org.startpad.funcs.test').define(function (exports, require) {
    var ut = require('com.jquery.qunit');
    var utCoverage = require('org.startpad.qunit.coverage');
    var types = require('org.startpad.types');
    var funcs = require('org.startpad.funcs');

    ut.module('funcs');

    coverage = new utCoverage.Coverage('org.startpad.funcs');

    ut.test("version", function () {
        var version = funcs.VERSION.split('.');
        ut.equal(version.length, 3, "VERSION has 3 parts");
        ut.ok(version[0] == 0 && version[1] == 1, "tests for version 0.1");
    });

    ut.test("monkeyPatch", function () {
        ut.equal(Function.methods, undefined, "methods not patched by default");
        funcs.monkeyPatch();
        ut.equal(types.typeOf(Function.methods), 'function', "monkey patched");
    });

    ut.test("methods", function () {
        function Foo() {
            this.x = 1;
        }

        Foo.methods({
            t1: function () { return this.x; },
            toString: function () { return "Foo object"; }
        });

        var f = new Foo();
        ut.equal(types.typeOf(Foo.prototype.t1), 'function', "added to prototype");
        ut.equal(f.t1(), 1, "method call");
        ut.equal(f + "", "Foo object", "toString override");
    });

    coverage.testCoverage();

});
