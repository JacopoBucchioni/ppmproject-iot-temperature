var xlabels = [];
var temps = [];
var hum = [];

/*
for (i = 0; i < misurazioni.length; i++) {
    xlabels.push(misurazioni[i]["fields"].date);
    temps.push(misurazioni[i]["fields"].temperature);
    hum.push(misurazioni[i]["fields"].humidity);
}
//console.log(xlabels);
//console.log(temps);
//console.log(hum);
*/



var config = {
    type: 'line',
    data: {
        labels: xlabels,
        datasets: [
            {
                label: 'Temperatura',
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: temps,
                yAxisID: 'y-axis-1',
            },

            {
                label: 'Umidità',
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                data: hum,
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
            if (inizio && fine) {
                if (inizio <= fine) {
                    console.log("ID sensore selezionato: " + id_sensore);
                    console.log("data inizio: " + inizio);
                    console.log("data fine: " + fine);


                    for (i = 0; i < misurazioni.length; i++) {
                        if (misurazioni[i]["fields"].sensor == id_sensore && misurazioni[i]["fields"].date<=fine && misurazioni[i]["fields"].date>=inizio) {
                            xlabels.push(misurazioni[i]["fields"].date);
                            temps.push(misurazioni[i]["fields"].temperature);
                            hum.push(misurazioni[i]["fields"].humidity);

                            window.myLine.update();
                        }
                    }

                } else {
                    alert("Data Inizio Supera Data Fine");
                    $("#inizio")[0].value = "";
                    $("#fine")[0].value = "";
                }
            } else {
                console.log("ID sensore selezionato: " + id_sensore);
                console.log("data inizio: " + inizio);
                console.log("data fine: " + fine);


                for (i = 0; i < misurazioni.length; i++) {
                    if (misurazioni[i]["fields"].sensor == id_sensore) {
                        xlabels.push(misurazioni[i]["fields"].date);
                        temps.push(misurazioni[i]["fields"].temperature);
                        hum.push(misurazioni[i]["fields"].humidity);

                        window.myLine.update();
                    }
                }

            }
        } else {
            alert("Non hai selezionato alcun Sesore");
        }

    });

});
