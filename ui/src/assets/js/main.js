$(document).ready(function () {
    var menu_h = $('.header').height();
    var tmenu_h = $('.top-header').height();
    var window_w = $(window).innerWidth();
    $(".menu-category-bar").addClass('active');
    $('.menu-category-bar').css({ "top": tmenu_h });
    $('.basket-container').css({ "top": tmenu_h });
    $('#welcome').css({"marginTop":tmenu_h});
});

$(function() {
    $('.chosen-select').chosen();
});


jQuery(document).on('click', '#pas_visible1', function() {
    var x = document.getElementById("pass1");
    if (x.type === "password") {
        x.type = "text";
        jQuery('#pas_visible1').attr('src', '/assets/images/eye1.svg');
    } else {
        x.type = "password";
        jQuery('#pas_visible1').attr('src', '/assets/images/eye2.svg');
    }
});

jQuery(document).on('click', '#pas_visible2', function() {
    var x = document.getElementById("pass2");
    if (x.type === "password") {
        x.type = "text";
        jQuery('#pas_visible2').attr('src', '/assets/images/eye1.svg');
    } else {
        x.type = "password";
        jQuery('#pas_visible2').attr('src', '/assets/images/eye2.svg');
    }
});

jQuery(document).on('click', '#pas_visible3', function() {
    var x = document.getElementById("pass3");
    if (x.type === "password") {
        x.type = "text";
        jQuery('#pas_visible3').attr('src', '/assets/images/eye1.svg');
    } else {
        x.type = "password";
        jQuery('#pas_visible3').attr('src', '/assets/images/eye2.svg');
    }
});

jQuery(document).on('click', '#pas_visible4', function() {
    var x = document.getElementById("pass4");
    if (x.type === "password") {
        x.type = "text";
        jQuery('#pas_visible4').attr('src', '/assets/images/eye1.svg');
    } else {
        x.type = "password";
        jQuery('#pas_visible4').attr('src', '/assets/images/eye2.svg');
    }
});


$(document).on('click', '.OpenLogin', function () {
    $('.slide-form').addClass('active');
});

$(document).on('click', '#loginPopupClose', function () {
    $('.slide-form').removeClass('active');
});




// Menu category scroll

$(document).ready(function () {
    $(document).on("scroll");
    $('a[href^="#"]').on('click', function (e) {

        var menu_h = $('.top-header').height();
        var mabr_height = $('.menu-category-bar').height();
        var total_height = (menu_h) + (mabr_height);

        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = $(this.hash);
        $target = $(target);
        
    });
});


$(function() {
  var items = $('#navMenu-items').width();
  var itemSelected = document.getElementsByClassName('navMenu-item');
  //navPointerScroll($(itemSelected));
  $("#navMenu-items").scrollLeft(200).delay(200).animate({
    scrollLeft: "-=200"
  }, 2000, "easeOutQuad");
 
  $('.navMenu-paddle-right').click(function () {
    $("#navMenu-items").animate({
      scrollLeft: '+='+items
    });
  });
  $('.navMenu-paddle-left').click(function () {
    $( "#navMenu-items" ).animate({
      scrollLeft: "-="+items
    });
  });

  if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    var scrolling = false;

    $(".navMenu-paddle-right").bind("mouseover", function(event) {
        scrolling = true;
        scrollContent("right");
    }).bind("mouseout", function(event) {
        scrolling = false;
    });

    $(".navMenu-paddle-left").bind("mouseover", function(event) {
        scrolling = true;
        scrollContent("left");
    }).bind("mouseout", function(event) {
        scrolling = false;
    });

    function scrollContent(direction) {
        var amount = (direction === "left" ? "-=3px" : "+=3px");
        $("#navMenu-items").animate({
            scrollLeft: amount
        }, 1, function() {
            if (scrolling) {
                scrollContent(direction);
            }
        });
    }
  }


});


