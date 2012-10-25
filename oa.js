var l,m,perall,pr;
$(function() {
var holders =[];
var towns=[];
var q={PermitHoldersName:"all",SignType:"all",SignCity:"all"};
uiStuff();
var g = google.maps;
var zoom = 8;
var center = new g.LatLng(42.04113400940814,-71.795654296875);
var oaid ="18liLCxH6xy9glonqX4HY2xb3yyKdOT5eTQl9XFs";
var burl = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+"
var eurl = "+FROM+18liLCxH6xy9glonqX4HY2xb3yyKdOT5eTQl9XFs"
var key ="&key=AIzaSyBvl2Lx_Tj-9N_fT9arfnl8utRkVPe50uA"
m = new g.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
});
var r = new Ruler({map:m});
g.event.addListener(m,"rightclick",function(e){
    r.setPosition(e.latLng);
    if(!$('input:checkbox:checked').val()){
    $( "#measure" ).attr('checked','checked').button("refresh");
}
});
$( "#measure" ).click(
    function(){
         if($('input:checkbox:checked').val()){
             r.setPosition(m.getCenter());
         }else{
             r.setPosition(null);
         }
    }
    );
var baseLayer = new g.FusionTablesLayer({
   query:  {
      select :'geometry',
      from: '1hWdQ52PcSHXu1hzfJtsD3js2baur_3BZFjVm8vA'
       },
   clickable:false,
   map:m
    });
 l = new g.FusionTablesLayer({
 query:{select:'Point',
 from:oaid},
 map:m
     
 }
 );
$.get(burl +"Permit,PermitHoldersName,SignCity"+ eurl+key,fillCharts,"JSONP");
function fillCharts(data){

     perall= $.map(data.rows,function(v){
         pushU(holders,v[1]);
         pushU(towns,v[2]);
         return v[0].split(" and ")
         
     }
     );
makeLists();
 makePer(data);
}
function makeLists(){
    mSList("PermitHoldersName","All Permit Holders",holders);
   
    mSList("SignType","All Sign Types",["Digital","Street Furniture","Traditional Display"]);
    mSList("SignCity","All Cities/Towns",towns);
    $(".np").change(np);
}
function np(){
    var qp=[];
    $.each(q,function(k,v){
    v=$("#"+k).val();
    if(v!='all'){
        qp.push("'"+k+"' = '"+v+"'");
    }
    });
    if(qp.length>0){
     l.query.where =qp.join(" and ");
    $.get(burl +"Permit"+ eurl+"+WHERE+"+qp.join(" and ")+key,makePer,"JSONP");
    l.setMap(m)
}else{
    
    l.query.where="";
    l.setMap(m);
    ac(perall)
}
}
function makePer(data){
    if(data.rows){
  pr= $.map(data.rows,function(v){  
       return v[0].split(" and ")  
     }
     );
     ac(pr)
    }}
