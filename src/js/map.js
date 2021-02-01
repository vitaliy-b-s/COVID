export function initMap(covidData, populationData, geoData) {
  const mapOptions = {
    center: [0.0, 0.0],
    zoom: 2,
    minZoom: 2,
  };
  const map = new L.map("map", mapOptions);
  const MAP_LAYER =
    "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=59a66f1f84374967b29c9edc3526fdaf";
  const layer = new L.TileLayer(MAP_LAYER, {
    noWrap: true,
  });
  map.addLayer(layer);

  const iconOptions = {
    iconUrl: "src/assets/img/icon.png",
    iconSize: [10, 10],
  };

  const customIcon = L.icon(iconOptions);
  arr.forEach((key, value) => {
    const markerDescription = `   Country: ${key.Country}, 
                Population: ${new Intl.NumberFormat("ru-RU").format(
                  key.Population
                )}, 
                Total confirmed: ${new Intl.NumberFormat("ru-RU").format(
                  key.TotalConfirmed
                )}, 
                Total deaths: ${new Intl.NumberFormat("ru-RU").format(
                  key.TotalDeaths
                )},       
        `;
    const markerOptions = {
      title: key.Country,
      clickable: true,
      icon: customIcon,
    };

    if (key.Lat === "No data") {
      return;
    } else {
      const marker = L.marker([key.Lat, key.Lon], markerOptions);
      marker.bindPopup(markerDescription).openPopup();
      marker.addTo(map);
      marker.addEventListener("click", event => {
        renderSearchResults(event.target.options.title);
      });
    }
  });
}
