var m;
var baseid = 1632887;
var oaid = 3145994;
var geocoder = new google.maps.Geocoder();
var zoom = 8;
var center = new google.maps.LatLng(42.04113400940814,-71.795654296875);
var marker;

function initialize() {
 

  m = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });
 
  
    
    
    
var baseLayer = new google.maps.FusionTablesLayer(baseid);
  baseLayer.setQuery("SELECT 'geometry' FROM " + baseid);
  baseLayer.setMap(m);
  
var mainLayer = new google.maps.FusionTablesLayer(oaid);
  mainLayer.setQuery("SELECT 'point' FROM " + oaid + " WHERE 'Status' = 'Active'");
  mainLayer.setMap(m);
  
  }
  
  function SelectAll(id)
{
    document.getElementById(id).focus();
    document.getElementById(id).select();
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