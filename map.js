var m;
var baseid = 1632887;
var oaid = 3145994;
var lat = 42.04113400940814;
var lng = -71.795654296875;
var zoom = 8;

function initialize() {
 

  m = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(lat,lng),
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