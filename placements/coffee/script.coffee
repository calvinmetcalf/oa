m = L.map('map',{maxZoom : 15}).setView [42.2, -71], 8
lc=L.control.layers.provided(['MapQuestOpen.OSM',"OpenStreetMap.Mapnik"]).addTo m
m.addHash
	lc:lc

excTile = L.tileLayer("http://tiles{s}.ro.lt/oa/{z}/{x}/{y}.png",
	subdomains:[1,2,3,4]
	opacity : 0.7
	zIndex : 10)
excGrid = new L.UtfGrid 'http://tiles{s}.ro.lt/oa/{z}/{x}/{y}.grid.json?callback={cb}', 
	resolution: 4
	subdomains:[1,2,3,4]
popup = L.popup()
exc = L.layerGroup([excTile,excGrid]).addTo(m)

dd={}
dd.FunctionalClassification = ['<Strong>Functional Classification</strong>: Local','<Strong>Functional Classification</strong>: Interstate','<Strong>Functional Classification</strong>: Urban or Rural Principal Arterial','<Strong>Functional Classification</strong>: Urban Principal Arterial or Rural Minor Arterial','<Strong>Functional Classification</strong>: Urban Minor Arterial or Rural Major Collector','<Strong>Functional Classification</strong>: Urban Collector or Rural Minor Collector']
dd.Jurisdiction
dd.Jurisdiction= {}
dd.Jurisdiction['1']='<Strong>Jurisdiction</strong>: Massachusetts Department of Transportation'
dd.Jurisdiction['2']='<Strong>Jurisdiction</strong>: City or Town accepted road'
dd.Jurisdiction['3']='<Strong>Jurisdiction</strong>: Department of Conservation and Recreation'
dd.Jurisdiction['5']='<Strong>Jurisdiction</strong>: Massachusetts Port Authority'
dd.Jurisdiction['6']='<Strong>Jurisdiction</strong>: State Park or Forest'
dd.Jurisdiction['7']='<Strong>Jurisdiction</strong>: State Institutional'
dd.Jurisdiction['8']='<Strong>Jurisdiction</strong>: Federal Park or Forest'
dd.Jurisdiction['9']='<Strong>Jurisdiction</strong>: County Institutional'
dd.Jurisdiction['0']='<Strong>Jurisdiction</strong>: Unaccepted by city or town'
dd.Jurisdiction['B']='<Strong>Jurisdiction</strong>: State college or university'
dd.Jurisdiction['C'] = '<Strong>Jurisdiction</strong>: US Air Force'
dd.Jurisdiction['D']='<Strong>Jurisdiction</strong>: US Army Corps of Engineers'
dd.Jurisdiction['E']='<Strong>Jurisdiction</strong>: Federal Institutional'
dd.Jurisdiction['F']='<Strong>Jurisdiction</strong>: Other Federal'
dd.Jurisdiction['G']='<Strong>Jurisdiction</strong>: Federal Bureau of Indian Affairs'
dd.Jurisdiction['H']='<Strong>Jurisdiction</strong>: Private'
dd.Jurisdiction['I']='<Strong>Jurisdiction</strong>: US Army'
dd.Jurisdiction['J']='<Strong>Jurisdiction</strong>: US Navy'
dd.NHSStatus=['<Strong>NHS Status</strong>: Not on NHS','<Strong>NHS Status</strong>: Interstate','<Strong>NHS Status</strong>: Strategic Defense Highway System (STRAHNET)','<Strong>NHS Status</strong>: STRAHNET Connector','<Strong>NHS Status</strong>: Other - One-way pair','<Strong>NHS Status</strong>: Truck route exclusion','<Strong>NHS Status</strong>: Major Airport','<Strong>NHS Status</strong>: Major Port Facility','<Strong>NHS Status</strong>: Major Amtrak Station','<Strong>NHS Status</strong>: Major Rail/Truck terminal','<Strong>NHS Status</strong>: Major Intercity Bus Terminal','<Strong>NHS Status</strong>: Major Public Transit or Multi-Modal Passenger Terminal','<Strong>NHS Status</strong>: Major Pipeline Terminal','<Strong>NHS Status</strong>: Major Ferry Terminal','<Strong>NHS Status</strong>: Other (not in above categories)','<Strong>NHS Status</strong>: MAP-21']

excGrid.on 'click', (e)->
	unless e.data 
		return false
	if e.data.ScenicByway
		data = "Scenic Byway: #{e.data.ScenicByway}"
	else
		delete e.data.ScenicByway
		data = (dd[k][v] for k,v of e.data).join('<br/>')
	popup.setContent(data).setLatLng(e.latlng).openOn(m);
lc.addOverlay exc, "NHS-SBW"
onEachFeature = (f,l)->
	l.bindPopup f.properties.name
xtowns = L.geoJson.ajax("json/exclutions.geojson",{style:{fillColor:'rgb(166,36,45)',fillOpacity:0.7,color:'rgb(110,24,30)'},onEachFeature: onEachFeature}).addTo m
lc.addOverlay xtowns, "Area Exclutions"