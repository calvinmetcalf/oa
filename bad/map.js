<<<<<<< HEAD
/*! http://mths.be/placeholder v2.0.5 by @mathias */;(function(f,h,$){var a='placeholder' in h.createElement('input'),d='placeholder' in h.createElement('textarea'),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?'textarea':':input')+'[placeholder]').not('.placeholder').bind({'focus.placeholder':b,'blur.placeholder':e}).data('placeholder-enabled',true).trigger('blur.placeholder');return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data('placeholder-enabled')&&l.hasClass('placeholder')?'':m.value},set:function(m,n){var l=$(m);if(!l.data('placeholder-enabled')){return m.value=n}if(n==''){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass('placeholder')){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate('form','submit.placeholder',function(){var l=$('.placeholder',this).each(b);setTimeout(function(){l.each(e)},10)})});$(f).bind('beforeunload.placeholder',function(){$('.placeholder').each(function(){this.value=''})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr('placeholder')&&o.hasClass('placeholder')){if(o.data('placeholder-password')){o=o.hide().next().show().attr('id',o.removeAttr('id').data('placeholder-id'));if(m===true){return o[0].value=n}o.focus()}else{l.value='';o.removeClass('placeholder')}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==''){if(l.type=='password'){if(!p.data('placeholder-textinput')){try{q=p.clone().attr({type:'text'})}catch(n){q=$('<input>').attr($.extend(g(this),{type:'text'}))}q.removeAttr('name').data({'placeholder-password':true,'placeholder-id':o}).bind('focus.placeholder',b);p.data({'placeholder-textinput':q,'placeholder-id':o}).before(q)}p=p.removeAttr('id').hide().prev().attr('id',o).show()}p.addClass('placeholder');p[0].value=p.attr('placeholder')}else{p.removeClass('placeholder')}}}(this,document,jQuery));
=======
>>>>>>> l
var m = new L.Map("map", {
    center: new L.LatLng(42.2, -71),
    zoom: 8,
	attributionControl: true
});

new L.Hash(m);
var mapQuestAttr = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ';
var osmDataAttr = 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var mopt = {
    url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg',
    options: {attribution:mapQuestAttr + osmDataAttr, subdomains:'1234'}
  };
var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:osmDataAttr})
var mq=L.tileLayer(mopt.url,mopt.options);
mq.addTo(m);
<<<<<<< HEAD
var clusters = new L.MarkerClusterGroup();
var badSign=L.geoJson('',{onEachFeature:popUp});

$.get("badsign.geojson",function(d){
    badSign.addData(d);
    badSign.eachLayer(function (l) { 
        clusters.addLayer(l); 
        
    });
    clusters.addTo(m);
    lc.addTo(m);
},"JSON");
=======
var badSign=L.geoJson('',{onEachFeature:popUp}).addTo(m);

$.get("badsign.geojson",function(d){badSign.addData(d);},"JSON");
>>>>>>> l
var baseMaps = {
    "Map Quest": mq,
    "Open Street Map":osm
}
var overlayMaps = {
<<<<<<< HEAD
    "Bad Signs":clusters
    
}
var lc=L.control.layers(baseMaps, overlayMaps);

function popUp(f,l){
    var out = [];
    if (f.properties){
         out.push("Permit: " + f.properties.Permit);
        out.push("Sign Type: " + f.properties.SignType);
        out.push("Lat Lng located in: " + f.properties.PhysicalTown);
        out.push("Data Base says it's in: " + f.properties.SignCity);
        
        
=======
    "Bad Signs":badSign
    
}
var lc=L.control.layers(baseMaps, overlayMaps);
lc.addTo(m);
function popUp(f,l){
    var out = [];
    if (f.properties){
        for(key in f.properties){
            out.push(key+": "+f.properties[key]);
        }
>>>>>>> l
        l.bindPopup(out.join("<br />"));
    }
}
function mQuery(q){
    var out = function (f){
        if(f.properties.FacilityType!==q){
            return {clickable:false,stroke:false};
        }
    };
    return out;
}
$(function() {
    var select='<div id="tabs"><ul><li><a href="#search">Search</a></li></ul> <div id="search"><form id="geocoder"><input type="text" class="tbox" id="address" placeholder="Enter an Address or LatLong" /><input type="submit" value="Search" id="geocode"/><input type="reset" value="Reset" id="resetgeo"/></form></div></div>';
    $('body').prepend(select);
    $( "#tabs" ).tabs({
            collapsible: true,
            selected: -1
    });
    $( "input:submit,input:reset" ).button();
<<<<<<< HEAD
    $('input, textarea').placeholder();
=======
>>>>>>> l
$("#geocoder").submit(geocode);
$("#resetgeo").click(resetgeo);
$("#getStatus").change(function(){
      var val = $("#getStatus").val();
      if(val===""){
        url.rmW("Status");
      }else{
        url.setW("Status",val);
      }
      redo();
    });

var old={};
var marker = new L.Marker();
function geocode(){
    old.center=m.getCenter();
    old.zoom=m.getZoom();
 var address =$("#address").val();
 var gURL = 'http://open.mapquestapi.com/nominatim/v1/search?countrycodes=us&exclude_place_ids=955483008,950010827&viewbox=-76.212158203125%2C44.46123053905882%2C-66.005859375%2C40.107487419012415&bounded=1&format=json&q=';
  $.ajax({
       type: "GET",
       url: gURL + address,
       dataType: 'jsonp',
       jsonp: 'json_callback',
       success: function (data, textStatus) {
           if(textStatus=="success"){
          var latlng = new L.LatLng(data[0].lat, data[0].lon);
         marker.setLatLng(latlng);
        
         m.addLayer(marker);
         m.setView(latlng,17);
      
           }
       }
  });
  return false;
}

function resetgeo(){
    m.removeLayer(marker);
    m.setView(old.center, old.zoom);
}
});