//opening hours append
var a=1;
$(document).on('click', '.opening-hours-Add', function(e) {
    //alert('opening');
    a=parseInt(a)+1;
    console.log('testing'+a);
    $("#opening-hours").append('<div id="opening-hours-row'+a+'"><div class="row"><div class="col-md-4"><div class="row"><div class="col-md-6 my-auto"><div class="form-group"><select placeholder="Tag von" class="form-control custom-select" tabIndex=1><option value="0"> Tag von</option><option value>Montag</option><option value>Dienstag</option><option value>Mittwoch</option><option value>Donnerstag</option><option value>Freitag</option><option value>Samstag</option><option value>Sonntag</option></select></div></div><div class="col-md-6 my-auto"><div class="form-group"><select placeholder="Tag bis" class="form-control custom-select" tabIndex=1><option value="0">Tag bis</option><option value>Montag</option><option value>Dienstag</option><option value>Mittwoch</option><option value>Donnerstag</option><option value>Freitag</option><option value>Samstag</option><option value>Sonntag</option></select></div></div></div></div><div class="col-md-6"><div id="custom-hours'+a+'"><div id="custom-hours-row"><div class="row"><div class="col-md-4 my-auto"><div class="form-group"><select placeholder="Zeit von" class="form-control custom-select" tabIndex=1><option value="0">Zeit von</option><option value>00:15</option><option value>00:30</option><option value>00:45</option><option value>01:00</option><option value>01:15</option><option value>01:30</option><option value>01:45</option><option value>02:00</option><option value>02:15</option><option value>02:30</option><option value>02:45</option><option value>03:00</option><option value>03:15</option><option value>03:30</option><option value>03:45</option><option value>04:00</option><option value>04:15</option><option value>04:30</option><option value>04:45</option><option value>05:00</option><option value>05:15</option><option value>05:30</option><option value>05:45</option><option value>06:00</option><option value>06:15</option><option value>06:30</option><option value>06:45</option><option value>07:00</option><option value>07:15</option><option value>07:30</option><option value>07:45</option><option value>08:00</option><option value>08:15</option><option value>08:30</option><option value>08:45</option><option value>09:00</option><option value>09:15</option><option value>09:30</option><option value>09:45</option><option value>10:00</option><option value>10:15</option><option value>10:30</option><option value>10:45</option><option value>11:00</option><option value>11:15</option><option value>11:30</option><option value>11:45</option><option value>12:00</option><option value>12:15</option><option value>12:30</option><option value>12:45</option><option value>13:00</option><option value>13:15</option><option value>13:30</option><option value>13:45</option><option value>14:00</option><option value>14:15</option><option value>14:30</option><option value>14:45</option><option value>15:00</option><option value>15:15</option><option value>15:30</option><option value>15:45</option><option value>16:00</option><option value>16:15</option><option value>16:30</option><option value>16:45</option><option value>17:00</option><option value>17:15</option><option value>17:30</option><option value>17:45</option><option value>18:00</option><option value>18:15</option><option value>18:30</option><option value>18:45</option><option value>19:00</option><option value>19:15</option><option value>19:30</option><option value>19:45</option><option value>20:00</option><option value>20:15</option><option value>20:30</option><option value>20:45</option><option value>21:00</option><option value>21:15</option><option value>21:30</option><option value>21:45</option><option value>22:00</option><option value>22:15</option><option value>22:30</option><option value>22:45</option><option value>23:00</option><option value>23:15</option><option value>23:30</option><option value>23:45</option></select></div></div><div class="col-md-4 my-auto"><div class="form-group"><select placeholder="Zeit von" class="form-control custom-select" tabIndex=1><option value="0">Zeit von</option><option value>00:15</option><option value>00:30</option><option value>00:45</option><option value>01:00</option><option value>01:15</option><option value>01:30</option><option value>01:45</option><option value>02:00</option><option value>02:15</option><option value>02:30</option><option value>02:45</option><option value>03:00</option><option value>03:15</option><option value>03:30</option><option value>03:45</option><option value>04:00</option><option value>04:15</option><option value>04:30</option><option value>04:45</option><option value>05:00</option><option value>05:15</option><option value>05:30</option><option value>05:45</option><option value>06:00</option><option value>06:15</option><option value>06:30</option><option value>06:45</option><option value>07:00</option><option value>07:15</option><option value>07:30</option><option value>07:45</option><option value>08:00</option><option value>08:15</option><option value>08:30</option><option value>08:45</option><option value>09:00</option><option value>09:15</option><option value>09:30</option><option value>09:45</option><option value>10:00</option><option value>10:15</option><option value>10:30</option><option value>10:45</option><option value>11:00</option><option value>11:15</option><option value>11:30</option><option value>11:45</option><option value>12:00</option><option value>12:15</option><option value>12:30</option><option value>12:45</option><option value>13:00</option><option value>13:15</option><option value>13:30</option><option value>13:45</option><option value>14:00</option><option value>14:15</option><option value>14:30</option><option value>14:45</option><option value>15:00</option><option value>15:15</option><option value>15:30</option><option value>15:45</option><option value>16:00</option><option value>16:15</option><option value>16:30</option><option value>16:45</option><option value>17:00</option><option value>17:15</option><option value>17:30</option><option value>17:45</option><option value>18:00</option><option value>18:15</option><option value>18:30</option><option value>18:45</option><option value>19:00</option><option value>19:15</option><option value>19:30</option><option value>19:45</option><option value>20:00</option><option value>20:15</option><option value>20:30</option><option value>20:45</option><option value>21:00</option><option value>21:15</option><option value>21:30</option><option value>21:45</option><option value>22:00</option><option value>22:15</option><option value>22:30</option><option value>22:45</option><option value>23:00</option><option value>23:15</option><option value>23:30</option><option value>23:45</option></select></div></div><div class="col-md-4 my-auto text-right"><div class="form-group"><a href="javascript:;" class="btn btn-sm btn-success btn-rounded custom-hours-row-add" data-id="opening-hours-row'+a+'" data-type="custom-hours'+a+'"><i class="lnr-plus-circle"></i> Zeit hinzufügen</a></div></div></div></div></div></div><div class="col-md-2 text-right"><div class="form-group"><a href="javascript:;" class="btn btn-sm btn-success btn-rounded opening-hours-remove" data-id="opening-hours-row'+a+'"><i class="lnr-circle-minus"></i>  löschen</a></div></div></div></div>');
});

