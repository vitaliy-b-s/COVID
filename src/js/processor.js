import { fetchData } from "./client";
import { countries, dataByCountries, generalData } from "./data";

// Не уверен, что за сортировку должен отвечать процессор
export function sortByNumberOfCases(arr) {
  const sorted = [...arr];

  function compare(a, b) {
    if (a.TotalConfirmed < b.TotalConfirmed) {
      return -1;
    }
    if (a.TotalConfirmed > b.TotalConfirmed) {
      return 1;
    }
    return 0;
  }
  return sorted.sort(compare).reverse();
}

export function convertData() {
  return fetchData().then(() => {
    // Мне не нравится этот блок кода. Вынеси его в отдельную функцию
    // В целом, лучше внутри .then(() => ...) не писать много кода, эта часть c then нужна, чтобы описать
    // последовательность действий, поэтому намного приятнее читать, когда не такая простыня, а что-то типа
    // .then(() => someMeaningfulFunctionName())
    generalData.covid.Countries.forEach(elem => {
      let population;
      let lat;
      let lon;
      countries.push(elem.Country);
      // можно использовать truthy и falsy и не делать явно сравнение с undefined
      if (
        generalData.population.find(x => x.name === elem.Country) === undefined
      ) {
        population = "No data";
      } else {
        population = generalData.population.find(x => x.name === elem.Country)
          .population;
      }
      if (generalData.coords.find(x => x.name === elem.Country) === undefined) {
        lat = "No data";
        lon = "No data";
      } else {
        lat = generalData.coords.find(x => x.name === elem.Country).latlng[0];
        lon = generalData.coords.find(x => x.name === elem.Country).latlng[1];
      }
      dataByCountries.set(elem.Country, {
        Country: elem.Country,
        TotalConfirmed: elem.TotalConfirmed,
        TotalDeaths: elem.TotalDeaths,
        TotalRecovered: elem.TotalRecovered,
        LastDayConfirmed: elem.NewConfirmed,
        LastDayDeath: elem.NewDeaths,
        LastDayRecovered: elem.NewRecovered,
        Population: population,
        Lat: lat,
        Lon: lon,
        TotalConfiremdPerMen: (100000 * elem.TotalConfirmed) / population,
        TotalDeathsPerMen: (100000 * elem.TotalDeaths) / population,
        TotalRecoveredPerMen: (100000 * elem.TotalRecovered) / population,
      });
    });
  });
}

// А ты уверен, что модуль с названием processor должен отвечать за смену единиц измерения?
export function cahngeOrderUnits(event) {
  generalData.orderParameter = event.target.value;
}

// Лучше не использовать в именах функций слово array. Зачем оно тут? Само слово countries во множественном
// числе говорит о том, что будешь рабоать с массивом.
// Имя аргумента - string - это тоже никуда не годится? string это тип данных, а не осмысленное название аргумента
export function filterCountriesArray(arr, string) {
  return arr.filter(elem => elem.toLowerCase().includes(string.toLowerCase()));
}
