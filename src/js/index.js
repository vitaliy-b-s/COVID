import { style } from "/src/assets/style.css";
import { scss } from "/src/assets/scss.scss";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import { collectCovidData } from "./client";

function buildApp() {
  collectCovidData().then(data => {
    buildGlobalСasesBlock(data.data.Global);
    buildCountriesTable(data.data.Countries);
    buildStatisticsTable(data.data.Global);

    addListenerToUnitButtons(data.data.Countries);
    addListenerToSearchButton(data.data.Countries);
    addListenerToSearchInut(data.data.Countries);
  });
}

function buildGlobalСasesBlock(covidData) {
  const globalCases = document.querySelector(".total__value");
  globalCases.innerHTML = new Intl.NumberFormat("ru-RU").format(
    covidData.TotalConfirmed
  );
}

function buildCountriesTable(covidDataByCountries) {
  const list = document.querySelector(".countries__list");
  list.innerHTML = "";

  covidDataByCountries.forEach(element => {
    const li = document.createElement("li");
    const country = document.createElement("div");
    const value = document.createElement("div");

    li.className = "country";
    country.className = "country__name";
    value.className = "country__cases_value";

    country.innerHTML = element.Country;
    value.innerHTML = new Intl.NumberFormat("ru-RU").format(
      element.TotalConfirmed
    );

    li.appendChild(value);
    li.appendChild(country);
    list.appendChild(li);
  });
}

function addListenerToUnitButtons(covidDataByCountries) {
  document.querySelectorAll(".input").forEach(elem =>
    elem.addEventListener("click", event => {
      if (event.target.value === "byCountryName") {
        buildCountriesTable(covidDataByCountries);
      } else {
        buildCountriesTable(sortByNumberOfCases(covidDataByCountries));
      }
    })
  );
}

function buildStatisticsTable(covidData) {
  const totalCases = document.querySelector(".statistics-case__value");
  const totalDeath = document.querySelector(".statistics-death__value");
  const totalRecovered = document.querySelector(".statistic-recover__value");

  totalCases.innerHTML = new Intl.NumberFormat("ru-RU").format(
    covidData.TotalConfirmed
  );
  totalDeath.innerHTML = new Intl.NumberFormat("ru-RU").format(
    covidData.TotalDeaths
  );
  totalRecovered.innerHTML = new Intl.NumberFormat("ru-RU").format(
    covidData.TotalRecovered
  );
}

function addListenerToSearchButton(covidData) {
  const searhedCountry = document.querySelector(".search__input").value;
  const statisticsTitle = document.querySelector(".statistics__title");

  document.querySelector(".search__button").addEventListener("click", () => {
    for (const key of covidData) {
      if (key.Country.toLowerCase() === searhedCountry.toLowerCase()) {
        statisticsTitle.innerHTML = key.Country;
        buildStatisticsTable(key);
        break;
      }
    }
  });
}

function addListenerToSearchInut(covidDataByCountries) {
  document.querySelector(".search__input").addEventListener("keyup", () => {
    renderPossibleSearchVariants(filterCountriesArray(covidDataByCountries));
  });
}

function renderPossibleSearchVariants(filteredArray) {
  const possibleCountriesList = document.querySelector(
    ".search__possible-variants"
  );
  possibleCountriesList.innerHTML = "";
  possibleCountriesList.style = "display: block;";
  filteredArray.forEach(elem => {
    const li = document.createElement("li");
    li.className = "search__possible-country";
    li.innerHTML = elem;
    possibleCountriesList.appendChild(li);
  });
}

function filterCountriesArray(covidDataByCountries) {
  const filteredArray = [];
  const searchedCountry = document.querySelector(".search__input").value;

  for (const key of covidDataByCountries) {
    if (key.Country.toLowerCase().includes(searchedCountry)) {
      filteredArray.push(key.Country);
    }
  }

  return filteredArray;
}

