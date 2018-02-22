// *** Функция инициализации объектов формы значениями
// глобальных переменных соответствующих параметров команды
function don_obst_oir_init() {

    $('#idtarget').attr('disabled', true);
    $('#latitude').attr('disabled', true);
    $('#longitude').attr('disabled', true);
    $('#depth').attr('disabled', true);
    $('#kurs').attr('disabled', true);
    $('#velocity').attr('disabled', true);
    $('#typec').attr('disabled', true);
    $('#enemy').attr('disabled', true);
    $('#status').attr('disabled', true);
    $('#data').attr('disabled', true);

    var Objarr;

    $('body').on("click", "tr[id *= Don]", function () {
        $('#idtarget').attr('disabled', false);
        $('#latitude').attr('disabled', false);
        $('#longitude').attr('disabled', false);
        $('#depth').attr('disabled', false);
        $('#kurs').attr('disabled', false);
        $('#velocity').attr('disabled', false);
        $('#typec').attr('disabled', false);
        $('#enemy').attr('disabled', false);
        $('#status').attr('disabled', false);
        $('#data').attr('disabled', false);
        $('#time').attr('disabled', false);
        $(this).addClass('selected').siblings().removeClass('selected');
        var row_uid = $(this).attr('row_uid');
        $('#idtarget').val(Objarr[row_uid].idtarget);
        $('#latitude').val(Objarr[row_uid].latitude);
        $('#longitude').val(Objarr[row_uid].longitude);
        $('#depth').val(Objarr[row_uid].depth);
        $('#kurs').val((parseFloat(Objarr[row_uid].kurs) * 180 / Math.PI).toFixed(6));
        $('#velocity').val(Objarr[row_uid].velocity);
        $('#typec').val(Objarr[row_uid].typec);
        $('#enemy').val(Objarr[row_uid].enemy);
        $('#status').val(Objarr[row_uid].status);
        $('#data').val(new Date(Objarr[row_uid].data).toString('HH:mm:ss dd.MM.yyyy'));
    });

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    $('body').on("click", "#ButSave", function () {
        var XML = '<?xml version="1.0" encoding="koi8-r"?>\n<Message>\n\t<Донесение по обстановке в ОИР>';
        Objarr.forEach(function (item, index, array) {
            var XMLcell = '\n\t\t<ts>\n\t\t\t<id_target>' + item.idtarget +
                '</id_target>\n\t\t\t<latitude>' + item.latitude +
                '</latitude>\n\t\t\t<longitude>' + item.longitude + '</longitude>\n' +
                '\t\t\t<depth>' + item.depth + '</depth>\n' +
                '\t\t\t<kurs>' + (parseFloat(item.kurs) * 180 / Math.PI).toFixed(6) + '</kurs>\n' +
                '\t\t\t<velocity>' + item.velocity + '</velocity>\n' +
                '\t\t\t<typec>' + item.typec + '</typec>\n' +
                '\t\t\t<enemy>' + item.enemy + '</enemy>\n' +
                '\t\t\t<status>' + item.status + '</status>\n' +
                '\t\t\t<data>' + new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') + '</data>\n\t\t</ts>\n';
            XML = XML.concat(XMLcell);
        });
        XML = XML.concat('\t</Донесение по обстановке в ОИР>\n</Message>');
        download(Date.now()+"_obst_oir.xml", XML);
    });

    $('body').on("click", "#ButOk", function () {
        $('#idtarget').attr('disabled', true);
        $('#latitude').attr('disabled', true);
        $('#longitude').attr('disabled', true);
        $('#depth').attr('disabled', true);
        $('#kurs').attr('disabled', true);
        $('#velocity').attr('disabled', true);
        $('#typec').attr('disabled', true);
        $('#enemy').attr('disabled', true);
        $('#status').attr('disabled', true);
        $('#data').attr('disabled', true);
        $('#time').attr('disabled', true);
    });

    $('body').on("click", "#ButPrim", function () {
        var elemToUpdateId = $("tr.selected").attr('row_uid');
        Objarr[elemToUpdateId].idtarget = $('#idtarget').val();
        Objarr[elemToUpdateId].latitude = $('#latitude').val();
        Objarr[elemToUpdateId].longitude = $('#longitude').val();
        Objarr[elemToUpdateId].depth = $('#depth').val();
        Objarr[elemToUpdateId].kurs = (($('#kurs').val() * Math.PI) / 180).toFixed(6);
        Objarr[elemToUpdateId].velocity = $('#velocity').val();
        Objarr[elemToUpdateId].typec = $('#typec').val();
        Objarr[elemToUpdateId].enemy = $('#enemy').val();
        Objarr[elemToUpdateId].status = $('#status').val();
        var date = new Date();
        var datearr = $('#data').val().split(".");
        var timearr = $('#time').val().split(":");
        date.setFullYear(parseInt(datearr[2]),parseInt(datearr[1])-1,parseInt(datearr[0]));
        date.setHours(parseInt(timearr[0]),parseInt(timearr[1]),parseInt(timearr[2]));
        Objarr[elemToUpdateId].data = date;
        $('#idtarget').attr('disabled', true);
        $('#latitude').attr('disabled', true);
        $('#longitude').attr('disabled', true);
        $('#depth').attr('disabled', true);
        $('#kurs').attr('disabled', true);
        $('#velocity').attr('disabled', true);
        $('#typec').attr('disabled', true);
        $('#enemy').attr('disabled', true);
        $('#status').attr('disabled', true);
        $('#data').attr('disabled', true);
        $('#time').attr('disabled', true);
        $('#idtarget').val(' ');
        $('#latitude').val(' ');
        $('#longitude').val(' ');
        $('#depth').val(' ');
        $('#kurs').val(' ');
        $('#velocity').val(' ');
        $('#typec').val(' ');
        $('#enemy').val(' ');
        $('#status').val(' ');
        $('#data').val(' ');
        $('#time').val(' ');
        $('#oir_body').html(' ');
        Objarr.forEach(function (item, i, arr) {
            $('#oir_body').append("<tr id='Don " + i + "' row_uid='" +  i + "'><td>" + item.idtarget + "</td><td>" +
                item.latitude + "</td><td>" + item.longitude + "</td><td>" + item.depth + "</td>" +
                "<td>" + (parseFloat(item.kurs) * 180 / Math.PI).toFixed(6) + "</td><td>" + parseFloat(item.velocity).toFixed(0) + "</td><td>" + item.typec + "</td>" +
                "<td>" + item.enemy + "</td><td>" + item.status + "</td><td>" + new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') + "</td></tr>");
        });
    });

    $.ajax({
        url: "/getClassStatusApply",
        type: 'GET',
        cache: false,
        success: function (jsonObj) {
            console.log(jsonObj);
            var Obj = JSON.parse(jsonObj)
            Obj.TargetClass.forEach(function (item, i, arr) {
                $('#typec').append("<option select_id='" + item.Id + "'>" + item.Name + "</option>");
            });
            Obj.TargetStatus.forEach(function (item, i, arr) {
                $('#status').append("<option select_id='" + item.Id + "'>" + item.Name + "</option>");
            });
            Obj.TargetApply.forEach(function (item, i, arr) {
                $('#enemy').append("<option select_id='" + item.Id + "'>" + item.Name + "</option>");
            });
        }
    });

    $.ajax({
        url: "/getDonosOIR",
        type: 'GET',
        cache: false,
        success: function (jsonarr) {
            Objarr = JSON.parse(jsonarr);
            Objarr.forEach(function (item, i, arr) {

                $('#oir_body').append("<tr id='Don " + item.idtarget + "' row_uid='" +  i + "'><td>" + item.idtarget + "</td><td>" +
                    item.latitude + "</td><td>" + item.longitude + "</td><td>" + item.depth + "</td>" +
                    "<td>" + (parseFloat(item.kurs) * 180 / Math.PI).toFixed(0) + "</td><td>" + parseFloat(item.velocity).toFixed(0) + "</td><td>" + item.typec + "</td>" +
                    "<td>" + item.enemy + "</td><td>" + item.status + "</td><td>" + new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') + "</td></tr>");
            });
        }
    });

    function Refresh() {
        var selected = $("#oir_body tr.selected td:first").text();

        $.ajax({
            url: "/getDonosOIR",
            type: 'GET',
            cache: false,
            success: function (jsonarr) {

                $('#oir_body').html(' ');
                Objarr = JSON.parse(jsonarr);
                Objarr.forEach(function (item, i, arr) {
                    var select;
                    if (item.idtarget == selected){
                        select = 'selected';
                    } else select = '';
                    $('#oir_body').append("<tr class='"+ select +"' id='Don " + i + "' row_uid='" + i + "'><td>" + item.idtarget + "</td><td>" +
                        item.latitude + "</td><td>" + item.longitude + "</td><td>" + item.depth + "</td>" +
                        "<td>" + (parseFloat(item.kurs) * 180 / Math.PI).toFixed(6) + "</td><td>" + parseFloat(item.velocity).toFixed(0) + "</td><td>" + item.typec + "</td>" +
                        "<td>" + item.enemy + "</td><td>" + item.status + "</td><td>" + new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') + "</td></tr>");
                });
            }
        });
    }

    setInterval(Refresh, 2000);
}


