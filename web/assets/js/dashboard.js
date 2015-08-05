$(document).ready(function(){

    if (Cookies.get('dont-show-box-lastminute')) {
        $('.box-dash-lastminute').hide();
    } else {
        $('.box-dash-lastminute').show();
    }

    $('.disable-box-new-feature').on('click', function(){
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 1);
        Cookies.set('dont-show-box-lastminute', 1, { expires : expire });
    });

    $('.close-box-lastminute').on('click', function() {
        $('.box-dash-lastminute').hide();
    })
});
