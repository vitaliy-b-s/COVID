export function sortByNumberOfCases(covidData) {
  const sorted = [...covidData];

  function compare(a, b) {
    if (a.TotalConfirmed < b.TotalConfirmed) {
      return -1;
    }
    if (a.TotalConfirmed > b.TotalConfirmed) {
      return 1;
    }
    return 0;
  }

  return sorted.sort(compare).reverse();
}

export function buildStatisticsTable(covidData) {
  const totalCases = document.querySelector(".statistics-case__value");
  const totalDeath = document.querySelector(".statistics-death__value");
  const totalRecovered = document.querySelector(".statistic-recover__value");

  totalCases.innerHTML = new Intl.NumberFormat("ru-RU").format(
    covidData.TotalConfirmed
  );
  totalDeath.innerHTML = new Intl.NumberFormat("ru-RU").format(
    covidData.TotalDeaths
  );
  totalRecovered.innerHTML = new Intl.NumberFormat("ru-RU").format(
    covidData.TotalRecovered
  );
}
