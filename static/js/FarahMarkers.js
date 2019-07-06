console.log("hello farahmarkers");
function createMap(restos) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create an overlayMaps object to hold the Restaurants layer
var layers = {
    BRONX: new L.LayerGroup(),
    MANHATTAN: new L.LayerGroup(),
    BROOKLYN: new L.LayerGroup(),
    STATEN_ISLAND: new L.LayerGroup(),
    QUEENS: new L.LayerGroup(),
    Missing: new L.LayerGroup()
    };
    
  var overlayMaps = {
    "Restaurants": restos,
      "Bronx": layers.BRONX,
      "Manhattan": layers.MANHATTAN,
      "Brooklyn": layers.BROOKLYN,
      "Staten Island": layers.STATEN_ISLAND,
      "Queens": layers.QUEENS,
      "Missing" : layers.Missing
  };
    


  // Create the map object with options
  var FarahM = L.map("FarahM", {
    center: [40.735670, -73.868934],
    zoom: 12,
//    layers: [lightmap, restos]
                     layers: [lightmap,
                              restos,
                              layers.BRONX,
                              layers.MANHATTAN,
                              layers.BROOKLYN,
                              layers.STATEN_ISLAND,
                              layers.QUEENS,
                              layers.Missing
                              ]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(FarahM);

 } // commenting out to remove the create map function


// });


function createMarkers(response) {


    var url = "http://127.0.0.1:5000/markerData";
    var markerColors;
    
    d3.json(url, function(response) {
            console.log("-- Next line is the marker json data");
            console.log(response);
            });

    // // Initialize an array to hold restaurant markers
    var restosMarkers = [];
    console.log("-- Next line is the restosMarkers list.   Should be empty");
    console.log(restosMarkers);
  
    // Loop through the restosMarkers array
    for (var i = 0; i < response.length; i++) {
      var locations = response[i];
  
      // For each restaurant, create a marker and bind a popup
      var restoMarker = L.marker([locations.lat, locations.long])
        .bindPopup("<h5>" + locations.DBA + "<h5>----------<h6>Rating: " + locations.GRADE + "<h6><h6>Cuisine: " + locations['CUISINE DESCRIPTION'] +"<h6><h6>Borough: "+ locations.BORO + "<h6><h6>Violations: " + locations['Count of Violations']+"<h6><h6>Address: "+locations.address_full+"<h6><h6>Directions: <a href='http://google.com/maps/dir/current+location/'>Copy the Full Address & Click Here!</a>");
      // Add the marker to the restosMarkers array
      restosMarkers.push(restoMarker);
    };
  
    // Create a layer group made from the restosMarkers array, pass it into the createMap function
    createMap(L.layerGroup(restosMarkers));
  };

d3.json("http://127.0.0.1:5000/markerData",createMarkers);

