var m = L.map('map').setView([42.2, -71], 8).hash();
var baseMaps = [
    "MapQuestOpen.OSM",
    "OpenStreetMap.Mapnik",
    "OpenStreetMap.DE",
    "Esri.WorldImagery",
    "Stamen.TerrainBackground",
    "Stamen.Watercolor"
]
var popup = L.popup();

var carto = {
    url:"http://{account}.cartodb.com/tiles/{table_name}/{z}/{x}/{y}.png", 
    opts : {
        account : "cwm",
        table_name : "oa"
    },
};
carto.layer = L.tileLayer(carto.url, carto.opts).addTo(m);

var overlayMaps = {"Outdoor Advertising" : carto.layer};

var lc = L.control.layers.filled(baseMaps, overlayMaps, {map : m});
var ee;
function makeGrid(url){
    
var utfGrid = new L.UtfGrid(url,{resolution:4});
m.addLayer(utfGrid);

utfGrid.on('click', function (e) {
    ee=e;

    		if (e.data) {
            L.Util.jsonp("http://cwm.cartodb.com/api/v2/sql?q=SELECT permit, permitholdersname, signcity, signtype, roadintendedtoface FROM oa where cartodb_id ="+e.data.cartodb_id, function(dd){
            var content = [];
            var d = dd.rows[0];
            for(key in d){
                content.push(key + ": " + d[key]);
            }
            popup.setLatLng(e.latlng).setContent(content.join("<br />")).openOn(m);
            });
			} 
		}); 
var mapDiv = L.DomUtil.get("map");
var oldStyle = mapDiv.getAttribute("style");
utfGrid.on('mouseover', function (e) {

    mapDiv.setAttribute("style", oldStyle + " cursor: pointer;")
});
utfGrid.on('mouseout', function (e) {
 
    mapDiv.setAttribute("style", oldStyle)
});
return utfGrid;
}
var utfGrid = makeGrid("http://cwm.cartodb.com/tiles/oa/{z}/{x}/{y}.grid.json?callback={cb}");
$(function(){ 
$( "#tabs" ).tabs({
            collapsible: true,
            selected: -1
    	});
});
var signTypes = ["Traditional Display", "Street Furniture", "Digital"];
var frag = document.createDocumentFragment();
signTypes.forEach(function(v){
    var o = document.createElement("option");
    o.value = v;
    o.innerHTML = v;
    frag.appendChild(o);
});
var s = document.getElementById("SignType");
s.appendChild(frag);
var dd;
$("#fQuery").submit(function(){
   var signtype = $("#SignType").val();
   var url = "http://{account}.cartodb.com/tiles/{table_name}/{z}/{x}/{y}.png";
   if (signtype=="all"){
       carto.layer.setUrl(url)
       m.removeLayer(utfGrid);
       utfGrid = makeGrid("http://cwm.cartodb.com/tiles/oa/{z}/{x}/{y}.grid.json?callback={cb}");
  
   }else{
       var sql = "sql=SELECT * FROM oa where signtype ='{signtype}'";
       carto.layer.setUrl(url + "?" + L.Util.template(sql, {signtype:signtype}));
       m.removeLayer(utfGrid);
       utfGrid = makeGrid("http://cwm.cartodb.com/tiles/oa/{z}/{x}/{y}.grid.json?callback={cb}" + "&" + L.Util.template(sql, {signtype:signtype}));
     
   }
   return false;
   
});
$(".np").change(function(){
    $("#fQuery").submit();
})