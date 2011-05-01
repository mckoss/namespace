/*
  QUnit Namespace Function Coverage extension

  Usage:

      var cover = new Coverage(moduleName);

      ...run tests...

      cover.testCoverage();

 */
namespace.module('org.startpad.qunit.coverage', function (exports, require) {
    var funcs = require('org.startpad.funcs');
    var types = require('org.startpad.types');
    var ut = require('com.jquery.qunit');

    exports.extend({
        'Coverage': Coverage
    });

    function Coverage(namespaceName) {
        this.name = namespaceName;
        this.ns = require(namespaceName);
        this.saves = [];
        this.calls = {};

        this.reorderSave = ut.QUnit.config.reorder;

        // Disable QUnit's test reordering so the coverage test can be placed last.
        ut.QUnit.config.reorder = false;

        for (var name in this.ns) {
            this.wrapFunction(this.ns, name, namespaceName + '.');
        }
    }

    funcs.methods(Coverage, {
        wrapFunction: function(parent, name, prefix) {
            var func = parent[name];
            var self = this;
            if (!parent.hasOwnProperty(name) || typeof func != 'function') {
                return;
            }

            this.saves.push({parent: parent, name: name, func: func});

            if (!prefix) {
                prefix = '';
            }
            var fullName = prefix + name;

            if (this.calls[fullName] != undefined) {
                throw new Error("Function already wrapped: " + fullName);
            }

            this.calls[fullName] = 0;
            parent[name] = function covered() {
                self.calls[fullName]++;
                return func.apply(this, arguments);
            };

            for (var method in func.prototype) {
                parent[name].prototype[method] = func.prototype[method];
                this.wrapFunction(parent[name].prototype, method, fullName + ':');
            }
        },

        assertCoverage: function() {
            for (var name in this.calls) {
                ut.ok(this.calls[name] > 0, "Calls to " + name + ": " + this.calls[name]);
            }
        },

        unwrapFunctions: function() {
            for (var i = 0; i < this.saves.length; i++) {
                var save = this.saves[i];
                save.parent[save.name] = save.func;
            }
            this.saves = [];
        },

        testCoverage: function() {
            var self = this;
            function testFunction() {
                self.assertCoverage();
                self.unwrapFunctions();
                ut.QUnit.config.reorder = self.reorderSave;
            }
            ut.test("Function Coverage for '" + this.name + "'", testFunction);
        }
    });

});