import { style } from "/src/assets/style.css"
import { scss } from "/src/assets/scss.scss"
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import { initMap } from './map.js'
import { convertData, sortByNumberOfCases, cahngeOrderUnits, filterCountriesArray } from './processor.js'
import { generalData, dataByCountries, searchedCountry, countries } from "./data.js"
import { search } from './search.js'

function buildPage() {
    const listOfCountries = document.querySelector('.countries__list')
    convertData()
        .then(() => {
            renderGlobalCases();
            renderStatistics(generalData.covid.Global)
        })
        .then(() => renderCountriesTable(generalData.covid.Countries, listOfCountries))
        .then(() => initMap(dataByCountries))
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

        list.appendChild(li)
    })
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
    document.querySelector('.search__input').addEventListener('keydown', () => {
        showPossibleSearchedCountries(countries)
    })
}


initApp()