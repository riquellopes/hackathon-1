$exibeAlert = function(index, value) {
    var element = $('<div>');
    element.addClass("alert alert-admin alert-" + index +" alert-dismissible alert-display");
    element.append('<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Fechar</span></button>');
    if(index == 'danger'){
        element.append('<span class="jsErrorMsg" style="color:red; font-weight: bold; display: block">' + value + '</span>');
    } else{
        element.append('<span>' + value + '</span>');
    }
    element.hover(function(){
        setTimeout(function(){
            element.fadeOut('1800', function(){
                setTimeout(function(){
                    element.remove();
                }, 1000);
            });
        }, 3000);
    });
    $('#jsError').append(element);
    $('#modaLoading').modal('hide');
};

//requisição ajax, validação de formulário
function sendForm(formId, redirectUrl) {
    $('#' + formId).on('submit', function(e) {

        $('#modaLoading').modal('show');
        $('#jsError').find('div').remove();

        var postInfos = fullSerialize($('#' + formId + ' input, textarea, select'));
        //var postInfos = $('#' + formId + ' input, textarea, select').serializeArray();
        
        e.preventDefault();
        $('.jsErrorMsg').remove();
        $("#message").hide();
        $('#' + formId + ' input').prop("disabled", true);
        $('#pleaseWaitDialog').modal('show');
        $.ajax({
            type: 'POST',
            url: $('#' + formId).attr('action'),
            data: postInfos,
            success: function(data, textStatus, jqXHR) {
                $exibeAlert('success', 'Margem salva com sucesso.')
                setTimeout(function() {
                    $("#jsSuccess").hide();
                    redirect(redirectUrl);
                }, 1000);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#' + formId + ' input').prop("disabled", false);
                $('#pleaseWaitDialog').modal('hide');
                $("#message").removeClass('alert-info');
                $("#message").removeClass('alert-success').addClass("alert alert-danger");
                $("#message").text("Erro ao inserir a Margem - Verifique os campos em destaque.");
                $("#message").show();
                setTimeout(function() {
                    $("#message").hide();
                    $('#modaLoading').modal('hide');
                }, 3000);

                $.each(JSON.parse(jqXHR.responseText), function(index, value) {
                    $exibeAlert('danger', value);
                });
            }});
    });
}