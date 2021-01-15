import { style } from "/src/assets/style.css"
import { scss } from "/src/assets/scss.scss"
import { data, saveData, cahngeOrderUnits } from './data.js'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'





function buildPage() {
    const globalCases = document.querySelector('.total__value')
    const totalCases = document.querySelector('.statistics-case__value')
    const totalDeath = document.querySelector('.statistics-death__value')
    const totalRecovered = document.querySelector('.statistic-recover__value')
    const listOFCountries = document.querySelector('.countries__list')
    saveData(data)
        .then(() => {
            globalCases.innerHTML = new Intl.NumberFormat('ru-RU').format(data.total.cases)
            totalCases.innerHTML = new Intl.NumberFormat('ru-RU').format(data.total.cases)
            totalDeath.innerHTML = new Intl.NumberFormat('ru-RU').format(data.total.cases)
            totalRecovered.innerHTML = new Intl.NumberFormat('ru-RU').format(data.total.recovered)
        })
        .then(() => {
            buildCountriesTable(data.byCountries, listOFCountries)

        })

}

function buildCountriesTable(arr, list) {
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
    const listOFCountries = document.querySelector('.countries__list');
    listOFCountries.innerHTML = "";
    if (data.orderParameter == "byCountryName") {
        buildCountriesTable(data.byCountries, listOFCountries)
    } else {
        buildCountriesTable(data.byNumberOfCases, listOFCountries)
    }
}





function initApp() {
    buildPage();
    document.querySelectorAll('.input').forEach(elem => elem.addEventListener("click", event => {
        cahngeOrderUnits(event)
        changeOrder();
    }))
}

initApp()