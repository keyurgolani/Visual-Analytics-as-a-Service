'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 *  MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('NavCtrl', function ($rootScope, $scope, $state, $http, $timeout, lodash) {
        $rootScope.userinfo = angular.fromJson(localStorage.getItem("__USER_INFO__"));
        $scope.userinfo = $rootScope.userinfo;

        console.log($scope.userinfo);
        $(".draggable").draggable({
        revert : function(event, ui) {
            // on older version of jQuery use "draggable"
            // $(this).data("draggable")
            // on 2.x versions of jQuery use "ui-draggable"
            // $(this).data("ui-draggable")
            $(this).data("uiDraggable").originalPosition = {
                top : 0,
                left : 0
            };
            // return boolean
            return !event;
            // that evaluate like this:
            // return event !== false ? false : true;
        }

        //console.log(localStorage.getItem("__USER_INFO__"));
    });

    $scope.result = function() {
      $state.go('index.result');
    }

    $scope.main = function () {
      $state.go('index.main');
    }

    $scope.logout = function() {
      localStorage.removeItem("__USER_INFO__");
      $state.go('login');
    }

    $scope.upload = function() {
      $state.go('index.upload');
    }

    $http({
        url: "file/get_file_list",
        method: "GET"
    }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            //console.log(response.data)
            $scope.fileList = response.data;
            console.log(!lodash.isEmpty(response.data))
            if(!lodash.isEmpty(response.data)){
              response.data.forEach((file, idx) => {
                  $("#inputFileList")
                    .append(`<li class="primary-submenu draggable_operator" data-nb-inputs="0" data-nb-outputs="1" data-title="${file.name}" data-dataset_id="${file.dataset_id}" data-idx="${idx + 7}" data-mode="input" ><a href="#">
                      <div>
                        <div class="nav-label" style="z-index:10000;">${file.name}</div>
                      </div>
                    </a>
                    </li>`)

              });
            }


                var $draggableOperators = $('.draggable_operator');
                console.log($draggableOperators);

                function getOperatorData($element) {
                  var nbInputs = parseInt($element.data('nb-inputs'));
                  var nbOutputs = parseInt($element.data('nb-outputs'));

                  var dataset_id = ($element.data('mode') === 'input' ? $element.data('dataset_id') : 0);
                  var data = {
                    properties: {
                      title: $element.data('title'),
                      inputs: {},
                      outputs: {},
                      dataset_id,
                      mode: $element.data('mode')
                    }
                  };
                  console.log(data);

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
                  console.log(data);
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
                      return $rootScope.flowchart.flowchart('getOperatorElement', data);
                    },
                    stop: function(e, ui) {
                        var $this = $(this);
                        var elOffset = ui.offset;
                        var $container = $rootScope.flowchart.parent();
                        var containerOffset = $container.offset();
                        if (elOffset.left > containerOffset.left &&
                            elOffset.top > containerOffset.top &&
                            elOffset.left < containerOffset.left + $container.width() &&
                            elOffset.top < containerOffset.top + $container.height()) {

                            var flowchartOffset = $rootScope.flowchart.offset();

                            var relativeLeft = elOffset.left - flowchartOffset.left;
                            var relativeTop = elOffset.top - flowchartOffset.top;

                            var positionRatio = $rootScope.flowchart.flowchart('getPositionRatio');
                            relativeLeft /= positionRatio;
                            relativeTop /= positionRatio;

                            var data = getOperatorData($this);
                            data.left = relativeLeft;
                            data.top = relativeTop;


                            $rootScope.flowchart.flowchart('addOperator', data);
                            var data2 = $rootScope.flowchart.flowchart('getData');
                            $http.post('user/updateScript', {
                              script: JSON.stringify(data2),
                              user_id: $rootScope.userinfo.user_id
                            });
                            localStorage.setItem("__USER_SCRIPT__", JSON.stringify(data2));
                        }
                    }
                });

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response.statusText);


                var $draggableOperators = $('.draggable_operator');
                console.log($draggableOperators);

                function getOperatorData($element) {
                  var nbInputs = parseInt($element.data('nb-inputs'));
                  var nbOutputs = parseInt($element.data('nb-outputs'));

                  var dataset_id = ($element.data('mode') === 'input' ? $element.data('dataset_id') : 0);
                  var data = {
                    properties: {
                      title: $element.data('title'),
                      inputs: {},
                      outputs: {},
                      dataset_id,
                      mode: $element.data('mode')
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
                      return $rootScope.flowchart.flowchart('getOperatorElement', data);
                    },
                    stop: function(e, ui) {
                        var $this = $(this);
                        var elOffset = ui.offset;
                        var $container = $rootScope.flowchart.parent();
                        var containerOffset = $container.offset();
                        if (elOffset.left > containerOffset.left &&
                            elOffset.top > containerOffset.top &&
                            elOffset.left < containerOffset.left + $container.width() &&
                            elOffset.top < containerOffset.top + $container.height()) {

                            var flowchartOffset = $rootScope.flowchart.offset();

                            var relativeLeft = elOffset.left - flowchartOffset.left;
                            var relativeTop = elOffset.top - flowchartOffset.top;

                            var positionRatio = $rootScope.flowchart.flowchart('getPositionRatio');
                            relativeLeft /= positionRatio;
                            relativeTop /= positionRatio;

                            var data = getOperatorData($this);
                            data.left = relativeLeft;
                            data.top = relativeTop;


                            $rootScope.flowchart.flowchart('addOperator', data);
                            var data2 = $rootScope.flowchart.flowchart('getData');
                            $http.post('user/updateScript', {
                              script: JSON.stringify(data2),
                              user_id: $rootScope.userinfo.user_id
                            });
                        }
                    }
                });
    });


    $scope.run = function(){
        var data = $rootScope.flowchart.flowchart('getData');
        $http.post('user/updateScript', {
          script: JSON.stringify(data),
          user_id: $rootScope.userinfo.user_id
        });
        // console.log(JSON.stringify(data, null, 2));
        // console.log(data.operators);
        let noOfInput = 0, noOfOutput = 0;

        $.each(data.operators, (idx, d) => {
          const {title, mode } = d.properties;
          if(mode === "input")  noOfInput++;
          if(mode === "output") noOfOutput++;
        })

        if(noOfInput === 0){
          alert("No input file added!");
          return;
        }

        if(noOfOutput === 0){
          alert("No output file added!");
          return;
        }




        // JSON parsing for server.py


        var data_flowChart = data;

        // console.log(data_flowChart);


        var dataset_id_from_json="";
        var output_format = "";
        var tools = {};

        var final_JSON=[];
        //var output = {};


        // Add all "operators" hashtable

        var data_operators = data_flowChart.operators;
        // console.log(data_operators);
        var length = Object.keys(data_operators).length;
        console.log(length, data_operators);
        var links = data_flowChart.links;

        var arrOperators = Object.keys(data_operators);
        var arrLinks = Object.keys(links);
        console.log("Array of Links: "+ arrLinks.length);

        let output = {};

        //Iterating through links
        for(var k =0;k<arrOperators.length;k++){
          //Get the from operator of each list object
          //console.log("---------"+JSON.stringify(links[k]))

          if(k==arrLinks.length){
            var fromOp = links[arrLinks[k-1]].toOperator;
          }
          else{
            var fromOp = links[arrLinks[k]].fromOperator;
          }

          console.log("fromOp "+fromOp);
          //Check if this fromOp is present in Operators
          if(data_operators[fromOp] != null) {
            console.log("IN")
            var mode =  data_operators[fromOp].properties.mode;
            console.log(data_operators[fromOp])
            //Modes
            if(mode === "input") {
              console.log("-----------:",data_operators[fromOp].properties)
              dataset_id_from_json = data_operators[fromOp].properties.dataset_id;
            }
            else if(mode === "output") {
              console.log(data_operators[fromOp].properties);
              const {title:format, isSorted = false, limit = 0} = data_operators[fromOp].properties;
              //output_format = data_operators[fromOp].properties.title;
              // console.log("output_format"+ output_format);

              output = {
                format,
                isSorted,
                limit
              };
            }
            else if(mode === "tool") {
              const {title: node, params} = data_operators[fromOp].properties;

              let tools;
              switch(node){
                case "map":
                  tools = {
                    node,
                    params
                  }
                  break;
                case "reduce":
                  tools = {
                    node,
                    params
                  }
                  break;
                case "filter":
                tools = {
                  node,
                  params
                }
                break;
                case "extractUsingRegex":
                data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "splitUsingRegex":
                  data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "splitUsingDelimiter":
                data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "duplicate":
                  tools = {
                    node,
                    params
                  }
                  break;
                case "mergeWithDelimiter":
                  tools = {
                    node,
                    params
                  }
                  break;
                case "filterWithParameter":
                  data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  data_operators[fromOp].properties.params.target_column = Number(data_operators[fromOp].properties.params.target_column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "filterUsingRegex":
                  tools = {
                    node,
                    params
                  }
                  break;
                case "slice":
                data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "convertTypeTo":

                  data_operators[fromOp].properties.params.column = data_operators[fromOp].properties.params.column.trim().split(',').map(Number);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "addColumn":
                  tools = {
                    node,
                    params
                  }
                  break;
                case "chooseColumn":
                  data_operators[fromOp].properties.params.indexes = data_operators[fromOp].properties.params.indexes.trim().split(',').map(Number);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "flatten":
                  tools = {
                    node,
                    params
                  }
                  break;
                case "reduceBy":
                  data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "sortBy":
                  data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "distinct":
                  tools = {
                    node
                  }
                  break;
                case "takeTop":
                  tools = {
                    node,
                    params
                  }
                  break;
                case "parseUserAgent":
                  data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "parseDateTime":
                  data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                case "findDistance":
                  data_operators[fromOp].properties.params.lat1 = Number(data_operators[fromOp].properties.params.lat1);
                  data_operators[fromOp].properties.params.lng1 = Number(data_operators[fromOp].properties.params.lng1);
                  data_operators[fromOp].properties.params.lat2 = Number(data_operators[fromOp].properties.params.lat2);
                  data_operators[fromOp].properties.params.lng2 = Number(data_operators[fromOp].properties.params.lng2);
                  
                  tools = {
                    node,
                    params
                  }
                  break;
                case "parkMedian":
                  data_operators[fromOp].properties.params.column = Number(data_operators[fromOp].properties.params.column);
                  tools = {
                    node,
                    params
                  }
                  break;
                  case "removeHeader":
                    tools = {
                      node
                    }
                    break;
                }


console.log("tools", tools);
              final_JSON.push(tools)
            }
          }
        }

        // TODO Get the isSorted and limit from front end



        console.log("Final JSON:: "+JSON.stringify(final_JSON));
        console.log("output:: "+JSON.stringify(output));
        console.log("dataset_id:: "+ dataset_id_from_json);


        /*//Iterating through operators
        for (var j =0; j<arrOperators.length;j++){

        }*/




        /*for(var i = 0; i < length ; i++) {

          var operator = data_operators[i];
          // console.log(operator);

          if(operator.mode == "input") {
            dataset_id_from_json = operator.properties.dataset_id;
          }
          else if(operator.mode == "output") {

          }
          else if(operator.mode == "tool") {
            tools[i] = {};
            tools[i]["title"] = operator.properties.title;
            tools[i]["logic"] = operator.properties.logic;
            tools[i]["params"] = operator.properties.params;
          }
        }//*/


        // var links = data_flowChart.links;
        // console.log(links);

        // for(var i=0;i<links.length;i++) {
        //   var sublink = links.i;

        //   if(sublink.fromOperator != sublink.toOperator) {
        //     // var from =
        //     console.log(sublink);


        //  }
      //     "fromOperator": 0,
      // "fromConnector": "output_0",
      // "fromSubConnector": 0,
      // "toOperator": 1,
      // "toConnector": "input_0",
      // "toSubConnector": 0

        // }

        // for(var i=0;i<data_flowChart.restaurants.length;i++) {
        //   if(allRestaurantsJSON.restaurants[i].name.indexOf(searchByrestaurantName)>-1){
        //     return i;
        //   }
        // }


        $scope.evokeWithRouter(dataset_id_from_json, final_JSON, output);
    }


    $scope.evokeWithRouter = function(dataset_id, jsonFile, output_options) {



        /*script = {
            {
                Name:"Map",
                Logic, "Logic"
            },
            {
                Name:"Reduce",
                Logic, "Logic"
            },
            {
            "node": "extractUsingRegex",
            "params": {
                "regex": "",
                "column": ""
            }
        }*/


        // var json =  [
        // {
        //  {
        //      "node": name_function,
        //      "logic": script //TODO: Filter Code to be passed here
        //  },

        // ]

        console.log($scope.userinfo)

        $http({
          method : "POST",
					url : 'http://localhost:8080/process',
					data : {
            "user_id": $scope.userinfo.user_id,
						"dataset_id" : dataset_id,
            "node_chain": jsonFile,
						"output" : output_options
					}
				}).then((results) => {
					alert(results)
				}, (error) => {
					console.log("Error", error);
				});
    }


  });
