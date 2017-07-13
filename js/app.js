// BEGIN CODEPEN.IO CODE

$( ".cross" ).hide();
$( ".menu" ).hide();
$( ".hamburger" ).click(function() {
$( ".menu" ).slideToggle( "slow", function() {
$( ".hamburger" ).hide();
$( ".cross" ).show();
});
});

$( ".cross" ).click(function() {
$( ".menu" ).slideToggle( "slow", function() {
$( ".cross" ).hide();
$( ".hamburger" ).show();
});
});

// END CODEPEN.IO CODE

var map;

var markers = [];

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 34.0522, lng: -118.2437},
      zoom: 11,
  });
}
