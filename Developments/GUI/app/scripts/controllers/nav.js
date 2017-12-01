'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 *  MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('NavCtrl', function ($rootScope, $scope, $state, $http, $timeout) {

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
            response.data.forEach((file, idx) => {
                $("#inputFileList")
                  .append(`<li class="primary-submenu draggable_operator" data-nb-inputs="0" data-nb-outputs="1" data-title="${file.name}" data-idx="${idx + 7}" data-mode="input" ><a href="#">
                    <div>
                      <div class="nav-label" style="z-index:10000;">${file.name}</div>
                    </div>
                  </a>
                  </li>`)

            })



            var $draggableOperators = $('.draggable_operator');
            console.log($draggableOperators);

            function getOperatorData($element) {
              var nbInputs = parseInt($element.data('nb-inputs'));
              var nbOutputs = parseInt($element.data('nb-outputs'));

              var data = {
                properties: {
                  title: $element.data('title'),
                  inputs: {},
                  outputs: {},
                  dataset_id: 0,
                  script:"",
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
                    }
                }
            });

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response.statusText);
    });

    $timeout(function(){
          $(".file_lists").draggable();
      });

    $scope.run = function(){
        var data = $rootScope.flowchart.flowchart('getData');
        console.log(JSON.stringify(data, null, 2));
        console.log(data.operators);
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

        //$scope.evokeWithRouter("filter", 1, $rootScope.script);
    }


    $scope.evokeWithRouter = function(name_function, dataset_id, script) {



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

        $.ajax({
          type: "POST",
          url: `http://localhost:8080/process/`+dataset_id,
          data: json,
          dataType: "text",
          success: function(response)
          {
            alert(response);
          }
        });
    }


  });
