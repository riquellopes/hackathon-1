/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function displayWeather() {
    getAjax(
            '//api.openweathermap.org/data/2.5/forecast/daily?lat=' + $('#latitude').val() + '&lon=' + $('#longitude').val() + '&cnt=7&mode=json&units=metric&lang=pt', $(this).serialize(), 'get',
        function (data) {
            if(data.city.coord.lat === 0 && data.city.coord.lon === 0){
                document.getElementById('BoxmsgErrorClima').style.display = 'block';
                var element = document.getElementById('msgErrorClima');
                var texto = 'Desculpe! Não conseguimos localizar a latitude e longitude.';
                element.innerHTML= texto;
            } else {
                var count = 0;
                var myElem = document.getElementById('weather-data-0');

                if (myElem != null) {
                    $.each(data.list, function (index, value) {

                        var date = timeConverter(value.dt);

                        document.getElementById('weather-data-' + count).innerHTML = date;
                        document.getElementById('weather-min-' + count).innerHTML = Math.round(data.list[count].temp.min) + 'º';
                        document.getElementById('weather-max-' + count).innerHTML = Math.round(data.list[count].temp.max) + 'º';
                        //document.getElementById('weather-desc-'+count).innerHTML = tempo;
                        //document.getElementById('weather-img-'+count).src =  '//openweathermap.org/img/w/'+data.list[count].weather[0].icon+'.png';

                        var tempo = data.list[count].weather[0].id;
                        var d = new Date();
                        var hour = d.getHours();

            if (myElem != null) {
                $.each(data.list, function(index, value) {

                    var date = timeConverter(value.dt);


                    document.getElementById('weather-data-' + count).innerHTML = date;
                    document.getElementById('weather-min-' + count).innerHTML = Math.round(data.list[count].temp.min) + 'º';
                    document.getElementById('weather-max-' + count).innerHTML = Math.round(data.list[count].temp.max) + 'º';
                    //document.getElementById('weather-desc-'+count).innerHTML = tempo;
                    //document.getElementById('weather-img-'+count).src =  'http://openweathermap.org/img/w/'+data.list[count].weather[0].icon+'.png';

                    var tempo = data.list[count].weather[0].id;

                    var d = new Date();
                    var hour = d.getHours();


                    if (tempo >= 200 && tempo <= 531) {
                        //chuva
                        document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/chuva.png';
                    }
                    if (tempo >= 600 && tempo <= 622) {
                        //neve
                        document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/chuva.png';
                    }
                    if (tempo >= 701 && tempo <= 781) {
                        //nebuloso
                        if (hour > 18 && hour < 23) {
                            document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-lua.png';
                        }
                        if (tempo >= 600 && tempo <= 622) {
                            //neve
                            document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/chuva.png';
                        }
                        if (tempo >= 701 && tempo <= 781) {
                            //nebuloso
                            if (hour > 18 && hour < 23) {
                                document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-lua.png';
                            }
                            else {
                                document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-sol.png';
                            }
                        }
                        if (tempo >= 801 && tempo <= 804) {
                            //nublado
                            if (hour > 18 && hour < 23) {
                                document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-lua.png';
                            }
                            else {
                                document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-sol.png';
                            }
                        }
                    }
                    if (tempo == 800) {
                        //claro
                        if (hour > 18 && hour < 23) {
                            document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/lua.png';
                        }
                        else {
                            document.getElementById('icon-weather-' + count).src = $('#urlAssets').val() + '/images/icons/dashboard/sol.png';
                        }

                        count = count + 1;
                    }
                });
            }
                var tempo = data.list[0].weather[0].id;

                var d = new Date();
                var hour = d.getHours();




                    count = count + 1;

                });
            }
            var tempo = data.list[0].weather[0].id;

            var d = new Date();
            var hour = d.getHours();


            if (tempo >= 200 && tempo <= 531) {
                //chuva
                document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/chuva.png';
            }
            if (tempo >= 600 && tempo <= 622) {
                //neve
                document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/chuva.png';
            }
            if (tempo >= 701 && tempo <= 781) {
                //nebuloso
                if (hour > 18 && hour < 23) {
                    document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-lua.png';
                }
                if (tempo >= 600 && tempo <= 622) {
                    //neve
                    document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/chuva.png';
                }
                if (tempo >= 701 && tempo <= 781) {
                    //nebuloso
                    if (hour > 18 && hour < 23) {
                        document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-lua.png';
                    }
                    else {
                        document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-sol.png';
                    }
                }
                if (tempo >= 801 && tempo <= 804) {
                    //nublado
                    if (hour > 18 && hour < 23) {
                        document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-lua.png';
                    }
                    else {
                        document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/nublado-com-sol.png';
                    }
                }
            }
            if (tempo == 800) {
                //claro
                if (hour > 18 && hour < 23) {
                    document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/lua.png';
                }
                else {
                    document.getElementById('icon-weather').src = $('#urlAssets').val() + '/images/icons/dashboard/sol.png';
                }

                }

                document.getElementById('metricsweather').innerHTML = Math.round(data.list[0].temp.day) + 'º';

                document.getElementById('metricsweather-max').innerHTML = Math.round(data.list[0].temp.max) + 'º';
                document.getElementById('metricsweather-min').innerHTML = Math.round(data.list[0].temp.min) + 'º';

                // document.getElementById('metricsweather-min').innerHTML = Math.round(data.list[0].temp.min)+'º';
                //document.getElementById('metricsweather-min').innerHTML = Math.round(data.list[0].temp.min)+'º';

                getAjax(
                        '//api.openweathermap.org/data/2.5/weather?lat=' + $('#latitude').val() + '&lon=' + $('#longitude').val() + '&lang=pt', $(this).serialize(), 'get',
                    function (data) {
                        var sunrise = GetYours(data.sys.sunrise);
                        var sunset = GetYours(data.sys.sunset);
                        document.getElementById('sunrise').innerHTML = sunrise;
                        document.getElementById('sunset').innerHTML = sunset;
                        document.getElementById('description').innerHTML = data.weather[0].description;
                    }
                );
            }
        }
    );
}

