import { fetchData } from './client.js'
import { countries, dataByCountries, generalData } from './data.js';

export function sortByNumberOfCases(arr) {
    const sorted = [...arr]

    function compare(a, b) {
        if (a.TotalConfirmed < b.TotalConfirmed) {
            return -1;
        }
        if (a.TotalConfirmed > b.TotalConfirmed) {
            return 1;
        }
        return 0;
    }
    return sorted.sort(compare).reverse()

}

export function convertData() {
    return fetchData()
        .then(() => {
            generalData.covid.Countries.forEach(elem => {
                let population;
                let lat;
                let lon;
                countries.push(elem.Country.toLowerCase());
                if (generalData.population.find(x => x.name === elem.Country) === undefined) {
                    population = "No data"
                } else {
                    population = generalData.population.find(x => x.name === elem.Country).population
                }
                if (generalData.coords.find(x => x.name === elem.Country) === undefined) {
                    lat = "No data"
                    lon = "No data"
                } else {
                    lat = generalData.coords.find(x => x.name === elem.Country).latlng[0]
                    lon = generalData.coords.find(x => x.name === elem.Country).latlng[1]
                }
                dataByCountries.set(elem.Country, {
                    'Country': elem.Country,
                    'TotalConfirmed': elem.TotalConfirmed,
                    'TotalDeaths': elem.TotalDeaths,
                    'TotalRecovered': elem.TotalRecovered,
                    'LastDayConfirmed': elem.NewConfirmed,
                    'LastDayDeath': elem.NewDeaths,
                    'LastDayRecovered': elem.NewRecovered,
                    'Population': population,
                    'Lat': lat,
                    'Lon': lon,
                    'TotalConfiremdPerMen': 100000 * elem.TotalConfirmed / population,
                    'TotalDeathsPerMen': 100000 * elem.TotalDeaths / population,
                    'TotalRecoveredPerMen': 100000 * elem.TotalRecovered / population
                })
            })
        })
}

export function cahngeOrderUnits(event) {
    generalData.orderParameter = event.target.value
}


export function filterCountriesArray(arr, string) {
    return arr.filter(elem => elem.includes(string))
}