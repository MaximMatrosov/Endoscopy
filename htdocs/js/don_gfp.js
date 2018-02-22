
// *** Функция инициализации объектов формы значениями
// глобальных переменных соответствующих параметров команды
function don_gfp_init() {
    var Objarr;

    $('#id').attr('disabled', true);
    $('#x').attr('disabled', true);
    $('#y').attr('disabled', true);
    $('#z').attr('disabled', true);
    $('#vt').attr('disabled', true);
    $('#vc').attr('disabled', true);
    $('#an').attr('disabled', true);

    $('body').on("click", "tr[id *= Don]", function () {
        $('#id').attr('disabled', false);
        $('#x').attr('disabled', false);
        $('#y').attr('disabled', false);
        $('#z').attr('disabled', false);
        $('#vt').attr('disabled', false);
        $('#vc').attr('disabled', false);
        $('#an').attr('disabled', false);
        $(this).addClass('selected').siblings().removeClass('selected');
        var row_uid = $(this).attr('row_uid');
        $('#id').val(Objarr[row_uid].id);
        $('#x').val(Objarr[row_uid].x);
        $('#y').val(Objarr[row_uid].y);
        $('#z').val(Objarr[row_uid].z);
        $('#vt').val(Objarr[row_uid].vt);
        $('#vc').val(Objarr[row_uid].vc);
        $('#an').val(Objarr[row_uid].an);
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
        var XML = '<?xml version="1.0" encoding="koi8-r"?>\n<Message>\n\t<Донесение с данными ГФП>';
        Objarr.forEach(function (item, index, array) {
            var XMLcell = '\n\t\t<ts>\n\t\t\t<id>' + item.id +
                '</id>\n\t\t\t<x>' + item.x +
                '</x>\n\t\t\t<y>' + item.y + '</y>\n' +
                '\t\t\t<z>' + item.z + '</z>\n' +
                '\t\t\t<vt>' + item.vt + '</vt>\n' +
                '\t\t\t<vc>' + item.vc + '</vc>\n' +
                '\t\t\t<an>' + item.an + '</an>\n\t\t</ts>\n';
            XML = XML.concat(XMLcell);
        });
        XML = XML.concat('\t</Донесение с данными ГФП>\n</Message>');
        download(Date.now()+"don_gfp.xml", XML);
    });

    $('body').on("click", "#ButOk", function () {
        $('#id').attr('disabled', true);
        $('#x').attr('disabled', true);
        $('#y').attr('disabled', true);
        $('#z').attr('disabled', true);
        $('#vt').attr('disabled', true);
        $('#vc').attr('disabled', true);
        $('#an').attr('disabled', true);
    });

    $('body').on("click", "#ButPrim", function () {
        var elemToUpdateId = $("tr.selected").attr('row_uid');
        Objarr[elemToUpdateId].id = $('#id').val();
        Objarr[elemToUpdateId].x = $('#x').val();
        Objarr[elemToUpdateId].y = $('#y').val();
        Objarr[elemToUpdateId].z = $('#z').val();
        Objarr[elemToUpdateId].vt = $('#vt').val();
        Objarr[elemToUpdateId].vc = $('#vc').val();
        Objarr[elemToUpdateId].an = $('#an').val();
        $('#id').attr('disabled', true);
        $('#x').attr('disabled', true);
        $('#y').attr('disabled', true);
        $('#z').attr('disabled', true);
        $('#vt').attr('disabled', true);
        $('#vc').attr('disabled', true);
        $('#an').attr('disabled', true);
        $('#id').val(' ');
        $('#x').val(' ');
        $('#y').val(' ');
        $('#z').val(' ');
        $('#vt').val(' ');
        $('#vc').val(' ');
        $('#an').val(' ');
        $('#gfp_body').html(' ');
        Objarr.forEach(function (item, i, arr){
            $('#gfp_body').append("<tr id='Don " + i +"' row_uid='"+ i +"'><td>"+ item.id +"</td><td>" +
                item.x + "</td><td>"+item.y + "</td><td>"+item.z + "</td>" +
                "<td>"+parseFloat(item.vt).toFixed(6) + "</td><td>"+parseFloat(item.vc).toFixed(6) + "</td><td>"+parseFloat(item.an).toFixed(6) + "</td></tr>");
        });
    });

    $.ajax({
        url: "/getDonosGFP",
        type: 'GET',
        cache: false,
        success: function (jsonarr) {
            console.log(jsonarr);
            Objarr = JSON.parse(jsonarr);
            Objarr.forEach(function (item, i, arr){
                $('#gfp_body').append("<tr id='Don " + i +"' row_uid='"+ i +"'><td>"+ item.id +"</td><td>" +
                    item.x + "</td><td>"+item.y + "</td><td>"+item.z + "</td>" +
                    "<td>"+parseFloat(item.vt).toFixed(6) + "</td><td>"+parseFloat(item.vc).toFixed(6) + "</td><td>"+parseFloat(item.an).toFixed(6) + "</td></tr>");
            });
        }
    });
}


