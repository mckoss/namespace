namespace.module('org.startpad.sample', function (exports, require) {
    var funcs = require('org.startpad.funcs');
    exports.extend({
        'VERSION': '0.1.0',
        'testFunction': testFunction,
        'TestConstructor': TestConstructor
    });
    
    function testFunction() { return 1; }
    
    function TestConstructor() { this.x = 2; }
    
    funcs.methods(TestConstructor, {
        test: function () { return this.x; }
    });
});
namespace.module('org.startpad.sample.test', function (exports, require) {
    var ut = require('com.jquery.qunit');
    var utCoverage = require('org.startpad.qunit.coverage');
    var sample = require('org.startpad.sample');

    ut.module('org.startpad.qunit.coverage');

    var coverage;

    coverage = new utCoverage.Coverage('org.startpad.sample');

    ut.test("version", function () {
        ut.equal(sample.VERSION, '0.1.0');
    });
    
    ut.test("coverage", function () {
        ut.equal(sample.testFunction(), 1);
        var x = new sample.TestConstructor();
        ut.equal(x.test(), 2);
    });

    coverage.testCoverage();

});
