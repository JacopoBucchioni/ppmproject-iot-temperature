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
                    beginAtZero: true,
                    callback: function (value, index, values) {
                        return value + '°C';
                    }
                }
            }, {
                display: true,
                type: 'linear',
                position: 'right',
                id: 'y-axis-2',
                ticks: {
                    beginAtZero: true,
                    callback: function (value, index, values) {
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




//Configuration variables
var updateInterval = 1000 //in ms
var numberElements = 8;

//Globals
var updateCount = 0;

var online;
var mydata;
var card_data;


function getData(callback) {
    $.ajax({
        type: 'GET',
        url: "getData/",

        success: function (response) {
            //console.log(response);
            /*
            if (JSON.stringify(online)===JSON.stringify(response)) {}
            else {
                online = response;
                callback();
            }
             */
            online = response;
            callback();

        },
        error: function (error) {
            console.log(error);
        }
    });

}

function addData() {
    if (online) {
        /*
        console.log(mydata);
        console.log("data", mydata['date']);
        console.log("temperature", mydata['temperature']);
        console.log("humidity", mydata['humidity']);
         */


        if (JSON.stringify(online) === JSON.stringify(mydata)) {
            var date = new Date(online["date"]);
            if ((new Date().getTime() - date.getTime()) > 30000) {
                card_data.html('OFFLINE');
                //if (window.myLine.data.labels.length && window.myLine.data.datasets[0].data.length && window.myLine.data.datasets[1].data.length) {
                    window.myLine.data.labels = [];
                    window.myLine.data.datasets[0].data = [];
                    window.myLine.data.datasets[1].data = [];
                    window.myLine.update();
                    updateCount = 0;
                //}
            }
        } else {
            mydata = online;
            card_data.html('temperatura: ' + mydata["temperature"] + ' ℃ <br> umidità: ' + mydata["humidity"] + ' % ');
            window.myLine.data.labels.push(mydata["date"]);
            window.myLine.data.datasets[0].data.push(mydata["temperature"]);
            window.myLine.data.datasets[1].data.push(mydata["humidity"]);

            if (updateCount > numberElements) {
                window.myLine.data.labels.shift();
                window.myLine.data.datasets[0].data.shift();
                window.myLine.data.datasets[1].data.shift();

            } else updateCount++;

            window.myLine.update();

            //console.log(window.myLine);
        }
    }
}

function updateData(){
    getData(addData);
    setTimeout(updateData,updateInterval);
}

window.onload = function () {
    var ctx = document.getElementById('sensor-chart').getContext('2d');
    window.myLine = Chart.Line(ctx, config);
    card_data = $("#my-data");
    updateData();

};