function ac(p){
    $("#permitT").autocomplete({source:p});
    
    
}
function pushU(array,value){
    if($.inArray(value,array)===-1){
    array.push(value);
    }
}
function mSList(i,messege,a){
   var id = "#"+i;
   $(id).empty().append("<option value='all'>"+messege+"</option>");
   $.each(a.sort(),function(iii,v){
   $(id).append("<option value='"+v+"'>"+v+"</option>");
   });

}
$("#LookUp").click(function(){
var val = $("#permitT").val();
if(val===""){
    np();
}else{
    l.query.where="Permit contains '" + val +"'";
    l.setMap(m);
}

});
$("#resetpermit").click(np)
geocoder("geocode","address","resetgeo");
function geocoder(geof,addrf,resetf){
    var ozoom = m.getZoom();
    var ocenter = m.getCenter();
    var gc = new g.Geocoder();
    geof = geof||'geocode';
    addrf = addrf||'address';
    resetf = resetf||'resetgeo';
    gc.geomarker = new g.Marker();
    var geoinfo = new g.InfoWindow();
    $('#' + geof).click(function(){
        gc.geocode( { 'address': $("#" + addrf).val()}, function(results, status) {
            if (status == g.GeocoderStatus.OK) {
                var r = results[0];
                m.setCenter(r.geometry.location);
                m.setZoom(14);
                gc.geomarker.content = "<div class='geoinfo'>Formatted address:<br/>"+r.formatted_address+"</div>";
                gc.geomarker.setPosition(r.geometry.location); 
                gc.geomarker.setMap(m);
                g.event.addListener(gc.geomarker, 'click',function(){
                                geoinfo.setContent(gc.geomarker.content);
                              geoinfo.open(m,gc.geomarker);
                			});
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    });

    $('#' + resetf).click(function(){
        m.setCenter(ocenter);
        m.setZoom(ozoom);
        gc.geomarker.setMap(null);
    });
}
function uiStuff(){
    $( "#tabs" ).tabs({
            collapsible: true,
            selected: -1
		});
        $( "input:submit,input:reset" ).button();
        $( "#measure" ).button();
        $('input, textarea').placeholder();
}


});



function Ruler(obj){
    var _this=this;
    _this.g = google.maps;
    _this.map = obj.map || null;
    _this.position = obj.position || null;
    
    _this.setMap = function(m){
        _this.map=m;
        test();
    };
    _this.setPosition = function(m){
        _this.position=m;
        test();
    };
    function test(){
        if(_this.open){
     remove();
     _this.open = 0;
 }
        if(_this.map &&_this.position){
         add();   
        }
    }
    function remove(){
     _this.g.event.clearListeners(_this.ruler1, 'drag');
     _this.g.event.clearListeners(_this.ruler2, 'drag');
     _this.ruler1.setMap(null);
      _this.ruler2.setMap(null);
      _this.ruler1label.setMap(null);
_this.ruler2label.setMap(null);
 _this.rulerpoly.setMap(null);   
    }
    // from http://www.barattalo.it/2009/12/19/ruler-for-google-maps-v3-to-measure-distance-on-map/
function Label(opt_options) {
    // Initialization
    this.setValues(opt_options);

    // Label specific
	var span = this.span_ = document.createElement('span');
	span.style.cssText = 'position: relative; left: 0%; top: -8px; ' +
                'white-space: nowrap; border: 0px; font-family:arial; font-weight:bold;' +
                'padding: 2px; background-color: #ddd; '+
				'opacity: .75; '+
				'filter: alpha(opacity=75); '+
				'-ms-filter: "alpha(opacity=75)"; '+
				'-khtml-opacity: .75; '+
				'-moz-opacity: .75;';

	var div = this.div_ = document.createElement('div');
	div.appendChild(span);
	div.style.cssText = 'position: absolute; display: none';
}
Label.prototype = new _this.g.OverlayView();

// Implement onAdd
Label.prototype.onAdd = function() {
	var pane = this.getPanes().overlayLayer;
	pane.appendChild(this.div_);

	
	// Ensures the label is redrawn if the text or position is changed.
	var me = this;
	this.listeners_ = [
		_this.g.event.addListener(this, 'position_changed',
		function() { me.draw(); }),
		_this.g.event.addListener(this, 'text_changed',
		function() { me.draw(); })
	];
	
};

// Implement onRemove
Label.prototype.onRemove = function() { this.div_.parentNode.removeChild(this.div_ );
	// Label is removed from the map, stop updating its position/text.
	for (var i = 0, I = this.listeners_.length; i < I; ++i) {
		_this.g.event.removeListener(this.listeners_[i]);
	}
};

// Implement draw
Label.prototype.draw = function() {
	var projection = this.getProjection();
	var position = projection.fromLatLngToDivPixel(this.get('position'));

	var div = this.div_;
	div.style.left = position.x + 'px';
	div.style.top = position.y + 'px';
	div.style.display = 'block';

	this.span_.innerHTML = this.get('text').toString();
};
    function add(){
        _this.open=true
    _this.ruler1 = new _this.g.Marker({
        position: _this.position ,
        map: _this.map,
        draggable: true
    });
 
    _this.ruler2 = new _this.g.Marker({
        position: _this.position ,
        map: _this.map,
        draggable: true
    });
     
    _this.ruler1label = new Label({ map: _this.map });
    _this.ruler2label = new Label({ map: _this.map });
    _this.ruler1label.bindTo('position', _this.ruler1, 'position');
    _this.ruler2label.bindTo('position', _this.ruler2, 'position');
 
    _this.rulerpoly = new _this.g.Polyline({
        path: [_this.ruler1.position, _this.ruler2.position] ,
        strokeColor: "#FFFF00",
        strokeOpacity: 0.7,
        strokeWeight: 8
    });
    _this.rulerpoly.setMap(_this.map);
 
    _this.ruler1label.set('text',"0ft");
    _this.ruler2label.set('text',"0ft");
 
    _this.g.event.addListener(_this.ruler1, 'drag', function() {
        _this.rulerpoly.setPath([_this.ruler1.getPosition(), _this.ruler2.getPosition()]);
        _this.ruler1label.set('text',distance( _this.ruler1.getPosition().lat(), _this.ruler1.getPosition().lng(), _this.ruler2.getPosition().lat(), _this.ruler2.getPosition().lng()));
        _this.ruler2label.set('text',distance( _this.ruler1.getPosition().lat(), _this.ruler1.getPosition().lng(), _this.ruler2.getPosition().lat(), _this.ruler2.getPosition().lng()));
    });
 
    _this.g.event.addListener(_this.ruler2, 'drag', function() {
        _this.rulerpoly.setPath([_this.ruler1.getPosition(), _this.ruler2.getPosition()]);
        _this.ruler1label.set('text',distance( _this.ruler1.getPosition().lat(), _this.ruler1.getPosition().lng(), _this.ruler2.getPosition().lat(), _this.ruler2.getPosition().lng()));
        _this.ruler2label.set('text',distance( _this.ruler1.getPosition().lat(), _this.ruler1.getPosition().lng(), _this.ruler2.getPosition().lat(), _this.ruler2.getPosition().lng()));
    });
 function distance(lat1,lon1,lat2,lon2) {
    var R = 3959; // km (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180; 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c;
    if (d>1) return Math.round(d)+"m";
    else if (d<=1) return Math.round(d*5280)+"ft";
    return d;
}
        
    }
    test();
    return _this;
}