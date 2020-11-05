
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

        showLines: true, // disable for all datasets

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

function getMisurazioni(callback) {
            $.ajax({
                type: 'GET',
                url: "",

                success: function (response) {
                    misurazioni = JSON.parse(response);
                    callback();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }

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
        var id_sensore = $("#sensori")[0].value;
        var inizio = $("#inizio")[0].value;
        var fine = $("#fine")[0].value;

        if (id_sensore) {
            $.getJSON("sensor/" + id_sensore + "/getData/", function (data) {
                misurazioni = JSON.parse(data);
                console.log('misurazioni!!', misurazioni);

                window.myLine.data.labels = [];
                window.myLine.data.datasets.forEach((dataset) => {
                    dataset.data = [];
                });
                window.myLine.update();


                if (inizio && fine) {
                    if (inizio <= fine) {
                        //console.log("sensore selezionato data inizio selezionata data fine selezionata");
                        //if (inizio <= fine) {
                        var inizio_date = Date.parse(inizio);
                        var fine_date = Date.parse(fine);

                        for (i = 0; i < misurazioni.length; i++) {
                            var mis_date = Date.parse(misurazioni[i]["fields"].date);
                            if (mis_date <= fine_date && mis_date >= inizio_date) { //TODO: compare date in ISO String
                                window.myLine.data.labels.push(new Date(misurazioni[i]["fields"].date));
                                window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                                window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);
                            }
                        }
                        window.myLine.update();
                        //console.log(window.myLine);

                    } else {
                        alert("Data Inizio Supera Data Fine");
                        $("#inizio")[0].value = "";
                        $("#fine")[0].value = "";
                    }

                } else {
                    if (inizio) {
                        //console.log("sensore selezionato data inizio selezionata data fine non selezionata");
                        var inizio_date = Date.parse(inizio);
                        for (i = 0; i < misurazioni.length; i++) {
                            var mis_date = Date.parse(misurazioni[i]["fields"].date);

                            if (mis_date >= inizio_date) { //TODO: compare date in ISO String
                                window.myLine.data.labels.push(new Date(misurazioni[i]["fields"].date));
                                window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                                window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);
                            }

                        }
                        window.myLine.update();
                        //console.log(window.myLine);
                    } else if (fine) {
                        //console.log("sensore selezionato data inizio non selezionata data fine selezionata");
                        var fine_date = Date.parse(fine);
                        for (i = 0; i < misurazioni.length; i++) {
                            var mis_date = Date.parse(misurazioni[i]["fields"].date);

                            if (mis_date <= fine_date) { //TODO: compare date in ISO String
                                window.myLine.data.labels.push(new Date(misurazioni[i]["fields"].date));
                                window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                                window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);
                            }

                        }
                        window.myLine.update();
                        //console.log(window.myLine);

                    } else {
                        //console.log("sensore selezionato data inizio non selezionata data fine non selezionata");
                        for (i = 0; i < misurazioni.length; i++) {

                            window.myLine.data.labels.push(new Date(misurazioni[i]["fields"].date));
                            window.myLine.data.datasets[0].data.push(misurazioni[i]["fields"].temperature);
                            window.myLine.data.datasets[1].data.push(misurazioni[i]["fields"].humidity);

                        }
                        window.myLine.update();
                        //console.log(window.myLine);
                    }
                }
            });
        } else {
            alert("Non hai selezionato alcun Sesore");
        }
    });

});
