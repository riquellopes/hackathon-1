/*
 * Method getAjax ( @url, @type {GET or POST}, @formData {object data}, @callback function )
 */
function getAjax(url, formData, type, callback){
    //ajaxConfig
    if(arguments[4] != undefined) {
        $.ajaxSetup(arguments[4]);
    }

    $.ajax({
        type: type,
        url: url,
        data: formData,
        success: function(data) {
            callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            callback(textStatus)
        }
    });
}

//Metodo redireciona o usuario para a url enviada
function redirect(url) {
    window.location.href = url;
}

function sendModalForm(url, formId, modalId) {
    $('#' + formId).on('submit', function(e) {
        $('#modaLoading').modal('show');
        var postInfos = fullSerialize($('#' + formId).find('input, select'));
        $('#' + formId + ' :input, select').prop("disabled", true);
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: url,
            data: postInfos,
            success: function(data, textStatus, jqXHR) {
                $('#' + modalId).find('form :input').val('');
                $('#' + modalId).modal('hide');
                $('#' + formId + ' :input, select').prop("disabled", false);
                $('#modaLoading').modal('hide');
                $('#jsSuccess').show();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#modaLoading').modal('hide');
                $('#' + formId + ' :input, select').prop("disabled", false);

                $.each(JSON.parse(jqXHR.responseText), function(index, value) {
                    var elements = $("[name^='" + index + "']");
                    if (elements.attr('name') != 'undefined') {
                        var matches = elements.attr('name').match(/^(\w+)\[(\w+)?\]\[?\]?$/);
                        if (matches) {
                            $.each(elements, function(i, v) {
                                var element = $(v);
                                if ($(this).val() == '') {
                                    generateErrors(element, value);
                                }
                            });
                        } else {
                            generateErrors(elements, value);
                        }
                    }
                });
            }
        });
    });
}

function fullSerialize(elements) {
    var serializedArray = {};
    elements.each(function(i, el) {
        var arr = ['submit', 'button'];
        if ($.inArray($(this).attr('type'), arr) == -1) {
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

                if ($field.context.type != 'checkbox' || $field.context.checked) {
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
                }
            } else {
                if ($(this).context.type == 'radio' || $(this).context.type == 'checkbox') {
                    if ($(this).context.checked) {
                        serializedArray[rawName] = value;
                    }
                } else {
                    serializedArray[rawName] = value;
                }

            }
        }
    });

    return serializedArray;
}

function generateErrors(element, text) {
    element.attr('title', text + ' <i class="fa fa-times"></i>');
    element.attr('data-original-title', text + ' <i class="fa fa-times"></i>');
    element.tooltip({
        html: true,
        template: '<div class="tooltip" role="tooltip"><div class="errorMsg-arrow tooltip-arrow"></div><div class="errorMsg-inner tooltip-inner"></div></div>',
        trigger: 'manual'
    });
    element.addClass('vermelho');
    element.tooltip('show');
    element.on('keyup', function() {
        if ($(this).val() != '') {
            $(this).tooltip('hide');
            element.removeClass('vermelho');
        } else {
            $(this).tooltip('show');
            element.addClass('vermelho');
        }
    });
}

