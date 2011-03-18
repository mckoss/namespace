Namespace.js is a proposal for a standardized mechanism for creating
JavaScript modules. Its inspiration comes from the design of Python *modules* and the *import* statement.

# Namespace API

There are only 4 parts to the *namespace* API:

1. **namespace** - the top level global Namespace object.
2. **namespace.lookup(pathname)** - get a Namespace object from its unique path name.
3. **Namespace.define(function)** - Namespace module definition function.
4. **Namespace.export(obj)** - export symbols from a Namespace.


# Typical Usage

Wrap your module in a closure function using a unique module name.
Any properties you add to the 'ns' object will be exported properties
for your namespace.

    namespace.lookup('com.mydomain.mymodule').define(function (ns) {
      var external = namespace.lookup('com.domain.external-module');

      function myFunction() {
        ...
      }

      ...

      ns.export({
        'myFunction': myFunction,
         ...
      });
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

## Namespace.define(function (ns) {...})

Use the *define* method to define your namespace.

    namespace.lookup('com.mydomain.my-namespace').define(function (ns) {
      ...
    });

Your closure function will be called with a single argument, the namespace object itself.  Any properties to you want to add to the namespace object will be available as external symbols.  Of course, any
local functions or variables defined in your closure function will
only be available within your module, unless explicitly exported by you.

## Namespace.export(obj)

You can use the *export* function as a convenient way to add public properties to your namespace:

    function publicFunction {
    }

    function PublicClass {
    }

    ns.export({
      'publicFunction': publicFunction,
      'PublicClass': PublicClass
    });

is equivalent to:

    ns.publicFunction = function () {
    };

    ns.PublicClass = function () {
    }

Which style you use is a matter of personal preference.


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
- **Does one thing well** - namespace.js is a tiny library (250 gzipped bytes)
  specifically designed to be used by any JavaScript module to make it
  easier for independently written modules to be used together.
