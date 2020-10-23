

var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Temperatura',
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                yAxisID: 'y-axis-1',
            },

            {
                label: 'Umidità',
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                data: [],
                yAxisID: 'y-axis-2'
            }
        ]
    },

    options: {
        responsive: true,

        hoverMode: 'index',
        stacked: false,

        scales: {
            xAxes: [{
                display: true
            }],
            yAxes: [{
                display: true,
                type: 'linear',
                position: 'left',
                id: 'y-axis-1',
                ticks: {
                    //beginAtZero: true,
                    callback: function (value, index, values){
                        return value + '°C';
                    }
                }
            },{
                display: true,
                type: 'linear',
                position: 'right',
                id: 'y-axis-2',
                ticks: {
                    //beginAtZero: true,
                    callback: function (value, index, values){
                        return value + '%';
                    }
                },

                // grid line settings
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },

            }]
        }
    }

};

window.onload = function () {
    var ctx = document.getElementById('mychart').getContext('2d');
    window.myLine = Chart.Line(ctx, config);
};


$(document).ready(function () {
    var date = new Date().toISOString();
    date = date.substring(0, date.length - 8);
    $("#inizio")[0].max = date;
    $("#fine")[0].max = date;


    $("#bottoneGrafico").click(function () {
        var id_sensore = $("#sensori")[0].value;
        var inizio = $("#inizio")[0].value;
        var fine = $("#fine")[0].value;

        if (id_sensore != "Seleziona Sensore") {
            window.myLine.data.labels = [];
            window.myLine.data.datasets.forEach((dataset) => {dataset.data = [];});
            window.myLine.update();

            if (inizio && fine) {
                console.log("sensore selezionato data inizio selezionata data fine selezionata");
                if (inizio <= fine) {
                    var inizio_date = Date.parse(inizio);
                    var fine_date = Date.parse(fine);

                    for (i = 0; i < misurazioni.length; i++) {
                        var mis_date = Date.parse(misurazioni[i]["fields"].date);
                        if (misurazioni[i]["fields"].sensor == id_sensore && mis_date <= fine_date && mis_date >= inizio_date) { //TODO: compare date in ISO String
                            window.myLine.data.labels.push(misurazioni[i]["fields"].date);
                            window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                            window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);
                        }
                    }
                    window.myLine.update();
                    console.log(window.myLine);

                } else {
                    alert("Data Inizio Supera Data Fine");
                    $("#inizio")[0].value = "";
                    $("#fine")[0].value = "";
                }
            }
            else {
                if (inizio){
                    console.log("sensore selezionato data inizio selezionata data fine non selezionata");
                    var inizio_date = Date.parse(inizio);
                    for (i = 0; i < misurazioni.length; i++) {
                        var mis_date = Date.parse(misurazioni[i]["fields"].date);
                        if (misurazioni[i]["fields"].sensor == id_sensore && mis_date>=inizio_date) {
                            window.myLine.data.labels.push(misurazioni[i]["fields"].date);
                            window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                            window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);
                        }
                    }
                    window.myLine.update();
                    console.log(window.myLine);
                }
                else if (fine){
                    console.log("sensore selezionato data inizio non selezionata data fine selezionata");
                    var fine_date = Date.parse(fine);
                    for (i = 0; i < misurazioni.length; i++) {
                        var mis_date = Date.parse(misurazioni[i]["fields"].date);
                        if (misurazioni[i]["fields"].sensor == id_sensore && mis_date<=fine_date) {
                            window.myLine.data.labels.push(misurazioni[i]["fields"].date);
                            window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                            window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);
                        }
                    }
                    window.myLine.update();
                    console.log(window.myLine);

                }
                else {
                    console.log("sensore selezionato data inizio non selezionata data fine non selezionata");
                    for (i = 0; i < misurazioni.length; i++) {
                        if (misurazioni[i]["fields"].sensor == id_sensore) {
                            window.myLine.data.labels.push(misurazioni[i]["fields"].date);
                            window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                            window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);
                        }
                    }
                    window.myLine.update();
                    console.log(window.myLine);
                }
            }
        } else {
            alert("Non hai selezionato alcun Sesore");
        }

    });

});
