import axios from "axios";

const COVID_API_URL = "https://api.covid19api.com/summary";
const FLAG_POPULATION_API_URL =
    "https://restcountries.eu/rest/v2/all?fields=name;population;flag";
const COORDS_API_URL = "/src/assets.countries.json";

export function collectCovidData() {
    return axios.get(COVID_API_URL)
}