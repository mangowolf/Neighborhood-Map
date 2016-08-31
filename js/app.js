// Normally we'd have these in a database instead.
var model = {
	currentLocation: null,
	locations: [
	{
		title: 'Los Tacos No.1',
		yelpURL: 'http://api.yelp.com/v2/business/los-tacos-no-1-new-york',
		location: {
			lat: 40.742455,
			lng: -74.005956
		},
	},
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
]};

//Stores location observables linked to the model
var View = function(data){

	this.markerLocation = ko.observable(data.location);
	this.locationTitle = ko.observable(data.title);

};

var ViewModel = {
	locationList: ko.observableArray([]),
	filter: ko.observable(""),
};

//Filters list of displayed locations based on User query string
ViewModel.filteredLocations = ko.computed(function(){
	var self = this;
	var filter = self.filter().toLowerCase();
	if(!filter){
		return self.locationList();
	}else{
		return ko.utils.arrayFilter(self.locationList(), function(item){
			var match = item.locationTitle().toLowerCase().indexOf(filter) >=0;
			item.markerLocation.setVisible(match);
			return match;
		})
	}
},ViewModel);

var yelpAPI = function(){
	/**
	 * Generates a random number and returns it as a string for OAuthentication
	 * @return {string}
	 */
	function nonce_generate() {
	  return (Math.floor(Math.random() * 1e12).toString());
	}

	//var yelpBaseURL = "http://api.yelp.com/v2/business";
	//var yelp_url = yelpBaseURL + model[i].yelpURL;
	var yelp_url = model.locations[0].yelpURL;

	var parameters = {
	  oauth_consumer_key: 'QJR3xjIwW9d9jnCjLBTzXQ',
	  oauth_token: 'zEwwDoGQU78dheH4id-wxVpaR5jwyDu2',
	  oauth_nonce: nonce_generate(),
	  oauth_timestamp: Math.floor(Date.now()/1000),
	  oauth_signature_method: 'HMAC-SHA1',
	  oauth_version : '1.0',
	  callback: 'cb',          // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
	  limit: 1
	};

	var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, 'tc2X8lqfCR4GeVCoStbnPyo4nds', 'vXE_E2P7ryml6qhzqYaObKLhcdA');
	parameters.oauth_signature = encodedSignature;

	var settings = {
	  url: yelp_url,
	  data: parameters,
	  cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
	  dataType: 'jsonp',
	  success: function(results) {
	    console.log(results);
	  },
	  error: function() {
	    console.log('failed');
	  }
	};

	// Send AJAX query via jQuery library.
	$.ajax(settings).done(function(results){
		var yelpLocations = results.reviews;
		model.locations[0].result = results;
		model.locations[0].rating = results.rating;
		console.log(model.locations[0].rating);
		/*yelpLocations.forEach(function(review){
			var loc = {};
			loc.rating = location.rating;
			loc.excerpt = location.excerpt;
			//loc.lat = location.location.coordinate.latitude;
			//loc.lng = location.location.coordinate.longitude;
			model.locations.push(loc);
			console.log(loc);
			model.locations[0].rating = review.rating;
			model.locations[0].excerpt = review.excerpt;
			console.log(review);
		});*/
	});
};

//Pops up information window over marker when corresponding list item is selected
ViewModel.curLocation = function(curLoc){
	google.maps.event.trigger(curLoc.markerLocation,'click');
};

var map;
var largeInfowindow;
var bounds;
var marker;

function initMap() {

	largeInfowindow = new google.maps.InfoWindow();
	bounds = new google.maps.LatLngBounds();

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

        // Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		// Push the marker to our array of markers.
		ViewModel.locationList()[i].markerLocation=marker;

		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function(){
			populateInfoWindow(this, largeInfowindow);
		});

		bounds.extend(ViewModel.locationList()[i].markerLocation.position);
	}

	yelpAPI();

    // Extend the boundaries of the map for each marker
	map.fitBounds(bounds);
};



// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow){
    // Check to make sure the infowindow is not already opened on this marker.
	if(infowindow.marker != marker){
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>' + '<h3>' + model.locations[0].rating + '</h3>');
		//infowindow.setContent('<h3>' + model.locations[0].rating + '</h3>');
		infowindow.open(map,marker);
        // Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeClick', function(){
			infowindow.setMarker(null);
		});
	}
};

var mappedData = ko.utils.arrayMap(model.locations, function(item){
	return new View(item);
});

ViewModel.locationList(mappedData);
ko.applyBindings(ViewModel);

