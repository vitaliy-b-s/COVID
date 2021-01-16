import { fetchData } from './client.js'
import { dataByCountries, generalData } from './data.js';

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
                let lon

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
                    'country': elem.Country,
                    'totalConfirmed': elem.TotalConfirmed,
                    'totalDeath': elem.TotalDeaths,
                    'totalRecovered': elem.TotalRecovered,
                    'lastDayConfirmed': elem.NewConfirmed,
                    'lastDayDeath': elem.NewDeaths,
                    'lastDayRecovered': elem.NewRecovered,
                    'population': population,
                    'lat': lat,
                    'lon': lon
                })

            })
        })
}