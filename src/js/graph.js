import { randomCases, labelsForGraph } from "./data.js";

export function buildGraph() {
    const grpah = document.getElementById('graph');
    Chart.defaults.global.defaultFontColor = 'whitesmoke'
    const newGarph = new Chart(grpah, {
        type: 'bar',
        data: {
            labels: labelsForGraph,
            datasets: [{
                label: "Total cases",
                data: randomCases,
                backgroundColor: "whitesmoke"
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: 'whitesmoke'
                }
            },
            defaultFontColor: "whitesmoke"
        }
    })

}