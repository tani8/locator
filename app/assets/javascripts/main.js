$(document).on('page:change', function(){
   // var mapCanvas = document.getElementById('map-canvas');
  // currentLocation();

  currentLocation();

});

function currentLocation(){
  // Check for geolocation support
  // return "yo"
  // if (navigator.geolocation) {
    // Get current position
    var result= {};

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {

        var location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // chaseMarkers(location.lat, location.lng);
        initialize(location);
    }
}

function initialize(location) {

  var mylatLong = new google.maps.LatLng(location.lat, location.lng);
  var mapOptions = {
    center: mylatLong,
    zoom: 8
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  chaseMarkers(location.lat, location.lng, map);

  var marker = new google.maps.Marker({
    position: mylatLong,
    map: map,
    title: "First location"
  });

  // marker.setMap(map);


}

function chaseMarkers(lati, longi, map){

  // var url = "https://m.chase.com/PSRWeb/location/list.action?lat=" + latit + "&lng=" + longi;
  var dataHash;

  var response = $.ajax({
    url: '/chaseparty',
    type: 'get',
    data: {lati: lati, longi: longi},
    // crossDomain: true,
    // jsonp removes the cross-domain issue, but returns with a failed response
    dataType: 'json',
  });

  response.done(function(data){
    var markerCoords = {};
    var name = new google.maps.InfoWindow();
    var marker, i;
    dataHash = data;

    for(i = 0; i < data["locations"].length; i++){
      lati = data["locations"][i]["lat"];
      longi = data["locations"][i]["lng"];
      // markerCoords[i] = {lat: lati, lng: longi}
      var responseCoord = new google.maps.LatLng(lati, longi);
      marker = new google.maps.Marker({
        position: responseCoord,
        map: map,
        address: data["locations"][i]["address"],
        markerData: data["locations"][i],
      });
      google.maps.event.addListener(marker, "click", function(e){
        // navigate to details page
        name.setContent(this.address);
        name.open(this.map, this);
        // console.log(data, i);
        chaseDetails(e, this.markerData);
      });

    }


  });

  response.fail(function(data){
    console.log(data);
    console.log("whoa there");
  });
}

function chaseDetails(e, markerDeets){
  // console.log("chaseDetails");
  console.log(e);
  console.log(markerDeets);
  debugger
  // $('#map-canvas').hide();
  // $('.find').append($("h2"))
  //   // data["locations"][i]["address"]
  // debugger
};
