require('./qunit.js');
require('./qunit-coverage.js');

var types = namespace.lookup('org.startpad.types');

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
            console.log(info.message);
        }
    }
});
