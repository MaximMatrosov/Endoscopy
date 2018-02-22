
// *** Функция инициализации объектов формы значениями
// глобальных переменных соответствующих параметров команды
function don_tsoir_init() {
    var Objarr;

    $('body').on("click", "tr[id *= Don]", function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var row_uid = $(this).attr('row_uid');
        $('#tsoir').val(Objarr[row_uid].tsoir);
        $('#sost').val(Objarr[row_uid].sost);
        $('#tk').val(new Date(Objarr[row_uid].tk).toString('HH:mm:ss dd.MM.yyyy'));
    });

    function getCSS(status) {
        switch (status) {
            case "Исправен": return "text-success";
            case "Работоспособен": return "text-warning";
            default: return "text-danger";
        }
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.setAttribute('target', '_blank');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    $('body').on("click", "#ButSave", function () {
        var XML = '<?xml version="1.0" encoding="koi8-r"?>\n<Message>\n\t<Донесение о состоянии ТС ОИР>';
        Objarr.forEach(function (item, index, array) {
            var XMLcell = '\n\t\t<ts>\n\t\t\t<name_ts>' + item.tsoir +
                '</name_ts>\n\t\t\t<status>' + item.sost +
                '</status>\n\t\t\t<date>' + new Date(item.tk).toString('HH:mm:ss dd.MM.yyyy') + '</date>\n\t\t</ts>\n';
            XML = XML.concat(XMLcell);
        });
        XML = XML.concat('\t</Донесение о состоянии ТС ОИР>\n</Message>');
        download(Date.now()+"don_tsoir.xml", XML);
    });

    $('body').on("click", "#ButOk", function () {
        $('#tsoir').attr('disabled', true);
        $('#sost').attr('disabled', true);
        $('#tk').attr('disabled', true);
    });

    $('body').on("click", "#ButPrim", function () {
        var elemToUpdateId = $("tr.selected").attr('row_uid');
        Objarr[elemToUpdateId].tsoir = $('#tsoir').val();
        Objarr[elemToUpdateId].sost = $('#sost').val();
        Objarr[elemToUpdateId].tk = $('#tk').val();
        $('#tsoir').val(' ');
        $('#sost').val(' ');
        $('#tk').val(' ');
        $('#tsoir_body').html(' ');
        Objarr.forEach(function (item, i, arr){
            $('#tsoir_body').append("<tr id='Don " + i +"' row_uid='"+ i +"'><td>"+ item.tsoir +"</td><td class='"+ getCSS(item.sost) +"'>" +
                item.sost + "</td><td>" + new Date(item.tk).toString('HH:mm:ss dd.MM.yyyy') + "</td></tr>");
        });
    });

    $.ajax({
        url: "/getStatusList",
        type: 'GET',
        cache: false,
        success: function (jsonObj) {
            console.log(jsonObj);
            var Obj = JSON.parse(jsonObj)
            Obj.StatusList.forEach(function (item, i, arr) {
                $('#sost').append("<option sost_id='" + item.Id + "'>" + item.Name + "</option>");
            });
        }
    });

    $.ajax({
        url: "/getDonosTSOIR",
        type: 'GET',
        cache: false,
        success: function (jsonarr) {
            console.log(jsonarr);
            Objarr = JSON.parse(jsonarr);
            Objarr.forEach(function (item, i, arr){
                $('#tsoir_body').append("<tr id='Don " + i +"' row_uid='"+ i +"'><td>"+ item.tsoir +"</td><td class='"+ getCSS(item.sost) + "'>" +
                    item.sost + "</td><td>" + new Date(item.tk).toString('HH:mm:ss dd.MM.yyyy') + "</td></tr>");
            });
        }
    });
}


