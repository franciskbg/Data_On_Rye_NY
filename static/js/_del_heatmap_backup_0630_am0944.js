// NYC lat/long = 40.730610, -73.935242

var HeatMap = L.map("h_map", {
  center: [40.735670, -73.868934],
  zoom: 12
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(HeatMap);

var url = "http://127.0.0.1:5000/heatData"; 

d3.json(url, function(response) {
  console.log("-- Next line is the json data")
  console.log(response);

  var heatArray = [];
  console.log("-- Next line is the heatArray list.   Should be empty")
  console.log(heatArray)

  for (var i = 0; i < response.length; i++) {
    var locations = response[i];
    
    // console.log(locations)

    if (locations) {
      heatArray.push([locations.lat, locations.long]);
    }
  }

  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(HeatMap);

  //Tooltip label
  var marker = new L.marker([40.735670, -73.868934], { opacity: 0.00 }); //opacity may be set to zero
  marker.bindTooltip("My Label", {permanent: true, className: "my-label", offset: [0, 0] });
  marker.addTo(HeatMap);

  //the map colors
  function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }

  //Add a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
  };

  legend.addTo(HeatMap);

  //2nd legend
  var legend2 = L.control({position: 'topright'});  
  legend2.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [50, 100, 150, 200, 250, 2000],
      labels = ['<strong> Restaurant Citations, Last 3 Months </strong>'],
      from, to;

  for (var i = 0; i < grades.length; i++) {
      from = grades [i];
      to = grades[i+1]-1;

  labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
      }
      div.innerHTML = labels.join('<br>');
      return div;
      };
  legend2.addTo(HeatMap);

});