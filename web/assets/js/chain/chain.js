//requisição ajax, validação de formulário
function sendForm(url, formId, redirectUrl) {

    $('#modaLoading').modal('show');

    var postInfos = $('#' + formId).serialize();
    $('.jsErrorMsg').remove();
    $("#message").hide();
    $('#' + formId + ' input').prop("disabled", true);
    $.ajax({
        type: 'POST',
        url: url,
        data: postInfos,
        success: function(data, textStatus, jqXHR) {
            $("#messageHotel").removeClass('alert-danger').addClass("alert alert-success");
            $("#messageHotel").text("Hotel inserido com sucesso.");
            $("#messageHotel").show();
            $('#jsSuccess').show();
            redirect(redirectUrl);
            setTimeout(function() {
                $("#jsSuccess").hide();
            }, 3000);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#' + formId + ' input').prop("disabled", false);
            $("#messageHotel").removeClass('alert-info');
            $("#messageHotel").removeClass('alert-success').addClass("alert alert-danger");
            $("#messageHotel").text("Erro ao inserir Hotel - Verifique os campos em destaque.");
            $("#messageHotel").show();
            $('#modaLoading').modal('hide');
            setTimeout(function() {
                $("#messageHotel").hide();
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
}


function fullSerialize(elements){
    var serializedArray = {};
    elements.each( function( i, el ){
      var $field = $( this )
        , rawName = $field.attr( "name" )
        , matches = rawName.match( /^(\w+)\[(\w+)?\]\[?\]?$/ )
        , key
        , subKey
        , value = $field.val()
        , subValue = {}
        ;
        
        if( matches ){
          key = matches[1];
          subKey = matches[2];
          
          if ( $field.context.type != 'checkbox' || $field.context.checked) {
              if( !( key in serializedArray ) ){
                  if (typeof subKey != 'undefined') {
                      serializedArray[key] = {};
                  } else {
                      serializedArray[key] = [];
                  }
              }

              if( typeof subKey != 'undefined' && !( subKey in serializedArray[key] ) ){
                  serializedArray[key][subKey] = [];
              }

              subValue = value;

              if( typeof subKey != 'undefined' ){
                  serializedArray[key][subKey].push(subValue);
              } else {
                  serializedArray[key].push(subValue);
              }
          }
        } else {
            if ($(this).context.type == 'radio' || $(this).context.type == 'checkbox'){
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