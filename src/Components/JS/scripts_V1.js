function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.8283, lng: -98.5795 }, // Center on the USA
        zoom: 4
    });

   
    // Detailed state boundaries (California, New York, Texas)
    var states = [
        {
            name: "California",
            sites: 50,
            color: "#FF0000", // Red
            coords: [
                { lat: 41.9988, lng: -124.2170 },
                { lat: 40.4530, lng: -124.4127 },
                { lat: 39.7041, lng: -123.8059 },
                { lat: 38.9394, lng: -123.7276},
                { lat: 35.3997, lng: -120.8598 },
                { lat: 34.5979, lng: -120.6151 },
                { lat: 32.5595, lng: -117.1307},
                { lat: 32.7960, lng: -114.5061},
                { lat: 34.9665, lng:-114.6599},
                { lat: 38.9675, lng:-120.0212},
                { lat: 42.0080, lng:-120.0432},
                { lat: 41.9988, lng:-124.2170}
            ]
        },
        {
            name: "New York",
            sites: 30,
            color: "#00FF00", // Green
            coords: [
                { lat: 40.4774, lng: -79.7626 },
                { lat: 41.4986, lng: -79.7626 },
                { lat: 42.0003, lng: -78.9659 },
                { lat: 42.5142, lng: -79.7626 },
                { lat: 43.4793, lng: -79.7626 },
                { lat: 44.5116, lng: -76.3374 },
                { lat: 44.8476, lng: -76.2407 },
                { lat: 45.0003, lng: -74.7103 },
                { lat: 45.0153, lng: -73.3438 },
                { lat: 44.8746, lng: -71.5564 },
                { lat: 44.6543, lng: -71.0576 },
                { lat: 44.0003, lng: -71.0328 },
                { lat: 43.0036, lng: -73.4861 },
                { lat: 42.7455, lng: -73.5090 },
                { lat: 42.6970, lng: -73.2642 },
                { lat: 42.0003, lng: -73.4901 },
                { lat: 41.2953, lng: -73.5533 },
                { lat: 40.9875, lng: -73.7262 },
                { lat: 40.6807, lng: -73.4146 },
                { lat: 40.5720, lng: -73.5011 },
                { lat: 40.4774, lng: -74.2589 },
                { lat: 40.5825, lng: -74.2591 },
                { lat: 40.4774, lng: -75.1900 },
                { lat: 40.4774, lng: -79.7626 }
            ]
        },
        {
            name: "Texas",
            sites: 70,
            color: "#0000FF", // Blue
            coords: [
                {lat: 36.4394, lng: -99.9663 },
                {lat: 36.5101, lng: -102.9985 },
                {lat: 31.9713, lng: -103.0864},
                {lat: 31.9948, lng: -106.6247 },
                {lat: 30.8590, lng: -105.3327 },
                {lat: 29.6925, lng: -104.5693},
                {lat: 28.9929, lng: -103.1990},
                {lat: 29.8624, lng: -102.3964},
                {lat: 29.7095, lng: -101.4372},
                {lat: 26.4459, lng: -99.0882},
                {lat: 25.9365, lng: -97.1893 },
                {lat: 27.3710, lng: -97.4047 },
                {lat: 29.3518, lng: -94.8399},
                {lat: 29.7341, lng: -93.8512},
                {lat: 31.0607, lng: -93.5545},
                {lat: 31.9972, lng: -94.0379},
                {lat: 33.5856, lng: -94.08192},
                {lat: 34.6045, lng: -99.9705},
                {lat: 36.4394, lng: -99.9663 }
            ]
        }
    ];

    states.forEach(state => {
        var polygon = new google.maps.Polygon({
            paths: state.coords,
            strokeColor: state.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: state.color,
            fillOpacity: 0.35
        });
        polygon.setMap(map);

        google.maps.event.addListener(polygon, 'click', function() {
            window.location.href = `state.html?state=${state.name}`;
        });

        // Add a label for the number of sites
        var center = getPolygonCenter(state.coords);
        var label = new google.maps.InfoWindow({
            content: `<div style="color: black; font-weight: bold;">${state.sites} Sites</div>`,
            position: center
        });
        label.open(map);

        google.maps.event.addListener(label, 'click', function() {
            window.location.href = `state.html?state=${state.name}`;
        });

        // Add state info to the list
        var stateList = document.getElementById('state-list');
        var listItem = document.createElement('li');
        listItem.textContent = `${state.name}: ${state.sites} Sites`;
        listItem.addEventListener('click', function() {
            window.location.href = `state.html?state=${state.name}`;
        });
        stateList.appendChild(listItem);
    });
}

// Calculate the center of the polygon to place the label
function getPolygonCenter(path) {
    var bounds = new google.maps.LatLngBounds();
    path.forEach(function(latlng) {
        bounds.extend(new google.maps.LatLng(latlng.lat, latlng.lng));
    });
    return bounds.getCenter();
}

