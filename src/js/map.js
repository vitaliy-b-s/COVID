import { buildStatisticsTable } from "./index";

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

  covidData.forEach(elem => {
    const geo = geoData.find(x => x.name === elem.Country);
    const population = populationData.find(x => x.name === elem.Country);

    if (geo === undefined || population === undefined) {
      return;
    }

    let maxSize;
    let size;

    const iconOptions = {
      iconUrl: "src/assets/img/marker.png",
      iconSize: [size, size],
    };

    const customIcon = L.icon(iconOptions);

    const markerDescription = `   Country: ${elem.Country},
                Population: ${new Intl.NumberFormat("ru-RU").format(
                  population.population
                )},
                Total confirmed: ${new Intl.NumberFormat("ru-RU").format(
                  elem.TotalConfirmed
                )},
                Total deaths: ${new Intl.NumberFormat("ru-RU").format(elem.TotalDeaths)},
        `;

    const markerOptions = {
      title: elem.Country,
      clickable: true,
      icon: customIcon,
    };

    if (geo.latlng === false) {
      return;
    } else {
      const marker = L.marker(geo.latlng, markerOptions);
      marker.bindPopup(markerDescription).openPopup();
      marker.addTo(map);
      marker.addEventListener("click", event => {
        const country = covidData.find(x => x.Country === event.target.options.title);
        document.querySelector(".statistics__title").innerHTML =
          event.target.options.title;
        document.querySelector(".units-change__button").style = "display: flex";
        buildStatisticsTable(country);
      });
    }
  });
}
