$ ()->	
	search = $ '#search'
	inner = """<form id="geocoder"><input type="text" class="tbox" id="address" placeholder="Enter an Address or LatLong" />
		<input type="submit" value="Search" id="geocode"/>
		<input type="reset" value="Reset" id="resetgeo"/></form>"""
	search.append inner
	$( "input:submit,input:reset" ).button();
	geocode = ->
		old.center = m.getCenter()
		old.zoom = m.getZoom()
		address = $("#address").val()
		gURL = "http://open.mapquestapi.com/nominatim/v1/search?countrycodes=us&exclude_place_ids=955483008,950010827&viewbox=-76.212158203125%2C44.46123053905882%2C-66.005859375%2C40.107487419012415&bounded=1&format=json&q="
		$.ajax
			type: "GET"
			url: gURL + address
			dataType: "jsonp"
			jsonp: "json_callback"
			success: (data, textStatus) ->
				if textStatus is "success"
					latlng = new L.LatLng(data[0].lat, data[0].lon)
					marker.setLatLng latlng
					m.addLayer marker
					m.setView latlng, 17

		false
	resetgeo = ->
		m.removeLayer marker
		m.setView old.center, old.zoom
		false
	$("#geocoder").submit geocode
	$("#resetgeo").click resetgeo
	$('input, textarea').placeholder()