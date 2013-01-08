var m = L.map('map').setView([42.2, -71], 8).hash();
var baseMaps = [
    "MapQuestOpen.OSM",
    "OpenStreetMap.Mapnik",
    "OpenStreetMap.DE",
    "Esri.WorldImagery",
    "Stamen.TerrainBackground",
    "Stamen.Watercolor"
];
var values={};
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
function makePop(p){
    var a = Object.keys(p).filter(function(f){
        return ["OBJECTID","Status","Latitude","Longitude","Icon","PhysicalTown"].indexOf(f)==-1;
    }).map(function(v){
        return v.replace(/(([a-z])([A-Z]))/g,"$2 $3") +": "+p[v];
    });
    return a.join("<br />");
}
function addValues(v){
    Object.keys(v).forEach(function(k){
        if(!(values[k])){
            values[k]=[];
        }
        if(values[k].indexOf(v[k])===-1){
        values[k].push(v[k]);
        }
        });
}
function query(obj){
    if(obj){
    values = {};
    oa.refilter(function(v){
        
        if(Object.keys(obj).every(function(k){
           return obj[k]===v.properties[k];
        })){
            addValues(v.properties);
            return true;
        }
    });
    }else{
        oa.refilter(function(v){
            addValues(v.properties);
            return true;
        });
    }
    oa.fire("refiltered");
}
function reData(){
        var q = $("#query select");
        var out = {};
        q.each(function(x,v){
            if(v.value!=='all'){
            out[v.id]=v.value;
            }
        });
        query(out);
        return true;
    };
oa.on("dataLoaded",function(){
    oa._cache.features.forEach(function(v){
        addValues(v.properties);
    });
    oa.fire("refiltered");
});
$(function(){
    var opts = document.createDocumentFragment();
    var tabs = document.createElement("div");
    tabs.id = "tabs";
    var tList = document.createElement("ul");
    tabs.appendChild(tList);
    var search = document.createElement("li");
    var slink = document.createElement("a");
    slink.href="#search";
    slink.innerHTML="Search";
    search.appendChild(slink);
    tList.appendChild(search);
    var query = document.createElement("li");
    var qlink = document.createElement("a");
    qlink.href="#query";
    qlink.innerHTML="Query";
    query.appendChild(qlink);
    tList.appendChild(query);
    var sdiv = document.createElement("div");
    sdiv.id="search";
    tabs.appendChild(sdiv);
    var qq = document.createElement("div");
    qq.id="query";
    qq.innerHTML="<select id='SignType'></select><select id='PermitHoldersName'></select><select id='SignCity'></select>";
    tabs.appendChild(qq);
    opts.appendChild(tabs);
    $("body").prepend(opts);
    $( "#tabs" ).tabs({
        collapsible: true,
            selected: -1
        });
    oa.on("refiltered",function(){
    makeDrops("SignType");
    makeDrops("PermitHoldersName");
    makeDrops("SignCity");
    function makeDrops(id){
    var div = $("#"+id);
    div.empty();
    var frag  = document.createDocumentFragment(); 
    makeOptions("all","all "+id);
    if(values[id].length>1){
    values[id].forEach(makeOptions);
    }else{
        makeOptions(values[id][0],values[id][0],"unique");
    }
    div.append(frag);
    
    function makeOptions(v,vv,checked){
        if(!vv || vv>-1){
            vv=v;
        }
        var opt = document.createElement("option");
        opt.innerHTML=vv;
        opt.value=v;
        if(checked==="unique"){
            opt.setAttribute("selected","selected");
        }
        frag.appendChild(opt);
    }}});
    $("#query").on("change","select",reData);
});
var marker = new L.Marker();
var old={};