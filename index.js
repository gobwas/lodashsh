var Parser   = require("esvu").Parser,
    Target   = require("esvu").Target,
    Variable = require("esvu").Variable,
    Property = require("esvu").Property,
    Binding  = require("esvu").Binding,
    Call     = require("esvu").Call,
    Context  = require("esvu").Context,
    assert   = require("assert"),
    parser, context;
console.log('esvu', require('esvu'));

function propLogger(binding, list, isChain) {
    binding.on("property", function(property) {
        property.on("binding", function(binding) {
            if (binding.value == void 0) {
                binding.on("call", function(call) {
                    list.push(property.id.name);

                    if (isChain || property.id.name == "chain") {
                        propLogger(call, true);
                    }
                });
            }
        });
    });
}

function shsh(code) {
	var list;

	assert(typeof code == "string", "Code is expected to be a string");

	list = [];

	console.log('Context', Context)

	parser = new Parser();
	context = new Context();

	context.on("scope", function(scope) {
	    scope.on("variable", function(variable) {
	        variable.on("binding", function(binding) {
	            if (binding.value instanceof Call) {
	                var isLodash;

	                try {
	                    isLodash = binding.value.arguments[0].value == "lodash";
	                } catch (err) {
	                    isLodash = false;
	                }

	                if (isLodash) {
	                    propLogger(binding, list);
	                }
	            }
	        });
	    });
	});

	parser.parse(code, context);


	return list;
}

module.exports = shsh;