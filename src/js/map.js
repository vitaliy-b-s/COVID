import { sortByNumberOfCases, buildStatisticsTable } from "./util";
const MAP_LAYER =
  "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=59a66f1f84374967b29c9edc3526fdaf";
const maxSize = 60;
const minSize = 10;

export function initMap(covidData, populationData, geoData) {
  const mapOptions = {
    center: [0.0, 0.0],
    zoom: 2,
    minZoom: 2,
  };
  const map = new L.map("map", mapOptions);
  const layer = new L.TileLayer(MAP_LAYER, {
    noWrap: true,
  });
  const sortedCasesArray = sortByNumberOfCases(covidData);

  map.addLayer(layer);

  covidData.forEach(elem => {
    const geo = geoData.find(x => x.name === elem.Country);
    const population = populationData.find(x => x.name === elem.Country);

    if (geo === undefined || population === undefined) {
      return;
    }

    const calculatedSize = calculateSizeOfmarker(elem, sortedCasesArray);

    const iconOptions = {
      iconUrl: "src/assets/img/marker.png",
      iconSize: [calculatedSize, calculatedSize],
    };

    const customIcon = L.icon(iconOptions);

    const markerDescription = `   Country: ${elem.Country},
                Population: ${new Intl.NumberFormat("ru-RU").format(
                  population.population
                )},
                Total confirmed: ${new Intl.NumberFormat("ru-RU").format(
                  elem.TotalConfirmed
                )},
                Total deaths: ${new Intl.NumberFormat("ru-RU").format(
                  elem.TotalDeaths
                )},
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
        const country = covidData.find(
          x => x.Country === event.target.options.title
        );
        document.querySelector(".statistics__title").innerHTML =
          event.target.options.title;
        document.querySelector(".units-change__button").style = "display: flex";
        buildStatisticsTable(country);
      });
    }
  });
}

function calculateSizeOfmarker(covidData, sortedArray) {
  const maxCases = sortedArray[0].TotalConfirmed;
  const minCases = sortedArray[sortedArray.length - 1].TotalConfirmed;
  const step = Math.trunc((maxCases - minCases) / (maxSize - minSize));
  const extraSize = Math.trunc(covidData.TotalConfirmed / step);
  const calculatedSize = minSize + extraSize;

  return calculatedSize;
}
