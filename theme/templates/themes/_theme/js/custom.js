/////////////////////////////////////////
// BITTE IMMER HIER EDITIEREN          //
// und nur die Datei *.min.* einbinden //
/////////////////////////////////////////
$(function() {

  //////////////
  // Slicknav //
  //////////////
  $('#menu').slicknav();

  //////////////////////
  // flexslider Start //
  //////////////////////
  // $('.flexslider').flexslider({'directionNav':false});
  // -->moved to package sb_slider


  //////////////////////////////////////////
  // Programmseite SprungmarkenNavigation //
  //////////////////////////////////////////
  if ($('#ankernav').length) {
    var $ankernav = $('#ankernav');
    var list      = '';
    // alle h2 durchlaufen
    // den Text in <li><a> sammeln
    // Sprungmarken id="" in den H2 setzen und den href entsprechend
    $('h2','main').each(function(index, el) {
      var $el  = $(el);
      var text = $el.text();
      $el.attr('id', 'ueberschrift'+index);
      list    += '<li><a href="#ueberschrift'+index+'">'+text+'</a></li>';
    });
    $ankernav.append('<ul>'+list+'</ul>');
  };

  ///////////////////////////////////////
  // Fachforen Filter
  ///////////////////////////////////////
  function filterFachforen(val) {

    // get val through GET vars
    if(typeof val == 'undefined') {
      //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
      var urlParams;
      var val = [];
      (window.onpopstate = function () {
          var match,
              pl     = /\+/g,  // Regex for replacing addition symbol with a space
              search = /([^&=]+)=?([^&]*)/g,
              decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
              query  = window.location.search.substring(1);

          urlParams = {};
          while (match = search.exec(query))
             urlParams[decode(match[1])] = decode(match[2]);
      })();

      if(typeof urlParams.ffs != 'undefined' && urlParams.ml == 'on') {
        val = urlParams.ffs.split('-');
      }
    }

    //do something
    if(val && val.length > 0) {
      $('.fachforen article').hide();
      for (var i = 0; i < val.length; i++) {
        $('.fachforen .foren_' + val[i]).show();
      };
    } else if(val && val.length == 0 && urlParams.ml == 'on') {
      $('.fachforen article').hide();
    } else {
      $('.fachforen article').show();
    }
  }

  $('#ffs').on('change', function(event) {
    event.preventDefault();
    var result = [$(this).val()];
    if(result != '') {
      filterFachforen(result);
    } else {
      filterFachforen(false);
    }
  });

  filterFachforen();


  /////////////////////////////////////////
  // Merkliste hinzufuegen und entfernen //
  /////////////////////////////////////////
  $('.fachforen .forum_normal').on('click', '.mlbtn', function(event) {
    event.preventDefault();
    event.stopPropagation();

    var $this        = $(this);
    var url          = $this.attr('href');
    var $counters    = $('.ffmlcount');
    var currentCount = parseInt($counters.first().text(),10);

    var fakeCounter = function() {
      if($this.hasClass('mlremove')) {
        currentCount = currentCount - 1;
      }
      if($this.hasClass('mladd')) {
        currentCount = currentCount + 1;
      }
      $counters.each(function(){
        $(this).text(currentCount);
      });
    }

    $this.parent().find('.mlbtn').toggle();

    $.ajax({
        url: url,
        type: 'get',
        success: fakeCounter,
        error: function(data) {
          $this.text('Ein Fehler ist aufgetreten.')
        }
      });

  });

  ////////////////////////////////////////////
  // Fachforen Alle Details anzeigen Button //
  ////////////////////////////////////////////
  if($('.fachforen .filterbox').length > 0){
    var textOn = 'Details für alle Fachforen zeigen';
    var textOff = 'Details für alle Fachforen verbergen';
    var $el = $('<a class="showmore all_show" href="#fachforen" data-text-on="' + textOn + '" data-text-off="' + textOff +'">' + textOn + '</a>');
    $('.fachforen .filterbox').before($el);
  }
  ///////////////////////////////////////
  // Details anzeigen einzeln und alle //
  ///////////////////////////////////////
  $('.fachforen').on('click', '.showmore', function(event) {
    event.preventDefault();
    event.stopPropagation();

    /* Elemente Cache */
    var $a                = $(this);
    var $article          = $a.parents('article');
    var $fachforenWrapper = $('main.fachforen');
    var textOn            = $a.data('text-on') || "Details anzeigen";
    var textOff           = $a.data('text-off') || "Details verbergen" ;

    // Toggle Classes alle Foren
    if($a.hasClass('all_show')){
      $a
        .removeClass('all_show')
        .addClass('all_hide')
        .html(textOff);
      $fachforenWrapper
        .find('article')
        .addClass('open')
        .removeClass('closed');
      return; // wenn gemacht, dann aussteigen
    }
    else if($a.hasClass('all_hide')){
      $a
        .removeClass('all_hide')
        .addClass('all_show')
        .html(textOn);
      $fachforenWrapper
        .find('article')
        .addClass('closed')
        .removeClass('open');
      return; // wenn gemacht, dann aussteigen
    }

    // Toggle Classes fuer einzelenes Forum
    if($article.hasClass('closed')){

      $article.removeClass('closed').addClass('open');
      $a.html(textOff);
    }
    else{
      $article.removeClass('open').addClass('closed');
      $a.html(textOn);
    }
    return;
  });


});
