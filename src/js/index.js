import { style } from "/src/assets/style.css"
import { scss } from "/src/assets/scss.scss"
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import { initMap } from './map.js'
import { convertData, sortByNumberOfCases, cahngeOrderUnits, filterCountriesArray } from './processor.js'
import { generalData, dataByCountries, searchedCountry, countries, randomCases, labelsForGraph } from "./data.js"
import { search } from './search.js'
import { buildGraph } from "./graph.js"
import Chart from 'chart.js';


function buildPage() {
    const listOfCountries = document.querySelector('.countries__list')
    convertData()
        .then(() => {
            renderGlobalCases();
            renderStatistics(generalData.covid.Global);
            getRandomNumberOfCases(500000, 600000);
            getDatesArray(new Date('December 15, 2020'), new Date('December 29, 2020'))
            console.log(labelsForGraph)
            buildGraph();
        })
        .then(() => renderCountriesTable(generalData.covid.Countries, listOfCountries))
        .then(() => initMap(dataByCountries))
}

function getRandomNumberOfCases(min, max) {
    for (let i = 0; i < 15; i++) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        randomCases.push(Math.round(rand));
    }
}

function getDatesArray(startDate, stopDate) {
    Date.prototype.addDays = function(days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        labelsForGraph.push(`${currentDate.getDate()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`);
        currentDate = currentDate.addDays(1);
    }
}

function renderGlobalCases() {
    const globalCases = document.querySelector('.total__value')
    globalCases.innerHTML =
        new Intl.NumberFormat('ru-RU').format(generalData.covid.Global.TotalConfirmed)
}

function renderStatistics(obj) {
    const totalCases = document.querySelector('.statistics-case__value')
    const totalDeath = document.querySelector('.statistics-death__value')
    const totalRecovered = document.querySelector('.statistic-recover__value')

    totalCases.innerHTML =
        new Intl.NumberFormat('ru-RU').format(obj.TotalConfirmed)
    totalDeath.innerHTML =
        new Intl.NumberFormat('ru-RU').format(obj.TotalDeaths)
    totalRecovered.innerHTML =
        new Intl.NumberFormat('ru-RU').format(obj.TotalRecovered)
}

function renderCountriesTable(arr, list) {
    list.innerHTML = ""
    arr.forEach(elem => {
        const li = document.createElement('li')
        const country = document.createElement('div')
        const value = document.createElement('div')

        li.className = "country"
        country.className = 'country__name'
        value.className = 'country__cases_value'

        country.innerHTML = elem.Country;
        value.innerHTML = new Intl.NumberFormat('ru-RU').format(elem.TotalConfirmed)

        li.appendChild(value)
        li.appendChild(country)
        list.appendChild(li)

    })
}

export function renderSearchResults(country) {
    const searchedData = search(dataByCountries, country)
    if (searchedCountry.info === undefined) {
        alert('Please enter valid country name')
        return
    } else {
        renderStatistics(searchedData)
        showButton();
        document.querySelector('.statistics__title').innerHTML = searchedCountry.info.Country
        document.querySelector('.units-change__button').value = "Per 100 000 men"
        document.querySelector('.units-change__button').innerHTML = "Per 100 000 men"
    }
}

function changeCountriesOrder() {
    const reverseOrdedCountries = sortByNumberOfCases(generalData.covid.Countries)
    const listOfCountries = document.querySelector('.countries__list');
    if (generalData.orderParameter === 'byCountryName') {
        renderCountriesTable(generalData.covid.Countries, listOfCountries)
    } else {
        renderCountriesTable(reverseOrdedCountries, listOfCountries)
    }
}

function changeStatisticsUnits() {
    const button = document.querySelector('.units-change__button')
    if (button.value === "Total") {
        renderStatistics(searchedCountry.info)

        button.innerHTML = "Per 100 000 men"
        button.value = "Per 100 000 men"

    } else {

        const totalCases = document.querySelector('.statistics-case__value')
        const totalDeath = document.querySelector('.statistics-death__value')
        const totalRecovered = document.querySelector('.statistic-recover__value')

        totalCases.innerHTML =
            new Intl.NumberFormat('ru-RU').format(searchedCountry.info.TotalConfiremdPerMen)
        totalDeath.innerHTML =
            new Intl.NumberFormat('ru-RU').format(searchedCountry.info.TotalDeathsPerMen)
        totalRecovered.innerHTML =
            new Intl.NumberFormat('ru-RU').format(searchedCountry.info.TotalRecoveredPerMen)

        button.innerHTML = "Total"
        button.value = "Total"

    }
}

function showButton() {
    document.querySelector('.units-change__button').classList.add('show')
}

function showPossibleSearchedCountries(array) {
    const list = document.querySelector('.search__possible-variants')
    list.innerHTML = "";

    array.forEach(element => {
        const li = document.createElement('li')
        li.className = "search__possible-country"
        li.innerHTML = element

        li.addEventListener("click", (event) => {
            document.querySelector('.search__input').value = event.target.innerHTML
            list.innerHTML = ""
            renderSearchResults(event.target.innerHTML)
        })

        list.appendChild(li)
    })
}

function expandElement(event) {
    const elem = event.target.parentNode;
    elem.classList.toggle("expand")

}

function initApp() {
    buildPage()
    document.querySelectorAll('.input').forEach(elem => elem.addEventListener("click", event => {
        cahngeOrderUnits(event);
        changeCountriesOrder();
    }))
    document.querySelector('.search__button').addEventListener('click', () => {
        renderSearchResults(document.querySelector('.search__input').value)
    })
    document.querySelector('.units-change__button').addEventListener('click', () => {
        changeStatisticsUnits()
    })
    document.querySelector('.search__input').addEventListener('keyup', () => {
        showPossibleSearchedCountries(filterCountriesArray(countries, document.querySelector('.search__input').value))
    })
}


initApp()