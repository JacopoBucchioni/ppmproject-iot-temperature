
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'temperatura °C',
                data: [],
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 2,

                pointHitRadius: 5,
                pointHoverRadius: 5,
            },

            {
                label: 'umidità %',
                data: [],
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 2,

                pointHitRadius: 5,
                pointHoverRadius: 5,
            }
        ]
    },

    options: {
        responsive: true,

        showLines: true, // disable lines for all datasets (improve render performance)

        tooltips: {
            mode: 'index',
            intersect: false,
        },

        //hoverMode: 'index',
        //stacked: false,

        scales: {
            xAxes: [{
                display: true,
                type: 'time',
                distribution: 'series',
                time: {
                    unit: 'minute',
                    displayFormats: {
                        minute: 'D MMM HH:mm'
                    }
                },


                ticks: {
                    source: 'auto'
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                },
            }],
            yAxes: [{
                display: true,
                // type: 'linear',
                ticks: {
                    //beginAtZero: true,
                    //callback: function (value, index, values) {return value + '°C';}
                    suggestedMin: -10,
                    suggestedMax: 100,
                },
                 scaleLabel: {
                    display: false,
                    labelString: 'Value'
                },

                gridLines: {
                    zeroLineColor: 'rgba(245, 221, 93)',
                },

            }]
        }
    }

};


window.onload = function () {
    var ctx = document.getElementById('mychart').getContext('2d');
    window.myLine = new Chart(ctx, config);
};

Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}

$(document).ready(function () {
    var misurazioni;

    var date = new Date().toIsoString();
    //console.log(date);
    date = date.substring(0, date.length - 9);
    //console.log(date);
    $("#inizio")[0].max = date;
    $("#fine")[0].max = date;


    $("#bottoneGrafico").click(function () {
        var timer_start = Date.now();
        var id_sensore = $("#sensori")[0].value;
        var inizio = $("#inizio")[0].value;
        var fine = $("#fine")[0].value;

        if (id_sensore) {
            if (inizio && fine && inizio > fine) {
                alert("Data Inizio Supera Data Fine");
                $("#inizio")[0].value = "";
                $("#fine")[0].value = "";

            } else {
                var t1 = Date.now();
                $.getJSON("sensor/" + id_sensore + "/getData/", {"inizio": inizio, "fine": fine}, function (data) {
                    var t2 = Date.now();
                    console.log('TEMPO JSON ', t2-t1);
                    misurazioni = JSON.parse(data);
                    console.log('misurazioni!!', misurazioni);

                    window.myLine.data.labels = [];
                    window.myLine.data.datasets.forEach((dataset) => {
                        dataset.data = [];
                    });
                    window.myLine.update();


                    for (i = 0; i < misurazioni.length; i++) {
                        window.myLine.data.labels.push(new Date(misurazioni[i]["fields"].date));
                        window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                        window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);
                    }
                    window.myLine.update();
                    var timer_end = Date.now();
                    console.log('TEMPO TOTALE RENDER ', timer_end - timer_start);

                });
            }
        } else {
            alert("Non hai selezionato alcun Sesore");
        }
    });
});
