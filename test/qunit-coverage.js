/*
  QUnit Namespace Function Coverage extension

  Usage:

      var cover = new Coverage(moduleName);

      ...run tests...

      cover.testCoverage();

 */
namespace.lookup('org.startpad.qunit.coverage').define(function (exports, require) {
    var funcs = require('org.startpad.funcs');
    var types = require('org.startpad.types');
    var ut = require('com.jquery.qunit');

    exports.extend({
        'Coverage': Coverage
    });

    function Coverage(namespaceName) {
        this.name = namespaceName;
        this.ns = require(namespaceName);
        this.funcs = {};
        this.called = {};
        this.methods = {};
        this.reorderSave = ut.QUnit.config.reorder;

        // Disable QUnit's test reordering so the coverage test can be placed last.
        ut.QUnit.config.reorder = false;

        for (var name in this.ns) {
            if (this.ns.hasOwnProperty(name)) {
                if (typeof this.ns[name] != 'function' ||
                    // Don't wrap ourselves!
                    // Don't count the definition function - alread called.
                    name == '_closure' ||
                    this.ns[name] === this.constructor) {
                    continue;
                }

                var func = this.ns[name];
                this.funcs[name] = func;
                this.ns[name] = this.wrapFunc(name, func);

                // In case func is a constructor, use it's prototype
                // object so we inherit all it's properties when
                // we create instances!
                this.ns[name].prototype = func.prototype;
                this.methods[name] = {};

                // For functions that are constructors, wrap all the
                // methods (function prototype functions).
                for (var method in func.prototype) {
                    if (typeof func.prototype[method] == 'function') {
                        var fnMethod = func.prototype[method];
                        this.methods[name][method] = fnMethod;
                        func.prototype[method] =
                            this.wrapFunc(name + ':' + method,
                                          fnMethod);
                    }
                }
            }
        }
    }

    funcs.methods(Coverage, {
        wrapFunc: function(name, func) {
            if (this.called[name] != undefined) {
                throw new Error("Function already wrapped: " + name);
            }

            this.called[name] = 0;

            var self = this;
            function onCall() {
                self.cover(name);
                return func.apply(this, arguments);
            }

            return onCall;
        },

        // Mark names as "covered".
        cover: function() {
            for (var i = 0; i < arguments.length; i++) {
                name = arguments[i];
                if (this.called[name] == undefined) {
                    throw new Error("Unwrapped function: " + name);
                }
                this.called[name]++;
            }
        },

        unwrap: function() {
            for (var name in this.funcs) {
                if (this.funcs.hasOwnProperty(name)) {
                    var func = this.funcs[name];
                    this.ns[name] = func;
                    var methods = this.methods[name];
                    for (var method in methods) {
                        if (methods.hasOwnProperty(method)) {
                            func.prototype[method] = methods[method];
                        }
                    }
                }
            }
        },

        assertCovered: function() {
            for (var name in this.called) {
                if (this.called.hasOwnProperty(name)) {
                    ut.ok(this.called[name] > 0,
                          "Coverage - function not called: " + this.name + '.' + name);
                }
            }
        },

        logCoverage: function() {
            console.log("Function coverage for " + this.name + ":");
            for (var name in this.called) {
                if (this.called.hasOwnProperty(name) && this.called[name] > 0) {
                    console.log(format.fixedDigits(this.called[name], 3) +
                                ' calls to ' + name);
                }
            }
        },

        testCoverage: function() {
            var self = this;
            function testFunction() {
                self.assertCovered();
                self.unwrap();
                ut.QUnit.config.reorder = self.reorderSave;
            }
            ut.test("Function Coverage for '" + this.name + "'", testFunction);
        }
    });

});