$(document).ready(function() {
    $("#sensors").load();
    setInterval(function(){
        $("#sensors").load();
    }, 3000);
});
