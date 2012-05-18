var fURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fwww.google.com%2Ffusiontables%2Fapi%2Fquery%3Fsql%3DSELECT%2B*%2BFROM%2B3952242%26hdrs%3Dfalse'%20and%20columns%3D'Permit%2Clat%2Clng%2CPermitHoldersName%2CSignCity%2CStatus%2CSignType%2CRoadIntendedToFace%2CIcon'&format=json";
var m,d;
var zoom = 8;
var g = google.maps;
var center = new g.LatLng(41.914541,-71.592407);
var infowindow = new g.InfoWindow();
var pN =[];



$(function() {
      $( "#tabs" ).tabs({
        	collapsible: true,
            selected: -1
		});
          $( "input:submit,input:reset" ).button();
        $('input, textarea').placeholder();
   m = new g.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });
getStuff(fURL);


}
);

var doStuff = function doStuff(data){
var types = [];
var holders = [];
var cities = [];
d = data.query.results.row;
$.each(d,function(i,s){
    var permit = s.Permit;
    var holder = s.PermitHoldersName;
    var rif = s.RoadIntendedToFace;
    var city = s.SignCity;
    var type = s.SignType;
    var lat = parseFloat(s.lat);
    var lng = parseFloat(s.lng);
    var icon;
    if($.inArray(type,types)==-1){
        types.push(type);
    }
    if($.inArray(holder,holders)==-1){
        holders.push(holder);
    }
    if($.inArray(city,cities)==-1){
        cities.push(city);
    }
    if($.inArray(permit,pN)==-1){
        pN.push(permit);
    }
    if(s.Icon == "small_red"){
        icon = new google.maps.MarkerImage("img/smallred.png");
    }else if(s.Icon == "small_green"){
        icon = new google.maps.MarkerImage("img/smallgreen.png");
    }else if(s.Icon == "small_yellow"){
        icon = new google.maps.MarkerImage("img/smallyellow.png");
    }
    var content ="<div class='oainfo' ><dl><dt>Permit Numbers</dt><dd>" + permit + "</dd><dt>Permit Holder</dt><dd>" + holder + "</dd><dt>Sign Type</dt><dd>" + type + "</dd><dt>Facing</dt><dd>" + rif + "</dd><dt>Municipality</dt><dd>" + city + "</dd></dl></div>";
     s.marker = new g.Marker({position: new g.LatLng(lat,lng),title:permit,icon:icon});
     s.marker.setMap(m)
     g.event.addListener(s.marker, 'click',
                    		function()
							{
                                infowindow.setContent(content);
                              infowindow.open(m,s.marker);
							});
    
    
    
}); 
$.each(types,function(i,t){
    $('.signType').append("<option value='" + t + "'>" + t + "</option>");
}
    
    );
   $.each(holders,function(i,t){
    $('.holders').append("<option value='" + t + "'>" + t + "</option>");
}
    
    );
     $.each(cities,function(i,t){
    $('.city').append("<option value='" + t + "'>" + t + "</option>");
}
    
    );
    $( "#permitNumber" ).autocomplete({
        	source: pN,
             minLength: 1
		});
};

var getStuff = function(url){
 $.get(url,
function(data){
    
    doStuff(data);
}, 'JSONP');   
};

$('#sper').click(function(){
    var perno = $('#permitNumber').val();
    $.each(d,function(i,s){
    if(s.Permit==perno){
        s.marker.setMap(m);
    }else{
        s.marker.setMap(null);
    }
    });
}
    
    );
$('#rper').click(function(){
    qMap();
});
$("select").change(function(){
qMap();
});

var qMap = function(){
    var t = $('.signType').val();    
var h = $('.holders').val();
var c = $('.city').val();
$.each(d,function(i,s){
    if(((t=='all')||(t==s.SignType))&&((h=='all')||(h==s.PermitHoldersName))&&((c=='all')||(c==s.SignCity))){
       s.marker.setMap(m);
    }else{
        s.marker.setMap(null);
    }
}
);
}