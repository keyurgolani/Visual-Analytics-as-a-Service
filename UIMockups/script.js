var app = angular.module('myApp', []);

app.controller('myController', function($scope, NodeChain) {
    $scope.expand = false;
    $scope.nodeChain = [];
}).directive('ngNode', function($document, $compile, Bounds, NodeChain) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            icon: '@',
            nid: '@'
        },
        templateUrl: 'node.html',
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
                startY = element[0].offsetTop;
                startX = element[0].offsetLeft;
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

            function mouseup(event) {
                // startX = startX + event.pageX - moveStartX;
                // startY = startY + event.pageY - moveStartY;

                var leftPane = Bounds.getElementById('leftPane');

                element.css({
                    position: 'relative',
                    top: 0 + 'px',
                    left: 0 + 'px'
                });
                if (!Bounds.within(event.pageX, event.pageY, leftPane)) {
                    scope.$parent.nodeChain.push(NodeChain.getNodeFromId(attr.nid));
                    scope.$apply();
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
    this.getNodeFromId = function(nid) {
        // TODO: Add Node Detailed Structure to be mapped to the node ID.
        // Node structure might contain the javascript functions to manipulate the sample data and other details & configurations about the node.
        return nid;
    };
});