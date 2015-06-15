var Parser   = require("esvu").Parser,
    Target   = require("esvu").Target,
    Variable = require("esvu").Variable,
    Property = require("esvu").Property,
    Binding  = require("esvu").Binding,
    Call     = require("esvu").Call,
    Context  = require("esvu").Context,
    assert   = require("assert"),
    parser, context, chains, refs;

chains = [];
refs   = [];

function propLogger(id, list, isChain) {
    id.on("property", function(property) {
        property.on("binding", function(binding) {
            if (binding.value == void 0) {
                binding.on("call", function(call) {
                	var name, isNewChain;

                    list.indexOf(name = property.id.name) == -1 && list.push(name);

					isNewChain = property.id.name == "chain";

					if (isNewChain || isChain) {
						chains.push(call);
						propLogger(call, list, true);
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

	parser = new Parser();
	context = new Context();

	context.on("scope", function(scope) {
	    scope.on("variable", function(variable) {
	        variable.on("binding", function(binding) {
	        	var ref;

	        	if ((ref = context.find(binding.value))) {
	        		if (refs.indexOf(ref.binding) != -1) {
	        			propLogger(binding, list);
	        		}
	        	} else if (chains.indexOf(binding.value) !== -1) {
					propLogger(binding, list, true);
	        	} else if (binding.value instanceof Call) {
	                var isLodash;

	                try {
	                    isLodash = binding.value.arguments[0].value == "lodash";
	                } catch (err) {
	                    isLodash = false;
	                }

	                if (isLodash) {
	                	refs.push(binding);
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