'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('MainCtrl', function ($rootScope, $scope, $state, $uibModal, $http, lodash) {
$scope.tempNode = {
  title: '',
  fileName: '',
  fileContent: null
}

$scope.script = $.parseJSON(lodash.isEmpty(localStorage.getItem("__USER_SCRIPT__")) ? {} : localStorage.getItem("__USER_SCRIPT__"));
console.log($scope.script);

$rootScope.map = (lodash.isEmpty($scope.script.map) ? {
 logic: ''
} : $scope.script.map);

$rootScope.filter = {
 logic: ''
}

$rootScope.reduce = {
 logic: ''
}

$rootScope.extractUsingRegex = {
 regex: '',
 column: '',
}

$rootScope.splitUsingRegex = {
 regex: '',
 column: '',
}

$rootScope.splitUsingDelimiter = {
 column: '',
 delimiter: '',
}

$rootScope.duplicate = {
 interleave: false,
 start: 0,
 end: 0,
}

$rootScope.mergeWithDelimiter = {
 delimiter: false,
 start: 0,
 end: 0,
}

$rootScope.filterWithParameter = {
 parameter: '',
 column: '',
 value: '',
 target_column: 0,
}

$rootScope.filterUsingRegex = {
 delimiter: false,
 start: 0,
 end: 0,
}

$rootScope.slice = {
 start: 0,
 end: 0,
 column: '',
}

$rootScope.convertTypeTo = {
 toType: '',
 column: '',
}

$rootScope.addColumn = {
 at: 0,
 value: '',
}

$rootScope.chooseColumn = {
 indexes: '',
 operation: '',
}

$rootScope.flatten = {
 start: 0,
 end: 0,
}

$rootScope.reduceBy = {
 column: '',
 aggregation: '',
}

$rootScope.takeTop = {
 n: 0,
}

$rootScope.parseUserAgent = {
 column: '',
 replace: false
}

$rootScope.parseDateTime = {
 column: '',
 replace: false
}

$rootScope.output = {
  limit: 10,
  isSorted:false
}

var $flowchart = $('#flowchart');

