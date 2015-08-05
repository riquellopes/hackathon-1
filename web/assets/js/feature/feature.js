//requisição ajax, validação de formulário
function sendFormFeature(url, formId, redirectUrl) {
    $('#' + formId).on('submit', function(e) {

        $('#modaLoading').modal('show');
        $('#jsError').find('div').remove();

        var postInfos = fullSerializa($('#' + formId + ' input, textarea, select'));
        e.preventDefault();
        $('.jsErrorMsg').remove();
        $("#message").hide();
        $('#' + formId + ' input, select, textarea').prop("disabled", true);
        $.ajax({
            type: 'POST',
            url: url,
            data: postInfos,
            success: function(data, textStatus, jqXHR) {
                $('#modaLoading').modal('hide');
                $("#message").removeClass('alert-danger').addClass("alert alert-success");
                $("#message").text("Acomodação salva com sucesso.");
                $("#message").show();
                $('#' + formId + ' input').prop("disabled", false);
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
                $("#message").text("Erro ao inserir a Acomodação - Verifique os campos em destaque.");
                $("#message").show();
                setTimeout(function() {
                    $("#message").hide();
                    $('#modaLoading').modal('hide');
                }, 3000);
                 $.each(JSON.parse(jqXHR.responseText), function(index, value) {
                    var element = $('<div>');
                    element.addClass("alert alert-admin alert-danger alert-dismissible alert-display");
                    element.append('<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Fechar</span></button>');
                    element.append('<span class="jsErrorMsg" style="color:red; font-weight: bold; display: block">' + value + '</span>');
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
                });      
            }
        });
    });
}

function cloneBox(boxClass) {
    var clone = $('.' + boxClass).first().clone();
    clone.addClass('cBoth').find('.box-adicionarcampo button').remove();
    clone.find('.box-adicionarcampo').html('<a class="fechar bt-remove" href="javascript:void(0)"><i class="fa fa-times-circle"></i></a>');
    $('.' + boxClass).first().after(clone.fadeIn('slow'));
}

//Fechar campos
function fecharBox(boxClass) {
    $(document).on('click', '.fechar', function(e) {
        e.preventDefault();
        $(this).fadeOut(200, function() {
            $(this).parents('.' + boxClass).remove();
        });
    });
}

function fullSerializa(elements) {
    var serializedArray = {};
    elements.each(function(i, el) {
        var $field = $(this)
                , rawName = $field.attr("name")
                , matches = rawName.match(/^(\w+)\[(\w+)?\]\[?\]?$/)
                , key
                , subKey
                , value = $field.val()
                , subValue = {}
        ;
        if (matches) {
            key = matches[1];
            subKey = matches[2];

            if (!(key in serializedArray)) {
                if (typeof subKey != 'undefined') {
                    serializedArray[key] = {};
                } else {
                    serializedArray[key] = [];
                }
            }

            if (typeof subKey != 'undefined' && !(subKey in serializedArray[key])) {
                serializedArray[key][subKey] = [];
            }

            subValue = value;

            if (typeof subKey != 'undefined') {
                serializedArray[key][subKey].push(subValue);
            } else {
                serializedArray[key].push(subValue);
            }

        } else {
            if ($(this).context.type == 'checkbox') {
                if ($(this).context.checked) {
                    serializedArray[rawName] = value;
                }
            } else {
                serializedArray[rawName] = value;
            }

        }
    });

    return serializedArray;
}
