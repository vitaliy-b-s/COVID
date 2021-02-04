import { style } from "/src/assets/style.css";
import { scss } from "/src/assets/scss.scss";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import { collectData } from "./client";
import { initMap } from "./map";
import { buildGraph } from "./graph";
import { sortByNumberOfCases, buildStatisticsTable } from "./util";

function buildApp() {
  collectData().then(data => {
    buildGlobalСasesBlock(data.covid.Global);
    buildCountriesTable(data.covid.Countries);
    buildStatisticsTable(data.covid.Global);
    initMap(data.covid.Countries, data.population, data.coords);
    buildGraph();
    addListenerToUnitButtons(data.covid.Countries);
    addListenerToSearchInut(data.covid.Countries);
    addListenerToSearchButton(data.covid.Countries);
    addListenerToPerMenButton(data.covid.Countries, data.population);
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

function addListenerToSearchButton(covidData) {
  document.querySelector(".search__button").addEventListener("click", () => {
    const searhedCountry = document.querySelector(".search__input").value;
    const statisticsTitle = document.querySelector(".statistics__title");
    document.querySelector(".search__possible-variants").style =
      "display: none";

    for (const key of covidData) {
      if (key.Country.toLowerCase() === searhedCountry.toLowerCase()) {
        statisticsTitle.innerHTML = key.Country;
        buildStatisticsTable(key);
        showButton(document.querySelector(".units-change__button"));
        break;
      }
    }
  });
}

function showButton(button) {
  button.style = "display: flex";
}

function addListenerToSearchInut(covidDataByCountries) {
  document.querySelector(".search__input").addEventListener("keyup", () => {
    renderPossibleSearchOptions(filterCountriesArray(covidDataByCountries));
  });
}

function renderPossibleSearchOptions(filteredArray) {
  const possibleCountriesList = document.querySelector(
    ".search__possible-variants"
  );

  possibleCountriesList.innerHTML = "";
  possibleCountriesList.style = "display: block;";

  filteredArray.forEach(elem => {
    const li = document.createElement("li");

    li.className = "search__possible-country";
    li.addEventListener("click", event => {
      setSearchedCountry(event);
    });
    li.innerHTML = elem;

    possibleCountriesList.appendChild(li);
  });
}

function setSearchedCountry(event) {
  document.querySelector(".search__input").value = event.target.innerHTML;
  document.querySelector(".search__possible-variants").style = "display: none";
}

function filterCountriesArray(covidDataByCountries) {
  const filteredArray = [];
  const searchedCountry = document.querySelector(".search__input").value;

  for (const key of covidDataByCountries) {
    if (key.Country.toLowerCase().includes(searchedCountry.toLowerCase())) {
      filteredArray.push(key.Country);
    }
  }

  return filteredArray;
}

function addListenerToPerMenButton(covidData, population) {
  const unit = document.querySelector(".units-change__button");
  unit.addEventListener("click", () => {
    changeStatisticsUnits(covidData, population);
  });
}

function changeStatisticsUnits(covidData, population) {
  const country = document.querySelector(".statistics__title").innerHTML;
  const changeButton = document.querySelector(".units-change__button");

  const totalCasesPerMen =
    (100000 * covidData.find(x => x.Country === country).TotalConfirmed) /
    population.find(x => x.name === country).population;

  const totalDeathPerMen =
    (100000 * covidData.find(x => x.Country === country).TotalDeaths) /
    population.find(x => x.name === country).population;

  const totalRecoveredPerMen =
    (100000 * covidData.find(x => x.Country === country).TotalRecovered) /
    population.find(x => x.name === country).population;

  if (changeButton.value === "Total") {
    buildStatisticsTable(covidData.find(x => x.Country === country));

    changeButton.innerHTML = "Per 100 000 men";
    changeButton.value = "Per 100 000 men";
  } else {
    const totalCases = document.querySelector(".statistics-case__value");
    const totalDeath = document.querySelector(".statistics-death__value");
    const totalRecovered = document.querySelector(".statistic-recover__value");

    totalCases.innerHTML = new Intl.NumberFormat("ru-RU").format(
      totalCasesPerMen
    );
    totalDeath.innerHTML = new Intl.NumberFormat("ru-RU").format(
      totalDeathPerMen
    );
    totalRecovered.innerHTML = new Intl.NumberFormat("ru-RU").format(
      totalRecoveredPerMen
    );

    changeButton.innerHTML = "Total";
    changeButton.value = "Total";
  }
}

buildApp();
