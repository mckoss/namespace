/*globals test, ok, equal */
namespace.lookup('namespace.test').define(function (exports, require) {
    module('namespace');

    test("global namespace object", function() {
        ok(typeof namespace == 'object', "namespace is defined");
        ok(typeof namespace.lookup == 'function', "namespace.lookup is a function");

        var ns = namespace.lookup('test');
        ok(ns.prototype === namespace.prototype, "namespace is a Namespace");

        var version = namespace.VERSION.split('.');
        equal(version.length, 3, "VERSION has 3 parts");
        ok(version[0] == 2 && version[1] == 2, "tests for version 2.2");
    });

    test("unique lookup", function() {
        var ns1 = namespace.lookup('org.startpad.test');
        var ns2 = namespace.lookup('org.startpad.test');
        ok(ns1 === ns2, "repeatable lookups");

        var ns3 = namespace.lookup('org.startpad.test2');
        ok(ns1 !== ns3, "each namespace unique");
    });

    test("define and extend", function () {
        namespace.lookup('org.startpad.testdefine').define(function (ns) {
            function foo() {
                return 1;
            }

            ns.extend({'foo': foo});
        });

        var testdefine = namespace.lookup('org.startpad.testdefine');
        equal(testdefine.foo(), 1);
        equal(namespace.org.startpad.testdefine.foo(), 1);
    });

    test("path names", function () {
        var ns1 = namespace.lookup('org.startpad.path-names');
        var ns2 = namespace.org.startpad.path_names;
        equal(ns1, ns2);
    });

    test("out of order definition", function() {
        namespace.lookup('first').define(function (ns) {
            var forward = namespace.lookup('forward');

            ns.test = function () {
                return forward.test();
            };
        });

        namespace.lookup('forward').define(function (ns) {
            ns.test = function () {
                return 7;
            };
        });

        equal(namespace.first.test(), 7, "forward reference to namespace export");
    });

    test("require parameter", function () {
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
        equal(namespace.test.require.func(7), 22);
    });

});