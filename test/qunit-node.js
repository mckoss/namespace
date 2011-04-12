require('./qunit.js');
require('./qunit-coverage.js');

var types = namespace.module('org.startpad.types');

var moduleInfo, testInfo;
var testNumber = 1;
var coverage;

types.extend(namespace.com.jquery.qunit.QUnit, {
    moduleStart: function (info) {
        moduleInfo = info;
    },

    testStart: function (info) {
        testInfo = info;
    },

    testDone: function (info) {
        var verdict = info.passed == info.total ? 'PASS' : 'FAIL';
        console.log(testNumber++ + '. ' + verdict + ' ' + moduleInfo.name + ': ' + info.name +
                    ' (' + info.passed + '/' + info.total + ' pass)');
    },

    log: function (info) {
        if (!info.result) {
            if (!info.message) {
                info.message = "Expected: " + info.expected + ", Actual: " + info.actual;
            }
            console.log(info.message);
        }
    }
});