function GetYours(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var hour = a.getHours();
    var minutes = a.getMinutes();
    var time = hour + ':' + minutes;
    return time;
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var semana = new Array(6);

    semana[0] = 'DOM';
    semana[1] = 'SEG';
    semana[2] = 'TER';
    semana[3] = 'QUAR';
    semana[4] = 'QUIN';
    semana[5] = 'SEX';
    semana[6] = 'SÁB';

    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year + '(' + semana[a.getDay()] + ')';
    return semana[a.getDay()];
}

function wheather(index) {

    var weather = [];
    weather[200] = "Temporal com Chuva fraca";
    weather[201] = "Temporal";
    weather[202] = "Tempestade";
    weather[210] = "Tempestade Eletríca";
    weather[211] = "Temporal";
    weather[212] = "Temporal";
    weather[221] = "Risco de Temporal";
    weather[230] = "Temporal";
    weather[231] = "Temporal";
    weather[232] = "Temporal";
    weather[300] = "Garoa";
    weather[301] = "Garoa";
    weather[302] = "Garoa intensa";
    weather[310] = "Chuviscos";
    weather[311] = "Garoa com Chuva";
    weather[312] = "Garoa Intensa";
    weather[313] = "Garoa com Chuva";
    weather[314] = "Chuva Forte";
    weather[321] = "Chuva";
    weather[500] = "Chuva fraca";
    weather[501] = "Chuva";
    weather[502] = "Chuva intensa";
    weather[503] = "Chuva forte";
    weather[504] = "Temporal";
    weather[511] = "Chuva com risco de granizo";
    weather[520] = "Chuva com relâmpagos";
    weather[521] = "Chuva";
    weather[522] = "Pncadas de Chuva";
    weather[531] = "Risco de Chuva";
    weather[600] = "Neve fraca";
    weather[601] = "Neve";
    weather[602] = "Neve intensa";
    weather[611] = "Granizo";
    weather[612] = "Chuva com Granizo";
    weather[615] = "Relâmpaga, Chuva e Neve";
    weather[616] = "Chuva e Neve";
    weather[620] = "Relâmpago e Neve";
    weather[621] = "Garoa com Neve";
    weather[622] = "Neve intensa com Goroa";
    weather[701] = "Névoa";
    weather[711] = "Fumaça";
    weather[721] = "Neblina";
    weather[731] = "Tempestade de Áreia";
    weather[741] = "Nublado";
    weather[751] = "Areia";
    weather[761] = "Poeira";
    weather[762] = "Cinzas Vulcânicas";
    weather[771] = "Rajadas de Vento";
    weather[781] = "Tornado";
    weather[900] = "Tornado";
    weather[901] = "Tempestade Tropical";
    weather[902] = "Furacão";
    weather[903] = "Frio";
    weather[904] = "Quente";
    weather[905] = "Ventania";
    weather[906] = "Granizo";
    weather[950] = "Ambiente";
    weather[951] = "Calmo";
    weather[952] = "Brisa";
    weather[953] = "Leve Brisa";
    weather[954] = "Brisa";
    weather[955] = "Brisa";
    weather[956] = "Brisa";
    weather[957] = "Risco de Vendaval";
    weather[958] = "Vendaval";
    weather[959] = "Vendaval Severo";
    weather[960] = "Tempestade Violenta";
    weather[961] = "Furacão";
    weather[800] = "Céu Claro";
    weather[801] = "Nuvens Dispersas";
    weather[802] = "Nuvens Dispersas";
    weather[803] = "Nuvens Esparsas";
    weather[804] = "Nuvens Negras";

    return weather[index];

}

$(function(){
    if($('#metricsweather-max').length > 0)
        displayWeather();
});


