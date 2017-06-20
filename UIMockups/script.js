var app = angular.module('myApp', []);

app.controller('myController', function($scope) {

}).directive('ngNode', function($document, $compile) {
	return {
		restrict: 'E',
		transclude: true,
		template: '<div class="node"><div ng-transclude></div></div>',
		link: function(scope, element, attr) {

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
	};
});
