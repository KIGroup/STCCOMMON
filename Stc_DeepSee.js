/*** Zen Module: Stc_DeepSee ***/

self._zenClassIdx['http://www.intersystems.com/deepsee/TrainingPointsMapPortlet'] = 'Stc_DeepSee_TrainingPointsMapPortlet';
self.Stc_DeepSee_TrainingPointsMapPortlet = function(index,id) {
	if (index>=0) {Stc_DeepSee_TrainingPointsMapPortlet__init(this,index,id);}
}

self.Stc_DeepSee_TrainingPointsMapPortlet__init = function(o,index,id) {
	('undefined' == typeof _DeepSee_Component_Portlet_abstractPortlet__init) ?zenMaster._DeepSee_Component_Portlet_abstractPortlet__init(o,index,id):_DeepSee_Component_Portlet_abstractPortlet__init(o,index,id);
	o.colorProperty = '';
	o.controller = '';
	o.controllerId = '';
	o.coordsJsFile = '';
	o.coordsProperty = '';
	o.drillUpButtonPosition = 'top';
	o.fillOpacity = '';
	o.fillOpacityProperty = '';
	o.hoverOpacity = '';
	o.isClickableProperty = '';
	o.latitude = '42.36';
	o.latitudeProperty = '';
	o.longitude = '288.92';
	o.longitudeProperty = '';
	o.mapType = 'ROADMAP';
	o.markerDataProperties = '';
	o.markerIcon = '';
	o.markerIconProperty = '';
	o.markerIconSize = '';
	o.markerSpecialIcon = '';
	o.markerSpecialProperty = '';
	o.markerTitleProperty = '';
	o.markersDraggable = false;
	o.onaddmarker = '';
	o.onaddpolygon = '';
	o.onapplyfilters = '';
	o.onclickmarker = '';
	o.onclickpolygon = '';
	o.ondrilldown = '';
	o.ondrillup = '';
	o.ongetcontroller = '';
	o.onnotifyView = '';
	o.onrightclickmarker = '';
	o.onrightclickpolygon = '';
	o.polygonDataProperties = '';
	o.polygonTitleProperty = '';
	o.strokeOpacity = '';
	o.strokeWeight = '';
	o.zoom = '12';
}
function Stc_DeepSee_TrainingPointsMapPortlet_serialize(set,s)
{
	var o = this;s[0]='3562878717';s[1]=o.index;s[2]=o.id;s[3]=o.name;s[4]=set.addObject(o.parent,'parent');s[5]=set.addObject(o.composite,'composite');s[6]=o.align;s[7]=o.aux;s[8]=o.colorProperty;s[9]=o.containerStyle;s[10]=o.controller;s[11]=o.controllerId;s[12]=o.coordsJsFile;s[13]=o.coordsProperty;s[14]=(o.dragEnabled?1:0);s[15]=o.drillUpButtonPosition;s[16]=(o.dropEnabled?1:0);s[17]=(o.dynamic?1:0);s[18]=o.enclosingClass;s[19]=o.enclosingStyle;s[20]=o.error;s[21]=o.fillOpacity;s[22]=o.fillOpacityProperty;s[23]=o.height;s[24]=(o.hidden?1:0);s[25]=o.hint;s[26]=o.hintClass;s[27]=o.hintStyle;s[28]=o.hoverOpacity;s[29]=o.isClickableProperty;s[30]=o.label;s[31]=o.labelClass;s[32]=o.labelDisabledClass;s[33]=o.labelStyle;s[34]=o.latitude;s[35]=o.latitudeProperty;s[36]=o.longitude;s[37]=o.longitudeProperty;s[38]=o.mapType;s[39]=o.markerDataProperties;s[40]=o.markerIcon;s[41]=o.markerIconProperty;s[42]=o.markerIconSize;s[43]=o.markerSpecialIcon;s[44]=o.markerSpecialProperty;s[45]=o.markerTitleProperty;s[46]=(o.markersDraggable?1:0);s[47]=o.onaddmarker;s[48]=o.onaddpolygon;s[49]=o.onafterdrag;s[50]=o.onapplyfilters;s[51]=o.onbeforedrag;s[52]=o.onclickmarker;s[53]=o.onclickpolygon;s[54]=o.ondrag;s[55]=o.ondrilldown;s[56]=o.ondrillup;s[57]=o.ondrop;s[58]=o.ongetcontroller;s[59]=o.onhide;s[60]=o.onnotifyView;s[61]=o.onrefresh;s[62]=o.onrightclickmarker;s[63]=o.onrightclickpolygon;s[64]=o.onshow;s[65]=o.onupdate;s[66]=o.overlayMode;s[67]=o.polygonDataProperties;s[68]=o.polygonTitleProperty;s[69]=o.renderFlag;s[70]=(o.showLabel?1:0);s[71]=o.slice;s[72]=o.strokeOpacity;s[73]=o.strokeWeight;s[74]=o.title;s[75]=o.tuple;s[76]=o.valign;s[77]=(o.visible?1:0);s[78]=o.width;s[79]=o.zoom;
}
function Stc_DeepSee_TrainingPointsMapPortlet_getSettings(s)
{
	s['name'] = 'string';
	s['colorProperty'] = 'string';
	s['controllerId'] = 'id';
	s['coordsJsFile'] = 'string';
	s['coordsProperty'] = 'string';
	s['drillUpButtonPosition'] = 'enum:op,bottom';
	s['fillOpacity'] = 'string';
	s['fillOpacityProperty'] = 'string';
	s['hoverOpacity'] = 'string';
	s['isClickableProperty'] = 'string';
	s['latitude'] = 'float';
	s['latitudeProperty'] = 'string';
	s['longitude'] = 'float';
	s['longitudeProperty'] = 'string';
	s['mapType'] = 'enum:ROADMAP,SATELLITE,HYBRID,TERRAIN';
	s['markerDataProperties'] = 'string';
	s['markerIcon'] = 'string';
	s['markerIconProperty'] = 'string';
	s['markerIconSize'] = 'string';
	s['markerSpecialIcon'] = 'string';
	s['markerSpecialProperty'] = 'string';
	s['markerTitleProperty'] = 'string';
	s['markersDraggable'] = 'boolean';
	s['onaddmarker'] = 'eventHandler';
	s['onaddpolygon'] = 'eventHandler';
	s['onapplyfilters'] = 'eventHandler';
	s['onclickmarker'] = 'eventHandler';
	s['onclickpolygon'] = 'eventHandler';
	s['ondrilldown'] = 'eventHandler';
	s['ondrillup'] = 'eventHandler';
	s['ongetcontroller'] = 'eventHandler';
	s['onnotifyView'] = 'eventHandler';
	s['onrightclickmarker'] = 'eventHandler';
	s['onrightclickpolygon'] = 'eventHandler';
	s['polygonDataProperties'] = 'string';
	s['polygonTitleProperty'] = 'string';
	s['strokeOpacity'] = 'string';
	s['strokeWeight'] = 'string';
	s['zoom'] = 'integer';
	this.invokeSuper('getSettings',arguments);
}

