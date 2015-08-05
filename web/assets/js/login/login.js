
$(document).ready(function(e) {


    var ip = $('#ip').val();
    var urlAssets = $('#urlAssets').val();
    $.ajax({
        type: 'GET',
        url: 'http://ip-api.com/json/' + ip,
        data: $(this).serialize(),
        success: function(data, textStatus, jqXHR) {

            var nome = data.regionName;
            if (typeof nome === "undefined") {
                nome = 'Rio de Janeiro';
            }

            $.ajax({
                type: 'GET',
                url: '//api.openweathermap.org/data/2.5/weather?units=metric&q=' + nome,
                data: $(this).serialize(),
                success: function(data, textStatus, jqXHR) {

                    $('#State option').first().text('Selecione um estado');
                    var tempo = data.weather[0].id;
                    $('#weatherId').html(Math.round(data.main.temp) + 'º c');
                    $('#State').val(nome);

                    var d = new Date();
                    var hour = d.getHours();

                    if (tempo >= 200 && tempo <= 531) {
                        $('#weatherType').html('Chuva');
                        $("#weatherIcon").removeClass('nublado');
                        $("#weatherIcon").removeClass('nublado-com-lua');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('lua');
                        $("#weatherIcon").removeClass('sol');
                        $("#weatherIcon").removeClass('chuva');
                        document.getElementById("weatherIcon").className = "chuva";

                        if (hour > 18 && hour < 00) {
                            $("body").css("background", "url('" + urlAssets + "/images/login/noite-chuva.jpg') no-repeat center fixed");
                            $("body").css("width", "100%");
                        }
                        else {
                            $("body").css("background", "url('" + urlAssets + "/images/login/dia-chuva.jpg') no-repeat center fixed");
                            $("body").css("width", "100%");
                        }



                        // alert('chuva');
                    }

                    if (tempo >= 600 && tempo <= 622) {
                        $('#weatherType').html('Neve');
                        $("#weatherIcon").removeClass('nublado');
                        $("#weatherIcon").removeClass('nublado-com-lua');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('lua');
                        $("#weatherIcon").removeClass('sol');
                        $("#weatherIcon").removeClass('chuva');
                        document.getElementById("weatherIcon").className = "chuva";
                        $("body").css("background", "url('image/setme.png')");

                        if (hour > 18 && hour < 00) {
                            $("body").css("background", "url('" + urlAssets + "/images/login/noite-chuva.jpg') no-repeat center fixed");
                            $("body").css("width", "100%");
                        }
                        else {
                            $("body").css("background", "url('" + urlAssets + "/images/login/dia-chuva.jpg') no-repeat center fixed");
                            $("body").css("width", "100%");
                        }
                        // alert('neve');
                    }


                    if (tempo >= 701 && tempo <= 781) {
                        $('#weatherType').html('Nebuloso');
                        $("#weatherIcon").removeClass('nublado');
                        $("#weatherIcon").removeClass('nublado-com-lua');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('lua');
                        $("#weatherIcon").removeClass('sol');
                        $("#weatherIcon").removeClass('chuva');
                        document.getElementById("weatherIcon").className = "nublado";
                        $("body").css("background", "url('image/setme.png')");
                        if (hour > 18 && hour < 00) {
                            $("body").css("background", "url('" + urlAssets + "/images/login/nublado-noite.jpg') no-repeat center fixed");
                            $("body").css("width", "100%");
                        }
                        else {
                            $("body").css("background", "url('" + urlAssets + "/images/login/min/bg-primary.jpg') center center fixed no-repeat");
                            $("body").css("width", "100%");
                        }
                        // alert('nebuloso');
                    }

                    if (tempo >= 801 && tempo <= 804) {
                        $('#weatherType').html('Nublado');
                        if (hour > 18 && hour < 00) {
                            $("#weatherIcon").removeClass('nublado');
                            $("#weatherIcon").removeClass('nublado-com-lua');
                            $("#weatherIcon").removeClass('nublado-com-sol');
                            $("#weatherIcon").removeClass('nublado-com-sol');
                            $("#weatherIcon").removeClass('lua');
                            $("#weatherIcon").removeClass('sol');
                            $("#weatherIcon").removeClass('chuva');
                            document.getElementById("weatherIcon").className = "nublado-com-lua";
                            $("body").css("background", "url('" + urlAssets + "/images/login/nublado-noite.jpg') no-repeat center fixed");
                            $("body").css("width", "100%");
                        }
                        else {
                            $("#weatherIcon").removeClass('nublado');
                            $("#weatherIcon").removeClass('nublado-com-lua');
                            $("#weatherIcon").removeClass('nublado-com-sol');
                            $("#weatherIcon").removeClass('nublado-com-sol');
                            $("#weatherIcon").removeClass('lua');
                            $("#weatherIcon").removeClass('sol');
                            $("#weatherIcon").removeClass('chuva');
                            document.getElementById("weatherIcon").className = "nublado-com-sol";
                            $("body").css("background", "url('" + urlAssets + "/images/login/min/bg-primary.jpg') center center fixed no-repeat");
                            $("body").css("width", "100%");
                        }
                        //alert('nublado');
                    }

                    if (tempo == 800) {
                        $('#weatherType').html('Claro');
                        if (hour > 18 && hour < 00) {
                            $("#weatherIcon").removeClass('nublado');
                            $("#weatherIcon").removeClass('nublado-com-lua');
                            $("#weatherIcon").removeClass('nublado-com-sol');
                            $("#weatherIcon").removeClass('nublado-com-sol');
                            $("#weatherIcon").removeClass('lua');
                            $("#weatherIcon").removeClass('sol');
                            $("#weatherIcon").removeClass('chuva');
                            document.getElementById("weatherIcon").className = "lua";
                            $("body").css("background", "url('" + urlAssets + "/images/login/noite-lua.jpg') no-repeat center fixed");
                            $("body").css("width", "100%");
                        }
                        else {
                            $("#weatherIcon").removeClass('nublado');
                            $("#weatherIcon").removeClass('nublado-com-lua');
                            $("#weatherIcon").removeClass('nublado-com-sol');
                            $("#weatherIcon").removeClass('nublado-com-sol');
                            $("#weatherIcon").removeClass('lua');
                            $("#weatherIcon").removeClass('sol');
                            $("#weatherIcon").removeClass('chuva');
                            document.getElementById("weatherIcon").className = "sol";
                            $("body").css("background", "url('" + urlAssets + "/images/login/min/bg-primary.jpg') center center fixed no-repeat");
                            $("body").css("width", "100%");
                        }
                    }


                },
                error: function(data) {

                }
            });



        },
        error: function(data) {

        }
    });

    $("#State").change(function() {
        var name = $("#State").val();
        $.ajax({
            type: 'GET',
            url: '//api.openweathermap.org/data/2.5/weather?units=metric&q=' + name,
            data: $(this).serialize(),
            success: function(data, textStatus, jqXHR) {

                var tempo = data.weather[0].id;
                $('#weatherId').html(Math.round(data.main.temp) + 'º c ');

                var d = new Date();
                var hour = d.getHours();

                if (tempo >= 200 && tempo <= 531) {
                    $('#weatherType').html('Chuva');
                    $("#weatherIcon").removeClass('nublado');
                    $("#weatherIcon").removeClass('nublado-com-lua');
                    $("#weatherIcon").removeClass('nublado-com-sol');
                    $("#weatherIcon").removeClass('nublado-com-sol');
                    $("#weatherIcon").removeClass('lua');
                    $("#weatherIcon").removeClass('sol');
                    $("#weatherIcon").removeClass('chuva');
                    document.getElementById("weatherIcon").className = "chuva";

                    if (hour > 18 && hour < 00) {
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/nublado-noite.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/noite-chuva.jpg') no-repeat center fixed");
                        $("body").css("width", "100%");
                    }
                    else {
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css({'background': 'url("' + urlAssets + '/images/login/dia-chuva.jpg") no-repeat center fixed'}).animate({opacity: 1}, 2500);
                         });*/
                        $("body").css({'background': 'url("' + urlAssets + '/images/login/dia-chuva.jpg") no-repeat center fixed'});
                        $("body").css("width", "100%");
                    }

                    // alert('chuva');
                }

                if (tempo >= 600 && tempo <= 622) {
                    $('#weatherType').html('Neve');
                    $("#weatherIcon").removeClass('nublado');
                    $("#weatherIcon").removeClass('nublado-com-lua');
                    $("#weatherIcon").removeClass('nublado-com-sol');
                    $("#weatherIcon").removeClass('nublado-com-sol');
                    $("#weatherIcon").removeClass('lua');
                    $("#weatherIcon").removeClass('sol');
                    $("#weatherIcon").removeClass('chuva');
                    document.getElementById("weatherIcon").className = "chuva";
                    $("body").css("background", "url('image/setme.png')");

                    if (hour > 18 && hour < 00) {
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/noite-chuva.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/noite-chuva.jpg') no-repeat center fixed");
                        $("body").css("width", "100%");
                    }
                    else {
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/dia-chuva.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/dia-chuva.jpg') no-repeat center fixed");
                        $("body").css("width", "100%");
                    }
                    // alert('neve');
                }


                if (tempo >= 701 && tempo <= 781) {
                    $('#weatherType').html('Nebuloso');
                    $("#weatherIcon").removeClass('nublado');
                    $("#weatherIcon").removeClass('nublado-com-lua');
                    $("#weatherIcon").removeClass('nublado-com-sol');
                    $("#weatherIcon").removeClass('nublado-com-sol');
                    $("#weatherIcon").removeClass('lua');
                    $("#weatherIcon").removeClass('sol');
                    $("#weatherIcon").removeClass('chuva');
                    document.getElementById("weatherIcon").className = "nublado";
                    $("body").css("background", "url('image/setme.png')");
                    if (hour > 18 && hour < 00) {
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/nublado-noite.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/nublado-noite.jpg') no-repeat center fixed");
                        $("body").css("width", "100%");
                    }
                    else {
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/bg-primary.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/min/bg-primary.jpg') center center fixed no-repeat");
                        $("body").css("width", "100%");
                    }
                    // alert('nebuloso');
                }

                if (tempo >= 801 && tempo <= 804) {
                    $('#weatherType').html('Nublado');
                    if (hour > 18 && hour < 00) {
                        $("#weatherIcon").removeClass('nublado');
                        $("#weatherIcon").removeClass('nublado-com-lua');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('lua');
                        $("#weatherIcon").removeClass('sol');
                        $("#weatherIcon").removeClass('chuva');
                        document.getElementById("weatherIcon").className = "nublado-com-lua";
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/nublado-noite.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/nublado-noite.jpg') no-repeat center fixed");
                        $("body").css("width", "100%");
                    }
                    else {
                        $("#weatherIcon").removeClass('nublado');
                        $("#weatherIcon").removeClass('nublado-com-lua');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('lua');
                        $("#weatherIcon").removeClass('sol');
                        $("#weatherIcon").removeClass('chuva');
                        document.getElementById("weatherIcon").className = "nublado-com-sol";
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/bg-primary.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/min/bg-primary.jpg') center center fixed no-repeat");
                        $("body").css("width", "100%");
                    }
                    //alert('nublado');
                }

                if (tempo == 800) {
                    $('#weatherType').html('Claro');
                    if (hour > 18 && hour < 00) {
                        $("#weatherIcon").removeClass('nublado');
                        $("#weatherIcon").removeClass('nublado-com-lua');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('lua');
                        $("#weatherIcon").removeClass('sol');
                        $("#weatherIcon").removeClass('chuva');
                        document.getElementById("weatherIcon").className = "lua";
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/noite-lua.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/noite-lua.jpg') no-repeat center fixed");
                        $("body").css("width", "100%");
                    }
                    else {
                        $("#weatherIcon").removeClass('nublado');
                        $("#weatherIcon").removeClass('nublado-com-lua');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('nublado-com-sol');
                        $("#weatherIcon").removeClass('lua');
                        $("#weatherIcon").removeClass('sol');
                        $("#weatherIcon").removeClass('chuva');
                        document.getElementById("weatherIcon").className = "sol";
                        /*$("body").animate({opacity: 0}, 1000, function() {
                         $("body").css("background", "url('" + urlAssets + "/images/login/bg-primary.jpg') no-repeat center fixed").animate({opacity: 1}, 2500);
                         });*/
                        $("body").css("background", "url('" + urlAssets + "/images/login/min/bg-primary.jpg') no-repeat center fixed");
                        $("body").css("width", "100%");
                    }
                }


            },
            error: function(data) {

            }
        });


    });

});


