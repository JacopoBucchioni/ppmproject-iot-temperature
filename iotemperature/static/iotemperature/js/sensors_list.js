
function addSensor(data, element) {
        var sensor_name;
        var pk = data['sensor_id'];
        var IPAddress = data['IPAddress'];
        var friendlyName = data['friendlyName'];
        var cluster = data['cluster'];
        var text;

        if (friendlyName) {
            sensor_name = friendlyName;
            text = '<div class="row justify-content-center">\n' +
            '                <div class="col-11 col-sm-11 col-md-9 col-lg-6 col-xl-5">\n' +
            '                    <div class="card mt-3 text-center shadow rounded" id="sensor-card" data-id="'+ pk +'" data-name="'+ sensor_name +'">\n' +
            '                        <div class="card-body">\n' +
            '                            <h3 class="card-title"><a href="/sensors/edit/'+pk+'">'+ sensor_name +'</a>\n' +
            '                                <button type="button" class="close float-right" id="cancella"><i class="far fa-trash-alt fa-xs"></i></button></h3>\n' +
            '                             <p class="card-text mb-0"><small class="text-muted">'+ IPAddress +'</small></p>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>'
        }
        else {
            sensor_name = IPAddress;
            text = '<div class="row justify-content-center">\n' +
            '                <div class="col-11 col-sm-11 col-md-9 col-lg-6 col-xl-5">\n' +
            '                    <div class="card mt-3 text-center shadow rounded" id="sensor-card" data-id="'+ pk +'" data-name="'+ sensor_name +'">\n' +
            '                        <div class="card-body">\n' +
            '                            <h3 class="card-title"><a href="/sensors/edit/'+pk+'">'+ sensor_name +'</a>\n' +
            '                                <button type="button" class="close float-right" id="cancella"><i class="far fa-trash-alt fa-xs"></i></button></h3>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>'
        }

        element.after(text);
    };


$(document).ready(function () {
    var csrfToken = $("input[name=csrfmiddlewaretoken]");


    $(document).on('submit', '#sensorForm', function (e) {
        e.preventDefault();
        var rowForm = $("#rowForm");
        var form = $("#sensorForm");
        var friendlyName = $("#id_friendlyName");
        var IPAddress = $("#id_IPAddress");
        //console.log(form.data('url'))

        $.ajax({
            type: 'POST',
            url: form.data('url'),
            data: {
                'csrfmiddlewaretoken': csrfToken.val(),
                'friendlyName': friendlyName.val(),
                'IPAddress': IPAddress.val(),
            },
            success: function(response) {
                console.log(response);
                if (response) {
                    addSensor(response, rowForm);

                    friendlyName.val("");
                    IPAddress.val("");
                }else {
                    //TODO show allert with error message "IP already taken"
                    alert("Sensore con questo Indirizzo IP esiste già");
                }
            },
            error: function(error){ //errore di ajax che non è riuscito a fare la richiesta (NO ERRORE SERVER SIDE)
                console.log(error);
            }
        });
    });




    $(document).on('click','#cancella', function (){
        sensor = $(this).closest("#sensor-card"); //TODO: grab sensor pk to delete

        var c = confirm("Sicuro di voler Cancellare il Sensore "+sensor.data("name"));
        if (c){
            $.ajax({
               type: 'POST',
               url: "delete/"+sensor.data("id")+"/",
               data: {
                   'csrfmiddlewaretoken': csrfToken.val(),
                   'pk': sensor.data("id"),
               },
                success: function (response){
                   console.log(response);
                   if (response['result'] === 'deleted'){
                       sensor.closest('.row').remove();
                   }
                   else {
                       alert("Impossibile Cancellare il Sensore "+sensor.data("name"));
                   }

                },
                error: function (error){
                   console.log(error);
                }
            });
        }
    });


});
