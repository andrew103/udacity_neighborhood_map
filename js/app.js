var locations = [
  {title: 'Park Ave Penthouse', id: 0, location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', id: 1, location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', id: 2, location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', id: 3, location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', id: 4, location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', id: 5, location: {lat: 40.7180628, lng: -73.9961237}}
];

var map;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // My location: {lat: 34.0522, lng: -118.2437}
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 11,
  });

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

  //   marker.addListener('click', function() {
  //     populateInfoWindow(this, largeInfowindow);
  //   });
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }

  vm.showAll();
  showListings(markers, map);
}

function showListings(points, map) {
  // var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker

  for (var i = 0; i < points.length; i++) {
    points[i].setMap(map);
    // bounds.extend(points[i].position);
  }
  // map.fitBounds(bounds);
}

function makeMarkerIcon(markerColor) {
    var markerImage = {
        url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
        size: new google.maps.Size(21, 34),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 34),
        scaledSize: new google.maps.Size(21,34)
    }
    return markerImage;
}



var Marker = function(location) {
    this.title = ko.observable(location.title);
    this.location = ko.observable(location.location);
    this.id = ko.observable(location.id);
}

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
    }

    this.showSpecific = function(clicked_location) {
        self.resetList();
        self.listLocations.push(clicked_location);
        self.listMarkers.push(markers[clicked_location.id()]);
        showListings(self.listMarkers(), map);
    }

    this.filterResults = function() {
        var filtered = [];
        for (var i = 0; i < self.listMarkers().length; i++) {
            var location_name = self.listLocations()[i].title().toLowerCase();
            if (location_name.indexOf(self.filterParam().toLowerCase()) !== -1) {
                filtered.push(self.listLocations()[i]);
            }
        }
        self.resetList()

        for (var i = 0; i < filtered.length; i++) {
            self.listLocations.push(filtered[i]);
            self.listMarkers.push(markers[filtered[i].id()])
        }

        showListings(self.listMarkers(), map);
    }

    this.removeFilter = function() {
        self.resetList();
        self.showAll();
        showListings(self.listMarkers(), map);
    }

    this.resetList = function() {
        var i=0;
        while (i < self.listLocations().length) {
            self.listLocations().splice(i, 1);
            self.listMarkers().splice(i, 1);
        }
        showListings(markers, null);
    }
}

var vm = new ViewModel();
ko.applyBindings(vm);










// OLD CODE STARTS
//
// var map;
// var markers = [];
//
//
// function initMap(){
//     map = new google.maps.Map(document.getElementById('map'), {
//         // My location: {lat: 34.0522, lng: -118.2437}
//       center: {lat: 40.7413549, lng: -73.9980244},
//       zoom: 11,
//   });
//
//   var locations = [
//     {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
//     {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
//     {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
//     {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
//     {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
//     {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
//   ];
//   var defaultIcon = makeMarkerIcon('0091ff');
//   var highlightedIcon = makeMarkerIcon('FFFF24');
//
//   for (var i = 0; i < locations.length; i++) {
//     var position = locations[i].location;
//     var title = locations[i].title;
//     var marker = new google.maps.Marker({
//       position: position,
//       title: title,
//       animation: google.maps.Animation.DROP,
//       icon: defaultIcon,
//       id: i
//     });
//
//     markers.push(marker);
//
//   //   marker.addListener('click', function() {
//   //     populateInfoWindow(this, largeInfowindow);
//   //   });
//     marker.addListener('mouseover', function() {
//       this.setIcon(highlightedIcon);
//     });
//     marker.addListener('mouseout', function() {
//       this.setIcon(defaultIcon);
//     });
//   }
//
//   showListings(markers);
//   populateMarkerList(markers);
// }
//
// function showListings(points) {
//   // var bounds = new google.maps.LatLngBounds();
//   // Extend the boundaries of the map for each marker and display the marker
//
//   for (var i = 0; i < points.length; i++) {
//     points[i].setMap(map);
//     // bounds.extend(points[i].position);
//   }
//   // map.fitBounds(bounds);
// }
//
// function makeMarkerIcon(markerColor) {
//     var markerImage = {
//         url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
//         size: new google.maps.Size(21, 34),
//         origin: new google.maps.Point(0, 0),
//         anchor: new google.maps.Point(10, 34),
//         scaledSize: new google.maps.Size(21,34)
//     }
//     return markerImage;
// }
//
// function populateMarkerList(list) {
//     var entry;
//     for (var i=0; i < list.length; i++) {
//         entry = "<p class='list_element'><a class='element_link' id='"+
//         list[i].id + "' onClick='showSpecific(this)'>"+
//         list[i].title+"</a></p>"
//         $('.marker_list').append(entry);
//     }
// }
//
// function showSpecific(el) {
//     var current_marker = [markers[$(el).attr('id')]];
//     showListings(current_marker);
// }
