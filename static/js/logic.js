var url='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson'
d3.json(url, function(data) {
    createFeatures(data.features);
    console.log(data)
  });
  
function createFeatures(eqData) {
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    };

    // Define function for circle radius 
    function radiusS(mag) {
        return mag * 22000;
    }

    // Define function to choose color
    function Choosecolor(mag) {
        if (mag < 1) {
            return "#ffffb3"
        } else if (mag < 2) {
        return "#8cff1a"
        } else if (mag < 3) {
            return "#408000"
        } else if (mag < 4) {
            return "#ff751a"
        }
        else if (mag < 5) {
            return "#ff3300"
        } else {
            return "#ff4000"
        }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object

    var earthquakes = L.geoJSON(eqData, {
        pointToLayer: function(eqData, latlng) {
            return L.circle(latlng, {
                radius: radiusS(eqData.properties.mag),
                color: Choosecolor(eqData.properties.mag),
                fillOpacity: 0.75
            });
        },
    onEachFeature: onEachFeature
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define outdoormap, satellitemap, and darkmap layers
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 13,
      id: "mapbox/outdoors-v11",
      accessToken: API_KEY
    });
  
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 13,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 13,
      id: "mapbox/dark-v10",
      accessToken: API_KEY
    });
  
    var faultLine = new L.LayerGroup();
    var baseMaps = {
      "Satellite": satellitemap,
      "Dark": darkmap,
      "Outdoors": outdoorsmap
    };
  
    var overlayerMaps = {
      'Earthquakes': earthquakes
    };
    var myMap = L.map("map", {
      center: [
        49.09, -115.71
      ],
      zoom: 4,
      layers: [outdoorsmap, earthquakes]
    });
  
    // Create a layer control
    L.control.layers(baseMaps, overlayerMaps, {collapsed: false}).addTo(myMap);
} 
   