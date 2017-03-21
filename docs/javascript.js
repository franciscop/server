setTimeout(function() {
  var email = 'mailto:public' + '@francisco.i' + 'o?subject=server for Node.js';
  document.querySelector('a.email').setAttribute('href', email);
}, 2000);



// TODO: replace this analytics mess with a simpler thing. I just want to know
// what pages are visited! But don't want to compromise users
(function(){
  // Only track if doNotTrack === '0'
  if (navigator.doNotTrack === '1') {
    return console.log("Honoring your doNotTrack. Keep making the web awesome ♥");
  }
  if (navigator.doNotTrack !== '0') {
    return console.log("No doNotTrack detected so we won't track you. Keep making the web awesome ♥");
  }
  (function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(RegExp(b+"=([^&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.desiredHash||"",e.title,j.pathname+j.search)))}catch(m){}var k,h;window.mixpanel=a;a._i=[];a.init=function(b,c,f){function e(b,a){var c=a.split(".");2==c.length&&(b=b[c[0]],a=c[1]);b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,
    0)))}}var d=a;"undefined"!==typeof f?d=a[f]=[]:f="mixpanel";d.people=d.people||[];d.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);b||(a+=" (stub)");return a};d.people.toString=function(){return d.toString(1)+".people (stub)"};k="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
    for(h=0;h<k.length;h++)e(d,k[h]);a._i.push([b,c,f])};a.__SV=1.2;b=e.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}})(document,window.mixpanel||[]);
  mixpanel.init("2fe06c49792c1a5a11c6c962d9f71750");
})();

// To honor doNotTrack and not making all the JS explode
if (typeof mixpanel !== 'undefined') {
  mixpanel.track("visit page");
  [1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 50, 100, 150, 200, 300, 400, 500, 1000].forEach(function(time){
    // Copy by value
    (function(time){
      setTimeout(function(){
        mixpanel.track('stay ' + time + ' seconds');
      }, time * 1000);
    })(time);
  });
  if (document.querySelector('.hero a.button')) {
    mixpanel.track_links('.hero a.button', 'main action');
  }
  mixpanel.track_links('nav .menu a', 'click nav menu');
  mixpanel.track_links('nav .brand', 'click brand');
  mixpanel.track_links('article a', 'click article link');
}
