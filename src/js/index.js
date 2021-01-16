import { style } from "/src/assets/style.css"
import { scss } from "/src/assets/scss.scss"
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import { initMap } from './map.js'
import { convertData, sortByNumberOfCases } from './processor.js'
import { generalData, cahngeOrderUnits, dataByCountries } from "./data.js"

function buildPage() {
    const globalCases = document.querySelector('.total__value')
    const totalCases = document.querySelector('.statistics-case__value')
    const totalDeath = document.querySelector('.statistics-death__value')
    const totalRecovered = document.querySelector('.statistic-recover__value')
    const listOfCountries = document.querySelector('.countries__list')
    convertData()
        .then(() => {
            globalCases.innerHTML =
                new Intl.NumberFormat('ru-RU').format(generalData.covid.Global.TotalConfirmed)
            totalCases.innerHTML =
                new Intl.NumberFormat('ru-RU').format(generalData.covid.Global.TotalConfirmed)
            totalDeath.innerHTML =
                new Intl.NumberFormat('ru-RU').format(generalData.covid.Global.TotalDeaths)
            totalRecovered.innerHTML =
                new Intl.NumberFormat('ru-RU').format(generalData.covid.Global.TotalRecovered)

        })
        .then(() => buildCountriesTable(generalData.covid.Countries, listOfCountries))
}

function buildCountriesTable(arr, list) {
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

function changeOrder() {
    const reverseOrdedCountries = sortByNumberOfCases(generalData.covid.Countries)
    const listOfCountries = document.querySelector('.countries__list');
    if (generalData.orderParameter === 'byCountryName') {
        buildCountriesTable(generalData.covid.Countries, listOfCountries)
    } else {
        buildCountriesTable(reverseOrdedCountries, listOfCountries)
    }
}

function initApp() {
    buildPage();
    document.querySelectorAll('.input').forEach(elem => elem.addEventListener("click", event => {
        cahngeOrderUnits(event);
        changeOrder();
    }))
    initMap(dataByCountries);
}

initApp()