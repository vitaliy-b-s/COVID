import Chart from "chart.js";

export function buildGraph() {
  const grpah = document.getElementById("graph");
  Chart.defaults.global.defaultFontColor = "whitesmoke";
  const newGarph = new Chart(grpah, {
    type: "bar",
    data: {
      labels: getDatesArray(new Date("December 15, 2020"), new Date("December 29, 2020")),
      datasets: [
        {
          label: "Total cases",
          data: getRandomNumberOfCases(500000, 600000),
          backgroundColor: "whitesmoke",
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      legend: {
        labels: {
          fontColor: "whitesmoke",
        },
      },
      defaultFontColor: "whitesmoke",
    },
  });
}

function getRandomNumberOfCases(min, max) {
  const randomCases = [];
  for (let i = 0; i < 15; i++) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    randomCases.push(Math.round(rand));
  }
  return randomCases;
}

function getDatesArray(startDate, stopDate) {
  const labelsForGraph = [];

  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    labelsForGraph.push(
      `${currentDate.getDate()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`
    );
    currentDate = currentDate.addDays(1);
  }

  return labelsForGraph;
}
