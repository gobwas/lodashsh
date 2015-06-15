var assert = require('assert'),
	lodashsh = require('../index'),
	path = require('path'),
	fs = require('fs'),
	_ = require('lodash');

describe('lodashsh node module', function () {
	it('should return prop calls of lodashed variable', function () {
		var usage;

		usage = lodashsh("_ = require('lodash'); _.forEach()");

		assert(usage[0] == "forEach", 'It not works =(');
	});

	it('should save references to the chains', function () {
		var usage;

		usage = lodashsh("_ = require('lodash'); chain = _.chain(); chain.forEach().map()");

		assert(usage[0] == "chain", 'It not works =(');
		assert(usage[1] == "forEach", 'It not works =(');
		assert(usage[2] == "map", 'It not works =(');
	});

	it('should save references to the chains with calls', function () {
		var usage;

		usage = lodashsh("_ = require('lodash'); chain = _.chain().sort(); chain.forEach().map()");

		assert(usage[0] == "chain", 'It not works =(');
		assert(usage[1] == "sort", 'It not works =(');
		assert(usage[2] == "forEach", 'It not works =(');
		assert(usage[3] == "map", 'It not works =(');
	});

	it('should save references to lodash ref', function () {
		var usage;

		usage = lodashsh("_ = require('lodash'); ref = _; ref.forEach()");

		assert(usage[0] == "forEach", 'It not works =(');
	});

	it('should work proper with chains', function() {
		var usage;

		usage = lodashsh(fs.readFileSync(path.resolve(__dirname, "../fixture/chain.js")).toString());

		assert(_.isEqual(['chain', 'groupBy', 'reduce', 'value', 'values', 'min'], usage));
	});
});