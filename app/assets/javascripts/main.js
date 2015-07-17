$(document).on('page:change', function(){
  // function created to get the users current location as coordinates
  // then calls initialize to set up a map with associated markers
  currentLocation();

});

function currentLocation(){

    if (navigator.geolocation) {
      // uses geolocation to get current location
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
      // handles edge case if geolocation isn't supported
        console.log("Geolocation is not supported by this browser.");
    }
    // will show initial user's position on map
    function showPosition(position) {
        var location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // passes location hash to initialize function to generate map and mark users current location
        initialize(location);
    }
}

function initialize(location) {
  // creates new map with lat and long from current location
  var mylatLong = new google.maps.LatLng(location.lat, location.lng);
  var mapOptions = {
    // center of map
    center: mylatLong,
    // how far in you want to zoom when new map generates
    zoom: 10
  };

  // sets the map after getting the div area to know where to place it
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // calls function to set markers on new map
  chaseMarkers(location.lat, location.lng, map);

  // sets first marker as current location
  var marker = new google.maps.Marker({
    position: mylatLong,
    map: map,
    title: "First location"
  });

}

function chaseMarkers(lati, longi, map){
  // ajax call to chaseparty route which holds the chase data when pinged
  // this was a workaround the cross-domain AJAX problem
  var response = $.ajax({
    url: '/chaseparty',
    type: 'get',
    // passing in the longitude and latitude to send to the controller
    data: {lati: lati, longi: longi},
    // jsonp removes the cross-domain issue, but returns with a failed response
    dataType: 'json',
  });

  response.done(function(data){
    // creates a window for each marker that was used to test the on click event
    var name = new google.maps.InfoWindow();
    var marker, i;

    // loops through the branch/atm locations
    for(i = 0; i < data["locations"].length; i++){
      // stores longitude and latitude, passes it to google's method, getting an array of coords
      lati = data["locations"][i]["lat"];
      longi = data["locations"][i]["lng"];
      var responseCoord = new google.maps.LatLng(lati, longi);

      // creates markers with the coordinates, specifices current map
      marker = new google.maps.Marker({
        position: responseCoord,
        map: map,
        // address attribute used for info window on click
        address: data["locations"][i]["address"],
        // passing each marker specific data
        markerData: data["locations"][i],
      });
      // adds lsitener on each marker so when clicked, executes chaseDetails function on event
      google.maps.event.addListener(marker, "click", function(e){
        // sets the string to be displayed on click
        name.setContent(this.address);
        // displays marker info on map when clicked
        name.open(this.map, this);
        // generate details page
        chaseDetails(e, this.markerData);
      });

    }

  });
  // if response results in a failure, console log notifies
  response.fail(function(data){
    // console.log(data);
    console.log("whoa there");
  });
}

function chaseDetails(e, markerDeets){
  // console.log("chaseDetails");
  // console.log(e);
  // console.log(markerDeets);
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  // hides google map with pins and location search bar
  // manipulating DOM elements instead of creating a new route page for details of each location
  $('#map-canvas').hide();
  $('.find').hide();

  // getting the template script from index.html.erb
  var templateScript = $("#marker-details").html();
  // compiling the template
  var template = Handlebars.compile(templateScript);
  // defining the data that I want to be accessible from handlebars template
    var context = {
      label: markerDeets.label.toUpperCase(),
      address: markerDeets.address,
      city: markerDeets.city,
      state: markerDeets.state,
      locType: markerDeets.locType.toUpperCase(),
      zipcode: markerDeets.zip,
      atms: markerDeets.atms,
      bank: markerDeets.bank,
      services: markerDeets.services,
      lobbyHrs: markerDeets.lobbyHrs,
      driveUpHrs: markerDeets.driveUpHrs,
      phone: markerDeets.phone,
      distance: Math.round(markerDeets.distance),
      type: markerDeets.type,
      days: days,
    };
  // pass data to template
  var compiledHTML = template(context);

  // add compiled html to page
  $('#location-details').html(compiledHTML);

};
