import { dataByCountries } from "./data";

export function initMap(arr) {
    const mapOptions = {
        center: [0.0, 0.0],
        zoom: 2
    }
    const map = new L.map('map', mapOptions);
    const layer = new L.TileLayer('https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=59a66f1f84374967b29c9edc3526fdaf', {
        noWrap: true
    });
    map.addLayer(layer);

    const iconOptions = {
        iconUrl: 'src/assets/img/icon.png',
        iconSize: [10, 10]
    }


    const customIcon = L.icon(iconOptions);
    arr.forEach((key, value) => {
        const markerDescription =
            `Country: ${key.country}, \n
            Population: ${new Intl.NumberFormat('ru-RU').format(key.population)}, 
            Total confirmed: ${new Intl.NumberFormat('ru-RU').format(key.totalConfirmed)}, 
            Total deaths: ${new Intl.NumberFormat('ru-RU').format(key.totalDeath)},       
        `;
        const markerOptions = {
            title: key.country,
            clickable: true,
            icon: customIcon
        }

        if (key.lat === "No data") {
            return
        } else {
            const marker = L.marker([key.lat, key.lon], markerOptions);
            marker.bindPopup(markerDescription).openPopup();
            marker.addTo(map);
        }

    })
}