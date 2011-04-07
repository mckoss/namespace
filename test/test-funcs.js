namespace.lookup('org.startpad.funcs.test').define(function (exports, require) {
    var funcs = require('org.startpad.types');

    module('funcs');

    test("version", function () {
        var version = funcs.VERSION.split('.');
        equal(version.length, 3, "VERSION has 3 parts");
        ok(version[0] == 0 && version[1] == 1, "tests for version 0.1");
        equal();
    });

    test("extend", function () {

    });

});