$(document).on('click', '.opening-hours-remove', function(e) {
  //$("#opening-hours-row2").remove();

  var thiz = $(this);
  var remove_id = $(thiz).attr("data-id");
   console.log("Remove"+remove_id);
  $("#"+remove_id).remove();

});

var c=0;
$(document).on('click', '.custom-hours-row-add', function(e) {
    c=parseInt(c)+1;
    var thiz = $(this);
    var type_id = $(thiz).attr("data-type");
    $("#"+type_id).append('<div id="custom-hours-row'+c+'"><div class="row"><div class="col-md-4 my-auto"><div class="form-group"><select placeholder="Zeit von" class="form-control custom-select" tabIndex=1><option value={0}>Zeit von</option><option value>00:15</option><option value>00:30</option><option value>00:45</option><option value>01:00</option><option value>01:15</option><option value>01:30</option><option value>01:45</option><option value>02:00</option><option value>02:15</option><option value>02:30</option><option value>02:45</option><option value>03:00</option><option value>03:15</option><option value>03:30</option><option value>03:45</option><option value>04:00</option><option value>04:15</option><option value>04:30</option><option value>04:45</option><option value>05:00</option><option value>05:15</option><option value>05:30</option><option value>05:45</option><option value>06:00</option><option value>06:15</option><option value>06:30</option><option value>06:45</option><option value>07:00</option><option value>07:15</option><option value>07:30</option><option value>07:45</option><option value>08:00</option><option value>08:15</option><option value>08:30</option><option value>08:45</option><option value>09:00</option><option value>09:15</option><option value>09:30</option><option value>09:45</option><option value>10:00</option><option value>10:15</option><option value>10:30</option><option value>10:45</option><option value>11:00</option><option value>11:15</option><option value>11:30</option><option value>11:45</option><option value>12:00</option><option value>12:15</option><option value>12:30</option><option value>12:45</option><option value>13:00</option><option value>13:15</option><option value>13:30</option><option value>13:45</option><option value>14:00</option><option value>14:15</option><option value>14:30</option><option value>14:45</option><option value>15:00</option><option value>15:15</option><option value>15:30</option><option value>15:45</option><option value>16:00</option><option value>16:15</option><option value>16:30</option><option value>16:45</option><option value>17:00</option><option value>17:15</option><option value>17:30</option><option value>17:45</option><option value>18:00</option><option value>18:15</option><option value>18:30</option><option value>18:45</option><option value>19:00</option><option value>19:15</option><option value>19:30</option><option value>19:45</option><option value>20:00</option><option value>20:15</option><option value>20:30</option><option value>20:45</option><option value>21:00</option><option value>21:15</option><option value>21:30</option><option value>21:45</option><option value>22:00</option><option value>22:15</option><option value>22:30</option><option value>22:45</option><option value>23:00</option><option value>23:15</option><option value>23:30</option><option value>23:45</option></select></div></div><div class="col-md-4 my-auto"><div class="form-group"><select placeholder="Zeit von" class="form-control custom-select" tabIndex=1><option value={0}>Zeit von</option><option value>00:15</option><option value>00:30</option><option value>00:45</option><option value>01:00</option><option value>01:15</option><option value>01:30</option><option value>01:45</option><option value>02:00</option><option value>02:15</option><option value>02:30</option><option value>02:45</option><option value>03:00</option><option value>03:15</option><option value>03:30</option><option value>03:45</option><option value>04:00</option><option value>04:15</option><option value>04:30</option><option value>04:45</option><option value>05:00</option><option value>05:15</option><option value>05:30</option><option value>05:45</option><option value>06:00</option><option value>06:15</option><option value>06:30</option><option value>06:45</option><option value>07:00</option><option value>07:15</option><option value>07:30</option><option value>07:45</option><option value>08:00</option><option value>08:15</option><option value>08:30</option><option value>08:45</option><option value>09:00</option><option value>09:15</option><option value>09:30</option><option value>09:45</option><option value>10:00</option><option value>10:15</option><option value>10:30</option><option value>10:45</option><option value>11:00</option><option value>11:15</option><option value>11:30</option><option value>11:45</option><option value>12:00</option><option value>12:15</option><option value>12:30</option><option value>12:45</option><option value>13:00</option><option value>13:15</option><option value>13:30</option><option value>13:45</option><option value>14:00</option><option value>14:15</option><option value>14:30</option><option value>14:45</option><option value>15:00</option><option value>15:15</option><option value>15:30</option><option value>15:45</option><option value>16:00</option><option value>16:15</option><option value>16:30</option><option value>16:45</option><option value>17:00</option><option value>17:15</option><option value>17:30</option><option value>17:45</option><option value>18:00</option><option value>18:15</option><option value>18:30</option><option value>18:45</option><option value>19:00</option><option value>19:15</option><option value>19:30</option><option value>19:45</option><option value>20:00</option><option value>20:15</option><option value>20:30</option><option value>20:45</option><option value>21:00</option><option value>21:15</option><option value>21:30</option><option value>21:45</option><option value>22:00</option><option value>22:15</option><option value>22:30</option><option value>22:45</option><option value>23:00</option><option value>23:15</option><option value>23:30</option><option value>23:45</option></select></div></div><div class="col-md-4 my-auto text-right"><div class="form-group"><a href="javascript:;" class="btn btn-sm btn-success btn-rounded custom-row-remove" data-id="custom-hours-row'+c+'"><i class="lnr-circle-minus"></i> löschen</a></div></div></div></div>');
});