function sortByNumberOfCases(covidData) {
  const sorted = [...covidData];

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

// function buildPage() {
//   const listOfCountries = document.querySelector(".countries__list");
//   // converData - функция, которая находится в модуле processor.js
//   // В модуле processor.js используется модуль client.js. В итоге все написано так, как будто
//   // клиент - это часть процессора? Это неправильно. Процессинг данных - это самостоятельная операция
//   // которая должна выполнять функцию, соответствующую своему названию - процессить переданные ей данные
//   // И почему у тебя прилага начинается с функции convertData, которая даже не получает ничего аргументом?
//   // это странная логика. Если у тебя есть клиент и процессор, то в моем представлении это должно выглядеть так:
//   // fetchData()
//   //    .then(data => convertData(data))
//   //    .then(...)
//   //
//   // Можно вынести всю эту логику в отдельный модуль, это тоже нормально. Но тогда функция должна называться
//   // не convertData, а collectData или provideData, а сам модуль - не процессором должен быть, а провайдером или коллектором
//   convertData()
//     // Этот блок в первом then тоже лучше вынести в отдельную функцию
//     .then(() => {
//       // Почему одна функция не получает аргументов и вытаскивает их сама, а вторая получает аргумент?
//       renderGlobalCases();
//       renderStatistics(generalData.covid.Global);
//       // Почему функция со словом get в названии ничего не возвращает, а вместо этого заполняет какой-то левый
//       // объект из другого модуля?
//       getRandomNumberOfCases(500000, 600000);
//       // аналогично
//       getDatesArray(
//         new Date("December 15, 2020"),
//         new Date("December 29, 2020")
//       );
//       // забыл убрать лог
//       console.log(labelsForGraph);
//       buildGraph();
//     })
//     .then(() =>
//       renderCountriesTable(generalData.covid.Countries, listOfCountries)
//     )
//     .then(() => initMap(dataByCountries));
// }

// function getRandomNumberOfCases(min, max) {
//   for (let i = 0; i < 15; i++) {
//     let rand = min - 0.5 + Math.random() * (max - min + 1);
//     randomCases.push(Math.round(rand));
//   }
// }

// function getDatesArray(startDate, stopDate) {
//   // не уверен, что это хорошая практика и нельзя сделать это без изменения прототипа
//   // но в целом прикольное решение, пусть остается
//   Date.prototype.addDays = function (days) {
//     const date = new Date(this.valueOf());
//     date.setDate(date.getDate() + days);
//     return date;
//   };
//   let currentDate = startDate;
//   while (currentDate <= stopDate) {
//     labelsForGraph.push(
//       `${currentDate.getDate()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`
//     );
//     currentDate = currentDate.addDays(1);
//   }
// }

// function renderGlobalCases() {
//   const globalCases = document.querySelector(".total__value");
//   globalCases.innerHTML = new Intl.NumberFormat("ru-RU").format(
//     generalData.covid.Global.TotalConfirmed
//   );
// }

// // Всегда давай аргументам функции осмысленные названия - что такое obj?
// function renderStatistics(obj) {
//   const totalCases = document.querySelector(".statistics-case__value");
//   const totalDeath = document.querySelector(".statistics-death__value");
//   const totalRecovered = document.querySelector(".statistic-recover__value");

//   totalCases.innerHTML = new Intl.NumberFormat("ru-RU").format(
//     obj.TotalConfirmed
//   );
//   totalDeath.innerHTML = new Intl.NumberFormat("ru-RU").format(obj.TotalDeaths);
//   totalRecovered.innerHTML = new Intl.NumberFormat("ru-RU").format(
//     obj.TotalRecovered
//   );
// }

// // аналогично предыдущей функции, только еще хуже
// // arr и list - блестящие названия аргументов, хрен пойми в каком что, правда
// function renderCountriesTable(arr, list) {
//   list.innerHTML = "";
//   arr.forEach(elem => {
//     const li = document.createElement("li");
//     const country = document.createElement("div");
//     const value = document.createElement("div");

//     li.className = "country";
//     country.className = "country__name";
//     value.className = "country__cases_value";

//     country.innerHTML = elem.Country;
//     value.innerHTML = new Intl.NumberFormat("ru-RU").format(
//       elem.TotalConfirmed
//     );

//     li.appendChild(value);
//     li.appendChild(country);
//     list.appendChild(li);
//   });
// }

// export function renderSearchResults(country) {
//   const searchedData = search(dataByCountries, country);
//   if (searchedCountry.info === undefined) {
//     alert("Please enter valid country name");
//     return;
//   } else {
//     renderStatistics(searchedData);
//     showButton();
//     document.querySelector(".statistics__title").innerHTML =
//       searchedCountry.info.Country;
//     document.querySelector(".units-change__button").value = "Per 100 000 men";
//     document.querySelector(".units-change__button").innerHTML =
//       "Per 100 000 men";
//   }
// }

// function changeCountriesOrder() {
//   const reverseOrdedCountries = sortByNumberOfCases(
//     generalData.covid.Countries
//   );
//   const listOfCountries = document.querySelector(".countries__list");
//   if (generalData.orderParameter === "byCountryName") {
//     renderCountriesTable(generalData.covid.Countries, listOfCountries);
//   } else {
//     renderCountriesTable(reverseOrdedCountries, listOfCountries);
//   }
// }

// function changeStatisticsUnits() {
//   const button = document.querySelector(".units-change__button");
//   if (button.value === "Total") {
//     renderStatistics(searchedCountry.info);

//     button.innerHTML = "Per 100 000 men";
//     button.value = "Per 100 000 men";
//   } else {
//     const totalCases = document.querySelector(".statistics-case__value");
//     const totalDeath = document.querySelector(".statistics-death__value");
//     const totalRecovered = document.querySelector(".statistic-recover__value");

//     totalCases.innerHTML = new Intl.NumberFormat("ru-RU").format(
//       searchedCountry.info.TotalConfiremdPerMen
//     );
//     totalDeath.innerHTML = new Intl.NumberFormat("ru-RU").format(
//       searchedCountry.info.TotalDeathsPerMen
//     );
//     totalRecovered.innerHTML = new Intl.NumberFormat("ru-RU").format(
//       searchedCountry.info.TotalRecoveredPerMen
//     );

//     button.innerHTML = "Total";
//     button.value = "Total";
//   }
// }

// function showButton() {
//   document.querySelector(".units-change__button").classList.add("show");
// }

// function showPossibleSearchedCountries(array) {
//   const list = document.querySelector(".search__possible-variants");
//   list.innerHTML = "";

//   array.forEach(element => {
//     const li = document.createElement("li");
//     li.className = "search__possible-country";
//     li.innerHTML = element;

//     li.addEventListener("click", event => {
//       document.querySelector(".search__input").value = event.target.innerHTML;
//       list.innerHTML = "";
//       renderSearchResults(event.target.innerHTML);
//     });

//     list.appendChild(li);
//   });
// }

function initApp() {
  buildApp();

  // document.querySelector(".search__button").addEventListener("click", () => {
  //   renderSearchResults(document.querySelector(".search__input").value);
  // });
  // document
  //   .querySelector(".units-change__button")
  //   .addEventListener("click", () => {
  //     changeStatisticsUnits();
  //   });
  // document.querySelector(".search__input").addEventListener("keyup", () => {
  //   showPossibleSearchedCountries(
  //     filterCountriesArray(
  //       countries,
  //       document.querySelector(".search__input").value
  //     )
  //   );
  // });
}

initApp();
