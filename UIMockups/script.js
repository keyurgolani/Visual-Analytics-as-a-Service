var app = angular.module('myApp', []);

app.controller('myController', function($scope) {

}).directive('ngNode', function($document, $compile, Bounds, NodeChain) {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			icon: '@'
		},
		templateUrl: 'node.html',
		link: function(scope, element, attr) {

			var originalWidth = Bounds.getWidth(element);
			var originalHeight = Bounds.getHeight(element);

			var originY = element[0].offsetTop;
			var originX = element[0].offsetLeft;

			var startY = element[0].offsetTop;
			var startX = element[0].offsetLeft;

			element.css({
				cursor: 'pointer',
				top: startY + 'px',
				left: startX + 'px'
			});

			var moveStartX = 0;
			var moveStartY = 0;

			element.on('mousedown', function(event) {
				event.preventDefault();
				moveStartX = event.pageX
				moveStartY = event.pageY
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				var y = startY + event.pageY - moveStartY;
				var x = startX + event.pageX - moveStartX;

				element.css({
					position: 'absolute',
					top: y + 'px',
					left: x + 'px',
					height: originalHeight + 'px!important',
					width: originalWidth + 'px!important'
				});
			}

			function mouseup(event) {
				// startX = startX + event.pageX - moveStartX;
				// startY = startY + event.pageY - moveStartY;
				element.css({
					position: 'relative',
					top: 0 + 'px',
					left: 0 + 'px',
					height: 'auto',
					width: 'auto'
				});
				var leftPane = Bounds.getElementById('leftPane');
				if (!Bounds.within(event.pageX, event.pageY, leftPane)) {
					console.log(element);
					NodeChain.addToChain();
				}
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}
		}
	};
}).service('Bounds', function() {
	this.within = function(x, y, elem) {
		return x > this.leftBound(elem) &&
			x < this.rightBound(elem) &&
			y > this.topBound(elem) &&
			x < this.bottomBound(elem)
	}
	this.getWidth = function(elem) {
		return elem.offsetWidth;
	}
	this.getHeight = function(elem) {
		return elem.offsetHeight;
	}
	this.getElementById = function(id) {
		return angular.element(document.getElementById(id))[0];
	}
	this.rightBound = function(elem) {
		return parseInt(elem.offsetLeft) + parseInt(elem.offsetWidth);
	};
	this.leftBound = function(elem) {
		return parseInt(elem.offsetLeft);
	};
	this.topBound = function(elem) {
		return parseInt(elem.offsetTop);
	};
	this.bottomBound = function(elem) {
		return parseInt(elem.offsetTop) + parseInt(elem.offsetHeight);
	};
}).service('NodeChain', function() {
	this.getNodeFromId = function(id) {
		// TODO: Add Node Detailed Structure to be mapped to the node ID.
		// Node structure might contain the javascript functions to manipulate the sample data and other details & configurations about the node.
		return id
	};
	this.addToChain = function(id) {
		// TODO: Define a global app variable named chain or anything and implement the add logic to it.
		// chain.add(this.getNodeFromId(id));
	}
});
