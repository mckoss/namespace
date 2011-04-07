namespace.lookup('namespace.test').define(function (exports, require) {
    var ut = require('com.jquery.qunit');

    ut.module('namespace');

    ut.test("global namespace object", function() {
        ut.ok(typeof namespace == 'object', "namespace is defined");
        ut.ok(typeof namespace.lookup == 'function', "namespace.lookup is a function");

        var ns = namespace.lookup('test');
        ut.ok(ns.prototype === namespace.prototype, "namespace is a Namespace");

        var version = namespace.VERSION.split('.');
        ut.equal(version.length, 3, "VERSION has 3 parts");
        ut.ok(version[0] == 2 && version[1] == 2, "tests for version 2.2");
    });

    ut.test("unique lookup", function() {
        var ns1 = namespace.lookup('org.startpad.test');
        var ns2 = namespace.lookup('org.startpad.test');
        ut.ok(ns1 === ns2, "repeatable lookups");

        var ns3 = namespace.lookup('org.startpad.test2');
        ut.ok(ns1 !== ns3, "each namespace unique");
    });

    ut.test("define and extend", function () {
        namespace.lookup('org.startpad.testdefine').define(function (exports) {
            function foo() {
                return 1;
            }

            exports.extend({'foo': foo});
        });

        var testdefine = namespace.lookup('org.startpad.testdefine');
        ut.equal(testdefine.foo(), 1);
        ut.equal(namespace.org.startpad.testdefine.foo(), 1);
    });

    ut.test("path names", function () {
        var ns1 = namespace.lookup('org.startpad.path-names');
        var ns2 = namespace.org.startpad.path_names;
        ut.equal(ns1, ns2);
    });

    ut.test("out of order definition", function() {
        namespace.lookup('first').define(function (ns) {
            var forward = namespace.lookup('forward');

            ns.test = function () {
                return forward.test();
            };
        });

        namespace.lookup('forward').define(function (exports) {
            exports.test = function () {
                return 7;
            };
        });

        ut.equal(namespace.first.test(), 7, "forward reference to namespace export");
    });

    ut.test("require parameter", function () {
        namespace.lookup('test.require').define(function (exports, require) {
            var extern = require('test.extern');
            exports.func = function (x) {
                return extern.func(x) + 1;
            };
        });
        namespace.lookup('test.extern').define(function (exports, require) {
            exports.func = function (x) {
                return x * 3;
            };
        });
        ut.equal(namespace.test.require.func(7), 22);
    });

});