$(document).on('click', '.custom-row-remove', function(e) {
  //$("#custom-hours-row2").remove();

  var thiz = $(this);
  var remove_id = $(thiz).attr("data-id");
   console.log("Remove"+remove_id);
  $("#"+remove_id).remove();

});

$(function() {
    $(".feiertage-date").daterangepicker({
        "singleDatePicker": true,
        "timePicker": false,
        "locale": {
         "format": "DD.MM.YYYY",
         "daysOfWeek": [
             "So",
             "Mo",
             "Di",
             "Mi",
             "Do",
             "Fr",
             "Sa"
         ],
         "monthNames": [
             "Jan",
             "Feb",
             "Mär",
             "Apr",
             "Mai",
             "Jun",
             "Jul",
             "Aug",
             "Sep",
             "Okt",
             "Nov",
             "Dez"
         ],
            "firstDay": 1,
            "applyLabel": "anwenden",
            "cancelLabel": "stornieren"
        },
        "startDate": "10/10/2020",
        "drops": "up",

    }, function(start) {
      console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ')");
    });
});

$(function () {
    $('.ferien-date').daterangepicker({
        "timePicker": false,
        "locale": {
         "format": "DD.MM.YYYY",
         "daysOfWeek": [
             "So",
             "Mo",
             "Di",
             "Mi",
             "Do",
             "Fr",
             "Sa"
         ],
         "monthNames": [
             "Jan",
             "Feb",
             "Mär",
             "Apr",
             "Mai",
             "Jun",
             "Jul",
             "Aug",
             "Sep",
             "Okt",
             "Nov",
             "Dez"
         ],
            "firstDay": 1,
            "applyLabel": "anwenden",
            "cancelLabel": "stornieren"
        },
        "startDate": "10/10/2020",
        "endDate": "16/10/2020",
        "drops": "up",

    }, function(start, end, label) {
      console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });
});



