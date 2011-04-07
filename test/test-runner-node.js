#!/usr/bin/env node
global.namespace = require('../src/namespace.js').namespace;

require('../src/types.js');
require('../src/funcs.js');
require('./qunit-node.js');

require('./test-namespace.js');
require('./test-types.js');
require('./test-funcs.js');
