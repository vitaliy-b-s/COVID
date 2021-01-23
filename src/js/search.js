import { searchedCountry } from './data.js'


export function search(arr, value) {
    for (let key of arr) {
        if (key[0].toLowerCase() === value.toLowerCase()) {
            searchedCountry.info = key[1];
            return searchedCountry.info
        }
    }
}