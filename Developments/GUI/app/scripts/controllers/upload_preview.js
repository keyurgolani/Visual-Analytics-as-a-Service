'use strict';

/**
 * @ngdoc function
 * @name visualAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualAnalyticsApp
 */
angular.module('visualAnalyticsApp')
  .controller('UploadPreviewCtrl', function ($scope, $http, $state, $stateParams) {

    //console.log($stateParams.file_name);

    $(document).ready(function(){
  	var data;

  var firstFile =   $stateParams.file_name.split(",")[$stateParams.seq - 1];
    console.log(firstFile);
  	$.ajax({
  	  type: "GET",
  	  url: `get_file/${firstFile}`,
  	  dataType: "text",
  	  success: function(response)
  	  {
  		data = $.csv.toArrays(response);
  		generateHtmlTable(data);
  	  }
  	});

  	function download_csv(csv, filename) {
  	    var csvFile;
  	    var downloadLink;

  	    // CSV FILE
  	    csvFile = new Blob([csv], {type: "text/csv"});

  	    // Download link
  	    downloadLink = document.createElement("a");
/*
  	    // File name
  	    downloadLink.download = filename;

  	    // We have to create a link to the file
  	    downloadLink.href = window.URL.createObjectURL(csvFile);

  	    downloadLink.style.display = "none";

  	    document.body.appendChild(downloadLink);

  	    downloadLink.click();*/

        var formData = new FormData();
        formData.append('data_files', csvFile, filename);

        $.ajax({
               url : 'file_upload',
               type : 'POST',
               data : formData,
               processData: false,  // tell jQuery not to process the data
               contentType: false,  // tell jQuery not to set contentType
               success : function(data) {
                   console.log(data);
                   //alert(data);
                   $state.go('index.main');
               }
        });
  	}

  	function export_table_to_csv(html, filename) {
  		var csv = [];
  		var rows = document.querySelectorAll("table tr");

  	    for (var i = 0; i < rows.length; i++) {
  			var row = [], cols = rows[i].querySelectorAll("td, th");

  	        for (var j = 0; j < cols.length; j++)
  	            row.push(cols[j].innerText);

  			csv.push(row.join(","));
  		}

  	    // Download CSV
  	    download_csv(csv.join("\n"), filename);
  	}

  	$("#btn_done").click(function () {
  	    var html = document.querySelector("table").outerHTML;
  		export_table_to_csv(html, $stateParams.file_name);
  	});

    $("#btn_next").click(function() {
      $state.go('index.upload_preview', {'file_name': $stateParams.file_name,'seq': parseInt($stateParams.seq) + 1});
      //$state.go('index.upload_preview', {'file_name': fileNames, 'seq': 1});
      //seq = seq +1;
      //console.log(seq);
    })

  	function generateHtmlTable(data) {

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
  	  }
  	}
    });

  });
