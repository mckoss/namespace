#!/usr/bin/env node
global.namespace = require('../src/namespace.js').namespace;

require('../namespace-plus.js');
require('./qunit-node.js');

require('./test-namespace.js');
require('./test-types.js');
require('./test-funcs.js');
require('./test-string.js');
require('./test-coverage.js');