self.Stc_DeepSee_TrainingPointsMapPortlet_acquireData = function() {
var controller = this.getController();
if (null == controller) {
this.connectToController();
controller = this.getController();
}
this._markerData = [];
if (controller && (this.latitudeProperty != '') && (this.longitudeProperty != ''))
{
var dims = controller.getDimensions();
var invert = controller.getSelectedRange;
if (!invert) {
var seriesSize = controller.getDimSize(1);
var seriesCount = controller.getDimSize(2);
var labelDim = 2;
var titleCol = -1;
var latCol = -1;
var longCol = -1;
var clickableCol = -1;
var miCol = -1;
var specIconCol = -1;
}
else {
var seriesSize = controller.getDimSize(2);
var seriesCount = controller.getDimSize(1);
var labelDim = 1;
}
if (seriesCount > 0)
{
if (!invert)
for (var p = 0; p < seriesSize; p++)
{
var pname = controller.getPropertyName(p);
if (pname == this.latitudeProperty) {
latCol = p;
}
if (pname == this.longitudeProperty) {
longCol = p;
}
if (pname == this.markerTitleProperty) {
titleCol = p;
}
if (pname == this.isClickableProperty) {
clickableCol = p;
}
if (pname == this.markerIconProperty) {
miCol = p;
}
if (pname == this.markerSpecialProperty) {
specIconCol = p;
}
}
if (invert || (latCol >= 0 && longCol >= 0))
for (var n = 0; n < seriesCount; n++)
{
var isClickable = 1;
var mi = null;
var specIcon = 0;
var sname = controller.getLabel(n,labelDim);
if (!invert) {
var lat = controller.getData(latCol,n);
var long = controller.getData(longCol,n);
if (titleCol >= 0) sname = controller.getData(titleCol,n);
if (clickableCol >= 0) isClickable = controller.getData(clickableCol,n);
if (miCol >= 0) mi = controller.getData(miCol,n);
if (specIconCol >= 0) specIcon = controller.getData(specIconCol,n);
}
else {
var lat = controller.getDataByName(this.latitudeProperty,n);
var long = controller.getDataByName(this.longitudeProperty,n);
if (this.markerTitleProperty != '') sname = controller.getDataByName(this.markerTitleProperty,n);
if (this.isClickableProperty != '') isClickable = controller.getDataByName(this.isClickableProperty,n);
if (this.markerIconProperty != '') mi = controller.getDataByName(this.markerIconProperty,n);
if (this.markerSpecialProperty != '') specIcon = controller.getDataByName(this.markerSpecialProperty,n);
}
if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(long))) {
var data = [];
if (this.markerDataProperties != '')
{
var props = this.markerDataProperties.split(",");
for (var i = 0; i < props.length; i++) {
data[props[i]] = controller.getDataByName(props[i],n);
}
}
if (!mi) mi = this.markerIcon;
this._markerData[this._markerData.length] = {
title: sname,
latitude: lat,
longitude: long,
isClickable: (!isClickable ? 1 : isClickable),
icon: mi,
specialIcon: specIcon,
data: data
};
}
}
}
}
this._polygonData = [];
if (this.coordsJsFile && !this._polygonCoords)
{
this._polygonCoords = [];
loadCoordinates(this._polygonCoords);
}
if (controller && (this.coordsProperty != ''))
{
var dims = controller.getDimensions();
var invert = controller.getSelectedRange;
if (!invert) {
var seriesSize = controller.getDimSize(1);
var seriesCount = controller.getDimSize(2);
var labelDim = 2;
var titleCol = -1;
var coordsCol = -1;
var colorCol = -1;
var foCol = -1;
var clickableCol = -1;
}
else {
var seriesSize = controller.getDimSize(2);
var seriesCount = controller.getDimSize(1);
var labelDim = 1;
}
if (seriesCount > 0)
{
if (!invert)
for (var p = 0; p < seriesSize; p++)
{
var pname = controller.getPropertyName(p);
if (pname == this.coordsProperty) {
coordsCol = p;
}
if (pname == this.colorProperty) {
colorCol = p;
}
if (pname == this.fillOpacityProperty) {
foCol = p;
}
if (pname == this.isClickableProperty) {
clickableCol = p;
}
if (pname == this.polygonTitleProperty) {
titleCol = p;
}
}
for (var n = 0; n < seriesCount; n++)
{
var color = 'purple';
var fo = this.fillOpacity;  // default opacity
var isClickable = 1;
var sname = controller.getLabel(n,labelDim);
if (!invert) {
if (coordsCol<0) break;
var coords = controller.getData(coordsCol,n);
if (colorCol >= 0) color = controller.getData(colorCol,n);
if (foCol >= 0) fo = controller.getData(foCol,n);
if (clickableCol >= 0) isClickable = controller.getData(clickableCol,n);
if (titleCol >= 0) sname = controller.getData(titleCol,n);
}
else {
var coords = controller.getDataByName(this.coordsProperty,n);
if (this.colorProperty != '') color = controller.getDataByName(this.colorProperty,n);
if (this.fillOpacityProperty != '') fo = controller.getDataByName(this.fillOpacityProperty,n);
if (this.isClickableProperty != '') isClickable = controller.getDataByName(this.isClickableProperty,n);
if (this.polygonTitleProperty != '') sname = controller.getDataByName(this.polygonTitleProperty,n);
}
if (!fo) fo = this.fillOpacity;  // default opacity
if (this.coordsJsFile) coords = this._polygonCoords[coords];
if (!coords) continue;
var pathsSets = coords.split(";");
for (var j = 0; j < pathsSets.length; j++) {
var paths = pathsSets[j].split(" ");
for (var i = 0; i < paths.length; i++) {
var p = paths[i].split(",")
paths[i] = new google.maps.LatLng(p[1], p[0], p[2]);
}
pathsSets[j] = paths;
}
var data = [];
if (this.polygonDataProperties != '')
{
var props = this.polygonDataProperties.split(",");
for (var i = 0; i < props.length; i++) {
data[props[i]] = controller.getDataByName(props[i],n);
}
}
this._polygonData[this._polygonData.length] = {
title: sname,
coords: pathsSets,
color: (!color ? 'purple' : color),
fo: (!fo ? 0.1 : fo),
isClickable: (!isClickable ? 1 : isClickable),
data: data
};
}
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_addMarker = function(id,latitude,longitude,title,isClickable,icon,data) {
var marker = null;
var map = this.getMapObject();
if (map && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
var mapLatlng = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
marker = new google.maps.Marker({
position: mapLatlng,
map: map,
draggable: this.markersDraggable,
title:title,
clickable: (isClickable == 1),
icon: (icon ? (this.markerIconSize ? new google.maps.MarkerImage(icon, null, null, null, new google.maps.Size(this.markerIconSize, this.markerIconSize)) : icon) : null),
data: data});
marker._id = id;
var index = this._markers.length;
this._markers[index] = marker;
if (this.markersDraggable) {
var code = new Function('zenPage.getComponent('+this.index+').markerDragEndHandler("'+index+'");');
google.maps.event.addListener(marker, 'dragend', code);
}
var code = new Function('zenPage.getComponent('+this.index+').markerClickHandler("'+index+'");');
google.maps.event.addListener(marker, 'click', code);
code = new Function('zenPage.getComponent('+this.index+').markerRightClickHandler("'+index+'");');
google.maps.event.addListener(marker, 'rightclick', code);
}
return marker;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_addPolygon = function(id,coords,color,fo,isClickable,title,data) {
var polygon = null;
var map = this.getMapObject();
if (map)
{
if (color.substring(0, 4) === "rgb(" && color.indexOf(")") == (color.length - 1) && color.indexOf(".") > -1)
{
var colorAr = color.substring(4, color.length - 1).split(",");
color = "rgb(" + String(parseFloat(colorAr[0])).split(".")[0] + "," + String(parseFloat(colorAr[1])).split(".")[0] + "," + String(parseFloat(colorAr[2])).split(".")[0] + ")";
}
polygon = new google.maps.Polygon({
tooltip: '',
title: title,
fillColor: (color.substring(0, "hsv2rgb".length) === "hsv2rgb" ? eval(color) : color),
fillOpacity: fo,
clickable: (isClickable == 1),
strokeColor: (color.substring(0, "hsv2rgb".length) === "hsv2rgb" ? eval(color) : color),
strokeOpacity: (this.strokeOpacity ? this.strokeOpacity : 0.5),
strokeWeight: (this.strokeWeight ? this.strokeWeight : 3),
paths: coords,
map: map,
data: data,
defaultFO: fo});
polygon._id = id;
var index = this._polygons.length;
this._polygons[index] = polygon;
var code = new Function('event', 'zenPage.getComponent('+this.index+').polygonClickHandler("'+index+'", event);');
google.maps.event.addListener(polygon, 'click', code);
code = new Function('event', 'zenPage.getComponent('+this.index+').polygonRightClickHandler("'+index+'", event);');
google.maps.event.addListener(polygon, 'rightclick', code);
code = new Function('event', 'zenPage.getComponent('+this.index+').polygonMouseOver("'+index+'", event);');
google.maps.event.addListener(polygon, 'mouseover', code);
code = new Function('event', 'zenPage.getComponent('+this.index+').polygonMouseMove("'+index+'", event);');
google.maps.event.addListener(polygon, 'mousemove', code);
code = new Function('event', 'zenPage.getComponent('+this.index+').polygonMouseOut("'+index+'", event);');
google.maps.event.addListener(polygon, 'mouseout', code);
}
return polygon;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_centerChangedHandler = function() {
if (this._drillDownTitle.length > 0) this._drillDownTitle[this._drillDownTitle.length - 1].draw();
}

self.Stc_DeepSee_TrainingPointsMapPortlet_clearMarkers = function() {
try {
if (this._markers) {
for (var n = 0; n < this._markers.length; n++) {
this.removeMarker(this._markers[n]);
}
}
this._markers = [];
}
catch(ex) {
alert('Error in clearMarkers ' + ex.message);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_clearPolygons = function() {
try {
if (this._polygons) {
for (var n = 0; n < this._polygons.length; n++) {
this.removePolygon(this._polygons[n]);
}
}
this._polygons = [];
}
catch(ex) {
alert('Error in clearPolygons ' + ex.message);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_connectToController = function() {
this.controller = '';
if (!zenIsMissing(this.controllerId)) {
if (this.composite) {
this.controller = this.composite.getChildById(this.controllerId);
}
else {
this.controller = zenPage.getComponentById(this.controllerId);
}
if (this.controller && this.controller.register) {
this.controller.register(this);
}
else {
alert('ZEN: Unable to connect component to dataController (' + this.id + ').');
}
if (this.controller) {
if ('' == this.controller.modelError) {
this.controller.loadModel(false);
}
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_disconnectFromController = function() {
if (this.controller && this.controller.unregister) {
this.controller.unregister(this);
}
this.controller = '';
}

self.Stc_DeepSee_TrainingPointsMapPortlet_dragendHandler = function() {
var map = this.getMapObject();
if (map) {
var latLng = map.getCenter();
this.latitude = latLng.lat();
this.longitude = latLng.lng();
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_drillDown = function(title,latLng,zoom,data) {
var map = this.getMapObject();
if (map)
{
this._prevZoom.push(map.getZoom());
this._prevCenter.push(map.getCenter());
map.setZoom(parseInt(zoom));
map.setCenter(latLng);
if (this._drillDownTitle.length > 0) this._drillDownTitle[this._drillDownTitle.length - 1].hide();
this._drillDownTitle.push(this.newDrillDownTitleOverlay(map, 'zenPage.getComponent('+this.index+').drillUp();', title, this.drillUpButtonPosition));
this._drillDownTitle[this._drillDownTitle.length - 1].show();
zenInvokeCallbackMethod(this.ondrilldown,this,'ondrilldown','data',data);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_drillUp = function() {
var map = this.getMapObject();
if (map)
{
if (this._drillDownTitle.length > 0)
{
this._drillDownTitle[this._drillDownTitle.length - 1].hide();
this._drillDownTitle[this._drillDownTitle.length - 1].setMap(null);
this._drillDownTitle.pop();
if (this._drillDownTitle.length > 0) this._drillDownTitle[this._drillDownTitle.length - 1].show();
}
if (this._prevZoom.length > 0)
{
map.setZoom(this._prevZoom[this._prevZoom.length - 1]);
this._prevZoom.pop();
}
if (this._prevCenter.length > 0)
{
map.setCenter(this._prevCenter[this._prevCenter.length - 1]);
this._prevCenter.pop();
}
zenInvokeCallbackMethod(this.ondrillup,this,'ondrillup');
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_geocodeAddressHandler = function(results,status) {
if (status == google.maps.GeocoderStatus.OK) {
var map = this.getMapObject();
if (map) {
map.setCenter(results[0].geometry.location);
}
}
else {
alert("Address not found: " + status);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_getAllFiltersValues = function() {
var result;
try{
var filterState = this.parent.parent.filterState;
result = "Year*" + (filterState.Year ? filterState.Year : "")
+ ";Status*" + (filterState.Status ? filterState.Status : "")
+ ";Course*" + (filterState.Course ? filterState.Course : "")
+ ";Teacher*" + (filterState.Teacher ? filterState.Teacher : "")
+ ";Company*" + (filterState.Company ? filterState.Company : "")
+ ";CompanyType*" + (filterState.CompanyType ? filterState.CompanyType : "");
console.log(result);
}
catch(ex){
console.log(ex);
}
return result;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_getControl = function(ind) {
return zenPage.getComponent(this.parent.parent.controlIndices[ind]);
}

self.Stc_DeepSee_TrainingPointsMapPortlet_getController = function() {
if (this.ongetcontroller) {
return zenInvokeCallbackMethod(this.ongetcontroller,this,'ongetcontroller','view',this);
}
return (null == this.controller || '' == this.controller) ? null : this.controller;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_getFilterStateArray = function() {
return this.parent.parent.getFilterStateArray();
}

self.Stc_DeepSee_TrainingPointsMapPortlet_getMapObject = function() {
return this._mapObject;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_getMapTypeId = function(type) {
if (('undefined' == typeof google)||('undefined' == typeof google.maps)) {
return '';
}
var mapType = google.maps.MapTypeId.ROADMAP;
switch (type) {
case 'HYBRID':
mapType = google.maps.MapTypeId.HYBRID;
break;
case 'SATELLITE':
mapType = google.maps.MapTypeId.SATELLITE;
break;
case 'TERRAIN':
mapType = google.maps.MapTypeId.TERRAIN;
break;
case 'ROADMAP':
default:
break;
}
return mapType;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_getMarker = function(index) {
return this._markers ? this._markers[index] : null;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_getPolygon = function(index) {
return this._polygons ? this._polygons[index] : null;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_initMap = function(mapDiv) {
if (('undefined' == typeof google)||('undefined' == typeof google.maps)) {
mapDiv.innerHTML = $$$Text('Unable to load google map api.');
return;
}
google.maps.visualRefresh = false;
var mapTypeId = this.getMapTypeId(this.mapType);
this.latitude = parseFloat(this.latitude);
if (isNaN(this.latitude)) this.latitude = 42.36;
this.longitude = parseFloat(this.longitude);
if (isNaN(this.longitude)) this.longitude = 288.92;
var mapLatlng = new google.maps.LatLng(this.latitude, this.longitude);
this.zoom = parseInt(this.zoom, 10);
if (isNaN(this.zoom)) this.zoom = 0;
var mapOptions = {
zoom: this.zoom,
center: mapLatlng,
mapTypeId: mapTypeId
}
var map = new google.maps.Map(mapDiv, mapOptions);
this._mapObject = map;
this._markers = [];
this._polygons = [];
this._prevZoom = [];
this._prevCenter = [];
this._drillDownTitle = [];
this._infoWindow = new google.maps.InfoWindow();
var code = new Function('zenPage.getComponent('+this.index+').zoomChangedHandler();');
google.maps.event.addListener(map, 'zoom_changed', code);
var code = new Function('zenPage.getComponent('+this.index+').dragendHandler();');
google.maps.event.addListener(map, 'dragend', code);
var code = new Function('zenPage.getComponent('+this.index+').centerChangedHandler();');
google.maps.event.addListener(map, 'center_changed', code);
}

self.Stc_DeepSee_TrainingPointsMapPortlet_markerClickHandler = function(index) {
var map = this.getMapObject();
if (map) {
var marker = this.getMarker(index);
if (marker) {
zenInvokeCallbackMethod(this.onclickmarker,this,'onclickmarker','marker',marker);
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_markerDragEndHandler = function(index) {
var map = this.getMapObject();
if (map) {
var marker = this.getMarker(index);
if (marker) {
this.createInfoWindow(marker,'Marker moved to:<br/>' + marker.getPosition());
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_markerRightClickHandler = function(index) {
var map = this.getMapObject();
if (map) {
var marker = this.getMarker(index);
if (marker) {
zenInvokeCallbackMethod(this.onrightclickmarker,this,'onrightclickmarker','marker',marker);
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_newDrillDownTitleOverlay = function(mapRef,clickHandler,text,drillUpButtonPosition) {
function DrillDownTitleOverlay(map, onclickHandler, titleText, drillUpButtonPosition)
{
this.map_ = map;
this.div_ = null;
this.divTitle_ = null;
this.titleText_ = titleText;
this.onclickHandler_ = onclickHandler;
this.rect_ = null;
this.visible_ = false;
this.drillUpButtonPosition_ = drillUpButtonPosition;
this.setMap(map);
};
DrillDownTitleOverlay.prototype = new google.maps.OverlayView();
DrillDownTitleOverlay.prototype.onAdd = function()
{
this.visible_ = true;
}
DrillDownTitleOverlay.prototype.onRemove = function()
{
if (this.div_) this.div_.parentNode.removeChild(this.div_);
if (this.divTitle_) this.divTitle_.parentNode.removeChild(this.divTitle_);
if (this.rect_) this.rect_.setMap(null);
this.div_ = null;
this.divTitle_ = null;
this.rect_ = null;
}
DrillDownTitleOverlay.prototype.draw = function()
{
var overlayProjection = this.getProjection();
if (this.div_) this.div_.parentNode.removeChild(this.div_);
if (this.divTitle_) this.divTitle_.parentNode.removeChild(this.divTitle_);
if (this.rect_) this.rect_.setMap(null);
var div = document.createElement('div');
div.appendChild(document.createTextNode('<<  ' + 'Back'));
div.style.border = 'solid 1px #000000';
div.style.color = '#ffffff';
div.style.backgroundColor = '#356B8D';
div.style.MozBoxShadow = '2px 2px 4px #7f7f7f';
div.style.boxShadow = '2px 2px 4px #7f7f7f';
div.style.whiteSpace = 'nowrap';
div.style.font = 'icon';
if (navigator.userAgent.indexOf("Safari")>=0 || navigator.userAgent.indexOf("Chrome")>=0)
{
div.style.fontFamily = "Tahoma,sans-serif";
div.style.fontSize = "13px";
}
div.style.padding = '2px 8px';
div.style.position = 'absolute';
div.style.display = 'block';
div.style.visibility = (this.visible_ ? "visible" : "hidden");
this.div_ = div;
var div2 = document.createElement('div');
div2.appendChild(document.createTextNode(this.titleText_));
div2.style.border = 'solid 1px #000000';
div2.style.color = '#000000';
if (navigator.userAgent.indexOf("MSIE")>=0)
{
div2.style.backgroundColor = 'white';
}
else
{
div2.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
}
div2.style.MozBoxShadow = '2px 2px 4px #7f7f7f';
div2.style.boxShadow = '2px 2px 4px #7f7f7f';
div2.style.whiteSpace = 'nowrap';
div2.style.font = 'icon';
if (navigator.userAgent.indexOf("Safari")>=0 || navigator.userAgent.indexOf("Chrome")>=0)
{
div2.style.fontFamily = "Tahoma,sans-serif";
div2.style.fontSize = "13px";
}
div2.style.fontWeight = 'bold';
div2.style.padding = '2px 8px';
div2.style.position = 'absolute';
div2.style.display = 'block';
div2.style.visibility = (this.visible_ ? "visible" : "hidden");
this.divTitle_ = div2;
var panes = this.getPanes();
panes.floatPane.appendChild(this.div_);
panes.floatPane.appendChild(this.divTitle_);
if (this.drillUpButtonPosition_ == 'bottom')
{
var x = 12
var y = parseInt(this.map_.getDiv().style.height) - 50
}
else
{
var x = 70
var y = 5
}
var point = overlayProjection.fromLatLngToDivPixel(overlayProjection.fromContainerPixelToLatLng(new google.maps.Point(x, y)));
this.div_.style.left = point.x + 'px';
this.div_.style.top = point.y + 'px';
var sw = overlayProjection.fromDivPixelToLatLng(new google.maps.Point(point.x, point.y + parseInt(this.div_.offsetHeight)));
var ne = overlayProjection.fromDivPixelToLatLng(new google.maps.Point(point.x + parseInt(this.div_.offsetWidth), point.y));
var rectBounds = new google.maps.LatLngBounds(sw, ne);
this.rect_ = new google.maps.Rectangle({
bounds: rectBounds,
clickable: true,
fillOpacity: 0,
strokeOpacity: 0,
zIndex: 10,
map: (this.visible_ ? this.map_ : null)});
google.maps.event.addListener(this.rect_, 'click', new Function(this.onclickHandler_));
var point = new google.maps.Point(x + parseInt(this.div_.offsetWidth) - 1, 5);
point = overlayProjection.fromLatLngToDivPixel(overlayProjection.fromContainerPixelToLatLng(point));
this.divTitle_.style.left = point.x + 'px';
this.divTitle_.style.top = this.div_.style.top;
this.div_.style.height = (parseInt(this.divTitle_.offsetHeight) - 6) + 'px';
this.divTitle_.style.height = (parseInt(this.divTitle_.offsetHeight) - 6) + 'px';
}
DrillDownTitleOverlay.prototype.hide = function()
{
if (this.div_) this.div_.style.visibility = "hidden";
if (this.divTitle_) this.divTitle_.style.visibility = "hidden";
if (this.rect_) this.rect_.setMap(null);
this.visible_ = false;
}
DrillDownTitleOverlay.prototype.show = function()
{
if (this.div_) this.div_.style.visibility = "visible";
if (this.divTitle_) this.divTitle_.style.visibility = "visible";
if (this.rect_) this.rect_.setMap(this.map_);
this.visible_ = true;
}
return new DrillDownTitleOverlay(mapRef, clickHandler, text, drillUpButtonPosition);
}

self.Stc_DeepSee_TrainingPointsMapPortlet_notifyView = function(reason,data1,data2,data3) {
var ret = true;
if (this.onnotifyView) {
ret = zenInvokeCallbackMethod(this.onnotifyView,this,'onnotifyEvent','reason',reason,'data1',data1,'data2',data2,'data3',data3);
}
if (ret && this.notifyViewHandler) {
this.notifyViewHandler(reason,data1,data2,data3);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_notifyViewHandler = function(reason,data1,data2,data3) {
switch(reason) {
case 'dataChange':
this.onApplyFilters(true);
case 'modelChange':
this.acquireData();
this.syncMarkers();
this.syncPolygons();
break;
case 'seriesChange':
break;
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_onApplyFilters = function(refresh,widget) {
zenInvokeCallbackMethod(this.onapplyfilters,this,'onapplyfilters','refresh',refresh);
}

self.Stc_DeepSee_TrainingPointsMapPortlet_openInfoWindowAtPosition = function(position,content) {
var map = this.getMapObject();
if (map && position)
{
this._infoWindow.setContent(content);
this._infoWindow.setPosition(position);
this._infoWindow.open(map);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_openInfoWindowForManyTrainings = function(marker,content) {
try{
content = "<div id='infoWindowContentId' class='infoWindowContent'>" + content + '</div>';
this.openInfoWindowAtPosition(marker.position, content);
}
catch(ex){
alert(ex);
console.log(ex);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_openInfoWindowForSingleTraining = function(marker,isBackOn) {
try{
var sc=findScoreCardWidgetByName('TrainingStudents');
sc.parent.parent.parent.titleDiv.innerHTML = dict.localize("Слушатели курса")+" - " + marker.data.Course + '. ' + marker.data.City + '.';
if (marker.data.StudentsCount == 0){
zenPage.dashboardEventHandler(zenThis,'click', '0', 'applyFilter', 'TrainingStudents', 'Training');
}
else{
zenPage.dashboardEventHandler(zenThis,'click', marker.data.ID, 'applyFilter', 'TrainingStudents', 'Training');
}
var content = "<div id='infoWindowContentId' class='infoWindowContent'>"
+ "<span style='font-weight: bold;'>" + marker.data.Course + "</span><br><br>"
+ "<span>" + dict.localize("Город") + ": " + marker.data.City + "</span><br>"
+ "<span>" + dict.localize("Адрес") + ": " + marker.data.Street + (marker.data.Room=='-' ? '' : ('; ' + marker.data.Room)) + "</span><br>"
+ "<span>" + dict.localize("Дата начала обучения") + ": " + marker.data.DateStart + "</span><br>"
+ "<span>" + dict.localize("Дата окончания обучения") + ": " + marker.data.DateFinish + "</span><br>"
+ "<span>" + dict.localize("Преподаватель") + ": " + marker.data.Teacher + "</span><br>"
+ "<span>" + dict.localize("Подгрупп / слушателей") + ": " + marker.data.SubGroupsCount + ' / ' + marker.data.StudentsCount + "</span><br>"
+ "<button class='trTableSingle_Btn' title='"+dict.localize("Вернуться к таблице")+"' style='" + (isBackOn ? '' : 'display: none;') + "' onclick=\"backToTable(\'" + this.index + "\',\'" + marker.data.ID + "\')\">"+dict.localize("Назад")+"</button>"
+ "<button class='trTableSingle_Btn' style='float: right;' title='"+dict.localize("Открыть в другом окне")+"' onclick='changeTraining("+marker.data.ID+")'>"+dict.localize("Детали")+"</button>"
+ "</div>";
this.openInfoWindowAtPosition(marker.position, content);
}
catch(ex){
alert(ex);
console.log(ex);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_panToAddress = function(address) {
if (('undefined' == typeof google)||('undefined' == typeof google.maps)) {
return '';
}
var callback = new Function('results','status','zenPage.getComponent('+this.index+').geocodeAddressHandler(results,status)');
var geocoder = new google.maps.Geocoder();
geocoder.geocode({ 'address': address}, callback);
}

self.Stc_DeepSee_TrainingPointsMapPortlet_polygonClickHandler = function(index,event) {
var map = this.getMapObject();
if (map) {
var polygon = this.getPolygon(index);
if (polygon) {
if (polygon.tooltip)
{
polygon.tooltip.hide();
clearTimeout(polygon.tooltipTimer);
}
zenInvokeCallbackMethod(this.onclickpolygon,this,'onclickpolygon','polygon',polygon,'position',event.latLng);
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_polygonMouseMove = function(index,event) {
var map = this.getMapObject();
if (map) {
var polygon = this.getPolygon(index);
if (polygon && polygon.tooltip)
{
clearTimeout(polygon.tooltipTimer);
polygon.tooltipTimer = setTimeout('zenPage.getComponent('+this.index+').polygonTooltipTimer('+index+',' + event.latLng.lat() + ',' + event.latLng.lng() + ');', 100);
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_polygonMouseOut = function(index,event) {
var map = this.getMapObject();
if (map) {
var polygon = this.getPolygon(index);
if (polygon)
{
if (polygon.clickable) polygon.setOptions({fillOpacity: polygon.defaultFO});
if (polygon.tooltip)
{
polygon.tooltip.hide();
clearTimeout(polygon.tooltipTimer);
}
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_polygonMouseOver = function(index,event) {
var map = this.getMapObject();
if (map) {
var polygon = this.getPolygon(index);
if (polygon && polygon.clickable) polygon.setOptions({fillOpacity: (this.hoverOpacity ? this.hoverOpacity : 0.35)});
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_polygonRightClickHandler = function(index,event) {
var map = this.getMapObject();
if (map) {
var polygon = this.getPolygon(index);
if (polygon) {
if (polygon.tooltip)
{
polygon.tooltip.hide();
clearTimeout(polygon.tooltipTimer);
}
zenInvokeCallbackMethod(this.onrightclickpolygon,this,'onrightclickpolygon','polygon',polygon,'position',event.latLng);
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_polygonTooltipTimer = function(index,lat,lng) {
var map = this.getMapObject();
if (map) {
var polygon = this.getPolygon(index);
if (polygon && polygon.tooltip) polygon.tooltip.show(new google.maps.LatLng(lat, lng));
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_removeMarker = function(marker) {
try {
marker.setMap(null);
}
catch(ex) {
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_removePolygon = function(polygon) {
try {
if (polygon.tooltip) polygon.tooltip.setMap(null);
polygon.setMap(null);
}
catch(ex) {
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_renderContents = function() {
this._mapObject = null;
var mapDiv = this.getEnclosingDiv();
if (mapDiv == null) return;
var width = isNaN(parseFloat(this.width)) ? 200 : parseFloat(this.width);
var height = isNaN(parseFloat(this.height)) ? 200 : parseFloat(this.height);
if ('' == this.enclosingStyle) {
mapDiv.style.width = width + 'px';
mapDiv.style.height = height + 'px';
}
this.acquireData();
this.initMap(mapDiv);
this.syncMarkers();
this.syncPolygons();
zenPage.dashboardEventHandler('', '', '', 'refresh', '*', '');
try{
var sc = findScoreCardWidgetByName('TrainingStudents');
for(var i=0; i < sc.parent.parent.children[1].children[0].columns.length; i++){
sc.parent.parent.children[1].children[0].columns[i].label = dict.localize(sc.parent.parent.children[1].children[0].columns[i].label);
}
}
catch(ex){
console.log('Portlet Map Error, renderContents(), localize scorecard columns');
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_sendEventToController = function(reason,data1,data2,data3) {
var controller = this.getController();
if (controller && controller.notifyController) {
controller.notifyController(this,reason,data1,data2,data3);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_setControllerId = function(id) {
this.disconnectFromController();
this.controllerId = id;
this.connectToController();
}

self.Stc_DeepSee_TrainingPointsMapPortlet_setProperty = function(property,value,value2) {
var map = this.getMapObject();
switch(property) {
case 'latitude':
case 'longitude':
this[property] = value;
if (map) {
var mapLatlng = new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude));
map.panTo(mapLatlng);
}
break;
case 'zoom':
this[property] = value;
if (map) {
map.setZoom(parseInt(this.zoom,10));
}
break;
case 'mapType':
this[property] = value;
if (map) {
var mapTypeId = this.getMapTypeId(this.mapType);
map.setMapTypeId(mapTypeId);
}
break;
default:
return this.invokeSuper('setProperty',arguments);
}
return true;
}

self.Stc_DeepSee_TrainingPointsMapPortlet_syncMarkers = function() {
try {
var controller = this.getController();
if (null == controller) {
return;
}
this.clearMarkers();
if (this._markerData) {
for (var n = 0; n < this._markerData.length; n++) {
var md = this._markerData[n];
if (md)
{
if(this.markerSpecialIcon != "" && md.specialIcon == 1)
md.icon = this.markerSpecialIcon;
var title = md.data.Course + ' (' + md.data.StudentsCount + ')';
var marker = this.addMarker(n,md.latitude,md.longitude,title,md.isClickable,md.icon,md.data);
if (marker) zenInvokeCallbackMethod(this.onaddmarker,this,'onaddmarker','marker',marker);
}
}
}
}
catch(ex) {
alert('Error in syncMarkers ' + ex.message);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_syncPolygons = function() {
function TooltipOverlay(map, title)
{
this.map_ = map;
this.div_ = null;
this.title_ = title;
this.setMap(map);
};
TooltipOverlay.prototype = new google.maps.OverlayView();
TooltipOverlay.prototype.onAdd = function()
{
var div = document.createElement('div');
div.appendChild(document.createTextNode(this.title_));
div.style.border = 'solid 1px #000000';
div.style.color = '#000000';
div.style.backgroundColor = '#ffffe1';
div.style.whiteSpace = 'nowrap';
div.style.font = 'icon';
if (navigator.userAgent.indexOf("Safari")>=0 || navigator.userAgent.indexOf("Chrome")>=0)
{
div.style.fontFamily = "Tahoma,sans-serif";
div.style.fontSize = "13px";
}
div.style.MozBoxShadow = '2px 2px 4px #7f7f7f';
div.style.boxShadow = '2px 2px 4px #7f7f7f';
div.style.padding = '2px 3px';
div.style.position = 'absolute';
div.style.visibility = "hidden";
this.div_ = div;
var panes = this.getPanes();
panes.floatShadow.appendChild(div);
}
TooltipOverlay.prototype.onRemove = function()
{
if (this.div_) this.div_.parentNode.removeChild(this.div_);
this.div_ = null;
}
TooltipOverlay.prototype.draw = function() {}
TooltipOverlay.prototype.hide = function()
{
if (this.div_) this.div_.style.visibility = "hidden";
}
TooltipOverlay.prototype.show = function(latLng)
{
if (this.div_)
{
var point = this.getProjection().fromLatLngToDivPixel(latLng)
this.div_.style.left = point.x + 'px';
this.div_.style.top = (point.y - parseInt(this.div_.offsetHeight)) + 'px';
this.div_.style.visibility = "visible";
}
}
var map = this.getMapObject();
try {
var controller = this.getController();
if (null == controller) {
return;
}
this.clearPolygons();
if (this._polygonData && this._polygonData.length > 0)
{
for (var n = 0; n < this._polygonData.length; n++)
{
var md = this._polygonData[n];
if (md)
{
var poly = this.addPolygon(n, md.coords, md.color, md.fo, md.isClickable, md.title, md.data);
if (poly && map && md.title)
poly.tooltip = new TooltipOverlay(map, md.title);
if (poly)
zenInvokeCallbackMethod(this.onaddpolygon,this,'onaddpolygon','polygon',poly);
}
}
}
}
catch(ex) {
alert('Error in syncPolygons ' + ex.message);
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_zoomChangedHandler = function() {
var map = this.getMapObject();
if (map) {
this.zoom = map.getZoom();
}
}

self.Stc_DeepSee_TrainingPointsMapPortlet_FindTrainingNeighbors = function(filterValues,portletIndex,trainingId,latitude,longitude) {
	return zenInstanceMethod(this,'FindTrainingNeighbors','L,L,L,L,L','VARCHAR',arguments);
}

self.Stc_DeepSee_TrainingPointsMapPortlet_ReallyRefreshContents = function() {
	zenInstanceMethod(this,'ReallyRefreshContents','','',arguments);
}
self.Stc_DeepSee_TrainingPointsMapPortlet__Loader = function() {
	zenLoadClass('_DeepSee_Component_Portlet_abstractPortlet');
	Stc_DeepSee_TrainingPointsMapPortlet.prototype = zenCreate('_DeepSee_Component_Portlet_abstractPortlet',-1);
	var p = Stc_DeepSee_TrainingPointsMapPortlet.prototype;
	if (null==p) {return;}
	p.constructor = Stc_DeepSee_TrainingPointsMapPortlet;
	p.superClass = ('undefined' == typeof _DeepSee_Component_Portlet_abstractPortlet) ? zenMaster._DeepSee_Component_Portlet_abstractPortlet.prototype:_DeepSee_Component_Portlet_abstractPortlet.prototype;
	p.__ZENcomponent = true;
	p._serverClass = 'Stc.DeepSee.TrainingPointsMapPortlet';
	p._type = 'TrainingPointsMapPortlet';
	p.serialize = Stc_DeepSee_TrainingPointsMapPortlet_serialize;
	p.getSettings = Stc_DeepSee_TrainingPointsMapPortlet_getSettings;
	p.FindTrainingNeighbors = Stc_DeepSee_TrainingPointsMapPortlet_FindTrainingNeighbors;
	p.ReallyRefreshContents = Stc_DeepSee_TrainingPointsMapPortlet_ReallyRefreshContents;
	p.acquireData = Stc_DeepSee_TrainingPointsMapPortlet_acquireData;
	p.addMarker = Stc_DeepSee_TrainingPointsMapPortlet_addMarker;
	p.addPolygon = Stc_DeepSee_TrainingPointsMapPortlet_addPolygon;
	p.centerChangedHandler = Stc_DeepSee_TrainingPointsMapPortlet_centerChangedHandler;
	p.clearMarkers = Stc_DeepSee_TrainingPointsMapPortlet_clearMarkers;
	p.clearPolygons = Stc_DeepSee_TrainingPointsMapPortlet_clearPolygons;
	p.connectToController = Stc_DeepSee_TrainingPointsMapPortlet_connectToController;
	p.disconnectFromController = Stc_DeepSee_TrainingPointsMapPortlet_disconnectFromController;
	p.dragendHandler = Stc_DeepSee_TrainingPointsMapPortlet_dragendHandler;
	p.drillDown = Stc_DeepSee_TrainingPointsMapPortlet_drillDown;
	p.drillUp = Stc_DeepSee_TrainingPointsMapPortlet_drillUp;
	p.geocodeAddressHandler = Stc_DeepSee_TrainingPointsMapPortlet_geocodeAddressHandler;
	p.getAllFiltersValues = Stc_DeepSee_TrainingPointsMapPortlet_getAllFiltersValues;
	p.getControl = Stc_DeepSee_TrainingPointsMapPortlet_getControl;
	p.getController = Stc_DeepSee_TrainingPointsMapPortlet_getController;
	p.getFilterStateArray = Stc_DeepSee_TrainingPointsMapPortlet_getFilterStateArray;
	p.getMapObject = Stc_DeepSee_TrainingPointsMapPortlet_getMapObject;
	p.getMapTypeId = Stc_DeepSee_TrainingPointsMapPortlet_getMapTypeId;
	p.getMarker = Stc_DeepSee_TrainingPointsMapPortlet_getMarker;
	p.getPolygon = Stc_DeepSee_TrainingPointsMapPortlet_getPolygon;
	p.initMap = Stc_DeepSee_TrainingPointsMapPortlet_initMap;
	p.markerClickHandler = Stc_DeepSee_TrainingPointsMapPortlet_markerClickHandler;
	p.markerDragEndHandler = Stc_DeepSee_TrainingPointsMapPortlet_markerDragEndHandler;
	p.markerRightClickHandler = Stc_DeepSee_TrainingPointsMapPortlet_markerRightClickHandler;
	p.newDrillDownTitleOverlay = Stc_DeepSee_TrainingPointsMapPortlet_newDrillDownTitleOverlay;
	p.notifyView = Stc_DeepSee_TrainingPointsMapPortlet_notifyView;
	p.notifyViewHandler = Stc_DeepSee_TrainingPointsMapPortlet_notifyViewHandler;
	p.onApplyFilters = Stc_DeepSee_TrainingPointsMapPortlet_onApplyFilters;
	p.openInfoWindowAtPosition = Stc_DeepSee_TrainingPointsMapPortlet_openInfoWindowAtPosition;
	p.openInfoWindowForManyTrainings = Stc_DeepSee_TrainingPointsMapPortlet_openInfoWindowForManyTrainings;
	p.openInfoWindowForSingleTraining = Stc_DeepSee_TrainingPointsMapPortlet_openInfoWindowForSingleTraining;
	p.panToAddress = Stc_DeepSee_TrainingPointsMapPortlet_panToAddress;
	p.polygonClickHandler = Stc_DeepSee_TrainingPointsMapPortlet_polygonClickHandler;
	p.polygonMouseMove = Stc_DeepSee_TrainingPointsMapPortlet_polygonMouseMove;
	p.polygonMouseOut = Stc_DeepSee_TrainingPointsMapPortlet_polygonMouseOut;
	p.polygonMouseOver = Stc_DeepSee_TrainingPointsMapPortlet_polygonMouseOver;
	p.polygonRightClickHandler = Stc_DeepSee_TrainingPointsMapPortlet_polygonRightClickHandler;
	p.polygonTooltipTimer = Stc_DeepSee_TrainingPointsMapPortlet_polygonTooltipTimer;
	p.removeMarker = Stc_DeepSee_TrainingPointsMapPortlet_removeMarker;
	p.removePolygon = Stc_DeepSee_TrainingPointsMapPortlet_removePolygon;
	p.renderContents = Stc_DeepSee_TrainingPointsMapPortlet_renderContents;
	p.sendEventToController = Stc_DeepSee_TrainingPointsMapPortlet_sendEventToController;
	p.setControllerId = Stc_DeepSee_TrainingPointsMapPortlet_setControllerId;
	p.setProperty = Stc_DeepSee_TrainingPointsMapPortlet_setProperty;
	p.syncMarkers = Stc_DeepSee_TrainingPointsMapPortlet_syncMarkers;
	p.syncPolygons = Stc_DeepSee_TrainingPointsMapPortlet_syncPolygons;
	p.zoomChangedHandler = Stc_DeepSee_TrainingPointsMapPortlet_zoomChangedHandler;
}

self._zenClassIdx['http://www.intersystems.com/deepsee/TrainingPointsMapPortletYandexVersion'] = 'Stc_DeepSee_TrainingPointsMapPortletYandexVersion';
self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion = function(index,id) {
	if (index>=0) {Stc_DeepSee_TrainingPointsMapPortletYandexVersion__init(this,index,id);}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion__init = function(o,index,id) {
	('undefined' == typeof _DeepSee_Component_Portlet_abstractPortlet__init) ?zenMaster._DeepSee_Component_Portlet_abstractPortlet__init(o,index,id):_DeepSee_Component_Portlet_abstractPortlet__init(o,index,id);
	o.controller = '';
	o.controllerId = '';
	o.drillUpButtonPosition = 'top';
	o.getAdditionInfoForObjectById = '';
	o.isClickableProperty = '';
	o.latitude = '60';
	o.longitude = '85';
	o.mapType = 'yandex#map';
	o.onaddplacemark = '';
	o.onaddpolygon = '';
	o.onapplyfilters = '';
	o.onclickplacemark = '';
	o.onclickpolygon = '';
	o.oncontextmenuplacemark = '';
	o.oncontextmenupolygon = '';
	o.ondrilldown = '';
	o.ondrillup = '';
	o.ongetcontroller = '';
	o.onnotifyView = '';
	o.placemarkDataProperties = '';
	o.placemarkIcon = '';
	o.placemarkIconProperty = '';
	o.placemarkIconSize = '';
	o.placemarkLatitudeProperty = '';
	o.placemarkLongitudeProperty = '';
	o.placemarkSpecialIcon = '';
	o.placemarkSpecialProperty = '';
	o.placemarkTitleProperty = '';
	o.polygonColorProperty = '';
	o.polygonCoordsJsFile = '';
	o.polygonCoordsProperty = '';
	o.polygonDataProperties = '';
	o.polygonFillOpacity = '';
	o.polygonFillOpacityProperty = '';
	o.polygonHoverOpacity = '';
	o.polygonLoadBordersMethod = '';
	o.polygonSaveBordersMethod = '';
	o.polygonStrokeOpacity = '';
	o.polygonStrokeWeight = '';
	o.polygonTitleProperty = '';
	o.zoom = '2';
}
function Stc_DeepSee_TrainingPointsMapPortletYandexVersion_serialize(set,s)
{
	var o = this;s[0]='1913630517';s[1]=o.index;s[2]=o.id;s[3]=o.name;s[4]=set.addObject(o.parent,'parent');s[5]=set.addObject(o.composite,'composite');s[6]=o.align;s[7]=o.aux;s[8]=o.containerStyle;s[9]=o.controller;s[10]=o.controllerId;s[11]=(o.dragEnabled?1:0);s[12]=o.drillUpButtonPosition;s[13]=(o.dropEnabled?1:0);s[14]=(o.dynamic?1:0);s[15]=o.enclosingClass;s[16]=o.enclosingStyle;s[17]=o.error;s[18]=o.getAdditionInfoForObjectById;s[19]=o.height;s[20]=(o.hidden?1:0);s[21]=o.hint;s[22]=o.hintClass;s[23]=o.hintStyle;s[24]=o.isClickableProperty;s[25]=o.label;s[26]=o.labelClass;s[27]=o.labelDisabledClass;s[28]=o.labelStyle;s[29]=o.latitude;s[30]=o.longitude;s[31]=o.mapType;s[32]=o.onaddplacemark;s[33]=o.onaddpolygon;s[34]=o.onafterdrag;s[35]=o.onapplyfilters;s[36]=o.onbeforedrag;s[37]=o.onclickplacemark;s[38]=o.onclickpolygon;s[39]=o.oncontextmenuplacemark;s[40]=o.oncontextmenupolygon;s[41]=o.ondrag;s[42]=o.ondrilldown;s[43]=o.ondrillup;s[44]=o.ondrop;s[45]=o.ongetcontroller;s[46]=o.onhide;s[47]=o.onnotifyView;s[48]=o.onrefresh;s[49]=o.onshow;s[50]=o.onupdate;s[51]=o.overlayMode;s[52]=o.placemarkDataProperties;s[53]=o.placemarkIcon;s[54]=o.placemarkIconProperty;s[55]=o.placemarkIconSize;s[56]=o.placemarkLatitudeProperty;s[57]=o.placemarkLongitudeProperty;s[58]=o.placemarkSpecialIcon;s[59]=o.placemarkSpecialProperty;s[60]=o.placemarkTitleProperty;s[61]=o.polygonColorProperty;s[62]=o.polygonCoordsJsFile;s[63]=o.polygonCoordsProperty;s[64]=o.polygonDataProperties;s[65]=o.polygonFillOpacity;s[66]=o.polygonFillOpacityProperty;s[67]=o.polygonHoverOpacity;s[68]=o.polygonLoadBordersMethod;s[69]=o.polygonSaveBordersMethod;s[70]=o.polygonStrokeOpacity;s[71]=o.polygonStrokeWeight;s[72]=o.polygonTitleProperty;s[73]=o.renderFlag;s[74]=(o.showLabel?1:0);s[75]=o.slice;s[76]=o.title;s[77]=o.tuple;s[78]=o.valign;s[79]=(o.visible?1:0);s[80]=o.width;s[81]=o.zoom;
}
function Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getSettings(s)
{
	s['name'] = 'string';
	s['controllerId'] = 'id';
	s['drillUpButtonPosition'] = 'enum:op,bottom';
	s['getAdditionInfoForObjectById'] = 'string';
	s['isClickableProperty'] = 'string';
	s['latitude'] = 'float';
	s['longitude'] = 'float';
	s['mapType'] = 'enum:yandex#map,yandex#satellite,yandex#hybrid';
	s['onaddplacemark'] = 'eventHandler';
	s['onaddpolygon'] = 'eventHandler';
	s['onapplyfilters'] = 'eventHandler';
	s['onclickplacemark'] = 'eventHandler';
	s['onclickpolygon'] = 'eventHandler';
	s['oncontextmenuplacemark'] = 'eventHandler';
	s['oncontextmenupolygon'] = 'eventHandler';
	s['ondrilldown'] = 'eventHandler';
	s['ondrillup'] = 'eventHandler';
	s['ongetcontroller'] = 'eventHandler';
	s['onnotifyView'] = 'eventHandler';
	s['placemarkDataProperties'] = 'string';
	s['placemarkIcon'] = 'string';
	s['placemarkIconProperty'] = 'string';
	s['placemarkIconSize'] = 'string';
	s['placemarkLatitudeProperty'] = 'string';
	s['placemarkLongitudeProperty'] = 'string';
	s['placemarkSpecialIcon'] = 'string';
	s['placemarkSpecialProperty'] = 'string';
	s['placemarkTitleProperty'] = 'string';
	s['polygonColorProperty'] = 'string';
	s['polygonCoordsJsFile'] = 'string';
	s['polygonCoordsProperty'] = 'string';
	s['polygonDataProperties'] = 'string';
	s['polygonFillOpacity'] = 'string';
	s['polygonFillOpacityProperty'] = 'string';
	s['polygonHoverOpacity'] = 'string';
	s['polygonLoadBordersMethod'] = 'string';
	s['polygonSaveBordersMethod'] = 'string';
	s['polygonStrokeOpacity'] = 'string';
	s['polygonStrokeWeight'] = 'string';
	s['polygonTitleProperty'] = 'string';
	s['zoom'] = 'integer';
	this.invokeSuper('getSettings',arguments);
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_acquireData = function() {
var controller = this.getController();
if (null == controller){
this.connectToController();
controller = this.getController();
}
this._placemarkData = [];
if (controller && (this.placemarkLatitudeProperty != '') && (this.placemarkLongitudeProperty != '')){
var dims = controller.getDimensions();
var invert = controller.getSelectedRange;
if (!invert){
var seriesSize = controller.getDimSize(1);
var seriesCount = controller.getDimSize(2);
var labelDim = 2;
var titleCol = -1;
var latCol = -1;
var longCol = -1;
var clickableCol = -1;
var miCol = -1;
var specIconCol = -1;
}
else{
var seriesSize = controller.getDimSize(2);
var seriesCount = controller.getDimSize(1);
var labelDim = 1;
}
if (seriesCount > 0){
if (!invert){
for (var p = 0; p < seriesSize; p++){
var pname = controller.getPropertyName(p);
if (pname == this.placemarkLatitudeProperty) {
latCol = p;
}
if (pname == this.placemarkLongitudeProperty) {
longCol = p;
}
if (pname == this.placemarkTitleProperty) {
titleCol = p;
}
if (pname == this.isClickableProperty) {
clickableCol = p;
}
if (pname == this.placemarkIconProperty) {
miCol = p;
}
if (pname == this.placemarkSpecialProperty) {
specIconCol = p;
}
}
}
if (invert || (latCol >= 0 && longCol >= 0)){
for (var n = 0; n < seriesCount; n++){
var isClickable = 1;
var mi = null;
var specIcon = 0;
var sname = controller.getLabel(n,labelDim);
if (!invert){
var lat = controller.getData(latCol,n);
var long = controller.getData(longCol,n);
if (titleCol >= 0) sname = controller.getData(titleCol,n);
if (clickableCol >= 0) isClickable = controller.getData(clickableCol,n);
if (miCol >= 0) mi = controller.getData(miCol,n);
if (specIconCol >= 0) specIcon = controller.getData(specIconCol,n);
}
else{
var lat = controller.getDataByName(this.placemarkLatitudeProperty,n);
var long = controller.getDataByName(this.placemarkLongitudeProperty,n);
if (this.placemarkTitleProperty != '') sname = controller.getDataByName(this.placemarkTitleProperty,n);
if (this.isClickableProperty != '') isClickable = controller.getDataByName(this.isClickableProperty,n);
if (this.placemarkIconProperty != '') mi = controller.getDataByName(this.placemarkIconProperty,n);
if (this.placemarkSpecialProperty != '') specIcon = controller.getDataByName(this.placemarkSpecialProperty,n);
}
if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(long))){
var data = [];
if (this.placemarkDataProperties != ''){
var props = this.placemarkDataProperties.split(",");
for (var i = 0; i < props.length; i++){
data[props[i]] = controller.getDataByName(props[i],n);
}
}
if (!mi) mi = this.placemarkIcon;
this._placemarkData[this._placemarkData.length] = {
title: sname,
latitude: lat,
longitude: long,
isClickable: (!isClickable ? 1 : isClickable),
icon: mi,
specialIcon: specIcon,
data: data
};
}
}
}
}
} // end if (controller && (this.placemarkLatitudeProperty != '') && (this.placemarkLongitudeProperty != ''))
this._polygonData = [];
if (this.polygonCoordsJsFile && !this._polygonCoords){
this._polygonCoords = [];
loadCoordinates(this._polygonCoords);
}
if (controller && (this.polygonCoordsProperty != '')){
var dims = controller.getDimensions();
var invert = controller.getSelectedRange;
if (!invert){
var seriesSize = controller.getDimSize(1);
var seriesCount = controller.getDimSize(2);
var labelDim = 2;
var titleCol = -1;
var coordsCol = -1;
var colorCol = -1;
var foCol = -1;
var clickableCol = -1;
}
else{
var seriesSize = controller.getDimSize(2);
var seriesCount = controller.getDimSize(1);
var labelDim = 1;
}
if (seriesCount > 0){
if (!invert){
for (var p = 0; p < seriesSize; p++){
var pname = controller.getPropertyName(p);
if (pname == this.polygonCoordsProperty){
coordsCol = p;
}
if (pname == this.polygonColorProperty){
colorCol = p;
}
if (pname == this.polygonFillOpacityProperty){
foCol = p;
}
if (pname == this.isClickableProperty){
clickableCol = p;
}
if (pname == this.polygonTitleProperty){
titleCol = p;
}
}
}
for (var n = 0; n < seriesCount; n++){
var color = 'purple';
var fo = this.polygonFillOpacity;  // default opacity
var isClickable = 1;
var sname = controller.getLabel(n,labelDim);
if (!invert){
if (coordsCol<0) break;
var coords = controller.getData(coordsCol,n);
if (colorCol >= 0) color = controller.getData(colorCol,n);
if (foCol >= 0) fo = controller.getData(foCol,n);
if (clickableCol >= 0) isClickable = controller.getData(clickableCol,n);
if (titleCol >= 0) sname = controller.getData(titleCol,n);
}
else{
var coords = controller.getDataByName(this.polygonCoordsProperty,n);
if (this.polygonColorProperty != '') color = controller.getDataByName(this.polygonColorProperty,n);
if (this.polygonFillOpacityProperty != '') fo = controller.getDataByName(this.polygonFillOpacityProperty,n);
if (this.isClickableProperty != '') isClickable = controller.getDataByName(this.isClickableProperty,n);
if (this.polygonTitleProperty != '') sname = controller.getDataByName(this.polygonTitleProperty,n);
}
if (!fo) fo = this.polygonFillOpacity;  // default opacity
if (this.polygonCoordsJsFile) coords = this._polygonCoords[coords];
if (!coords) continue;
var pathsSets = coords.split(";");
for (var j = 0; j < pathsSets.length; j++){
var paths = pathsSets[j].split(" ");
for (var i = 0; i < paths.length; i++){
var p = paths[i].split(",");
paths[i] = [p[1], p[0]];
}
pathsSets[j] = paths;
}
var data = [];
if (this.polygonDataProperties != ''){
var props = this.polygonDataProperties.split(",");
for (var i = 0; i < props.length; i++){
data[props[i]] = controller.getDataByName(props[i],n);
}
}
this._polygonData[this._polygonData.length] = {
title: sname,
coords: pathsSets,
color: (!color ? 'purple' : color),
fo: (!fo ? 0.1 : fo),
isClickable: (!isClickable ? 1 : isClickable),
data: data
};
}
}
}// end if (controller && (this.polygonCoordsProperty != ''))
/* FOR-SLIDER
if (!this.polygonColorProperty){
if ($("#divSliderRangesPart").is(":visible") == true){
this.getSliderData().isChanged = false;
this.closeSlider();
}
}
*/
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_addPlacemark = function(id,latitude,longitude,title,isClickable,icon,data) {
var map = this.getMapObject();
if (!map || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) return null;
var geometry = [latitude, longitude];
var properties = {hintContent: title};
var options = {
preset: data.PlacemarkPreset,
iconColor: data.PlacemarkPreset.substring(data.PlacemarkPreset.indexOf("#") + 1, data.PlacemarkPreset.indexOf("Icon"))
};
var placemark = new ymaps.Placemark(geometry, properties, options);
placemark._id = id;
placemark.clickable = (isClickable == 1);
placemark.data = data;
var index = this._placemarks.length;
this._placemarks[index] = placemark;
placemark.events.add("click", new Function('zenPage.getComponent(' + this.index + ').placemarkEventHandler("' + index + '", "click");'));
placemark.events.add("contextmenu", new Function('zenPage.getComponent(' + this.index + ').placemarkEventHandler("' + index + '", "contextmenu");'));
return placemark;
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_addPolygon = function(id,coords,color,fo,isClickable,title,data) {
var map = this.getMapObject();
if (!map) return null;
if (color.substring(0, 4) === "rgb(" && color.indexOf(")") == (color.length - 1) && color.indexOf(".") > -1){
var colorAr = color.substring(4, color.length - 1).split(",");
color = "rgb(" + String(parseFloat(colorAr[0])).split(".")[0] + "," + String(parseFloat(colorAr[1])).split(".")[0] + "," + String(parseFloat(colorAr[2])).split(".")[0] + ")";
}
var polygon = new ymaps.Polygon(
/* geometry */
coords,
/* properties */
{
hintContent: title
},
/* options */
{
fillColor: (color.substring(0, "hsv2rgb".length) === "hsv2rgb" ? eval(color) : color),
fillOpacity: fo,
strokeColor: (color.substring(0, "hsv2rgb".length) === "hsv2rgb" ? eval(color) : color),
strokeOpacity: (this.polygonStrokeOpacity ? this.polygonStrokeOpacity : 0.5),
strokeWeight: (this.polygonStrokeWeight ? this.polygonStrokeWeight : 3),
});
polygon._id = id;
polygon.defaultFO = fo;
polygon.clickable = (isClickable == 1);
polygon.data = data;
var index = this._polygons.length;
this._polygons[index] = polygon;
polygon.events.add("click", new Function('event', 'zenPage.getComponent(' + this.index + ').polygonEventHandler("' + index + '", event);'));
polygon.events.add("contextmenu", new Function('event', 'zenPage.getComponent(' + this.index + ').polygonEventHandler("' + index + '", event);'));
polygon.events.add("mouseenter", new Function('event', 'zenPage.getComponent(' + this.index + ').polygonEventHandler("' + index + '", event);'));
polygon.events.add("mouseleave", new Function('event', 'zenPage.getComponent(' + this.index + ').polygonEventHandler("' + index + '", event);'));
return polygon;
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_beatNumber = function(num) {
if (num == undefined) return '';
return num.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_clearPlacemarks = function() {
try {
if (this._placemarks && this._clusterer) {
for (var n = 0; n < this._placemarks.length; n++) {
this._clusterer.remove(this._placemarks[n]);
}
}
this._placemarks = [];
}
catch(ex) {
alert('Error in clearPlacemarks ' + ex.message);
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_clearPolygons = function() {
try {
var map = this.getMapObject();
if (this._polygons) {
for (var n = 0; n < this._polygons.length; n++) {
map.geoObjects.remove(this._polygons[n]);
}
}
this._polygons = [];
}
catch(ex) {
alert('Error in clearPolygons ' + ex.message);
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_closeSlider = function() {
/* FOR-SLIDER
$("#btnOpenSlider").show();
$("#btnCloseSlider").hide();
$("#divSliderRangesPart").hide();
var sliderData = this.getSliderData();
if (sliderData.isChanged){
var res = this.SaveBorders(sliderData.getParameterId(), sliderData.getLevel(), sliderData.getGuid(), sliderData.getValues()[0], sliderData.getValues()[1]);
console.log('borders saved');
if (res != 1){
alert('Ошибка! Диапазон не сохранен.'+ '\n' + res);
return;
}
sliderData.isChanged = false;
}
*/
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_connectToController = function() {
this.controller = '';
if (!zenIsMissing(this.controllerId)) {
if (this.composite) {
this.controller = this.composite.getChildById(this.controllerId);
}
else {
this.controller = zenPage.getComponentById(this.controllerId);
}
if (this.controller && this.controller.register) {
this.controller.register(this);
}
else {
alert('ZEN: Unable to connect component to dataController (' + this.id + ').');
}
if (this.controller) {
if ('' == this.controller.modelError) {
this.controller.loadModel(false);
}
}
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_disconnectFromController = function() {
if (this.controller && this.controller.unregister) {
this.controller.unregister(this);
}
this.controller = '';
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_drillDown = function(title,latLng,zoom,data) {
var map = this.getMapObject();
if (!map) return;
this._prevZoom.push(map.getZoom());
this._prevCenter.push(map.getCenter());
map.setZoom(parseInt(zoom));
map.setCenter(latLng);
this._drillDownTitle.push(title);
this.setDrillDownTitle(title);
zenInvokeCallbackMethod(this.ondrilldown, this, 'ondrilldown', 'data', data);
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_drillUp = function() {
var map = this.getMapObject();
if (!map) return;
if (this._drillDownTitle.length > 0){
this._drillDownTitle.pop();
this.setDrillDownTitle(this._drillDownTitle[this._drillDownTitle.length - 1]);
}
if (this._prevZoom.length > 0){
map.setZoom(this._prevZoom[this._prevZoom.length - 1]);
this._prevZoom.pop();
}
if (this._prevCenter.length > 0){
map.setCenter(this._prevCenter[this._prevCenter.length - 1]);
this._prevCenter.pop();
}
zenInvokeCallbackMethod(this.ondrillup, this, 'ondrillup');
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getControl = function(ind) {
return zenPage.getComponent(this.parent.parent.controlIndices[ind]);
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getController = function() {
if (this.ongetcontroller) {
return zenInvokeCallbackMethod(this.ongetcontroller,this,'ongetcontroller','view',this);
}
return (null == this.controller || '' == this.controller) ? null : this.controller;
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getFilterStateArray = function() {
return this.parent.parent.getFilterStateArray();
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getMapObject = function() {
return this._mapObject;
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getPlacemark = function(index) {
return this._placemarks ? this._placemarks[index] : null;
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getPolygon = function(index) {
return this._polygons ? this._polygons[index] : null;
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getPolygonColor = function(min,max,value) {
if (!value || !min || !max) return 'rgb(255,255,255)';
var middle = (max + min) / 2;
if (value <= middle){
var redPart = (value - min) / (middle - min);
return "rgb(" + Math.round(255 * redPart) + ",255, 0)";
}
else{
var greenPart = (max - value) / (max - middle);
return "rgb(255," + Math.round(255 * greenPart) + ", 0)";
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getSliderData = function() {
if (this._sliderData) return this._sliderData;
this._sliderData = {
setParameterId: function(id){
this._parameterId = id;
},
getParameterId: function(){
return this._parameterId;
},
setGuid: function(guid){
this._guid = guid;
},
getGuid: function(){
return this._guid;
},
setLevel: function(lvl){
this._level = lvl;
},
getLevel: function(){
return this._level;
},
setUnitName: function(name){
this._unitName = name ? name : '';
},
getUnitName: function(){
return this._unitName;
},
setMin: function(value){
this._min = Math.floor(value ? parseInt(value) : 0);
},
getMin: function(){
return this._min;
},
setMax: function(value){
this._max = Math.ceil(value ? parseInt(value) : 1000);
},
getMax: function(){
return this._max;
},
setValues: function(min, max){
this.isChanged = true;
min = Math.floor(min ? parseInt(min) : 0);
min = (min == 0 && this.getMin()) ? this.getMin(): min;
max = Math.ceil(max ? parseInt(max) : 0);
max = (max == 0 && this.getMax()) ? this.getMax(): max;
this._values = [min, max];
},
getValues: function(){
return this._values;
},
getStep: function(){
var step = 1;
var range = this.getMax() - this.getMin();
if (range >= 1e8) step = 100000;
else if (range >= 1e7) step = 10000;
else if (range >= 1e6) step = 1000;
else if (range >= 1e5) step = 100;
else if (range >= 1e4) step = 10;
this.step = step
var modulo = range % step;
if (modulo != 0){
var halfModulo = (step - modulo) / 2;
if (this.getMin() < Math.floor(halfModulo)){
this.setMax(this.getMax() + Math.ceil(halfModulo) + Math.floor(halfModulo) - this.getMin());
this.setMin(0);
}
else{
this.setMin(this.getMin() - Math.floor(halfModulo));
this.setMax(this.getMax() + Math.ceil(halfModulo));
}
}
return step;
}
};
return this._sliderData;
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_initMap = function() {
this._mapObject = null;
var mapDiv = this.getEnclosingDiv();
if (mapDiv == null) return;
if (('undefined' == typeof ymaps) || ('undefined' == typeof ymaps.Map)) {
mapDiv.innerHTML = $$$Text('Unable to load yandex map api.');
return;
}
this.latitude = parseFloat(this.latitude);
if (isNaN(this.latitude)) this.latitude = 60;
this.longitude = parseFloat(this.longitude);
if (isNaN(this.longitude)) this.longitude = 85;
this.zoom = parseInt(this.zoom, 10);
if (isNaN(this.zoom)) this.zoom = 2;
var mapOptions = {
center: [this.latitude, this.longitude],
zoom: this.zoom,
controls: [],
type: this.mapType ? this.mapType.split(":").pop() : 'yandex#map'
};
this._mapObject = new ymaps.Map(mapDiv, mapOptions);
this._mapObject.behaviors.enable('scrollZoom',{smooth: false});
this._mapObject.controls.add('zoomControl',{smooth: false});
this._mapObject.controls.add(new ymaps.control.TypeSelector(['yandex#map', 'yandex#satellite', 'yandex#hybrid']));
this._placemarks = [];
this._polygons = [];
this._prevZoom = [];
this._prevCenter = [];
this._drillDownTitle = [];
this._presets = ['islands#redIcon',
'islands#greenIcon',
'islands#blueIcon',
'islands#orangeIcon',
'islands#yellowIcon',
'islands#brownIcon',
'islands#oliveIcon',
'islands#violetIcon',
'islands#pinkIcon',
'islands#blackIcon'];
var drillUpActionComponent = new ymaps.control.Button({
options: {
layout: ymaps.templateLayoutFactory.createClass("<div id='" + this.id + "_drillUpActionComponent" + "'></div>")
}
});
var duPosition = {left: '5px', top: '10px'};
if (this.drillUpButtonPosition == "bottom"){
duPosition = {left: '5px', bottom: '10px'};
}
this._mapObject.controls.add(drillUpActionComponent, { float: 'none', position: duPosition });
/*/ Create slider range if we need tool for change color
if (!this.polygonColorProperty){
var sliderComponent = new ymaps.control.Button({
options: {
layout: ymaps.templateLayoutFactory.createClass(""+
"<div id='divSlider'>" +
"    <div id='divSliderButtonsPart'>" +
"        <input id='btnOpenSlider'  type='button' value='Изменить диапазон'  onclick='zenPage.getComponentById(\"" + this.id + "\").openSlider();'/>" +
"        <input id='btnCloseSlider' type='button' value='Сохранить диапазон' onclick='zenPage.getComponentById(\"" + this.id + "\").closeSlider();'/>" +
"    </div>" +
"    <div id='divSliderRangesPart'>" +
"        <input id='inputSliderMinValue' type='text' readonly='true' title='Минимальное значение параметра'/>" +
"        <input id='inputSliderValues'   type='text' readonly='true' title='Границы диапазона'/>" +
"        <input id='inputSliderMaxValue' type='text' readonly='true' title='Максимальное значение параметра'/>" +
"        <div id='slider-range' widgetid=\"" + this.id + "\">" +
"        </div>" +
"    </div>" +
"</div>")
}
});
this._mapObject.controls.add(sliderComponent, { float: 'right'});
}*/
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_notifyView = function(reason,data1,data2,data3) {
var ret = true;
if (this.onnotifyView) {
ret = zenInvokeCallbackMethod(this.onnotifyView,this,'onnotifyEvent','reason',reason,'data1',data1,'data2',data2,'data3',data3);
}
if (ret && this.notifyViewHandler) {
this.notifyViewHandler(reason,data1,data2,data3);
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_notifyViewHandler = function(reason,data1,data2,data3) {
switch(reason) {
case 'dataChange':
this.onApplyFilters(true);
case 'modelChange':
this.acquireData();
this.syncPlacemarks();
this.syncPolygons();
break;
case 'seriesChange':
break;
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_onApplyFilters = function(refresh,widget) {
zenInvokeCallbackMethod(this.onapplyfilters,this,'onapplyfilters','refresh',refresh);
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_openBallonAtPlacemark = function(placemark) {
try{
var sc = findScoreCardWidgetByName('TrainingStudents');
sc.parent.parent.parent.titleDiv.innerHTML = dict.localize("Слушатели курса")+" - " + placemark.data.Course + '. ' + placemark.data.City + '.';
if (placemark.data.StudentsCount == 0){
zenPage.dashboardEventHandler(zenThis,'click', '0', 'applyFilter', 'TrainingStudents', 'Training');
}
else{
zenPage.dashboardEventHandler(zenThis,'click', placemark.data.ID, 'applyFilter', 'TrainingStudents', 'Training');
}
var content = "<div style='font-size:12px; font-family:arial;'>"
+ "<span style='font-weight: bold;'>" + placemark.data.Course + "</span><br><br>"
+ "<span>" + dict.localize("Город") + ": " + placemark.data.City + "</span><br>"
+ "<span>" + dict.localize("Адрес") + ": " + placemark.data.Street + (placemark.data.Room=='-' ? '' : ('; ' + placemark.data.Room)) + "</span><br>"
+ "<span>" + dict.localize("Дата начала обучения") + ": " + placemark.data.DateStart + "</span><br>"
+ "<span>" + dict.localize("Дата окончания обучения") + ": " + placemark.data.DateFinish + "</span><br>"
+ "<span>" + dict.localize("Преподаватель") + ": " + placemark.data.Teacher + "</span><br>"
+ "<span>" + dict.localize("Подгрупп / слушателей") + ": " + placemark.data.SubGroupsCount + ' / ' + placemark.data.StudentsCount + "</span><br>"
+ "<button class='trTableSingle_Btn' style='float: right;' title='"+dict.localize("Открыть в другом окне")+"' onclick='changeTraining(" + placemark.data.ID + ")'>" + dict.localize("Детали") + "</button>"
+ "</div>";
this.openBallonAtPosition(placemark.geometry.getCoordinates(), content);
}
catch(ex){
alert(ex);
console.log(ex);
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_openBallonAtPosition = function(position,content) {
var map = this.getMapObject();
if (map && position){
map.balloon.open(position, {contentBody: content});
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_openSlider = function() {
/* FOR-SLIDER
$("#btnOpenSlider").hide();
$("#btnCloseSlider").show();
$("#divSliderRangesPart").show();
var portlet = this;
var sliderData = this.getSliderData();
var step = sliderData.getStep();
var unitName = sliderData.getUnitName();
var minValue = sliderData.getMin();
var maxValue = sliderData.getMax();
var values = sliderData.getValues();
$("#slider-range").slider({
range: true,
step: step,
min: minValue,
max: maxValue,
values: values,
slide: function(event, ui){
var sliderData = portlet.getSliderData();
sliderData.setValues(ui.values[0], ui.values[1]);
for(var n=0; n < portlet._polygons.length; n++){
var poly = portlet._polygons[n];
var color = portlet.getPolygonColor(ui.values[0], ui.values[1], poly.data['Value']);
poly.options.set("fillColor", color);
poly.options.set("strokeColor", color);
}
$("#inputSliderValues" ).val(ui.values[0] + " - " + ui.values[1] + " " + unitName);
}
});
$("#inputSliderMinValue").val(minValue + " " + unitName);
$("#inputSliderMaxValue").val(maxValue + " " + unitName);
$("#inputSliderValues").val(values[0] + " - " + values[1] + " " + unitName);
*/
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_placemarkEventHandler = function(index,eventType) {
var placemark = this.getPlacemark(index);
if (!placemark) return;
switch(eventType){
case 'click':
zenInvokeCallbackMethod(this.onclickplacemark, this, 'onclickplacemark', 'placemark', placemark);
break;
case 'contextmenu':
zenInvokeCallbackMethod(this.oncontextmenuplacemark, this, 'oncontextmenuplacemark', 'placemark', placemark);
break;
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_polygonEventHandler = function(index,event) {
var polygon = this.getPolygon(index);
if (!polygon) return;
switch(event.get('type')){
case 'click':
zenInvokeCallbackMethod(this.onclickpolygon, this, 'onclickpolygon', 'polygon', polygon, 'position', event.get('coords'));
break;
case 'contextmenu':
zenInvokeCallbackMethod(this.oncontextmenupolygon, this, 'oncontextmenupolygon', 'polygon', polygon, 'position', event.get('coords'));
break;
case 'mouseenter':{
if (polygon.clickable){
polygon.options.set({fillOpacity: (this.polygonHoverOpacity ? this.polygonHoverOpacity : 0.35)});
}
break;
}
break;
case 'mouseleave':{
if (polygon.clickable){
polygon.options.set({fillOpacity: polygon.defaultFO});
}
break;
}
break;
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_renderContents = function() {
this.acquireData();
zenPage.dashboardEventHandler('', '', '', 'refresh', '*', '');
try{
var sc = findScoreCardWidgetByName('TrainingStudents');
for(var i=0; i < sc.parent.parent.children[1].children[0].columns.length; i++){
sc.parent.parent.children[1].children[0].columns[i].label = dict.localize(sc.parent.parent.children[1].children[0].columns[i].label);
}
}
catch(ex){
console.log('Portlet Map Error, renderContents(), localize scorecard columns');
}
var portlet = this;
ymaps.ready(function(){
portlet.initMap();
console.log('ymaps.ready(function(){');
ymaps.modules.require(['PieChartClusterer'], function (PieChartClusterer) {
console.log('ymaps.modules.require');
/**
* Supports all Clusterer constructor options.
* @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer-docpage/
*/
var customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
'<ul class=list>',
'{% for geoObject in properties.geoObjects %}',
'<li style="color: {{geoObject.options.iconColor}}; font-size: 16px;"><a class="clusterItemLink" href="#" onclick="zenPage.getComponentById(\'' + portlet.id + '\').placemarkEventHandler({{geoObject._id|raw}} , \'click\')"  class="list_item" title="{{geoObject.data.CourseDescription|raw}}">{{geoObject.data.DateStart|raw}}. {{ geoObject.properties.hintContent|raw }}. {{geoObject.data.City|raw}}</a></li>',
'{% endfor %}',
'</ul>'
].join(''));
portlet._clusterer =  new PieChartClusterer({
clusterDisableClickZoom: true,
clusterOpenBalloonOnClick: true,
clusterBalloonPanelMaxMapArea: 0,
clusterBalloonMaxHeight: 200,
clusterBalloonContentLayout: customBalloonContentLayout
});
portlet._clusterer.events.add("contextmenu", function (e) {
var cluster = e.get('target');
var clusterer = cluster.getParent();
clusterer.balloon.open(cluster);
});
console.log(portlet._clusterer);
portlet.syncPlacemarks();
portlet.syncPolygons();
});
});
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_sendEventToController = function(reason,data1,data2,data3) {
var controller = this.getController();
if (controller && controller.notifyController) {
controller.notifyController(this,reason,data1,data2,data3);
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_setControllerId = function(id) {
this.disconnectFromController();
this.controllerId = id;
this.connectToController();
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_setDrillDownTitle = function(title) {
var du = document.getElementById(this.id + '_drillUpActionComponent')
du.innerHTML = '';
if (!title) return;
var divBtn = document.createElement('div');
var portlet = this;
divBtn.onclick = function(){portlet.drillUp()};
divBtn.appendChild(document.createTextNode('<<  ' + 'Назад'));
divBtn.className = 'btnYandex';
divBtn.style.display = 'initial';
divBtn.style.borderRadius = '2px 0 0 2px';
divBtn.style.cursor = 'pointer';
var divTitle = document.createElement('div');
divTitle.appendChild(document.createTextNode(title));
divTitle.className = 'btnYandex';
divTitle.style.display = 'initial';
divTitle.style.borderRadius = '0 2px 2px 0';
divTitle.style.background = 'none';
if (navigator.userAgent.indexOf("MSIE")>=0){
divTitle.style.backgroundColor = 'white';
divBtn.style.display = 'inline';
divTitle.style.display = 'inline';
}
else{
divTitle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
}
du.appendChild(divBtn);
du.appendChild(divTitle);
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_syncPlacemarks = function() {
this.clearPlacemarks();
var map = this.getMapObject();
var controller = this.getController();
if (!map || !controller || !this._placemarkData)
return;
this._clusterer.removeAll();
/*
this._clusterer.events.add("contextmenu", function (e) {
var cluster = e.get('target');
var clusterer = cluster.getParent();
clusterer.balloon.open(cluster);
});
*/
try {
for (var n = 0; n < this._placemarkData.length; n++){
var md = this._placemarkData[n];
if (md){
if(this.placemarkSpecialIcon != "" && md.specialIcon == 1){
md.icon = this.placemarkSpecialIcon;
}
var placemark = this.addPlacemark(n, md.latitude, md.longitude, md.title, md.isClickable, md.icon, md.data);
if (placemark){
zenInvokeCallbackMethod(this.onaddplacemark, this, 'onaddplacemark', 'placemark', placemark);
}
}
}
this._clusterer.add(this._placemarks);
map.geoObjects.add(this._clusterer);
}
catch(ex) {
alert('Error in syncPlacemarks ' + ex.message);
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_syncPolygons = function() {
this.clearPolygons();
var map = this.getMapObject();
var controller = this.getController();
if (!map || !controller || !this._polygonData || this._polygonData.length == 0)
return;
try {
var minValue = 0, maxValue = 0;
if (!this.polygonColorProperty){
minValue = parseFloat(this._polygonData[0].data['Value']);
if (isNaN(minValue))
minValue = 0;
maxValue = minValue;
for (var n = 1; n < this._polygonData.length; n++){
var nValue = parseFloat(this._polygonData[n].data['Value']);
if (isNaN(nValue)) nValue = 0;
if (minValue > nValue)
minValue = nValue;
else if (maxValue < nValue)
maxValue = nValue;
}
if (!this.polygonColorProperty){
var sliderData = this.getSliderData();
var bordersData = this.LoadBordersData(this._polygonData[0].data.ParameterId, this._polygonData[0].data.Level, sliderData.getGuid())
sliderData.setParameterId(this._polygonData[0].data.ParameterId);
sliderData.setLevel(this._polygonData[0].data.Level);
sliderData.setMin(minValue);
sliderData.setMax(maxValue);
sliderData.setValues(bordersData.minValue, bordersData.maxValue);
sliderData.setUnitName(bordersData.unitName);
sliderData.isChanged = false;
minValue = sliderData.getValues()[0];
maxValue = sliderData.getValues()[1];
}
}
for (var n = 0; n < this._polygonData.length; n++){
var md = this._polygonData[n];
if (md){
if (!this.polygonColorProperty){
md.color = this.getPolygonColor(minValue, maxValue, md.data['Value']);
}
var poly = this.addPolygon(n, md.coords, md.color, md.fo, md.isClickable, md.title, md.data);
if (poly){
map.geoObjects.add(poly);
zenInvokeCallbackMethod(this.onaddpolygon, this, 'onaddpolygon', 'polygon', poly);
}
}
}
}
catch(ex) {
alert('Error in syncPolygons ' + ex.message);
}
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_GetAdditionInformationForObjectById = function(id) {
	return zenInstanceMethod(this,'GetAdditionInformationForObjectById','L','HANDLE',arguments);
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_LoadBordersData = function(paramId,level,regionId) {
	return zenInstanceMethod(this,'LoadBordersData','L,L,L','HANDLE',arguments);
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_ReallyRefreshContents = function() {
	zenInstanceMethod(this,'ReallyRefreshContents','','',arguments);
}

self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion_SaveBorders = function(paramId,level,regionId,min,max) {
	return zenInstanceMethod(this,'SaveBorders','L,L,L,L,L','VARCHAR',arguments);
}
self.Stc_DeepSee_TrainingPointsMapPortletYandexVersion__Loader = function() {
	zenLoadClass('_DeepSee_Component_Portlet_abstractPortlet');
	Stc_DeepSee_TrainingPointsMapPortletYandexVersion.prototype = zenCreate('_DeepSee_Component_Portlet_abstractPortlet',-1);
	var p = Stc_DeepSee_TrainingPointsMapPortletYandexVersion.prototype;
	if (null==p) {return;}
	p.constructor = Stc_DeepSee_TrainingPointsMapPortletYandexVersion;
	p.superClass = ('undefined' == typeof _DeepSee_Component_Portlet_abstractPortlet) ? zenMaster._DeepSee_Component_Portlet_abstractPortlet.prototype:_DeepSee_Component_Portlet_abstractPortlet.prototype;
	p.__ZENcomponent = true;
	p._serverClass = 'Stc.DeepSee.TrainingPointsMapPortletYandexVersion';
	p._type = 'TrainingPointsMapPortletYandexVersion';
	p.serialize = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_serialize;
	p.getSettings = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getSettings;
	p.GetAdditionInformationForObjectById = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_GetAdditionInformationForObjectById;
	p.LoadBordersData = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_LoadBordersData;
	p.ReallyRefreshContents = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_ReallyRefreshContents;
	p.SaveBorders = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_SaveBorders;
	p.acquireData = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_acquireData;
	p.addPlacemark = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_addPlacemark;
	p.addPolygon = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_addPolygon;
	p.beatNumber = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_beatNumber;
	p.clearPlacemarks = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_clearPlacemarks;
	p.clearPolygons = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_clearPolygons;
	p.closeSlider = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_closeSlider;
	p.connectToController = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_connectToController;
	p.disconnectFromController = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_disconnectFromController;
	p.drillDown = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_drillDown;
	p.drillUp = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_drillUp;
	p.getControl = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getControl;
	p.getController = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getController;
	p.getFilterStateArray = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getFilterStateArray;
	p.getMapObject = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getMapObject;
	p.getPlacemark = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getPlacemark;
	p.getPolygon = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getPolygon;
	p.getPolygonColor = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getPolygonColor;
	p.getSliderData = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_getSliderData;
	p.initMap = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_initMap;
	p.notifyView = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_notifyView;
	p.notifyViewHandler = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_notifyViewHandler;
	p.onApplyFilters = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_onApplyFilters;
	p.openBallonAtPlacemark = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_openBallonAtPlacemark;
	p.openBallonAtPosition = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_openBallonAtPosition;
	p.openSlider = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_openSlider;
	p.placemarkEventHandler = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_placemarkEventHandler;
	p.polygonEventHandler = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_polygonEventHandler;
	p.renderContents = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_renderContents;
	p.sendEventToController = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_sendEventToController;
	p.setControllerId = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_setControllerId;
	p.setDrillDownTitle = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_setDrillDownTitle;
	p.syncPlacemarks = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_syncPlacemarks;
	p.syncPolygons = Stc_DeepSee_TrainingPointsMapPortletYandexVersion_syncPolygons;
}
/* EOF */