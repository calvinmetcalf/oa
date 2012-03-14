var m;
var baseid = 1632887;
var oaid = 3145994;
var geocoder = new google.maps.Geocoder();
var zoom = 8;
var center = new google.maps.LatLng(42.04113400940814,-71.795654296875);
var marker;
var mainLayer;

$(function() {
        $( "#tabs" ).tabs({
    		collapsible: true,
            selected: -1
		});
        $( "input:submit,input:reset" ).button();
        $('input, textarea').placeholder();
        fusion();
        popLists();
	});

function fusion() {
    
  m = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });

var baseLayer = new google.maps.FusionTablesLayer(baseid);
  baseLayer.setQuery("SELECT 'geometry' FROM " + baseid);
  baseLayer.setMap(m);
  baseLayer.setOptions({suppressInfoWindows:true});
  
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

var getSignData = MakeData("signType"," AND 'SignType' like '")
var getHolderData = MakeData("holderName"," AND 'PermitHoldersName' like '")
var getMuniData = MakeData("cityTown"," AND 'SignCity' like '")

function MakeData(selectID,querryText){

function getData(response) {
  // Get the number of rows
var numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
 var typeSelect = document.getElementById(selectID);  
  for(i = 0; i < numRows; i++) {
      var ftData = response.getDataTable().getValue(i, 0);
      if (!ftData)
     { continue;}
     else if
     (String(ftData).indexOf(",")>-1)
     {continue;}
     else
     { var newoption = document.createElement('option');
      newoption.setAttribute('value',querryText + ftData + "'");
    newoption.innerHTML = ftData;
    typeSelect.appendChild(newoption);}
  }  
}
return getData;
}



function changeMap() {
  var signType = document.getElementById('signType').value.replace("'", "\\'");
  var holderName = document.getElementById('holderName').value.replace("'", "\\'");
  var cityTown = document.getElementById('cityTown').value.replace("'", "\\'");
  mainLayer.setQuery("SELECT 'point' FROM " + oaid + " WHERE 'Status' = 'Active' " + signType + holderName + cityTown);
 
}


function lookupPermit() {
  var permitNum = document.getElementById('permitNumber').value.replace("'", "\\'");
  mainLayer.setQuery("SELECT 'point' FROM " + oaid + " WHERE 'PermitNumber' = '" + permitNum + "'");
  var centerQueryText = encodeURIComponent("SELECT 'Latitude', 'Longitude' FROM " + oaid + " WHERE 'PermitNumber' = '" + permitNum + "'");
 /*I have no idea why "'PermitNumber' = " works here but "'PermitNumber' CONTAINS" does not*/
 var centerQuery = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + centerQueryText);
  centerQuery.send(zoomTo);
}

function zoomTo(response) {

if (!response) {
  alert('no response');
  return;
}

if (response.isError()) {
  alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
  return;
} 



m.setCenter(new google.maps.LatLng(

          parseFloat(response.getDataTable().getValue(0, 0)),

          parseFloat(response.getDataTable().getValue(0, 1))

));

m.setZoom(14);

}

function resetPermit(){
      m.setCenter(center);
    m.setZoom(zoom);
    changeMap();
    
}
