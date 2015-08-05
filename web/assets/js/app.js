(function($) {
	"use strict";

var w = window.location;

	var options = {
		events_source: '/hotel/availability',
		view: 'month',
                day: 'now',
		tmpl_path: '/tmpls/',
                language: 'pt-BR',
		tmpl_cache: false,
		onAfterViewLoad: function(view) {
			$('.page-header h3').text(this.getTitle());
			$('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
                        filterData();
                        loadClickEvent();
		},
		onBeforeViewLoad: function(view) {
                        
		},
		classes: {
			months: {
				general: 'label'
			}
		}
	};

	var calendar = $('#calendar').calendar(options);

	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
                $('#modaLoading').modal('show');
                    setTimeout(function() {
                        calendar.navigate($this.data('calendar-nav'));
                        $('#modaLoading').modal('hide');
                    }, 500);
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
                    $('#modaLoading').modal('show');
                    setTimeout(function() {
                        calendar.view($this.data('calendar-view'));
                        $('#modaLoading').modal('hide');
                    }, 500);
                });
	});

	$('#first_day').change(function(){
		var value = $(this).val();
		value = value.length ? parseInt(value) : null;
		calendar.setOptions({first_day: value});
		calendar.view();
	});

	$('#language').change(function(){
		calendar.setLanguage($(this).val());
		calendar.view();
	});

	$('#events-in-modal').change(function(){
		var val = $(this).is(':checked') ? $(this).val() : null;
		calendar.setOptions({modal: val});
	});
	$('#events-modal .modal-header, #events-modal .modal-footer').click(function(e){
		//e.preventDefault();
		//e.stopPropagation();
	});
}(jQuery));

$(document).on('change', '.jsRestrictionType', function(){
    if($(this).val() == 1) {
        $('.jsMinNights').show();
        $('.jsEntryDays').hide();
    } else {
        $('.jsMinNights').hide();
        $('.jsEntryDays').show();
    }
});

$(document).ready(function(){
    $('.jsFilter').each(function() {
        var $this = $(this);
        $this.change(function() {
                filterData();
        });
    });
    
    $('.jsFilterAccommodation').each(function() {
        var $this = $(this);
        $this.change(function() {
                filterDataAccommodation();
        });
    });
    
    loadModal();
});

function filterData(){
    var checkeds = $('.jsFilter:checked');
    var values = [];
    
    checkeds.each(function(e, elem) {
       values.push($(elem).val());
    });
    
    if ($.inArray( "tariff", values ) == -1) {
        $('.tariff').hide();
        $('.available').removeClass('col-lg-6');
        $('.available').addClass('col-lg-12');
    } else {
        $('.available').removeClass('col-lg-12');
        $('.available').addClass('col-lg-6');
        $('.tariff').show();
    }
    
    if ($.inArray( "available", values ) == -1) {
        $('.available').hide();
        $('.tariff').removeClass('col-lg-6 bd-right-calendar');
        $('.tariff').addClass('col-lg-12');
    } else {
        $('.tariff').removeClass('col-lg-12');
        $('.tariff').addClass('col-lg-6 bd-right-calendar');
        $('.available').show();
    }
    
    if ($.inArray( "stop-sale", values ) == -1) {
        $('.stop-sale').hide();
    } else {
        $('.stop-sale').show();
    }
    
    if ($.inArray( "free-sale", values ) == -1) {
        $('.free-sale').hide();
    } else {
        $('.free-sale').show();
    }
    
    if ($.inArray( "restricao", values ) == -1) {
        $('.restricao').hide();
    } else {
        $('.restricao').show();
    }
    
    if ($.inArray( "release", values ) == -1) {
        $('.release').hide();
    } else {
        $('.release').show();
    }
}

function filterDataAccommodation(){
    $('.jsFilterAccommodation').each(function(e, elem) {
        if ($(elem).is(':checked')) {
            $('.jsAccommodation'+$(elem).val()).show();
        } else {
            $('.jsAccommodation'+$(elem).val()).hide();
        }
    });
}

function loadClickEvent () {
    $('.editAttribute').on('click', function(e){
        var url = $(this).data('url');
        var infos = {};
        infos['id'] = $(this).data('id');
        infos['date'] = $(this).data('date');
        infos['tpl_name'] = $(this).data('tpl-name');
        infos['accommodation_id'] = $(this).data('accommodation');
        
        getEditForm(url, infos);
    });
}

function loadModal(){
    $('.jsShowModal').on('click', function(e){
        var url = $(this).data('url');
        var infos = {};
        infos['date'] = $(this).data('date');
        infos['tpl_name'] = $(this).data('tpl-name');
        
        getEditForm(url, infos);
    });
}

