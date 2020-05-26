
    
 // DropDown
 // 
 $('.select').on('click','.placeholder',function(){
  var parent = $(this).closest('.select');
  if ( ! parent.hasClass('is-open')){
    parent.addClass('is-open');
    $('.select.is-open').not(parent).removeClass('is-open');
  }else{
    parent.removeClass('is-open');
  }
}).on('click','ul>li',function(){
  var parent = $(this).closest('.select');
  parent.removeClass('is-open').find('.placeholder').text( $(this).text() );
  parent.find('input[type=hidden]').attr('value', $(this).attr('data-value') );
});


$('#custom_options').on('click', 'li', function() {
    var choosenValue = $(this).data('value'),
        choosenText = $(this).text();
    $('select').val(choosenValue).prop('selected', true);
    $("#current_option")
        .data('value', choosenValue)
        .find('span')
        .text(choosenText);
        $( "#forSortCat" ).submit();
   });



// Shop menu

function diplay_hide (blockId)

{ 
  if ($(blockId).css('display') == 'none') 
  { 
    $(blockId).animate({height: 'show'}, 500); 
  } 
  else 
  {     
    $(blockId).animate({height: 'hide'}, 500); 
  }
} 
///////////
// Input //
///////////


$('input').blur(function(){
  if($(this).val().length !== 0) {
    $(this).addClass('filled');
  }
  else {
    $(this).removeClass('filled');
  }
});



//* Шапка
$('a[href^="#"]').on('click', function(event) {

  var $target = $(this.getAttribute('href'));

  if($target.length) {
    event.preventDefault();
    $('html, body').stop().animate({
      scrollTop: $target.offset().top
    }, 750, 'easeInOutQuad');
  }
});


$('.nav-toggle').on('click', function() {
  $(this).toggleClass('open');
  $('.menu-left').toggleClass('collapse');
});

$('.menu-left a').on('click', function() {
  $('.nav-toggle').removeClass('open');
  $('.menu-left').removeClass('collapse');
});


var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
  didScroll = true;
});

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $(this).scrollTop();

  if(Math.abs(lastScrollTop - st) <= delta)
    return;

  if (st > lastScrollTop && st > navbarHeight){
    $('header').removeClass('show-nav').addClass('hide-nav');
    $('.nav-toggle').removeClass('open');
    $('.menu-left').removeClass('collapse');
  } else {
    if(st + $(window).height() < $(document).height()) {
      $('header').removeClass('hide-nav').addClass('show-nav');
    }
  }

  lastScrollTop = st;
}

// Canvas Фон

var Canvas = document.getElementById('canvas');
var ctx = Canvas.getContext('2d');

var resize = function() {
  Canvas.width = Canvas.clientWidth;
  Canvas.height = Canvas.clientHeight;
};
window.addEventListener('resize', resize);
resize();

var elements = [];
var presets = {};

presets.o = function (x, y, s, dx, dy) {
  return {
    x: x,
    y: y,
    r: 12 * s,
    w: 5 * s,
    dx: dx,
    dy: dy,
    draw: function(ctx, t) {
      this.x += this.dx;
      this.y += this.dy;

      ctx.beginPath();
      ctx.arc(this.x + + Math.sin((50 + x + (t / 10)) / 100) * 3, this.y + + Math.sin((45 + x + (t / 10)) / 100) * 4, this.r, 0, 2 * Math.PI, false);
      ctx.lineWidth = this.w;
      ctx.strokeStyle = 'rgba(93, 156, 236, 0.41)';
      ctx.stroke();
    }
  }
};

presets.x = function (x, y, s, dx, dy, dr, r) {
  r = r || 0;
  return {
    x: x,
    y: y,
    s: 20 * s,
    w: 5 * s,
    r: r,
    dx: dx,
    dy: dy,
    dr: dr,
    draw: function(ctx, t) {
      this.x += this.dx;
      this.y += this.dy;
      this.r += this.dr;

      var _this = this;
      var line = function(x, y, tx, ty, c, o) {
        o = o || 0;
        ctx.beginPath();
        ctx.moveTo(-o + ((_this.s / 2) * x), o + ((_this.s / 2) * y));
        ctx.lineTo(-o + ((_this.s / 2) * tx), o + ((_this.s / 2) * ty));
        ctx.lineWidth = _this.w;
        ctx.strokeStyle = c;
        ctx.stroke();
      };

      ctx.save();

      ctx.translate(this.x + Math.sin((x + (t / 10)) / 100) * 5, this.y + Math.sin((10 + x + (t / 10)) / 100) * 2);
      ctx.rotate(this.r * Math.PI / 180);

      line(-1, -1, 1, 1, '#ededef');
      line(1, -1, -1, 1, '#ededef');

      ctx.restore();
    }
  }
};

for(var x = 0; x < Canvas.width; x++) {
  for(var y = 0; y < Canvas.height; y++) {
    if(Math.round(Math.random() * 8000) == 1) {
      var s = ((Math.random() * 5) + 1) / 10;
      if(Math.round(Math.random()) == 1)
        elements.push(presets.o(x, y, s, 0, 0));
      else
        elements.push(presets.x(x, y, s, 0, 0, ((Math.random() * 3) - 1) / 10, (Math.random() * 360)));
    }
  }
}

setInterval(function() {
  ctx.clearRect(0, 0, Canvas.width, Canvas.height);

  var time = new Date().getTime();
  for (var e in elements)
    elements[e].draw(ctx, time);
}, 10);




// Menu  TAb

// Анимация
(function() {
  [].slice.call(document.querySelectorAll('.menu')).forEach(function(menu) {
    var menuItems = menu.querySelectorAll('.menu__link'),
    setCurrent = function(ev) {
      ev.preventDefault();

      var item = ev.target.parentNode; 

      if( classie.has(item, 'menu__item--current') ) {
        return false;
      }
      classie.remove(menu.querySelector('.menu__item--current'), 'menu__item--current');
      classie.add(item, 'menu__item--current');
    };

    [].slice.call(menuItems).forEach(function(el) {
      el.addEventListener('click', setCurrent);
    });
  });

  [].slice.call(document.querySelectorAll('.link-copy')).forEach(function(link) {
    link.setAttribute('data-clipboard-text', location.protocol + '//' + location.host + location.pathname + '#' + link.parentNode.id);
    new Clipboard(link);
    link.addEventListener('click', function() {
      classie.add(link, 'link-copy--animate');
      setTimeout(function() {
        classie.remove(link, 'link-copy--animate');
      }, 300);
    });
  });
})(window);

$('.who').bind("change keyup input click", function() {
    if(this.value.length >= 2){
        $.ajax({
            type: 'post',
            url: "https://akkaunt.net/ajaxsearch", //Путь к обработчику
            data: {'referal':this.value},
            response: 'text',
            success: function(data){
                $(".list").html(data); //Выводим полученые данные в списке
           }
       })
    }
});
