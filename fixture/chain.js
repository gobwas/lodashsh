var _ = require("lodash"),
	chain, count, min;

chain = _
		.chain(this.list)
        .groupBy(dimension)
        .reduce(func);

count = chain.value();

min = chain.values().min().value();