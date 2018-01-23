// Some super simple heuristics
const is = {
  mobile: 'ontouchstart' in document.documentElement && window.innerWidth < 900,
  desktop: !('ontouchstart' in document.documentElement) && window.innerWidth > 900
};

// Add language tag to the code for print
const regName = /lang(uage)?\-/;
const hasName = name => regName.test(name);
const map = { js: 'javascript', jade: 'pug' };
[].slice.call(document.querySelectorAll('pre code')).forEach(function(pre){
  if (!regName.test(pre.className)) return;
  let name = pre.className.split(/\s+/).filter(hasName)[0].replace(regName, '');
  pre.parentNode.setAttribute('data-language', name in map ? map[name] : name);
});

// Display the proper part in the TOC
const tocLinks = u('.toc [href]');
if (is.desktop) {
  tocLinks.filter(el => {
    return u(el).attr('href').split('#')[0] === window.location.pathname;
  }).parent().addClass('active');
}

// Build the search
if (u('article.documentation').length) {
  const base = el => u(el).attr('href').split('#')[0];
  const unique = (value, i, all) => all.indexOf(value) === i;
  const searchLinks = tocLinks.nodes.map(base).filter(unique);
  const all = {};
  const headings = {};
  Promise.all(searchLinks.map(link => fetch(link).then(res => res.text()).then(html => {
    u('<div>').html(html).find('article.documentation h1, article.documentation h2, article.documentation h3, article.documentation h4').each(el => {
      if (el.id) {
        if (el.nodeName === 'H1') {
          headings[`${link}`] = u(el).text();
        } else {
          headings[`${link}#${el.id}`] = u(el).text();
        }
      }
    });
    all[link] = u('<div>').html(html).find('article.documentation .main').text().toLowerCase();
  }))).then(() => {

    const search = term => {
      if (!term) {
        u('.search').removeClass('active');
        u('.searchbox').html('<ul></ul>');
        u('.toc > ul').removeClass('hidden');
        return;
      }
      u('.toc > ul').addClass('hidden');
      u('.search').addClass('active');
      const value = term.toLowerCase();
      u('.searchbox').html('<ul></ul>');
      const found = [];
      for (let link in headings) {
        if (headings[link].toLowerCase().includes(value)) {
          found.push(link.split('#')[0]);
          u('.searchbox ul').append(`<li><a href="${link}">★ ${headings[link]}</a></li>`);
        }
      }
      let extra = false;
      for (let link in all) {
        if (all[link].includes(value) && !found.includes(link)) {
          if (!extra) {
            u('.searchbox ul').append('<li class="tip">Also mentioned here:</li>');
          }
          extra = true;
          u('.searchbox ul').append(`<li><a href="${link}">${link}</a></li>`);
        }
      }
      u('.searchbox a').on('click', e => {
        u('.search').removeClass('active');
        u('.search').first().value = '';
        u('.searchbox').html('<ul></ul>');
        u('.toc > ul').removeClass('hidden');
      });
    };

    const initial = u('.search').first().value;
    if (initial) {
      search(initial);
    }
    // Autofocus only on desktop
    if (is.desktop) {
      u('.search').first().focus();
    }
    u('.search').on('input', e => {
      search(e.target.value);
    });
    u('.searchform').handle('submit', e => {
      search(u('.search').first().value);
      u('.searchbox a').first().click();
    });
  });
}

u('.main h2, .main h3, .main h4, .main h5').each(el => {
  const path = `${window.location.pathname.split('#')[0]}#${el.id}`;
  u(el).html(`<a href="${path}"><span class="self">#</span>${u(el).html()}</a>`);
});



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

// Syntax highlighting changes vertical align. This makes it to scroll back
// to the current hash (if any) after page load+highlight
const hash = window.location.hash;
if (hash && u(hash).length) {
  u(hash).scroll();
}

// Show more/less when clicking the chevron
u('.toc .more').handle('click', e => {
  const container = u(e.currentTarget).closest('li');
  const child = container.find('ul').nodes[0];
  const height = container.hasClass('active') ? 0 : child.scrollHeight;
  child.style.maxHeight = height + 'px';
  container.toggleClass('active');
});

// Go to the appropriate part of the page when clicking an internal link
// Manual event delegation
u('article').on('click', e => {
  if (e.target.nodeName !== 'A') return;
  const href = u(e.target).attr('href');
  if (!href) return;
  const [url, hash] = href.split('#');

  // If it is the current URL just go to the top
  if (url === window.location.pathname && !hash) {
    e.preventDefault();
    u('body').scroll();
    history.replaceState(null, null, window.location.pathname);
    return;
  }

  // If it is an internal link go to that part
  if ((!url || url === window.location.pathname) && u('#' + hash).length) {
    e.preventDefault();
    u('#' + hash).scroll();
    history.replaceState(null, null, '#' + hash);
  }
});



// Google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-63739359-2', 'auto');
ga('send', 'pageview');


// Hopefully avoid email scrapping
setTimeout(function() {
  u('a.email').attr('href', 'mailto:public' + '@francisco.i' + 'o?subject=server.js');
}, 2000);