function verifyAccommodationTariff(){
    $('.jsChcekAll').on('change', function(){
        if($(this).is(':checked')) {
            $('.jsAccommodationCheck').prop('checked', true);
            $('.jsTariffValue').show();
        } else {
            $('.jsAccommodationCheck').prop('checked', false);
            $('.jsTariffValue').hide();
        }
    });
    
    $('.jsAccommodationCheck').each(function(e, elem){
        if ($(elem).is(':checked')) {
            $('.jsAccommodationTariff' + $(elem).val()).show();
        } else {
            $('.jsAccommodationTariff' + $(elem).val()).hide();
        }
        
        $(elem).on('change', function(){
            $('.jsChcekAll').prop('checked', false);
            if ($(elem).is(':checked')) {
                $('.jsAccommodationTariff' + $(elem).val()).show();
            } else {
                $('.jsAccommodationTariff' + $(elem).val()).hide();
            }
        });
    });
}

function fullSerialize(elements){
    var serializedArray = {};
    elements.each( function( i, el ){
      var $field = $( this )
        , rawName = $field.attr( "name" )
        , matches = (rawName != undefined) ? rawName.match( /^(\w+)\[(\w+)?\]\[?\]?$/ ) : ''
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

              if ( typeof subKey != 'undefined' ) {
                  var subKeyMatches = subKey.match( /^(\w+)\[(\w+)?\]\[?\]?$/ );
                  if (subKeyMatches && !( subKey in serializedArray[key])) {
                      serializedArray[key][subKey] = [];
                  }                  
              }

              subValue = value;

              if( typeof subKey != 'undefined' ){
                if (subKeyMatches) {
                    serializedArray[key][subKey].push(subValue);
                } else {
                    serializedArray[key][subKey] = subValue;
                }
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

function getEditForm(url, info) {
    $('#modaLoading').modal('show');
    $.ajax({
        type: 'POST',
        url: url,
        data: info,
        success: function(data) {
            addModalContent(data.form);
            $('#editForm').modal('show');
            createDatepickers();
            $('#modaLoading').modal('hide');
            verifyAccommodationTariff();
        }
    });
}

function addModalContent(content){
    $('#editForm').find('.modal-content').html(content);
}

//data campos na modal
function createDatepickers() {
    $('.jsDatepicker').datepicker({
        dateFormat: 'dd/mm/yy',
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        showOn: 'both',
        beforeShow: function() {
            if ($(this).attr('name') == 'itxUntil') {
                if ($('.jsDatepicker[name=itxOf]').val() != '') {
                    $(this).datepicker('option', 'minDate', $('.jsDatepicker[name=itxOf]').val());
                }
            }
        }
    });
}

function sendForm(url, formId, redirectUrl) {
    $(document).on('submit', '#' + formId, function(e) {

        // formModalDisponibilidade 
        if(formId == 'jsFormAvailable' && $("input[name='irdTypeAvailability']").length > 0) {
            if( $("input[name='irdTypeAvailability']:checked").length < 1){
                return false;
            } else {
                if( $("input[name='irdTypeAvailability']:checked").val() != 3 && ($("input[name='itxAllotment']").val() == '' && $("input[name='itxQuantity']").val() == '') )
                {
                    return false;
                }
            }
        }

        $('#modaLoading').modal('show');
        var postInfos = fullSerialize($('#' + formId + ' input, select, textarea'));
        e.preventDefault();
        $('.jsErrorMsg').remove();
        $("#message").hide();
        $('#' + formId + ' :input').prop("disabled", true);
        $.ajax({
            type: 'POST',
            url: url,
            data: postInfos,
            success: function(data, textStatus, jqXHR) {
                if(data.dados != undefined) {
                    if (data.dados[1].length > 0) {
                        $('#editForm').modal('hide');
                        $('#modaLoading').modal('hide');

                        var html = '';
                        var hasDatas = false;

                        for (var i = 0; i < data.dados[1].length; i++) {
                            var dataHtml = '';

                            if(data.dados[1][i] != undefined && data.dados[1][i].datas != undefined) {
                                hasDatas = true;

                                for (var x = 0; x < data.dados[1][i].datas.length; x++) {
                                    var sep = (x != 0) ? '- ' : '';
                                    dataHtml += sep + data.dados[1][i].datas[x];
                                }
                                html += '<tr><td width="400">' + data.dados[1][i].acomodacao + '</td><td>' + dataHtml + '</td></tr>';
                            }
                        }

                        if(hasDatas) {
                            $('#modalRespAllotment tbody').html(html);
                            $('#modalRespAllotment').modal('show');
                        }else {
                            redirect(redirectUrl);
                        }
                    } else {
                        redirect(redirectUrl);
                    }
                } else {
                    redirect(redirectUrl);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#' + formId + ' :input').prop("disabled", false);
                $('#pleaseWaitDialog').modal('hide');
                $("#message").removeClass('alert-info');
                $("#message").removeClass('alert-success').addClass("alert alert-danger");
                $("#message").text("Erro ao inserir a Taxas - Verifique os campos em destaque.");
                $("#message").show();
                $('#modaLoading').modal('hide');
                setTimeout(function() {
                    $("#message").hide();
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