//Validar senha do usuÃ¡rio
function ValidatePassword() {
    $('#oldPassword').keyup(function(e) {
        var formData = "password=" + $(this).val();
        var value = $(this).val();
        if (value.length > 6) {

            $('.carregando').show();

            $.ajax({
                type: 'POST',
                url: "validatePassword",
                data: formData,
                success: function(data, textStatus, jqXHR) {
                    if (data.message == 'sucess') {

                        $(".message").hide();
                        $("#psw1").attr("readonly", false);
                        $("#psw2").attr("readonly", false);

                        $('.carregando').hide();
                    }
                    else {
                        $(".message").show();
                        $("#psw1").attr("readonly", true);
                        $("#psw2").attr("readonly", true);

                        $('.carregando').hide();
                        $('.confirm-change-password').hide();

                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });
        }
        else {
            $(".carregando").hide();
        }

    });
}


//Validar nova senha do usuÃ¡rio
function ValidateNewPassword() {
    $('#psw2').keyup(function(e) {

        var senha1 = $('#psw1').val();
        var senha2 = $('#psw2').val();

        if (senha2.length > 6) {

            if (senha1 == senha2) {
                $('.confirm-change-password').show();
            } else {
                $('.confirm-change-password').hide();
            }
        }
    });
}

(function(e) {
    function t() {
        var e = document.createElement("input"), t = "onpaste";
        return e.setAttribute(t, ""), "function" == typeof e[t] ? "paste" : "input"
    }
    var n, a = t() + ".mask", r = navigator.userAgent, i = /iphone/i.test(r), o = /android/i.test(r);
    e.mask = {definitions: {9: "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]"}, dataName: "rawMaskFn", placeholder: "_"}, e.fn.extend({caret: function(e, t) {
        var n;
        if (0 !== this.length && !this.is(":hidden"))
            return"number" == typeof e ? (t = "number" == typeof t ? t : e, this.each(function() {
                this.setSelectionRange ? this.setSelectionRange(e, t) : this.createTextRange && (n = this.createTextRange(), n.collapse(!0), n.moveEnd("character", t), n.moveStart("character", e), n.select())
            })) : (this[0].setSelectionRange ? (e = this[0].selectionStart, t = this[0].selectionEnd) : document.selection && document.selection.createRange && (n = document.selection.createRange(), e = 0 - n.duplicate().moveStart("character", -1e5), t = e + n.text.length), {begin: e, end: t})
    }, unmask: function() {
        return this.trigger("unmask")
    }, mask: function(t, r) {
        var c, l, s, u, f, h;
        return!t && this.length > 0 ? (c = e(this[0]), c.data(e.mask.dataName)()) : (r = e.extend({placeholder: e.mask.placeholder, completed: null}, r), l = e.mask.definitions, s = [], u = h = t.length, f = null, e.each(t.split(""), function(e, t) {
            "?" == t ? (h--, u = e) : l[t] ? (s.push(RegExp(l[t])), null === f && (f = s.length - 1)) : s.push(null)
        }), this.trigger("unmask").each(function() {
            function c(e) {
                for (; h > ++e && !s[e]; )
                    ;
                return e
            }
            function d(e) {
                for (; --e >= 0 && !s[e]; )
                    ;
                return e
            }
            function m(e, t) {
                var n, a;
                if (!(0 > e)) {
                    for (n = e, a = c(t); h > n; n++)
                        if (s[n]) {
                            if (!(h > a && s[n].test(R[a])))
                                break;
                            R[n] = R[a], R[a] = r.placeholder, a = c(a)
                        }
                    b(), x.caret(Math.max(f, e))
                }
            }
            function p(e) {
                var t, n, a, i;
                for (t = e, n = r.placeholder; h > t; t++)
                    if (s[t]) {
                        if (a = c(t), i = R[t], R[t] = n, !(h > a && s[a].test(i)))
                            break;
                        n = i
                    }
            }
            function g(e) {
                var t, n, a, r = e.which;
                8 === r || 46 === r || i && 127 === r ? (t = x.caret(), n = t.begin, a = t.end, 0 === a - n && (n = 46 !== r ? d(n) : a = c(n - 1), a = 46 === r ? c(a) : a), k(n, a), m(n, a - 1), e.preventDefault()) : 27 == r && (x.val(S), x.caret(0, y()), e.preventDefault())
            }
            function v(t) {
                var n, a, i, l = t.which, u = x.caret();
                t.ctrlKey || t.altKey || t.metaKey || 32 > l || l && (0 !== u.end - u.begin && (k(u.begin, u.end), m(u.begin, u.end - 1)), n = c(u.begin - 1), h > n && (a = String.fromCharCode(l), s[n].test(a) && (p(n), R[n] = a, b(), i = c(n), o ? setTimeout(e.proxy(e.fn.caret, x, i), 0) : x.caret(i), r.completed && i >= h && r.completed.call(x))), t.preventDefault())
            }
            function k(e, t) {
                var n;
                for (n = e; t > n && h > n; n++)
                    s[n] && (R[n] = r.placeholder)
            }
            function b() {
                x.val(R.join(""))
            }
            function y(e) {
                var t, n, a = x.val(), i = -1;
                for (t = 0, pos = 0; h > t; t++)
                    if (s[t]) {
                        for (R[t] = r.placeholder; pos++ < a.length; )
                            if (n = a.charAt(pos - 1), s[t].test(n)) {
                                R[t] = n, i = t;
                                break
                            }
                        if (pos > a.length)
                            break
                    } else
                        R[t] === a.charAt(pos) && t !== u && (pos++, i = t);
                return e ? b() : u > i + 1 ? (x.val(""), k(0, h)) : (b(), x.val(x.val().substring(0, i + 1))), u ? t : f
            }
            var x = e(this), R = e.map(t.split(""), function(e) {
                return"?" != e ? l[e] ? r.placeholder : e : void 0
            }), S = x.val();
            x.data(e.mask.dataName, function() {
                return e.map(R, function(e, t) {
                    return s[t] && e != r.placeholder ? e : null
                }).join("")
            }), x.attr("readonly") || x.one("unmask", function() {
                x.unbind(".mask").removeData(e.mask.dataName)
            }).bind("focus.mask", function() {
                clearTimeout(n);
                var e;
                S = x.val(), e = y(), n = setTimeout(function() {
                    b(), e == t.length ? x.caret(0, e) : x.caret(e)
                }, 10)
            }).bind("blur.mask", function() {
                y(), x.val() != S && x.change()
            }).bind("keydown.mask", g).bind("keypress.mask", v).bind(a, function() {
                setTimeout(function() {
                    var e = y(!0);
                    x.caret(e), r.completed && e == x.val().length && r.completed.call(x)
                }, 0)
            }), y()
        }))
    }})
})(jQuery);

//adicionar campo numÃ©rico em acomodaçÃµes
(function() {
    $('.checkacomodaacao-js').on('click', function() {
        $(this).parents('.checkbox').next().find('.box-quantidade-js').toggle(100);
    });
})();

(function() {
    "use strict";

    //função de tab de menu
    $('#myTab a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });

    //função fechar
    $("#close").on("click", function(e) {
        e.preventDefault();
        $("#box-fechar").hide();
    });
})();

//estrela de categoria
(function() {
    "use strict";
    $('.categoria-hotel-js').change(function() {
        var valorCateg = $(this).val();
        (valorCateg == 1) ? $('.colors-stars').addClass('one') : $('.colors-stars').removeClass('one');
        (valorCateg == 2) ? $('.colors-stars').addClass('two') : $('.colors-stars').removeClass('two');
        (valorCateg == 3) ? $('.colors-stars').addClass('three') : $('.colors-stars').removeClass('three');
        (valorCateg == 4) ? $('.colors-stars').addClass('four') : $('.colors-stars').removeClass('four');
        (valorCateg == 5) ? $('.colors-stars').addClass('five') : $('.colors-stars').removeClass('five');
        (valorCateg == 6) ? $('.colors-stars').addClass('six') : $('.colors-stars').removeClass('six');
    });
})();

//requisição ajax - endereço
$('#searchaddress').click(function(e) {
    e.preventDefault();
    var str1 = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    var str2 = $("#endereco").val();
    var str3 = "&sensor=true";
    var request = str1.concat(str2, str3);
    $.ajax({
        type: 'POST',
        url: request,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {

            if (typeof data.results[1] != 'undefined') {
                $("#message").removeClass('alert-danger').addClass("alert alert-info");
                $("#message").text("Seja mais preciso, achei mais de um endereço para essa busca");
                $("#message").show();
                setInterval(function() {
                    $("#message").hide();
                }, 10000);
                exit;

            }

            if (data.status === 'OK' && typeof data.results[1] == 'undefined') {
                $("#message").removeClass('alert-danger').addClass("alert alert-info");
                $("#message").text("\\o/ Encontrei o endereço procurado! \\o/");
                $("#message").show();
                setInterval(function() {
                    $("#message").hide();
                }, 10000);


                $("#endereco").val(data.results[0].formatted_address);
                $("#latitude").val(data.results[0].geometry.location.lat);
                $("#longitude").val(data.results[0].geometry.location.lng);


                document.getElementById("imgaddress").src = "https://maps.googleapis.com/maps/api/staticmap?size=8012x212&maptype=hybrid&markers=size:mid|color:red|" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "+&sensor=false";
                $("#box-fechar, #close").show();

                $.each(data.results[0].address_components, function(index, element) {

                    if (element.types[0] === 'postal_code') {
                        $("#cep").val(data.results[0].address_components[index].long_name);
                    }

                    if (element.types[0] === 'administrative_area_level_1') {

                        document.getElementById("statechoose").text = data.results[0].address_components[index].long_name;
                    }

                    if (element.types[0] === 'administrative_area_level_2') {

                        document.getElementById("citychoose").text = data.results[0].address_components[index].long_name;
                    }

                    if (element.types[0] === 'country') {

                        document.getElementById("countrychoose").text = data.results[0].address_components[index].long_name;
                    }


                });
            }
            else {
                $("#message").removeClass('alert-danger').addClass("alert alert-info");
                $("#message").text("Endereço não encontrado!");
                $("#message").show();
                setInterval(function() {
                    $("#message").hide();
                }, 10000);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#message").removeClass('alert-danger').addClass("alert alert-info");
            $("#message").text("Endereço não encontrado!");
            $("#message").show();
            setInterval(function() {
                $("#message").hide();
            }, 10000);
        }
    });
});

$(function() {
    // PLUGIN tablesort
    if($(".tablesorter").length > 0)
        $(".tablesorter").tablesorter();

    //Função para toggle botão de menu tablet
    $('.menu-tablet').on('click', function(e) {
        e.preventDefault();
        $('.box-sidebar', this).slideToggle('slow');
    });

    $("[data-hide]").on("click", function() {
        $(this).closest("." + $(this).attr("data-hide")).removeClass('alert-display');
    });

    //função para aparecer calendÃ¡rio relatÃ³rio de vendas
    if($.datepicker != undefined) {
        $('.jsDatepickerRv').datepicker({
            showOn: 'both',
            buttonImage: "/assets/images/icons/site-nhu/calendario.png",
            buttonImageOnly: true,
            changeYear: false,
            dateFormat: 'yy-mm-dd'
        });
    }

    // Autocomplete
    var availableTags = [
        "ItaÃº",
        "Santander",
        "Caixa Economica Federal",
        "Bradesco",
        "Panamericano",
        "Banrisul",
        "Banco do Brasil"
    ];
    if (typeof $("#bank") == "undefined") {
        $("#bank").autocomplete({
            source: availableTags
        });
    }

    // jquery Mask
    $('.msk_date').mask('99/99/9999');
    $('.msk_date_birthday').mask('99/99');
    $('.msk_time').mask('99:99:99');
    $('.msk_date_time').mask('99/99/9999 99:99:99');
    $('.msk_cep').mask('99999-999');
    $('.msk_phone').mask('99999-9999');
    $('.msk_phone_with_ddd').mask('(99) 9999-9999');
    $('.msk_phone_us').mask('(999) 999-9999');
    $('.msk_mixed').mask('AAA 000-S0S');
    $('.msk_cpf').mask('999.999.999-99', {reverse: true});
    $('.msk_cnpj').mask('99.999.999/9999-99', {reverse: true});
    $('.msk_money').mask('999.999.999.999.999,99', {reverse: true});
    $('.msk_money2').mask("#.##9,99", {reverse: true, maxlength: false});
    $('.msk_ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {translation: {'Z': {pattern: /[0-9]/, optional: true}}});
    $('.msk_ip_address').mask('099.099.099.099');
    $('.msk_percent').mask('99.99', {reverse: true});
    $('.msk_clear-if-not-match').mask("99/99/9999", {clearIfNotMatch: true});
    $('.msk_placeholder').mask("99/99/9999", {placeholder: "__/__/____"});

    //Função para selecioner menu
    (function() {
        var getUrl = window.location.pathname;
        var resultGetUrl = getUrl.substring(0, (getUrl.length - 1));
        $('#lista-hover li a[href="' + resultGetUrl + '"]').parent('li').addClass('menu-selecionado-extranet');
    })();
});

function invoices(URL) {
    $.ajax({
        type: 'GET',
        url: URL,
        data: null,
        complete: function(data, textStatus, jqXHR) {
            window.open(data.responseJSON);
        }
    });
}