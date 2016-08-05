//Javascript file

/*var model = [
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
	},
];*/

var map;

function initMap() {

	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 40.7413549, lng: -73.9980244},
	  zoom: 13
	});

	var tribeca = {lat: 40.7413549, lng:-74.0089934};

	var marker = new google.maps.Marker({
		position: tribeca,
		map: map,
		title: 'First Marker!'
	});
}