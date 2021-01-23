import { generalData } from './data'


const axios = require('axios');

const COVID_API_URL = 'https://api.covid19api.com/summary'
const FLAG_POPULATION_API_URL = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag'
const COORDS_API_URL = "/countries.json"

export function fetchData() {
    const requestCovid = axios.get(COVID_API_URL)
    const requestPopulation = axios.get(FLAG_POPULATION_API_URL)
    const requestCoords = axios.get(COORDS_API_URL)


    return axios
        .all([requestCovid, requestPopulation, requestCoords])
        .then(
            axios.spread((...responses) => {
                generalData.covid = responses[0].data
                generalData.population = responses[1].data
                generalData.coords = responses[2].data
            })
        )
}