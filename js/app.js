/*-------JSON Data containing locations to be displayed on the map-------*/
var locations = {
	currentLocation: null,
	locationsArray: [
	{
		title: 'Whiskey Thieves',
		yelpURL: 'http://api.yelp.com/v2/business/whiskey-thieves-san-francisco',
		location: {
			lat: 37.7860926,
			lng: -122.4171254
		},
	},
	{
		title: 'Nihon Whisky Lounge',
		yelpURL: 'http://api.yelp.com/v2/business/nihon-whisky-lounge-san-francisco',
		location: {
			lat: 37.768697,
			lng: -122.41529
		},
	},
	{
		title: 'Rickhouse',
		yelpURL: 'http://api.yelp.com/v2/business/rickhouse-san-francisco',
		location: {
			lat: 37.7904968261719,
			lng: -122.403594970703
		},
	},
	{
		title: 'Hard Water',
		yelpURL: 'http://api.yelp.com/v2/business/hard-water-san-francisco',
		location: {
			lat: 37.797501,
			lng: -122.395484
		},
	},
	{
		title: 'Rye',
		yelpURL: 'http://api.yelp.com/v2/business/rye-san-francisco',
		location: {
			lat: 37.78677,
			lng: -122.41461
		},
	},
]};

/*-----------------------YELP API CALL--------------------------------*/

var yelpAPI = function(i){
	/**
	 * Generates a random number and returns it as a string for OAuthentication
	 * @return {string}
	 */
	function nonce_generate() {
	  return (Math.floor(Math.random() * 1e12).toString());
	}

	var yelp_url = locations.locationsArray[i].yelpURL;

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
	  cache: true,        // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
	  dataType: 'jsonp',
	  error: function() {
	    alert('Yelp information is not accessible at this time.');
	  }
	};

	// Send AJAX query via jQuery library.
	$.ajax(settings).done(function(results){
		var yelpLocations = results.reviews;
		locations.locationsArray[i].result = results;
		locations.locationsArray[i].ratingImg = results.rating_img_url;
		locations.locationsArray[i].snippetImg = results.snippet_image_url;
		locations.locationsArray[i].snippetText = results.snippet_text;
	});
};

/*--------------Creates the map using Google Maps API -------------------*/
var map;
var largeInfoWindow;
var bounds;

function initMap() {

	//Creates an instance of the Google Maps InfoWindow
	largeInfoWindow = new google.maps.InfoWindow();

	//Defines the bounds of the map
	bounds = new google.maps.LatLngBounds();

	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 37.7701612271937, lng: -122.415708343283},
		zoom: 13
	});

	var locLength = locations.locationsArray.length;

	for(var i=0; i<locLength;i++){
		yelpAPI(i);
	};

	//var mappedData = ko.utils.arrayMap(locations.locationsArray)
	var vm = new ViewModel();
	ko.applyBindings(vm);
}

var ViewModel = function(){
	var self = this;
	self.filter = ko.observable(""),
	//self.optionBox = ko.observable(true),
	//Creates an observable array bound to the model
	self.locationList = ko.observableArray(locations.locationsArray),
	self.locationList().forEach(function(bar){

			//sets the marker for each location
			var marker = new google.maps.Marker({
			map: map,
			position: bar.location,
			title: bar.title,
			animation: google.maps.Animation.DROP,
		});

		marker.addListener('click', toggleBounce);

		function toggleBounce(){
			if(marker.getAnimation()!=null){
				marker.setAnimation(null);
			}else{
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		}

		bar.markerLocation = marker;

		var gEvent = google.maps.event;
		gEvent.addListener(marker,'click',function(marker, infowindow){
			return function(){
				if(infowindow.marker != marker){
					infowindow.marker = marker;
					console.log(bar.ratingImg);
					var content = '<h3>' + bar.title + '</h3>' + '<img src=' +
						bar.ratingImg + '></div>' + '<div><img src=' + bar.snippetImg +
						'></div>' + '<div>' + bar.snippetText + '</div>'
					infowindow.setContent(content);
					//infowindow.setContent('<h3>' + locations.locations[0].rating + '</h3>');
					infowindow.open(map,marker);
			        // Make sure the marker property is cleared if the infowindow is closed.
					infowindow.addListener('closeClick', function(){
						infowindow.setMarker(null);
					});
					console.log(infowindow);
				}else{
					console.log('fail');
				}
			};
		}(marker, largeInfoWindow, map));
		bounds.extend(bar.markerLocation.position);
	});
	/*setMarker = function(){
		for(var i=0; i<locations.locationsArray.length; i++){
			// Get the position from the location  array.
			var position = locationList()[i].markerLocation;
			var title = locationList()[i].locationTitle;

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

			bounds.extend(ViewModel.locationList()[i].markerLocation.position);
			console.log(self.locationList()[i]);
		}

		map.fitBounds(bounds);

	}(),*/


	//Computed Observable that filters the array list based on query parameter
	filteredLocations = ko.computed(function(){
		filter = self.filter().toLowerCase();
		if(!filter){
			return self.locationList();
		}else{
			return ko.utils.arrayFilter(self.locationList(), function(loc){
				var match = loc.title.toLowerCase().indexOf(filter) >=0;
				loc.markerLocation.setVisible(match);
				return match;
			});
		}
	})

	self.curLocation = function(bar){
		google.maps.event.trigger(bar.markerLocation,'click');
	};

	/*self.toggleMenu = function(){
		console.log('in function!');
		if(self.optionBox() == true){
			self.optionBox(false);
		}else
		{
			self.optionBox(true);
		}
	}*/
};

