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
var utfGrid = new L.UtfGrid("http://cwm.cartodb.com/tiles/oa/{z}/{x}/{y}.grid.json?callback={cb}",{resolution:4});
m.addLayer(utfGrid);

utfGrid.on('click', function (e) {
    ee=e;
    console.log("click")
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
    console.log("moved in")
    mapDiv.setAttribute("style", oldStyle + " cursor: pointer;")
});
utfGrid.on('mouseout', function (e) {
    console.log("moved out")
    mapDiv.setAttribute("style", oldStyle)
});
 
"http://cwm.cartodb.com/api/v2/sql?q=SELECT * FROM oa where cartodb_id =2"