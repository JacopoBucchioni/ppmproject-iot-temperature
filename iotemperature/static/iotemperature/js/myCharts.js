var xlabels = [];
var temps = [];
var hum = [];

for (i = 0; i < misurazioni.length; i++) {
    xlabels.push(misurazioni[i]["fields"].date);
    temps.push(misurazioni[i]["fields"].temperature);
    hum.push(misurazioni[i]["fields"].humidity);
}
//console.log(xlabels);
//console.log(temps);
//console.log(hum);


var config = {
    type: 'line',
    data: {
        labels: xlabels,
        datasets: [
            {
                label: 'Temperatura in °C',
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: temps,
            },

            {
                label: 'Umidità in %',
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                data: hum,
            }
        ]
    },

    options: {
        responsive: true,
        scales: {
            xAxes: [{
                display: true
            }],
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }

};


window.onload = function () {
    var ctx = document.getElementById('mychart').getContext('2d');
    window.myChart = new Chart(ctx, config);
};

$(document).ready(function() {
    var date = new Date().toISOString();
    date = date.substring(0, date.length-8);
    $("#inizio")[0].max = date;
    $("#fine")[0].max = date;


    $("#bottoneGrafico").click(function () {
        var inizio = $("#inizio")[0].value;
        var fine = $("#fine")[0].value;
        if (inizio<=fine){
            console.log("data inizio: "+inizio);
            console.log("data fine: "+fine);
        }
        else {
            alert("Data Inizio Supera Data Fine");
            $("#inizio")[0].value = "";
            $("#fine")[0].value = "";
        }

    });

});
