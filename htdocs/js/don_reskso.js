
// *** Функция инициализации объектов формы значениями
// глобальных переменных соответствующих параметров команды
function don_reskso_init() {
    var Objarr;

    $('body').on("click", "tr[id *= Don]", function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var row_uid = $(this).attr('row_uid');
        $('#nkso').val(Objarr[row_uid].nkso);
        $('#kolmsuz').val(Objarr[row_uid].kolmsuz);
        $('#primmsuz').val(Objarr[row_uid].primmsuz);
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
        var XML = '<?xml version="1.0" encoding="koi8-r"?>\n<Message>\n\t<Донесение о результатах применения КСО>';
        Objarr.forEach(function (item, index, array) {
            var XMLcell = '\n\t\t<ts>\n\t\t\t<nkso>' + item.nkso +
                '</nkso>\n\t\t\t<kolmsuz>' + item.kolmsuz +
                '</kolmsuz>\n\t\t\t<primmsuz>' + item.primmsuz + '</primmsuz>\n' +
                '\t\t\t<data>' + new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') + '</data>\n\t\t</ts>\n';
            XML = XML.concat(XMLcell);
        });
        XML = XML.concat('\t</Донесение о результатах применения КСО>\n</Message>');
        download(Date.now()+"_reskso.xml", XML);
    });

    $('body').on("click", "#ButOk", function () {
        $('#nkso').attr('disabled', true);
        $('#kolmsuz').attr('disabled', true);
        $('#primmsuz').attr('disabled', true);
        $('#data').attr('disabled', true);
    });

    $('body').on("click", "#ButPrim", function () {
        var elemToUpdateId = $("tr.selected").attr('row_uid');
        Objarr[elemToUpdateId].nkso = $('#nkso').val();
        Objarr[elemToUpdateId].kolmsuz = $('#kolmsuz').val();
        Objarr[elemToUpdateId].primmsuz = $('#primmsuz').val();
        Objarr[elemToUpdateId].data = $('#data').val();
        $('#nkso').val(' ');
        $('#kolmsuz').val(' ');
        $('#primmsuz').val(' ');
        $('#data').val(' ');
        $('#reskso_body').html(' ');
        Objarr.forEach(function (item, i, arr){
            $('#reskso_body').append("<tr id='Don " + i +"' row_uid='"+ i +"'><td>"+ item.nkso +"</td><td>" +
                item.kolmsuz + "</td><td>"+item.primmsuz + "</td><td>"+ new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') +"</td></tr>");
        });
    });

    $.ajax({
        url: "/getDonosResKso",
        type: 'GET',
        cache: false,
        success: function (jsonarr) {
            console.log(jsonarr);
            Objarr = JSON.parse(jsonarr);
            Objarr.forEach(function (item, i, arr){
                $('#reskso_body').append("<tr id='Don " + i +"' row_uid='"+ i +"'><td>"+ item.nkso +"</td><td>" +
                    item.kolmsuz + "</td><td>"+item.primmsuz + "</td><td>"+ new Date(item.data).toString('HH:mm:ss dd.MM.yyyy') +"</td></tr>");
            });
        }
    });
}


