// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var Model = [
	{
		title: 'Park Ave Penthouse',
		location: {
			lat: 40.7713024,
			lng: -73.9632393
		},
	},
	{
		title: 'Chelsea Loft',
		location: {
			lat: 40.7444883,
			lng: -73.9949465
		},
	},
	{
		title: 'Union Square Open Floor Plan',
		location: {
			lat: 40.7347062,
			lng: -73.9895759
		},
	},
	{
		title: 'East Village Hip Studio',
		location: {
			lat: 40.7281777,
			lng: -73.984377
		},
	},
	{
		title: 'TriBeCa Artsy Bachelor Pad',
		location: {
			lat: 40.7195264,
			lng: -74.0089934
		},
	},
	{
		title: 'Chinatown Homey Space',
		location: {
			lat: 40.7180628,
			lng: -73.9961237
		},
	}
];

var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {

	//Styles the listing marker icon
	//var defaultIcon = makeMarkerIcon('0091ff');
	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 40.7413549, lng: -73.9980244},
	  zoom: 13
	});

    // The following group uses the location array to create an array of markers on initialize.
	for(var i=0; i<Model.length; i++){
		// Get the position from the location array.
		var position = Model[i].location;
		var title = Model[i].title;
        // Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			//icon: defaultIcon,
			id: i
		});

		// Push the marker to our array of markers.
		markers.push(marker);

		// Create an onclick event to open an infowindow at each marker.
		/*marker.addListener('click', function(){
			populateInfoWindow(this, largeInfowindow);
		});*/
		bounds.extend(markers[i].position);
	}
    // Extend the boundaries of the map for each marker
	map.fitBounds(bounds);

/*	function makeMarkerIcon(markerColor){
		var markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+
			markerColor + '|40|_|%E2%80%A2',
			new google.maps.Size(21,34),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34),
			new google.maps.Size(21.34));
		return markerImage;
	}
};*/

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
/*function populateInfoWindow(marker, infowindow){
        // Check to make sure the infowindow is not already opened on this marker.
	if(infowindow.marker != marker){
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map,marker);
        // Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeClick', function(){
			infowindow.setMarker(null);
		});
	}
};*/
}
var View = function(data){
	this.markerLocation = ko.observable(data.location);
	/*this.marker = new google.maps.Marker({
		position: this.markerLocation,
		map: map,
		title: data.title
	});*/
};

var ViewModel = function(){
	var self = this;

	this.locationList = ko.observableArray([]);

	Model.forEach(function(locItem){
		self.locationList.push(new View(locItem));
	});
};

ko.applyBindings(new ViewModel());