//Configuration variables
var updateInterval = 1000 //in ms
var mydata;

var container;

function getData(callback) {
    $.ajax({
        type: 'GET',
        url: "getData/",

        success: function (response) {
            //console.log(response);
            if (JSON.stringify(mydata) === JSON.stringify(response)) { }
            else {
                mydata = response;
                callback();
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function appendData() {
    console.log('mydata', mydata);
    if (mydata){
        for (var i in mydata){
            //console.log('i!!!',i);
            //var selector = $('#' + i);
            //console.log('selector!!', selector);
            if ($('#' + i)){
                //TODO: aggiornare solo i dati e non ristamapre tutta la card

            }
            else {
                if (mydata[i]["sensor"]["friendlyName"]) {
                    container.append('<div class="row justify-content-center" id="' + i + '">\n' +
                        '                <div class="col-12 col-md-10 col-lg-5">\n' +
                        '                    <div class="card mt-3 text-center shadow rounded">\n' +
                        '                        <div class="card-body" id="mis-card-body">\n' +
                        '                            <h3 class="card-title" id="sensor-name"><a href="/home/sensor/' + mydata[i]["sensor"]["id"] + '">' + mydata[i]["sensor"]["friendlyName"] + '</a></h3>\n' +
                        '                            <p class="card-text" id="IPAddress"><small class="text-muted">' + mydata[i]["IPAddress"] + '</small></p>\n' +
                        '                            <p class="card-text" id="sensor-data">temperatura: ' + mydata[i]["temperature"] + ' ℃ <br> umidità: ' + mydata[i]["humidity"] + ' % </p>\n' +
                        '                        </div>\n' +
                        '                        <div class="card-footer">\n' +
                        '                            <p class="card-text"><small class="text-muted">Last update: ' + mydata[i]["date"] + '</small></p>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>');
                } else {
                    container.append('<div class="row justify-content-center" id="' + i + '">\n' +
                        '                <div class="col-12 col-md-10 col-lg-5">\n' +
                        '                    <div class="card mt-3 text-center shadow rounded">\n' +
                        '                        <div class="card-body" id="mis-card-body">\n' +
                        '                            <h3 class="card-title" id="sensor-name"><a href="/home/sensor/' + mydata[i]["sensor"]["id"] + '">' + mydata[i]["IPAddress"] + '</a></h3>\n' +
                        '                            <p class="card-text" id="sensor-data">temperatura: ' + mydata[i]["temperature"] + ' ℃ <br> umidità: ' + mydata[i]["humidity"] + ' % </p>\n' +
                        '                        </div>\n' +
                        '                        <div class="card-footer">\n' +
                        '                            <p class="card-text"><small class="text-muted">Last update: ' + mydata[i]["date"] + '</small></p>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>');
                }
            }

        }
    }else {
        console.log("NESSUN SENSORE ONLINE")
    }
}

function updateData(){
    getData(appendData);
    setTimeout(updateData,updateInterval);
}

$(document).ready(function () {
    container = $("#online-sensor");
    updateData();
});
