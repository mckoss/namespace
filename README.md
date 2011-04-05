[namespace.js] is a proposal for a standardized mechanism for creating
JavaScript modules. Its inspiration comes from the design of Python *modules* and the *import* statement.

# Namespace API (version 2.2)

There are only 4 parts to the *namespace* API:

1. **namespace** - the top level global Namespace object.
2. **namespace.lookup(pathname)** - get a Namespace object from its unique path name.
3. **Namespace.define(function (exports, require))** - Namespace module definition function.
4. **Namespace.extend(obj)** - export symbols from a Namespace.

You can also test namespace.VERSION to ensure you have the required version installed -
currently "2.2.0".


# Typical Usage

Wrap your module in a closure function using a unique module name.
Any properties you add to the 'exports' object will be exported properties
for your namespace.

    namespace.lookup('com.mydomain.mymodule').define(function (exports, require) {
      var external = require('com.domain.external-module');

      exports.extend({
        'myFunction': myFunction,
         ...
      });

      function myFunction() {
        ...
      }
    });


# Detailed Documentation

## namespace

The single global variable, *namespace*, is the top level Namespace.  All other
namespaces are descendant properties of this object.

### namespace.lookup(`<`string`>` pathname)

Lookup a namespace object given it's (globally) unique path name.  It is up to the user
to provide a unique name, but it is recommended that you use *reverse-domain* notation.
If you own the domain, 'mydomain.com', you can ensure uniqueness by naming your modules
with a prefix 'com.mydomain.'.

    namespace.lookup('com.mydomain.my-namespace')

If a namespace does not yet exist, an empty namespace will be created.  Each call to
lookup with a given path, will always return the identical object (enabling forward
references to namespaces that have not yet been defined).

If you are sure that a namespace has already been defined, you can also reference the
namespace object with the javascript expression:

    namespace.com.mydomain.my_namespace

*Note that '-' characters in the path name, are converted to '_' characters when used in
JavaScript property names.*

## Namespace.define(function (exports, require) {...})

Use the *define* method to define your namespace.

    namespace.lookup('com.mydomain.my-namespace').define(function (exports, require) {
      ...
    });

Your closure function will be called with a two arguments, the
namespace object itself (exports), and an alias for namespace.lookup (require).
Any properties to you want to add to the
namespace object will be available as external symbols. Of course, any
local functions or variables defined in your closure function will
only be available within your module, unless explicitly exported by
you.

## Namespace.extend(obj)

You can use the *extend* function as a convenient way to add public properties to your namespace:

    function publicFunction {
    }

    function PublicClass {
    }

    exports.extend({
      'publicFunction': publicFunction,
      'PublicClass': PublicClass
    });

is equivalent to:

    exports.publicFunction = function () {
    };

    exports.PublicClass = function () {
    }

Which style you use is a matter of personal preference (but see [FAQ] about safe use with
Google Closure).

# Revision History

- 2.2.0 April 5, 2011 - Better VERSION handling and CommonJS Module compatible (exports/require).
  (515 bytes minified, 325 bytes gzipped)
- 2.1.4 March 18, 2011 - First published version
  (383 bytes minified, 250 bytes gzipped)


# Advantages of Using namespace.js

- **Module isolation** - each namespace need not add ANY top-level
  global symbols, and you can create functions and variables that are
  only locally accessible.
- **Explicit exports** - limit which functions are publicly
  accessible.
- **Load-order independence** of modules - your module can refer to
  external modules, even if they have not yet been loaded.
- **Multiple JavaScript environments** - namespace.js has been tested to work in web
  browsers, Rhino, V8, and WebWorkers.
- Compatible with [CommonJS Modules](http://www.commonjs.org/specs/modules/1.0/) specification.
- **Does one thing well** - namespace.js is a tiny library (325 gzipped bytes)
  specifically designed to be used by any JavaScript module to make it
  easier for independently written modules to be used together.

  [FAQ]: http://mckoss.github.com/namespace/FAQ.html
  [README]: http://mckoss.github.com/namespace/README.html
  [namespace.js]: http://mckoss.github.com/namespace/