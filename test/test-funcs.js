namespace.module('org.startpad.funcs.test', function (exports, require) {
    var ut = require('com.jquery.qunit');
    var utCoverage = require('org.startpad.qunit.coverage');
    var types = require('org.startpad.types');
    var funcs = require('org.startpad.funcs');

    ut.module('funcs');

    coverage = new utCoverage.Coverage('org.startpad.funcs');

    ut.test("version", function () {
        var version = funcs.VERSION.split('.');
        ut.equal(version.length, 3, "VERSION has 3 parts");
        ut.ok(version[0] == 0 && version[1] == 2, "tests for version 0.2");
    });

    ut.test("numericVersion", function () {
        ut.equal(funcs.numericVersion("1.2.3"), 10203);
        ut.ok(funcs.numericVersion("2.0.0") > funcs.numericVersion("1.9.9"));
    });

    ut.test("patch", function () {
        ut.equal(Function.prototype.methods, undefined, "methods not patched by default");
        funcs.patch();
        var patched = ['methods', 'curryThis', 'curry', 'decorate', 'subclass'];
        for (var i = 0; i < patched.length; i++) {
            coverage.wrapFunction(Function.prototype, patched[i], 'Function:');
        }
        ut.equal(types.typeOf(Function.prototype.methods), 'function', "monkey patched");
    });

    ut.test("monkeyPatch", function () {
        function Foo() {
        }

        Foo.methods({
            test: function () { return 1; }
        });

        var f = new Foo();
        ut.equal(f.test(), 1);

        funcs.monkeyPatch(Foo, 'test', '1.0.0', {
            test: function () { return 3; }
        });

        ut.equal(f.test(), 3);

        funcs.monkeyPatch(Foo, 'test', '0.9.9', {
            test: function () { return 2; }
        });

        ut.equal(f.test(), 3);

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

        var teens = sample.curryThis({a: 3}, 1);
        ut.equal(teens(0), 13);
        ut.equal(teens(1), 14);

        var mod4 = sample.curryThis({a: 3}, undefined, 1);
        ut.equal(mod4(0), 4);
        ut.equal(mod4(1), 14);
        ut.equal(mod4(2), 24);

        mod4 = funcs.bind(sample, {a: 3}, undefined, 1);
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

    ut.test("decorator", function() {
        function doubleIt(fn, args) {
            if (fn == undefined) {
                return;
            }
            return 2 * fn.apply(this, args);
        }

        var plusOneTimes2 = funcs.decorate(function(x) {
            return x + 1;
        }, doubleIt);

        ut.equal(plusOneTimes2(1), 4);

        plusOneTimes2 = function(x) {
            return x + 1;
        }.decorate(doubleIt);

        ut.equal(plusOneTimes2(1), 4);

        function Foo(x) {
            this.x = x;
        }

        function twice(fn, args) {
            if (fn == undefined) {
                return;
            }
            fn.apply(this, args);
            return fn.apply(this, args);
        }

        Foo.methods({
            addOne: function() {
                this.x++;
            }.decorate(twice)
        });

        var foo = new Foo(7);
        ut.equal(foo.x, 7);
        foo.addOne();
        ut.equal(foo.x, 9);

        function dummy() {
            return true;
        }

        function callCounter(fn, args, fnWrapper) {
            if (fn == undefined) {
                fnWrapper.count = 0;
                return;
            }
            fnWrapper.count++;
            return fn.apply(this, args);
        }

        var countDummy = dummy.decorate(callCounter);
        for (var i = 0; i < 10; i++) {
            ut.ok(countDummy() === true);
        }
        ut.equal(countDummy.count, 10);
    });

    ut.test("shadow", function() {
        var obj = {a: 1, b: 2};

        var shadowObj = funcs.shadow(obj);
        ut.equal(shadowObj.a, 1);
        obj.a = 3;
        ut.equal(shadowObj.a, 3);
        shadowObj.a = 4;
        ut.equal(shadowObj.a, 4);
        ut.equal(obj.a, 3);
    });

    ut.test("subclass", function() {
        function Super() {
            this.x = 1;
        }
        Super.methods({
            value: function() {
                return this.x;
            }
        });

        function Sub() {
            this._super();
        }

        Sub.subclass(Super, {
            value2: function () {
                return this.value(this) + 1;
            }
        });

        function Over() {
            this._super();
        }

        funcs.subclass(Over, Super, {
            value: function () {
                return this._proto.value.call(this) + 2;
            }
        });

        var s = new Sub();
        ut.equal(s.x, 1);
        ut.equal(s.value(), 1);
        ut.equal(s.value2(), 2);

        var o = new Over();
        ut.equal(o.value(), 3);
    });

    coverage.testCoverage();

});
