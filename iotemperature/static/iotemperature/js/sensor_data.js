//Configuration variables

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
            },

            {
                label: 'umidità %',
                data: [],
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
            }
        ]
    },

    options: {
        responsive: true,

        tooltips: {
            mode: 'x',
            intersect: false,
        },

        scales: {
            xAxes: [{
                display: true,
                type: 'time',
                time: {
                    displayFormats: {
                        second: 'H:mm:ss'
                    }
                },
                ticks: {
                    source: 'data'
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }

            }],
            yAxes: [{
                display: true,
                //type: 'linear',
                ticks: {
                    suggestedMin: -10,
                    suggestedMax: 100
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


var updateInterval = 1000 //in ms
var numberElements = 10;

//Globals
var updateCount = 0;

var online;
var card_data;


function getData(callback) {
    $.ajax({
        type: 'GET',
        url: "getData/",

        success: function (response) {
            //console.log(response);
            if (JSON.stringify(online)===JSON.stringify(response)) {

            } else {
                online = response;
                callback();
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function addData() {

    if (online) {
        console.log('online non vuoto', online);

        card_data.html('temperatura: ' + online["temperature"] + ' ℃ <br> umidità: ' + online["humidity"] + ' % ');
        window.myLine.data.labels.push(new Date(online["date"]));
        window.myLine.data.datasets[0].data.push(online["temperature"]);
        window.myLine.data.datasets[1].data.push(online["humidity"]);

        if (updateCount > numberElements) {
            window.myLine.data.labels.shift();
            window.myLine.data.datasets[0].data.shift();
            window.myLine.data.datasets[1].data.shift();

        } else updateCount++;

        window.myLine.update();


    } else {
        console.log('online vuoto', online);

        card_data.html('OFFLINE');
        window.myLine.data.labels = [];
        window.myLine.data.datasets[0].data = [];
        window.myLine.data.datasets[1].data = [];
        window.myLine.update();
        updateCount = 0;

    }
}

function updateData(){
    getData(addData);
    setTimeout(updateData,updateInterval);
}

window.onload = function () {
    var ctx = document.getElementById('sensor-chart').getContext('2d');
    window.myLine = new Chart(ctx, config);
    card_data = $("#my-data");
    updateData();

};
