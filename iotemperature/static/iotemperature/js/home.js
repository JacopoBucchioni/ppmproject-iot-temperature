//Configuration variables
var updateInterval = 1000 //in ms

var online;
var container;
var text;


function getData(callback) {
    $.ajax({
        type: 'GET',
        url: "getData/",

        success: function (response) {
            //console.log(response);
            if (JSON.stringify(online) === JSON.stringify(response)) {

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

function appendData() {
    if (online) {
        console.log('online != {}', online);

        for (var i in online) {
            var sensorCard = $("#" + i);

            if (online[i]) {
                text.hide();
                var date = new Date(online[i]["date"]);

                if (sensorCard.length) {
                    console.log("l'elemento esite già e viene solo aggiornato");

                    $("#" + i + "-data").html('temperatura: ' + online[i]["temperature"] + ' ℃ <br> umidità: ' + online[i]["humidity"] + ' %');
                    $("#" + i + "-last-update").html('Last update: ' + date.toLocaleString());

                } else {
                    console.log("l'elemento viene creato per la prima volta");

                    if (online[i]["sensor"]["friendlyName"]) {
                        container.append('<div class="row justify-content-center" id="' + i + '">\n' +
                            '                <div class="col-12 col-md-10 col-lg-5">\n' +
                            '                    <div class="card mt-3 text-center shadow rounded">\n' +
                            '                        <div class="card-body" id="mis-card-body">\n' +
                            '                            <h3 class="card-title" id="sensor-name"><a href="/home/sensor/' + online[i]["sensor"]["id"] + '">' + online[i]["sensor"]["friendlyName"] + '</a></h3>\n' +
                            '                            <p class="card-text" id="IPAddress"><small class="text-muted">' + online[i]["IPAddress"] + '</small></p>\n' +
                            '                            <p class="card-text" id="' + i + '-data" style="margin-top: 5px; margin-bottom: 15px;">temperatura: ' + online[i]["temperature"] + ' ℃ <br> umidità: ' + online[i]["humidity"] + ' % </p>\n' +
                            '                        </div>\n' +
                            '                        <div class="card-footer">\n' +
                            '                            <p class="card-text"><small class="text-muted" id="' + i + '-last-update">Last update: ' + date.toLocaleString() + '</small></p>\n' +
                            '                        </div>\n' +
                            '                    </div>\n' +
                            '                </div>\n' +
                            '            </div>');
                    } else {
                        container.append('<div class="row justify-content-center" id="' + i + '">\n' +
                            '                <div class="col-12 col-md-10 col-lg-5">\n' +
                            '                    <div class="card mt-3 text-center shadow rounded">\n' +
                            '                        <div class="card-body" id="mis-card-body">\n' +
                            '                            <h3 class="card-title" id="sensor-name"><a href="/home/sensor/' + online[i]["sensor"]["id"] + '">' + online[i]["IPAddress"] + '</a></h3>\n' +
                            '                            <p class="card-text" id="' + i + '-data" style="margin-top: 5px; margin-bottom: 15px;">temperatura: ' + online[i]["temperature"] + ' ℃ <br> umidità: ' + online[i]["humidity"] + ' % </p>\n' +
                            '                        </div>\n' +
                            '                        <div class="card-footer">\n' +
                            '                            <p class="card-text"><small class="text-muted" id="' + i + '-last-update">Last update: ' + date.toLocaleString() + '</small></p>\n' +
                            '                        </div>\n' +
                            '                    </div>\n' +
                            '                </div>\n' +
                            '            </div>');
                    }
                }

            } else {
                if (sensorCard.length) {
                    console.log("l'elemento esite e viene cancellato");
                    sensorCard.remove();
                }
            }
        }
        // console.log('dimensione container dopo il for', container.children().length);
        if (container.children().length == 0) {
            text.show();
        }

    } else {
        text.show();
        console.log("NESSUN SENSORE ONLINE online=={}", online);
    }
}

function updateData(){
    getData(appendData);
    setTimeout(updateData,updateInterval);
}

$(document).ready(function () {
    container = $("#online-sensor");
    text = $("#info-text");
    updateData();
});
