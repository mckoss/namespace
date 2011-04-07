require.paths.unshift('.');
require.paths.unshift('../src');
global.namespace = require('namespace.js').namespace;

require('types.js');
require('funcs.js');
require('qunit.js');

require('test-namespace.js');
