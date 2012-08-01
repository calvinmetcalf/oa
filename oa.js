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
};
function uiStuff(){
    $( "#tabs" ).tabs({
            collapsible: true,
            selected: -1
		});
        $( "input:submit,input:reset" ).button();
        $('input, textarea').placeholder();
}
});