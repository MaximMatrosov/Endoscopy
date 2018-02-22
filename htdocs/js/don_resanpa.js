// *** Функция инициализации объектов формы значениями
// глобальных переменных соответствующих параметров команды
function don_resanpa_init() {
    var Objarr;

    $('body').on("click", "tr[id *= Don]", function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var row_uid = $(this).attr('row_uid');
        $('#nanpa').val(Objarr[row_uid].nanpa);
        $('#kolmgt').val(Objarr[row_uid].kolmgt);
        $('#primmgt').val(Objarr[row_uid].primmgt);
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
        var XML = '<?xml version="1.0" encoding="koi8-r"?>\n<Message>\n\t<Донесение о результатах применения АНПА>';
        Objarr.forEach(function (item, index, array) {
            var XMLcell = '\n\t\t<ts>\n\t\t\t<nanpa>' + item.nanpa +
                '</nanpa>\n\t\t\t<kolmgt>' + item.kolmgt +
                '</kolmgt>\n\t\t\t<primmgt>' + item.primmgt + '</primmgt>\n' +
                '\t\t\t<data>' + new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') + '</data>\n\t\t</ts>\n';
            XML = XML.concat(XMLcell);
        });
        XML = XML.concat('\t</Донесение о результатах применения АНПА>\n</Message>');
        download(Date.now()+"resanpa.xml", XML);
    });

    $('body').on("click", "#ButOk", function () {
        $('#nanpa').attr('disabled', true);
        $('#kolmgt').attr('disabled', true);
        $('#primmgt').attr('disabled', true);
        $('#data').attr('disabled', true);
    });

    $('body').on("click", "#ButPrim", function () {
        var elemToUpdateId = $("tr.selected").attr('row_uid');
        Objarr[elemToUpdateId].nanpa = $('#nanpa').val();
        Objarr[elemToUpdateId].kolmgt = $('#kolmgt').val();
        Objarr[elemToUpdateId].primmgt = $('#primmgt').val();
        Objarr[elemToUpdateId].data = Date.parse($('#data').val());
        var date = Date.parse($('#data').val());
        $('#nanpa').val(' ');
        $('#kolmgt').val(' ');
        $('#primmgt').val(' ');
        $('#data').val(' ');
        $('#resanpa_body').html(' ');
        Objarr.forEach(function (item, i, arr) {
            $('#resanpa_body').append("<tr id='Don " + i + "' row_uid='" + i + "'><td>" + item.nanpa + "</td><td>" +
                item.kolmgt + "</td><td>" + item.primmgt + "</td><td>" + new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') + "</td></tr>");
        });
    });

    $.ajax({
        url: "/getDonosResAnpa",
        type: 'GET',
        cache: false,
        success: function (jsonarr) {
            console.log(jsonarr);
            Objarr = JSON.parse(jsonarr);
            Objarr.forEach(function (item, i, arr) {
                $('#resanpa_body').append("<tr id='Don " + i + "' row_uid='" + i + "'><td>" + item.nanpa + "</td><td>" +
                    item.kolmgt + "</td><td>" + item.primmgt + "</td><td>" + new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') + "</td></tr>");
            });
        }
    });
}


