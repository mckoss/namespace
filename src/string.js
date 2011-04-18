var funcs = require('org.startpad.funcs');

exports.extend({
'VERSION': '0.1.0',
'patch': patch,
'format': format
});

function patch() {
  funcs.monkeyPatch(String, 'org.startpad.string', exports.VERSION, {
      'format': function () {
          if (arguments.length == 1 && typeof arguments[0] == 'object') {
              return format(this, arguments[0]);
          } else {
              return format(this, arguments);
          }
        }
  });
  return exports;
}

var reFormat = /\{\s*([^} ]+)\s*\}/g;

// Format a string using values from a dictionary or array.
// {n} - positional arg (0 based)
// {key} - object property (first match)
// .. same as {0.key}
// {key1.key2.key3} - nested properties of an object
// keys can be numbers (0-based index into an array) or
// property names.
function format(st, args, re) {
  re = re || reFormat;
  st = st.replace(re, function(whole, key) {
      var value = args;
      var keys = key.split('.');
      for (var i = 0; i < keys.length; i++) {
          key = keys[i];
          var n = parseInt(key);
          if (!isNaN(n)) {
              value = value[n];
          } else {
              value = value[key];
          }
          if (value == undefined) {
              return "";
          }
      }
      // Implicit toString() on this.
      return value;
  });
  return st;
}
