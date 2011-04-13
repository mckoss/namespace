namespace.js is a proposal for a standardized mechanism for creating
JavaScript modules in the browser. Its inspiration comes from the design of
[Python Modules] and the [CommonJS Modules] definition.

# Namespace API (version 3.0)

The idea is to have a single global variable, *namespace*, inside of which all
modules are child JavaScript object.  With a simple wrapper, you
implement your module in a [JavaScript Closure] function.  You can then use
the *exports* and *require* symbols, just as any CommonJS module would.

Any properties you add to the 'exports' object will be exported properties
for your module.

    namespace.module('com.mydomain.mymodule', function (exports, require) {
      var external = require('com.domain.external-module');

      exports.extend({
        'myFunction': myFunction,
         ...
      });

      function myFunction() {
        ...
      }
    });


# Documentation

## namespace

The single global variable, *namespace*, is the top level Module.  All other
modules are descendant properties of this object.

### namespace.module(pathname, function (exports, require) { ... ])

Use the *module* method to define your module:

    namespace.module('com.mydomain.my-module', function (exports, require) {
      ...
    });

Your closure function will be called with two arguments, the module
object itself (exports), and the *require* function which can be used
to retreive a reference to any other module.

Any properties to you want to add to the *exports* object will be
available as external symbols. Of course, any local functions or
variables defined in your closure function will only be available
within your module, unless explicitly exported by you.

It is up to the module author to provide a unique name, but it is
recommended that you use *reverse-domain* notation.  If you own the
domain, 'mydomain.com', you can ensure uniqueness by naming your
modules with a prefix 'com.mydomain.'.

## require(pathname)

Return a module object given it's unique path name.

If a module does not yet exist, an empty module will be created.  Each call to
require with a given path, will always return the identical object (enabling forward
references to modules that have not yet been defined).

If you are sure that a module has already been defined, you can also reference the
module object with the javascript expression, even outside of a module definition.

    namespace.com.mydomain.my_module

*Note that '-' characters in the path name, are converted to '_' characters when used in
JavaScript property names.*

## exports.extend(obj)

You can use the *extend* function as a convenient way to add public properties to your module:

    namespace.module('com.mydomain.my-module', function (exports, require) {
        exports.extend({
          'publicFunction': publicFunction,
          'PublicClass': PublicClass
        });

        function publicFunction {
        }

        function PublicClass {
        }
    });


is equivalent to:

    namespace.module('com.mydomain.my-module', function (exports, require) {
        exports.publicFunction = function () {
        };

        exports.PublicClass = function () {
        }
    });

Which style you use is a matter of personal preference (but see [FAQ] about safe use with
Google Closure).

# Unit Tests

Run the latest [Unit Tests] online.

# Revision History

- 3.0.0 April 12, 2011 - Further simplify - remove lookup and define methods.
  Now just have *module*, *exports* and *require*.
  (541 bytes, 348 bytes gzipped)
- 2.2.0 April 5, 2011 - Better VERSION handling and CommonJS Module compatible (exports/require).
  (515 bytes minified, 325 bytes gzipped)
- 2.1.4 March 18, 2011 - First published version
  (383 bytes minified, 250 bytes gzipped)

# Advantages of Using namespace.js

- **Module isolation** - each module need not add ANY top-level
  global symbols, and you can create functions and variables that are
  only locally accessible.
- **Explicit exports** - limit which functions are publicly
  accessible.
- **Load-order independence** of modules - your module can refer to
  external modules, even if they have not yet been loaded.
- **Multiple JavaScript environments** - namespace.js has been tested to work in web
  browsers, Rhino, V8, node.js, and WebWorkers.
- Compatible with [CommonJS Modules](http://www.commonjs.org/specs/modules/1.0/) specification.
- **Does one thing well** - namespace.js is a tiny library (325 gzipped bytes)
  specifically designed to be used by any JavaScript module to make it
  easier for independently written modules to be used together.

  [CommonJS Modules]: http://www.commonjs.org/specs/modules/1.0/
  [Python Modules]: http://docs.python.org/tutorial/modules.html
  [JavaScript Closure]: https://developer.mozilla.org/en/JavaScript/Guide/Closures
  [Unit Tests]: http://namespace-js.pageforest.com/test/test-runner.html
