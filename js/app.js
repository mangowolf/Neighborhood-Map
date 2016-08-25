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

var View = function(data){

	this.markerLocation = ko.observable(data.location);
	this.locationTitle = ko.observable(data.title);

};

/*var ViewModel = {

	locationList: ko.observableArray([]),
	filterTitle: ko.obersvable(null),
	ViewModel.init: function(){

		var self = this;

		this.locationList = ko.observableArray([]);

		this.filterTitle = ko.observable(null);

	},

	filter: function(){

		if(this.filterTitle == null){
			Model.forEach(function(locItem){
				self.locationList.push(new View(locItem));
			});
			return ViewModel.init().selfself.locationList();
		}
		else{
			alert('hello world');
		}
	}
};*/

var ViewModel = {
	locationList: ko.observableArray([]),
	filterTitle: ko.observable(null),
	filter: ko.observable(""),
};

/*ViewModel.init = function(){
	this.filter;
},*/

/*ViewModel.populateLocList = function(){
	var self = this;
	Model.forEach(function(locItem){
		self.locationList.push(new View(locItem));
	});
	console.log(ViewModel.locationList());
	return self.locationList();
}*/

ViewModel.filteredLocations = ko.computed(function(){
	var self = this;
	var filter = self.filter().toLowerCase();
	console.log(filter);
	if(!filter){
		return self.locationList();
	}else{
		return ko.utils.arrayFilter(self.locationList(), function(item){
			return item.locationTitle().toLowerCase().indexOf(filter) >=0;
			//return ko.utils.stringStartsWith(locItem.locationTitle().toLowerCase(), filter);
		})
	}
},ViewModel);

//ViewModel.populateLocList();

var mappedData = ko.utils.arrayMap(Model, function(item){
	return new View(item);
});

ViewModel.locationList(mappedData);


var map;
// Create a new blank array for all the listing markers.
//var markers = [];

//Ties the KO observables to the global scope where Google map resides
//var loc = ViewModel.locationList();

function initMap() {

	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 40.7413549, lng: -73.9980244},
	  zoom: 13
	});

    // The following group uses the location array to create an array of markers on initialize.
	for(var i=0; i<ViewModel.locationList().length; i++){
		// Get the position from the location array.
		var position = ViewModel.locationList()[i].markerLocation();
		var title = ViewModel.locationList()[i].locationTitle();
		//var position = loc[i].markerLocation();
		//var title = loc[i].locationTitle();
        // Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		// Push the marker to our array of markers.
		ViewModel.locationList()[i]=marker;

		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function(){
			populateInfoWindow(this, largeInfowindow);
		});
		bounds.extend(ViewModel.locationList()[i].position);
	}
    // Extend the boundaries of the map for each marker
	map.fitBounds(bounds);

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow){
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
};
}

ko.applyBindings(ViewModel);
//ko.applyBindings(new ViewModel.init());