//Feiertage append
var d=1;
$(document).on('click', '.feiertage-row-add', function(e) {
    //alert('opening');
    d=parseInt(d)+1;
    console.log('testing'+d);
    $("#Feiertage").append('<div id="Feiertage-row'+d+'"><div class="row"><div class="col-md-4"><input type="text" class="feiertage-date" class="form-control"></div><div class="col-md-8"><div class="form-group"><div class="input-group"><input type="text" class="form-control" placeholder="Betreff"><div class="input-group-append"><div class="input-group-text feiertage-row-remove" data-id="Feiertage-row'+d+'"><i class="lnr-circle-minus"></i> löschen</div></div></div></div></div></div></div>');
});

$(document).on('click', '.feiertage-row-remove', function(e) {

  var thiz = $(this);
  var remove_id = $(thiz).attr("data-id");
   console.log("Remove"+remove_id);
  $("#"+remove_id).remove();

});

//Ferien append
var d=1;
$(document).on('click', '.ferien-row-add', function(e) {
    //alert('opening');
    d=parseInt(d)+1;
    console.log('testing'+d);
    $("#ferien").append('<div id="ferien-row'+d+'"><div class="row"><div class="col-md-4"><input type="text" class="ferien-date" class="form-control"></div><div class="col-md-8"><div class="form-group"><div class="input-group"><input type="text" class="form-control" placeholder="Betreff"><div class="input-group-append"><div class="input-group-text feiertage-row-remove" data-id="ferien-row'+d+'"><i class="lnr-circle-minus"></i> löschen</div></div></div></div></div></div></div>');
});

$(document).on('click', '.ferien-row-remove', function(e) {

  var thiz = $(this);
  var remove_id = $(thiz).attr("data-id");
   console.log("Remove"+remove_id);
  $("#"+remove_id).remove();

});

//Filiale edit

$(document).on('click', '.filialeInfoEditTirger', function () {
    $('.filialeInfoEdit').show();
    $('.filialeInfoEditHide').hide();
    $(this).hide();
    $('.filialeInfoSave').show();
});

$(document).on('click', '.filialeInfoSave', function () {
    $('.filialeInfoEdit').hide();
    $('.filialeInfoEditHide').show();
    $(this).hide();
    $('.filialeInfoEditTirger').show();
});

$(document).on('click', '.openingHoursEditTirger', function () {
    $('.openingHoursEdit').show();
    $('.openingHoursHide').hide();
    $(this).hide();
    $('.openingHoursSave').show();
});

$(document).on('click', '.openingHoursSave', function () {
    $('.openingHoursEdit').hide();
    $('.openingHoursHide').show();
    $(this).hide();
    $('.openingHoursEditTirger').show();
});

$(document).on('click', '.feiertageEditTirger', function () {
    $('.feiertageEdit').show();
    $('.feiertageHide').hide();
    $(this).hide();
    $('.feiertageSave').show();
});

$(document).on('click', '.feiertageSave', function () {
    $('.feiertageEdit').hide();
    $('.feiertageHide').show();
    $(this).hide();
    $('.feiertageEditTirger').show();
});

$(document).on('click', '.ferienEditTirger', function () {
    $('.ferienEdit').show();
    $('.ferienHide').hide();
    $(this).hide();
    $('.ferienSave').show();
});

$(document).on('click', '.ferienSave', function () {
    $('.ferienEdit').hide();
    $('.ferienHide').show();
    $(this).hide();
    $('.ferienEditTirger').show();
});

$(document).on('click', '.nav-link', function () {
    $('#navbarNavDropdown').removeClass('show');
});

$(document).on('click', '.ToggleMenu', function () {
    $('.left-sidebar').addClass('active');
});
$(document).on('click', '.menuToggleClose', function () {
    $('.left-sidebar').removeClass('active');
});