$scope.load_sample_button = function() {
    var sampleData = $.parseJSON(`{"operators":{"0":{"properties":{"title":"inyo.csv","inputs":{},"outputs":{"output_0":{"label":"Output 1"}},"dataset_id":3,"mode":"input"},"left":460,"top":40},"1":{"properties":{"title":"removeHeader","inputs":{"input_0":{"label":"Input 1"}},"outputs":{"output_0":{"label":"Output 1"}},"dataset_id":0,"mode":"tool"},"left":640,"top":120},"2":{"properties":{"title":"splitUsingDelimiter","inputs":{"input_0":{"label":"Input 1"}},"outputs":{"output_0":{"label":"Output 1"}},"dataset_id":0,"mode":"tool","params":{"delimiter":",","column":"0"}},"left":780,"top":20},"3":{"properties":{"title":"chooseColumn","inputs":{"input_0":{"label":"Input 1"}},"outputs":{"output_0":{"label":"Output 1"}},"dataset_id":0,"mode":"tool","params":{"indexes":"2, 5","operation":"keep"}},"left":760,"top":320},"4":{"properties":{"title":"convertTypeTo","inputs":{"input_0":{"label":"Input 1"}},"outputs":{"output_0":{"label":"Output 1"}},"dataset_id":0,"mode":"tool","params":{"toType":"integer","column":"0"}},"left":900,"top":200},"5":{"properties":{"title":"reduceBy","inputs":{"input_0":{"label":"Input 1"}},"outputs":{"output_0":{"label":"Output 1"}},"dataset_id":0,"mode":"tool","params":{"column":"1","aggregation":"add"}},"left":900,"top":440},"8":{"properties":{"title":"sortBy","inputs":{"input_0":{"label":"Input 1"}},"outputs":{"output_0":{"label":"Output 1"}},"dataset_id":0,"mode":"tool","params":{"column":"1"}},"left":1240,"top":100},"9":{"properties":{"title":"flatten","inputs":{"input_0":{"label":"Input 1"}},"outputs":{"output_0":{"label":"Output 1"}},"dataset_id":0,"mode":"tool"},"left":1100,"top":280},"10":{"properties":{"title":"CSV","inputs":{"input_0":{"label":"Input 1"}},"outputs":{},"dataset_id":0,"mode":"output","limit":0,"isSorted":false},"left":1360,"top":240}},"links":{"0":{"fromOperator":0,"fromConnector":"output_0","fromSubConnector":0,"toOperator":1,"toConnector":"input_0","toSubConnector":0},"1":{"fromOperator":1,"fromConnector":"output_0","fromSubConnector":0,"toOperator":2,"toConnector":"input_0","toSubConnector":0},"2":{"fromOperator":"2","fromConnector":"output_0","fromSubConnector":0,"toOperator":3,"toConnector":"input_0","toSubConnector":0},"3":{"fromOperator":"3","fromConnector":"output_0","fromSubConnector":0,"toOperator":4,"toConnector":"input_0","toSubConnector":0},"4":{"fromOperator":"4","fromConnector":"output_0","fromSubConnector":0,"toOperator":5,"toConnector":"input_0","toSubConnector":0},"8":{"fromOperator":"5","fromConnector":"output_0","fromSubConnector":0,"toOperator":9,"toConnector":"input_0","toSubConnector":0},"9":{"fromOperator":9,"fromConnector":"output_0","fromSubConnector":0,"toOperator":"8","toConnector":"input_0","toSubConnector":0}},"operatorTypes":{}}`);

    $flowchart.flowchart('setData', sampleData);
}
$rootScope.flowchart = $flowchart;
    var $container = $flowchart.parent();

    var cx = $flowchart.width() / 2;
    var cy = $flowchart.height() / 2;


    // Panzoom initialization...
    $flowchart.panzoom();

    // Centering panzoom
    $flowchart.panzoom('pan', -cx + $container.width() / 2, -cy + $container.height() / 2);

    // Panzoom zoom handling...
    var possibleZooms = [0.5, 0.75, 1, 2, 3];
    var currentZoom = 2;
    $container.on('mousewheel.focal', function( e ) {
        e.preventDefault();
        var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
        $flowchart.flowchart('setPositionRatio', possibleZooms[currentZoom]);
        $flowchart.panzoom('zoom', possibleZooms[currentZoom], {
            animate: false,
            focal: e
        });
    });



    // Apply the plugin on a standard, empty div...

    $flowchart.flowchart({
      data: lodash.isEmpty($scope.script) ? {} : $scope.script
    });

    $('.delete_selected_button').click(function() {
      $flowchart.flowchart('deleteSelected');
    });

    $('.delete_all_button').click(() => {
      $flowchart.flowchart('setData', {});
    })

    $flowchart.on('linkCreate', function(linkId, linkData) {

      var data = $flowchart.flowchart('getData');
      $http.post('user/updateScript', {
        script: JSON.stringify(data),
        user_id: $rootScope.userinfo.user_id
      });
      $scope.script = data;
      localStorage.setItem("__USER_SCRIPT__", JSON.stringify(data));
    });



    $flowchart.on('operatorSelect2', function(el, operatorId, returnHash) {
      var data = $flowchart.flowchart('getData');
      var title = data.operators[operatorId].properties.title.trim();
      var mode = data.operators[operatorId].properties.mode;

      $scope.tempNode.title = title;

      //$("#myModal").modal('show')
      if(mode === "input"){
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modal/view_input.html',
          controller: function ($scope, $uibModalInstance, $http) {
            $scope.load = function() {
              if(title.indexOf('.csv') !== -1){
                $http({
                    url: "file/get_file/" + title,
                    method: "GET"
                }).success($scope.processData);
              }
              $('#datatables-example').DataTable();
            }

            $scope.generateHtmlTable = function(data) {

          		 var html = '<table class="table table-bordered table-striped table-hover table-condensed  text-center" id="DynamicTable">';

                if(typeof(data[0]) === 'undefined') {
                  return null;
                } else {
          		$.each(data, function( index, row ) {
          		  //bind header
          		  if(index == 0) {
            			html += '<thead>';
            			html += '<tr>';
            			$.each(row, function( index, colData ) {
            				html += '<th>';
            				html += colData;
            				html += '</th>';
            			});
            			html += '<th>';
            			html += 'Actions';
            			html += '</th>';
            			html += '</tr>';
            			html += '</thead>';
            			html += '<tbody>';
          		  } else {
            			html += '<tr>';

            			$.each(row, function( index, colData ) {

            				html += '<td>';
            				html += colData;
            				html += '</td>';

            			});
            			html += '</tr>';
          		  }
          		});
          		html += '</tbody>';
          		html += '</table>';
          		$('#csv-display').append(html);
          		$('#DynamicTable').SetEditable({ $addButton: $('#addNewRow')});
              $('#DynamicTable').paging({
              limit: 10,
              rowDisplayStyle: 'block',
              activePage: 0,
              rows: []

          		});
          	  }
          	}

            $scope.processData = function(file) {
              data = $.csv.toArrays(file);
              $scope.generateHtmlTable(data);
            };

            $scope.load();

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.save = function(){
              var html = document.querySelector("table").outerHTML;
              $scope.export_table_to_csv(html, title);
            }

            $scope.download_csv = function(csv, filename) {
          	    var csvFile;
          	    var downloadLink;

          	    // CSV FILE
          	    csvFile = new Blob([csv], {type: "text/csv"});

          	    // Download link
          	    downloadLink = document.createElement("a");

                var formData = new FormData();
                formData.append('upload', csvFile, filename);

                $.ajax({
                       url : 'file/file_upload',
                       type : 'POST',
                       data : formData,
                       processData: false,  // tell jQuery not to process the data
                       contentType: false,  // tell jQuery not to set contentType
                       success : function(data) {
                           console.log(data);
                           $uibModalInstance.dismiss('cancel');
                       }
                });
          	}

          	$scope.export_table_to_csv = function(html, filename) {
          		var csv = [];
          		var rows = document.querySelectorAll("table tr");

          	    for (var i = 0; i < rows.length; i++) {
          			var row = [], cols = rows[i].querySelectorAll("td, th");

          	        if(i===0){
                      for (var j = 0; j < cols.length - 2; j++){
                        //console.log(cols[j].innerText);
            	            row.push(cols[j].innerText);
                        }
                    }else{
                      for (var j = 0; j < cols.length - 1; j++){
                        //console.log(cols[j].innerText);
            	            row.push(cols[j].innerText);
                        }
                    }

          			csv.push(row.join(","));
          		}

          	    // Download CSV
          	    $scope.download_csv(csv.join("\n"), filename);
          	}

          },
          scope: $scope,
          windowClass: "hmodal-success",
          size: 'lg'
      });
      }else if(mode === "tool"){
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modal/view_node.html',
          controller: function ($scope, $uibModalInstance, $http) {

              $scope.map = {
                logic: ''
              }

              $scope.filter = {
                logic: ''
              }

              $scope.reduce = {
                logic: ''
              }

              $scope.extractUsingRegex = {
                regex: '',
                column: '',
              }

              $scope.splitUsingRegex = {
                regex: '',
                column: '',
              }

              $scope.splitUsingDelimiter = {
                regex: '',
                column: '',
              }

              $scope.duplicate = {
                interleave: false,
                start: 0,
                end: 0,
              }

              $scope.mergeWithDelimiter = {
                delimiter: false,
                start: 0,
                end: 0,
              }

              $scope.filterWithParameter = {
                parameter: '',
                column: '',
                value: '',
                target_column: 0,
              }

              $scope.filterUsingRegex = {
                regex: false,
                start: 0,
                end: 0,
              }

              $scope.slice = {
                start: 0,
                end: 0,
                column: '',
              }

              $scope.convertTypeTo = {
                toType: '',
                column: '',
              }

              $scope.addColumn = {
                at: 0,
                value: '',
              }

              $scope.chooseColumn = {
                indexes: '',
                operation: '',
              }

              $scope.flatten = {
                start: 0,
                end: 0,
              }

              $scope.reduceBy = {
                column: '',
                aggregation: '',
              }

              $scope.sortBy = {
                column: '',
                ascending: false,
              }

              $scope.takeTop = {
                n: 0,
              }

              $scope.parseUserAgent = {
                column: '',
                replace: false
              }

              $scope.parseDateTime = {
                column: '',
                replace: false
              }

              $scope.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
              };

              $scope.submit = function() {
                var data = $flowchart.flowchart('getData');
                $uibModalInstance.dismiss('cancel');
                //$rootScope.script = $scope.script;


                switch(data.operators[operatorId].properties.title){
                  case "map":
                    $rootScope.map = $scope.map;
                    data.operators[operatorId].properties.params = $scope.map;

                  break;
                  case "filter":
                  $rootScope.filter = $scope.filter;
                  data.operators[operatorId].properties.params = $scope.filter;

                  break;
                  case "reduce":
                  $rootScope.reduce = $scope.reduce;
                  data.operators[operatorId].properties.params = $scope.reduce;

                  break;
                  case "extractUsingRegex":
                  $rootScope.extractUsingRegex = $scope.extractUsingRegex;
                  data.operators[operatorId].properties.params = $scope.extractUsingRegex;

                  break;
                  case "splitUsingRegex":
                  $rootScope.splitUsingRegex = $scope.splitUsingRegex;
                  data.operators[operatorId].properties.params = $scope.splitUsingRegex;

                  break;
                  case "splitUsingDelimiter":
                  $rootScope.splitUsingDelimiter = $scope.splitUsingDelimiter;
                  data.operators[operatorId].properties.params = $scope.splitUsingDelimiter;

                  break;
                  case "duplicate":
                  $rootScope.duplicate = $scope.duplicate;
                  data.operators[operatorId].properties.params = $scope.duplicate;

                  break;
                  case "mergeWithDelimiter":
                  $rootScope.mergeWithDelimiter = $scope.mergeWithDelimiter;
                  data.operators[operatorId].properties.params = $scope.mergeWithDelimiter;

                  break;
                  case "filterWithParameter":
                  $rootScope.filterWithParameter = $scope.filterWithParameter;
                  data.operators[operatorId].properties.params = $scope.filterWithParameter;

                  break;
                  case "filterUsingRegex":
                  $rootScope.filterUsingRegex = $scope.filterUsingRegex;
                  data.operators[operatorId].properties.params = $scope.filterUsingRegex;

                  break;
                  case "slice":
                  $rootScope.slice = $scope.slice;
                  data.operators[operatorId].properties.params = $scope.slice;

                  break;
                  case "convertTypeTo":
                  $rootScope.convertTypeTo = $scope.convertTypeTo;
                  data.operators[operatorId].properties.params = $scope.convertTypeTo;

                  break;
                  case "addColumn":
                  $rootScope.addColumn = $scope.addColumn;
                  data.operators[operatorId].properties.params = $scope.addColumn;

                  break;
                  case "chooseColumn":
                  $rootScope.chooseColumn = $scope.chooseColumn;
                  data.operators[operatorId].properties.params = $scope.chooseColumn;

                  break;
                  case "flatten":
                  $rootScope.flatten = $scope.flatten;
                  data.operators[operatorId].properties.params = $scope.flatten;

                  break;
                  case "reduceBy":
                  $rootScope.reduceBy = $scope.reduceBy;
                  data.operators[operatorId].properties.params = $scope.reduceBy;

                  break;

                  case "sortBy":
                  $rootScope.sortBy = $scope.sortBy;
                  data.operators[operatorId].properties.params = $scope.sortBy;

                  break;
                  case "takeTop":
                  $rootScope.takeTop = $scope.takeTop;
                  data.operators[operatorId].properties.params = $scope.takeTop;

                  break;
                  case "parseUserAgent":
                  $rootScope.parseUserAgent = $scope.parseUserAgent;
                  data.operators[operatorId].properties.params = $scope.parseUserAgent;

                  break;
                  case "parseDateTime":

                  $rootScope.parseDateTime = $scope.parseDateTime;
                  data.operators[operatorId].properties.params = $scope.parseDateTime;

                  break;
                }


                console.log($rootScope, $scope, data);

                $http.post('user/updateScript', {
                  script: JSON.stringify(data),
                  user_id: $rootScope.userinfo.user_id
                });
                $scope.script = data;
                localStorage.setItem("__USER_SCRIPT__", JSON.stringify(data));

                $flowchart.flowchart('setData', data);
                console.log($flowchart.flowchart('getData'));
              }

              $scope.load = function() {

                switch(data.operators[operatorId].properties.title){
                  case "map":
                    $scope.map = {
                      ...data.operators[operatorId].properties.params
                    }

                  break;
                  case "filter":
                  $scope.filter = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "reduce":
                  $scope.reduce = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "extractUsingRegex":
                  $scope.extractUsingRegex = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "splitUsingRegex":
                  $scope.splitUsingRegex = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "splitUsingDelimiter":
                  $scope.splitUsingDelimiter = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "duplicate":
                  $scope.duplicate = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "mergeWithDelimiter":
                  $scope.mergeWithDelimiter = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "filterWithParameter":
                  $scope.filterWithParameter = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "filterUsingRegex":
                  $scope.filterUsingRegex = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "slice":
                  $scope.slice = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "convertTypeTo":
                  $scope.convertTypeTo = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "addColumn":
                  $scope.addColumn = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "chooseColumn":
                  $scope.chooseColumn = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "flatten":
                  $scope.flatten = {
                    ...data.operators[operatorId].properties.params
                  }
                  console.log($scope.flatten)
                  break;
                  case "reduceBy":
                  $scope.reduceBy = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;

                  case "sortBy":
                  $scope.sortBy = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "takeTop":
                  $scope.takeTop = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "parseUserAgent":
                  $scope.parseUserAgent = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                  case "parseDateTime":

                  $scope.parseDateTime = {
                    ...data.operators[operatorId].properties.params
                  }
                  break;
                }

              }

              $scope.load();

          },
          scope: $scope,
          windowClass: "hmodal-success",
          size: 'lg'
      });
    }else if(mode === "output"){

        var modalInstance = $uibModal.open({
          templateUrl: 'views/modal/view_output.html',
          controller: function ($scope, $uibModalInstance, $http) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.submit = function() {
              $uibModalInstance.dismiss('cancel');
              //$rootScope.script = $scope.script;
              data.operators[operatorId].properties.limit = $scope.output.limit;
              data.operators[operatorId].properties.isSorted = $scope.output.isSorted;
              $flowchart.flowchart('setData', data);

              $rootScope.output = $scope.output;
            }


          },
          scope: $scope,
          windowClass: "hmodal-success",
          size: 'lg'
      });
      }

     })


    var $draggableOperators = $('.draggable_operator');

    function getOperatorData($element) {
      var nbInputs = parseInt($element.data('nb-inputs'));
      var nbOutputs = parseInt($element.data('nb-outputs'));
      var data = {
        properties: {
          title: $element.text(),
          inputs: {},
          outputs: {}
        }
      };

      var i = 0;
      for (i = 0; i < nbInputs; i++) {
        data.properties.inputs['input_' + i] = {
          label: 'Input ' + (i + 1)
        };
      }
      for (i = 0; i < nbOutputs; i++) {
        data.properties.outputs['output_' + i] = {
          label: 'Output ' + (i + 1)
        };
      }

      return data;
    }

    var operatorId = 0;

    $draggableOperators.draggable({
        cursor: "move",
        opacity: 0.7,

        helper: 'clone',
        appendTo: 'body',
        zIndex: 1000,

        helper: function(e) {
          var $this = $(this);
          var data = getOperatorData($this);
          return $flowchart.flowchart('getOperatorElement', data);
        },
        stop: function(e, ui) {
            var $this = $(this);
            var elOffset = ui.offset;
            var containerOffset = $container.offset();
            if (elOffset.left > containerOffset.left &&
                elOffset.top > containerOffset.top &&
                elOffset.left < containerOffset.left + $container.width() &&
                elOffset.top < containerOffset.top + $container.height()) {

                var flowchartOffset = $flowchart.offset();

                var relativeLeft = elOffset.left - flowchartOffset.left;
                var relativeTop = elOffset.top - flowchartOffset.top;

                var positionRatio = $flowchart.flowchart('getPositionRatio');
                relativeLeft /= positionRatio;
                relativeTop /= positionRatio;

                var data = getOperatorData($this);
                data.left = relativeLeft;
                data.top = relativeTop;

                $flowchart.flowchart('addOperator', data);
            }
        }
    });


  });
