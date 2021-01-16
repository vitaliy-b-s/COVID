export function initMap(arr) {
    const mapOptions = {
        center: [0.0, 0.0],
        zoom: 2
    }
    const map = new L.map('map', mapOptions);
    const layer = new L.TileLayer('https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=59a66f1f84374967b29c9edc3526fdaf');
    map.addLayer(layer);

    const iconOptions = {
        iconUrl: 'src/assets/img/icon.png',
        iconSize: [10, 10]
    }

    const customIcon = L.icon(iconOptions);

    arr.forEach(element => {
        const markerDescription =
            `Country: ${element.country}
             Population:${element.popualtion}
             Total confirmed: ${element.totalConfirmed}
             Total deaths: ${element.totalDeath}      
            `;
        const markerOptions = {
            title: markerDescription,
            clickable: true,
            icon: customIcon
        }
        const marker = L.marker([element.lat, element.lon], markerOptions);
        marker.bindPopup(markerDescription).openPopup();
        marker.addTo(map);
    });






}