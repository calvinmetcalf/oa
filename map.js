var m;
var tableid = 1632887;

function initialize() {
    var hash = document.location.hash.substring(1);
    var args = {};
    var pairs = hash.split("&");
 
    for(var i = 0; i < pairs.length; i++){
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var name = pairs[i].substring(0,pos);
        var value = pairs[i].substring(pos+1);
        value = decodeURIComponent(value);
        args[name] = value;
        };

  m = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(args.lat,args.lng),
      zoom: +args.zoom,
      mapTypeId: 'roadmap'
    });
 
    layer = new google.maps.FusionTablesLayer({
      query: {
        select: 'geometry',
        from: tableid
      }
    });
    layer.setMap(m);
  }