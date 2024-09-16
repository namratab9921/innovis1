function initMap() {
    const urlParams = new URLSearchParams(window.location.search);
    const stateName = urlParams.get('state');
    document.getElementById('state-name').textContent = stateName;

    const stateData = getStateData(stateName);

    var map = new google.maps.Map(document.getElementById('map'), {
        center: stateData.center,
        zoom: 6
    });

    stateData.sites.forEach(site => {
        var marker = new google.maps.Marker({
            position: site.coords,
            map: map,
            title: site.name
        });

        var infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${site.name}</strong><br>${site.address}</div>`
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        var siteList = document.getElementById('site-list');
        var listItem = document.createElement('li');
        listItem.textContent = `${site.name}: ${site.address}`;
        listItem.addEventListener('click', function() {
            window.location.href = `site.html?state=${stateName}&site=${site.name}`;
        });
        siteList.appendChild(listItem);
    });
}

function getStateData(stateName) {
    const states = {
        "California": {
            center: { lat: 36.7783, lng: -119.4179 },
            sites: [
                { name: "Site 1", address: "123 Main St, Los Angeles, CA", coords: { lat: 34.0522, lng: -118.2437 } },
                { name: "Site 2", address: "456 Market St, San Francisco, CA", coords: { lat: 37.7749, lng: -122.4194 } },
                { name: "Site 3", address: "789 Central Ave, Fresno, CA", coords: { lat: 36.7783, lng: -119.4179 } }
            ]
        },
        "New York": {
            center: { lat: 43.2994, lng: -74.2179 },
            sites: [
                { name: "Sun City", address: "123 Broadway, New York, NY", coords: { lat: 40.7128, lng: -74.0060 } },
                { name: "Moon Rocket express", address: "456 State St, Albany, NY", coords: { lat: 42.6526, lng: -73.7562 } },
                { name: "City Mall", address: "879 Jumbo St, Norwich, NY", coords: { lat: 41.9978, lng:-74.4049 } },
                { name: "Riverside Market", address: "1253 Puppet Lane, Watkins Glen, NY", coords: { lat: 42.4777, lng :-74.2182 } },
                { name: "Metro Theatre Mall", address: "001 Wide St, Auburn, NY", coords: { lat: 42.1812, lng: -74.8938 } },
                { name: "Highway Tower", address: "23 Narrow Lane, Ithaca, NY", coords: { lat: 42.7843, lng: -74.6357} },
                { name: "Airport Site", address: "168 Wonderland Avenue, Geneva, NY", coords: { lat: 42.5586, lng: -75.5201 } },
                { name: "Dense Urban", address: "129 Riverside Higway, Lowville, NY", coords: { lat: 42.9137, lng: -75.5036 } },
                { name: "City Centre", address: "78 County lane, Fulton, NY", coords: { lat: 43.0624, lng:  -76.1573 } },
                { name: "Rural Back of Nowhere", address: "789 Lake Shore Dr, Syracuse, NY", coords: { lat: 43.2994, lng: -74.2179 } }
            ]
        },
        "Texas": {
            center: { lat: 31.9686, lng: -99.9018 },
            sites: [
                { name: "Site 1", address: "123 Elm St, Houston, TX", coords: { lat: 29.7604, lng: -95.3698 } },
                { name: "Site 2", address: "456 Maple St, Dallas, TX", coords: { lat: 32.7767, lng: -96.7970 } },
                { name: "Site 3", address: "789 Oak St, Austin, TX", coords: { lat: 31.9686, lng: -99.9018 } }
            ]
        }
    };

    return states[stateName];
}


