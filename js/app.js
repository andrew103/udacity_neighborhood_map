/* jshint loopfunc: true */

var locations = [
  {title: 'Statue of Liberty', id: 0, location: {lat: 40.6892, lng: -74.0445}},
  {title: 'Empire State Building', id: 1, location: {lat: 40.7484, lng: -73.9857}},
  {title: 'Central Park', id: 2, location: {lat:40.7829, lng: -73.9654}},
  {title: 'Rockefeller Center', id: 3, location: {lat: 40.7587, lng: -73.9787}},
  {title: 'Brooklyn Bridge', id: 4, location: {lat: 40.7061, lng: -73.9969}},
  {title: 'Times Square', id: 5, location: {lat: 40.7589, lng: -73.9851}}
];

var map;
var largeInfowindow;

var currentMarker = null;
var markers = [];

// Creates the Google map to be displayed on the webpage with markers and all
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // My location: {lat: 34.0522, lng: -118.2437}
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 11,
  });

  largeInfowindow = new google.maps.InfoWindow();


  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24');

  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    markers.push(marker);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
    marker.addListener('click', function() {
        toggleBounce(this);
    });
  }

  vm.showAll();
  showListings(markers, map);
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    }
    else {
        if (currentMarker !== null) {
            currentMarker.setAnimation(null);
        }
        currentMarker = marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

// Injects information to be displayed by a marker's InfoWindow
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.marker = marker;
    linkWiki(marker.title, infowindow);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      if (marker.getAnimation() !== null) {
          toggleBounce(marker);
      }
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
  else {
      infowindow.marker = null;
      infowindow.close();
  }
}

// Makes a call to the Wikipedia API to retrieve the location's wiki article
function linkWiki(name, infowindow) {
    var wikiURL = `http://en.wikipedia.org/w/api.php?action=opensearch&search=`+name+
                    `&format=json&callback=wikiCallback`;

    var wikiRequestTimeout = setTimeout(function(){
        infowindow.setContent("<p>"+name+"</p><p>Failed to get wikipedia resources</p>");
    }, 8000);

    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response) {
            clearTimeout(wikiRequestTimeout);

            var articleName = response[0];
            var url = 'http://en.wikipedia.org/wiki/' + articleName;
            infowindow.setContent("<p>"+name+"</p><a class='btn btn-default' href='"+url+"'>Wikipedia</a>");
        }
    });
}

// Displays the locations on the map in the form of markers
function showListings(points, map) {
  // var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker

  for (var i = 0; i < points.length; i++) {
    points[i].setMap(map);
    // bounds.extend(points[i].position);
  }
  // map.fitBounds(bounds);
}

// Styles the markers used for each location
function makeMarkerIcon(markerColor) {
    var markerImage = {
        url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
        size: new google.maps.Size(21, 34),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 34),
        scaledSize: new google.maps.Size(21,34)
    };
    return markerImage;
}

// START KNOCKOUTJS CODE

// Model for use within the MVVM
var Marker = function(location) {
    this.title = ko.observable(location.title);
    this.location = ko.observable(location.location);
    this.id = ko.observable(location.id);
};

// ViewModel to connect the information about listings to the webpage view
var ViewModel = function() {

    var self = this;

    this.listLocations = ko.observableArray([]);
    this.listMarkers = ko.observableArray([]);

    this.filterParam = ko.observable("");


    this.showAll = function() {
        locations.forEach(function(point_location) {
            self.listLocations.push(new Marker(point_location));
        });
        markers.forEach(function(point) {
            self.listMarkers.push(point);
        });
    };

    this.showSpecific = function(clicked_location) {
        self.resetList();
        self.listLocations.push(clicked_location);
        self.listMarkers.push(markers[clicked_location.id()]);
        toggleBounce(markers[clicked_location.id()]);
        populateInfoWindow(markers[clicked_location.id()],  largeInfowindow);
        showListings(self.listMarkers(), map);
    };

    this.filterResults = function() {
        var filtered = [];
        for (var i = 0; i < self.listMarkers().length; i++) {
            var location_name = self.listLocations()[i].title().toLowerCase();
            if (location_name.indexOf(self.filterParam().toLowerCase()) !== -1) {
                filtered.push(self.listLocations()[i]);
            }
        }
        self.resetList();

        for (var j = 0; j < filtered.length; j++) {
            self.listLocations.push(filtered[j]);
            self.listMarkers.push(markers[filtered[j].id()]);
        }

        showListings(self.listMarkers(), map);
    };

    this.removeFilter = function() {
        self.resetList();
        self.showAll();
        showListings(self.listMarkers(), map);
    };

    this.resetList = function() {
        var i=0;
        while (i < self.listLocations().length) {
            self.listLocations().splice(i, 1);
            self.listMarkers().splice(i, 1);
        }
        showListings(markers, null);
    };
};

// Initializes the location listings and filtering elements of the webpage
var vm = new ViewModel();
ko.applyBindings(vm);
