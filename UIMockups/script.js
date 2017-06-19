var app = angular.module('myApp', []);

app.controller('myController', function($scope) {

});

app.directive('ngDraggable', function($document, $window) {
	function makeDraggable(scope, element, attr) {

		startY = element[0].offsetTop;
		startX = element[0].offsetLeft;

		element.css({
			cursor: 'pointer',
			top: startY + 'px',
			left: startX + 'px'
		});

		element.on('mousedown', function(event) {
			event.preventDefault();
			moveStartX = event.pageX
			moveStartY = event.pageY
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});

		function mousemove(event) {
			y = startY + event.pageY - moveStartY;
			x = startX + event.pageX - moveStartX;

			element.css({
				position: 'absolute',
				top: y + 'px',
				left: x + 'px'
			});
		}

		function mouseup() {
			startX = startX + event.pageX - moveStartX;
			startY = startY + event.pageY - moveStartY;
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
		}
	}
	return {
		link: makeDraggable
	};
});
