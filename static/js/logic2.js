var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var satellitestreetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
});

var map = L.map("map", {
    center: [40, -95],
    zoom: 5,
    layers: [lightmap, satellitemap, streetmap, satellitestreetmap]
});

satellitemap.addTo(map)
streetmap.addTo(map)
satellitestreetmap.addTo(map)

var baseMap = {
    satellite:satellitemap, 
    light:lightmap,
    street:streetmap,
    satstreet:satellitestreetmap
};

L.control
    .layers(baseMap)
    .addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data){
    function styleInfo(feature) {
        return{
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        };
    }
    function getRadius(magnitude){
        return magnitude*4;
    }
    function getColor(magnitude){
        switch(true){
            case magnitude>5:
                return "red";
            case magnitude>4:
                return "blue";
            case magnitude>3:
                return "green";
            case magnitude>2:
                return "orange";
            case magnitude>1:
                return "purple";
            default:
                return "white";
        }
    }



    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)},
        style: styleInfo,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]

        for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(map);

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function (plateData){
        L.geoJSON(plateData, {
            color: "orange",
            weight: 3,
        }).addTo(map)
    });
    

    });


