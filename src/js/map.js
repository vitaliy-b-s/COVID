import { buildStatisticsTable, sortByNumberOfCases } from "./util";

const MAP_LAYER =
  "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=59a66f1f84374967b29c9edc3526fdaf";
const MIN_MARKER_SIZE = 10;
const MAX_MARKER_SIZE = 60;

const NUMBER_FORMAT = new Intl.NumberFormat("ru-RU");

export function initMap(covidData, populationData, geoData) {
  const map = createMap();
  addMarkersToMap(map, covidData, populationData, geoData);
}

function createMap() {
  const mapOptions = {
    center: [0.0, 0.0],
    zoom: 2,
    minZoom: 2,
  };
  const map = new L.map("map", mapOptions);
  const layer = new L.TileLayer(MAP_LAYER, {
    noWrap: true,
  });
  map.addLayer(layer);
  return map;
}

function addMarkersToMap(map, covidData, populationData, geoData) {
  const sortedCases = sortByNumberOfCases(covidData);
  const maxOfTotalConfirmed = sortedCases[0].TotalConfirmed;
  const minOfTotalConfirmed = sortedCases[sortedCases.length - 1].TotalConfirmed;
  const step = Math.trunc(
    (maxOfTotalConfirmed - minOfTotalConfirmed) / (MAX_MARKER_SIZE - MIN_MARKER_SIZE)
  );

  covidData.forEach(elem => {
    const geo = geoData.find(x => x.name === elem.Country);
    const population = populationData.find(x => x.name === elem.Country);

    if (geo === undefined || population === undefined) {
      return;
    }

    const markerSize = calculateExtraSize(elem, step);

    const markerDescription = buildMarkerDescription(elem, population);

    const markerOptions = buildMarkerOptions(markerSize, elem);

    createMarker(map, geo, markerDescription, markerOptions);
  });
}

function calculateExtraSize(country, step) {
  const extraSize = Math.trunc(country.TotalConfirmed / step);
  return MIN_MARKER_SIZE + extraSize;
}

function buildMarkerDescription(country, population) {
  return `Country: ${country.Country},
    Population: ${NUMBER_FORMAT.format(population.population)},
    Total confirmed: ${NUMBER_FORMAT.format(country.TotalConfirmed)},
    Total deaths: ${NUMBER_FORMAT.format(country.TotalDeaths)}
`;
}

function buildMarkerOptions(markerSize, country) {
  const iconOptions = {
    iconUrl: "src/assets/img/marker.png",
    iconSize: [markerSize, markerSize],
  };

  const customIcon = L.icon(iconOptions);

  return {
    title: country.Country,
    clickable: true,
    icon: customIcon,
  };
}

function createMarker(map, geo, markerDescription, markerOptions) {
  if (geo.latlng === undefined) {
    return;
  } else {
    const marker = L.marker(geo.latlng, markerOptions);

    marker.bindPopup(markerDescription).openPopup();
    marker.addTo(map);

    marker.addEventListener("click", event => {
      document.querySelector(".statistics__title").innerHTML = event.target.options.title;
      document.querySelector(".units-change__button").style = "display: flex";
      buildStatisticsTable(country);
    });
  }
}
