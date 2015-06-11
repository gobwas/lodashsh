var assert = require('assert');
var lodashsh = require('../index');

describe('lodashsh node module', function () {
	it('must have at least one test', function () {
		var usage;

		usage = lodashsh("_ = require('lodash'); _.forEach()");

		assert(usage[0] == "forEach", 'It not works =(');
	});
});