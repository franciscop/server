// Avoid email scrapping
setTimeout(function() {
  var email = 'mailto:public' + '@francisco.i' + 'o?subject=server.js';
  [].slice.call(document.querySelectorAll('a.email')).forEach(function(el){
    el.setAttribute('href', email);
  });
}, 2000);

// Add language tag to the code for print
[].slice.call(document.querySelectorAll('pre code')).filter(function(pre){
  return /lang(uage)?\-/.test(pre.className);
}).forEach(function(pre){
  var name = pre.className.split(/\s+/).filter(function(name){
    return /lang(uage)?\-/.test(name);
  })[0].replace(/lang(uage)?\-/, '');
  var map = { js: 'javascript', jade: 'pug' };
  if (name in map) name = map[name];
  pre.parentNode.setAttribute('data-language', name);
});


var nav = u('nav');
var toc = u('.toc');
let offset = 10;
const breakpoint = 900;
var navheight = parseFloat(getComputedStyle(u('nav').first()).getPropertyValue('height'));
const resize = () => {
  if (!toc.length) return;

  if (window.innerWidth > breakpoint) {
    u('.toc [href]').filter(el => {
      return u(el).attr('href').split('#')[0] === window.location.pathname;
    }).parent().addClass('active');
    var articlepaddingtop = parseFloat(getComputedStyle(u('article').first()).getPropertyValue('padding-top'));
    var h2paddingtop = parseFloat(getComputedStyle(u('.toc h2').first()).getPropertyValue('padding-top'));
    u('.toc').first().style.top = (articlepaddingtop + navheight - offset) + 'px';
    u('.toc').first().style.maxHeight = 'calc(100% - ' + (articlepaddingtop + navheight + offset + 20) + 'px)';
    u('.toc').first().style.width = (parseFloat(getComputedStyle(u('.toc').parent().first()).getPropertyValue('width')) - 10) + 'px';
    // console.log(getComputedStyle(u('.toc').parent().first()).getPropertyValue('width'));
  } else {
    toc.removeClass('fixed');
    u('.toc').first().style.top = 'auto';
    u('.toc').first().style.maxHeight = '1000px';
    u('.toc').first().style.width = 'auto';
  }
};
resize();
window.onresize = resize;

function transparency(){
  var top = document.documentElement.scrollTop || document.body.scrollTop;
  var height = "innerHeight" in window
    ? window.innerHeight
    : document.documentElement.offsetHeight;

  if (toc.length) {
    toc.toggleClass('fixed', u('article').size().top < navheight - offset && window.innerWidth > breakpoint);
  }

  if (u('article.documentation').length) {
    if (u('nav.transparent').length) {
      u('nav').removeClass('transparent');
    }
    return;
  }

  if (top > 80) {
    if (nav.hasClass('transparent')) {
      nav.removeClass('transparent');
    }
  } else {
    if (!nav.hasClass('transparent')) {
      nav.addClass('transparent');
    }
  }
}
u(document).on('scroll', transparency);
transparency();
setTimeout(function(){ nav.removeClass('instant'); }, 200);


// Remove an incorrect "get" that there was highlighted
Prism.hooks.add('after-highlight', function(env){
  u('span.token.keyword').each(el => {
    if (el.innerHTML === 'get') {
      if (el.nextElementSibling && el.nextElementSibling.innerHTML === '(') {
        u(el).replace('<span class="token function">get</span>');
      } else {
        u(el).replace('get');
      }
    }
    if (el.innerHTML === 'delete') {
      if (el.previousElementSibling && el.previousElementSibling.innerHTML === '.') {
        u(el).replace('delete');
      }
    }
    if (el.innerHTML === 'public') u(el).replace('public');
  });
});

u('.toc .more').handle('click', e => {
  const container = u(e.currentTarget).closest('li');
  const child = container.find('ul').nodes[0];
  const height = container.hasClass('active') ? 0 : child.scrollHeight;
  child.style.maxHeight = height + 'px';
  container.toggleClass('active');
});

u('a').on('click', e => {
  const href = u(e.currentTarget).attr('href');
  if (!href) return;
  const [url, hash] = href.split('#');
  // console.log(url, window.location.pathname, u('#' + hash));
  if ((!url || url === window.location.pathname) && u('#' + hash).length) {
    e.preventDefault();
    u('#' + hash).scroll();
  }
});



// Google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-63739359-2', 'auto');
ga('send', 'pageview');