function sendFormForgotPassword() {
    $('.btn-successForgot').on('click', function(e) {
        var elementButton = $('.js-btLoadinLogin');
        elementButton.show();
        var formData = "email=" + $('#forgotEmail').val();

        $('#forgotEmail').on('focus', function(){
            $('.mensagemLoad').removeClass('cor-vermelha alert alert-danger').text(' Você irá receber um email para confirmar sua alteração de senha.');
            elementButton.parent().removeClass('disabled');
        });
                $.ajax({
                type: 'POST',
                url: "forgotPassword",
                data: formData,
                success: function(data, textStatus, jqXHR) {
                    if(data.message == 'sucesso'){
                        $('.mensagemLoad').text('Foi enviado um email de confirmação para você.');
                        elementButton.hide();
                        elementButton.parent().addClass('disabled');
                    }else{
                        $('.mensagemLoad').addClass('cor-vermelha alert alert-danger').text('Email não encontrado na nossa base. Favor digite novamente');
                        elementButton.hide();
                        elementButton.parent().addClass('disabled');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
                });
        });
    }


    function sendForm(url) {
    $('#formLogin').on('submit', function(e) {

        $('#loading-modal').removeClass('remove-load');
        $('.modal-backdrop').removeClass('remove-load');

        $('#jsError').find('div').remove();

        var postInfos = $(this).serialize();
        e.preventDefault();
        $('.jsErrorMsg').remove();

        $("#message").hide();
        $(this).find('input').prop("disabled", true);
        $('#pleaseWaitDialog').modal('show');
        $.ajax({
            type: 'POST',
            url: url,
            data: postInfos,
            success: function(data, textStatus, jqXHR) {
                $("#message").removeClass('alert-danger').addClass("alert alert-success");
                $("#message").text("Hotel inserido com sucesso.");
                $("#message").show();
                $('form').find('input').prop("disabled", false);
                redirect(data.url);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('form').find('input').prop("disabled", false);
                $('#pleaseWaitDialog').modal('hide');
                $("#message").removeClass('alert-info');
                $("#message").removeClass('alert-success').addClass("alert alert-danger");
                $("#message").text("Erro ao inserir Hotel - Verifique os campos em destaque.");
                $("#message").show();

                $('.modal-backdrop').addClass('remove-load');
                $('#loading-modal').addClass('remove-load');


                setTimeout(function() {
                    $("#message").hide();
                }, 3000);

                $.each(JSON.parse(jqXHR.responseText), function(index, value) {
                    var element = $('<div>');
                    element.addClass("alert alert-admin alert-danger alert-dismissible alert-display");
                    element.append('<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Fechar</span></button>');
                    element.append('<span class="jsErrorMsg" style="color:red; font-weight: bold; display: block">' + value + '</span>');
                    element.hover(function() {
                        setTimeout(function() {
                            element.fadeOut('1800', function() {
                                setTimeout(function() {
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
;



