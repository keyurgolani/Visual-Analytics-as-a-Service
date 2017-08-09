module.exports = function(RED) {
	function Data(config) {
		RED.nodes.createNode(this, config);
		console.log('------------', config, '------------');
		var node = this;
		node.on('input', function(msg) {
			msg.payload = [
				[119736, "FL", "CLAY COUNTY", 498960, 498960, 498960, 498960, 498960, 792148.9, 0, 9979.2, 0, 0, 30.102261, -81.711777, "Residential", "Masonry", 1],
				[448094, "FL", "CLAY COUNTY", 1322376.3, 1322376.3, 1322376.3, 1322376.3, 1322376.3, 1438163.57, 0, 0, 0, 0, 30.063936, -81.707664, "Residential", "Masonry", 3],
				[206893, "FL", "CLAY COUNTY", 190724.4, 190724.4, 190724.4, 190724.4, 190724.4, 192476.78, 0, 0, 0, 0, 30.089579, -81.700455, "Residential", "Wood", 1]
			];
			node.send(msg);
		});
	}
	RED.nodes.registerType("data", Data);
};
