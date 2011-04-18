namespace.module('org.startpad.string.test', function (exports, require) {
    var ut = require('com.jquery.qunit');
    var utCoverage = require('org.startpad.qunit.coverage');
    var types = require('org.startpad.types');
    var string = require('org.startpad.string');

    ut.module('org.startpad.string');

    var coverage;

    coverage = new utCoverage.Coverage('org.startpad.string');

    ut.test("version", function () {
        var version = types.VERSION.split('.');
        ut.equal(version.length, 3, "VERSION has 3 parts");
        ut.ok(version[0] == 0 && version[1] == 1, "tests for version 0.1");
        ut.equal();
    });
    
    ut.test("patch", function () {
        ut.equal(String.prototype.format, undefined, "methods not patched by default");
        string.patch();
        var patched = ['format'];
        for (var i = 0; i < patched.length; i++) {
            coverage.wrapFunction(String.prototype, patched[i], 'String:');
        }
        ut.equal(types.typeOf(String.prototype.format), 'function', "monkey patched");
    });
    
    ut.test("format", function()
    {
        ut.equal(string.format("this is {wow} test", {wow: "foo"}),
                    "this is foo test");
        ut.equal(string.format("{key} is replaced {key} twice",
                                       {key: "yup"}),
                    "yup is replaced yup twice");

        ut.equal(string.format("{key} and {key2}", {key: "mom"}),
                    "mom and ");
                    
        ut.equal(string.format(1), '1');

        ut.equal("format {0}".format("string"), "format string");
        ut.equal("{1} reverse {0}".format('a', 'b'), "b reverse a");
        ut.equal("Prop: {prop}".format({prop: "hi"}), "Prop: hi");
        ut.equal("Nested: {person.name}".format({person: {name: "Mike"}}), "Nested: Mike");

        var people = [{name: "Mike"}, {name: "Bobby"}];
        people[0].friend = people[1];
        people[0].friends = [people[0], people[1]];
        ut.equal("Two people are {0.name} and {1.name}.".format(people),
                    "Two people are Mike and Bobby.");
        ut.equal("{0.name}'s friend is {0.friend.name}.".format(people),
                    "Mike's friend is Bobby.");
        ut.equal("{0.name}'s friends are {0.friends.0.name} and {0.friends.1.name}."
                    .format(people),
                    "Mike's friends are Mike and Bobby.");

        ut.equal("Allow space { 0 } around vars { 1.prop }.".format("prop", {prop: "prop2"}),
                    "Allow space prop around vars prop2.");
    });

    coverage.testCoverage();

});
