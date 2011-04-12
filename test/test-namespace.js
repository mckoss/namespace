namespace.module('namespace.test', function (exports, require) {
    var ut = require('com.jquery.qunit');

    ut.module('namespace');

    ut.test("global namespace object", function() {
        ut.ok(typeof namespace == 'object', "namespace is defined");
        ut.ok(typeof namespace.module == 'function', "namespace.module is a function");

        var ns = namespace.module('test');
        ut.ok(ns.prototype === namespace.prototype, "namespace is a Namespace");

        var version = namespace.VERSION.split('.');
        ut.equal(version.length, 3, "VERSION has 3 parts");
        ut.ok(version[0] == 3 && version[1] == 0, "tests for version 3.0");
    });

    ut.test("single module per name", function() {
        var ns1 = namespace.module('org.startpad.test');
        var ns2 = namespace.module('org.startpad.test');
        ut.ok(ns1 === ns2, "identical module");

        var ns3 = namespace.module('org.startpad.test2');
        ut.ok(ns1 !== ns3, "each namespace unique");
    });

    ut.test("define and extend", function () {
        namespace.module('org.startpad.testdefine', function (exports) {
            function foo() {
                return 1;
            }

            exports.extend({'foo': foo});
        });

        var testdefine = namespace.module('org.startpad.testdefine');
        ut.equal(testdefine.foo(), 1);
        ut.equal(namespace.org.startpad.testdefine.foo(), 1);
    });

    ut.test("path names", function () {
        var ns1 = namespace.module('org.startpad.path-names');
        var ns2 = namespace.org.startpad.path_names;
        ut.equal(ns1, ns2);
    });

    ut.test("out of order definition", function() {
        namespace.module('first', function (exports, require) {
            var forward = require('forward');

            exports.test = function () {
                return forward.test();
            };
        });

        namespace.module('forward', function (exports) {
            exports.test = function () {
                return 7;
            };
        });

        ut.equal(namespace.first.test(), 7, "forward reference to namespace export");
    });

    ut.test("require parameter", function () {
        namespace.module('test.require', function (exports, require) {
            var extern = require('test.extern');
            exports.func = function (x) {
                return extern.func(x) + 1;
            };
        });
        namespace.module('test.extern', function (exports, require) {
            exports.func = function (x) {
                return x * 3;
            };
        });
        ut.equal(namespace.test.require.func(7), 22);
    });

});