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
function transparency(){
  var top = document.documentElement.scrollTop || document.body.scrollTop;
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

// Google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-63739359-2', 'auto');
ga('send', 'pageview');
