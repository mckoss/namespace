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
        var patched = ['methods', 'bind', 'curry', 'decorate'];
        for (var i = 0; i < patched.length; i++) {
            coverage.wrapFunction(Function.prototype, patched[i], 'Function:');
        }
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

        function Bar() {
            this.x = 1;
        }

        funcs.methods(Bar, {
            t1: function () { return this.x; },
            toString: function () { return "Bar object"; }
        });

        f = new Bar();
        ut.equal(types.typeOf(Bar.prototype.t1), 'function', "added to prototype");
        ut.equal(f.t1(), 1, "method call");
        ut.equal(f + "", "Bar object", "toString override");
    });

    ut.test("bind", function() {
        function sample(x, y) {
            return this.a + 10 * x + y;
        }

        var teens = sample.bind({a: 3}, 1);
        ut.equal(teens(0), 13);
        ut.equal(teens(1), 14);

        var mod4 = funcs.bind(sample, {a: 3}, undefined, 1);
        ut.equal(mod4(0), 4);
        ut.equal(mod4(1), 14);
        ut.equal(mod4(2), 24);
    });

    ut.test("curry", function() {
        function foo(x, y) {
            return 10 * x + y;
        }

        var f10 = foo.curry(1);
        ut.equal(f10(0), 10);
        ut.equal(f10(1), 11);
        var f01 = foo.curry(undefined, 1);
        ut.equal(f01(0), 1);
        ut.equal(f01(2), 21);
    });

    coverage.testCoverage();

});
