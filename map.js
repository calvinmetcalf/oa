var m = L.map('map').setView([42.2, -71], 8).hash();
var baseMaps = [
    "MapQuestOpen.OSM",
    "OpenStreetMap.Mapnik",
    "OpenStreetMap.DE",
    "Esri.WorldImagery",
    "Stamen.TerrainBackground",
    "Stamen.Watercolor"
];

var oa = L.geoJson.ajax("oa.geojson",{style:onEach,pointToLayer:point2layer,onEachFeature:onEachFeature}).addTo(m);

var overlayMaps = {"Outdoor Advertising":oa};

var lc = L.control.layers.filled(baseMaps, overlayMaps, {map : m});

function onEach(e) {
    if(e.properties.SignType=="Street Furniture"){
        return{color:"#000",fillColor:"#ffff00",fillOpacity:0.8,opacity:1,weight:1};   
    }else if(e.properties.SignType=="Traditional Display"){
        return{color:"#000",fillColor:"#ff0000",fillOpacity:0.8,opacity:1,weight:1};   
    }else{
        return{color:"#000",fillColor:"#00ff00",fillOpacity:0.8,opacity:1,weight:1};   
    }
}
function point2layer(f,latlng){
    return L.circleMarker(latlng,{radius:4});
}
function onEachFeature(e,l){
    l.bindPopup(makePop(e.properties));
}
function up(word){return word.substring(0,1).toUpperCase()+word.substring(1);};
function makePop(p){
    var a = Object.keys(p).filter(function(f){
        return ["OBJECTID","Status","Latitude","Longitude","Icon","PhysicalTown"].indexOf(f)==-1;
    }).map(function(v){
        return v.replace(/(([a-z])([A-Z]))/g,"$2 $3") +": "+p[v];
    });
    return a.join("<br />")
}