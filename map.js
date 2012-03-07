var m;
var baseid = 1632887;
var oaid = 3145994;
var geocoder = new google.maps.Geocoder();
var zoom = 8;
var center = new google.maps.LatLng(42.04113400940814,-71.795654296875);
var marker;
var mainLayer

function initialize() {
    
  m = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });

var baseLayer = new google.maps.FusionTablesLayer(baseid);
  baseLayer.setQuery("SELECT 'geometry' FROM " + baseid);
  baseLayer.setMap(m);
  
 mainLayer = new google.maps.FusionTablesLayer(oaid);
  mainLayer.setQuery("SELECT 'point' FROM " + oaid + " WHERE 'Status' = 'Active'");
  mainLayer.setMap(m);
  }

function geocode() {
     var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        m.setCenter(results[0].geometry.location);
        m.setZoom(14);
     marker = new google.maps.Marker({
            map: m, 
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

function resetgeo() {
    
    m.setCenter(center);
    m.setZoom(zoom);
marker.setMap(null);
}

 $(function() {
    	$( "#tabs" ).tabs({
			collapsible: true,
            selected: -1
		});
        $( "input:submit,input:reset" ).button();
	});
    
    google.load('visualization', '1', {});
    
function popLists(){    
    var querySignText = encodeURIComponent("SELECT 'SignType', COUNT() FROM " + oaid + " GROUP BY 'SignType'");
    var querySign = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + querySignText);
	querySign.send(getSignData);
    
    var queryHolderText = encodeURIComponent("SELECT 'PermitHoldersName', COUNT() FROM " + oaid + " GROUP BY 'PermitHoldersName'");
    var queryHolder = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryHolderText);
	queryHolder.send(getHolderData);
            
    var queryMuniText = encodeURIComponent("SELECT 'SignCity', COUNT() FROM " + oaid + " GROUP BY 'SignCity'");
	var queryMuni = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryMuniText);
	queryMuni.send(getMuniData);
}

function getSignData(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  typeSelect = document.getElementById("signType");  
  for(i = 0; i < numRows; i++) {
      newoption = document.createElement('option');
  	newoption.setAttribute('value'," AND 'SignType' like '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	typeSelect.appendChild(newoption);
  }  
}

function getHolderData(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  holderSelect = document.getElementById("holderName");  
  for(i = 0; i < numRows; i++) {
      newoption = document.createElement('option');
 	newoption.setAttribute('value'," AND 'PermitHoldersName' like '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	holderSelect.appendChild(newoption);
  }  
}
function getMuniData(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  muniSelect = document.getElementById("cityTown");  
  for(i = 0; i < numRows; i++) {
  	newoption = document.createElement('option');
  	newoption.setAttribute('value'," AND 'SignCity' like '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	muniSelect.appendChild(newoption);
  }  
}

function changeMap() {
  var signType = document.getElementById('signType').value.replace("'", "\\'");
  var holderName = document.getElementById('holderName').value.replace("'", "\\'");
  var cityTown = document.getElementById('cityTown').value.replace("'", "\\'");
  mainLayer.setQuery("SELECT 'point' FROM " + oaid + " WHERE 'Status' = 'Active' " + signType + holderName + cityTown);
 
}
