import { fethcData, sortByNumberOfCases } from './dataMethods'

export const data = {
    total: {

    },
    totalLastDay: {

    }

};
const COVID_API_URL = 'https://api.covid19api.com/summary'

export function saveData(obj) {
    return fethcData(COVID_API_URL)
        .then(result => {
            obj.total.cases = result.data.Global.TotalConfirmed;
            obj.total.death = result.data.Global.TotalDeaths;
            obj.total.recovered = result.data.Global.TotalRecovered
            obj.totalLastDay.cases = result.data.Global.NewConfirmed
            obj.totalLastDay.death = result.data.Global.NewDeaths
            obj.totalLastDay.recovered = result.data.Global.NewRecovered
            obj.byCountries = result.data.Countries
            obj.byNumberOfCases = sortByNumberOfCases(result.data.Countries)

        })
}

export function cahngeOrderUnits(event) {
    data.orderParameter = event.target.value
}