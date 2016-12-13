// Avoid a transition when the page loads
setTimeout(() => {
  delete dom.html.class.initial;
}, 100);

let tableofcontents = () => {
  dom['[data-headers]'].forEach(header => {
    let headers = header.getAttribute('data-headers') || 'h1, h2, h3';
    let selector = headers.split(/\s*,\s*/).map(h => h + ':not(.noindex)').join(', ');

    dom['[data-headers] ul, [data-headers] ol'].html = `
      ${dom[selector].map(node => `
        <li class="${node.nodeName === 'H2' ? 'primary' : 'secondary'}">
          <a class="pseudo button" href="#${node.id}">
            ${node.innerHTML}
          </a>
        </li>
      `).join('')}
    `;
  });
}

// Supermenu
let supermenu = (smoothscroll = true) => {
  function shouldScrollOrNot(){
    u('body').toggleClass('no-scroll', u('nav > input').first().checked);
  }
  u('nav > input').on('change', shouldScrollOrNot);
  shouldScrollOrNot();

  u('article h2').each(function(node){
    u(node).attr('id', node.id);
  });
  var lessonName = u('h1').html();
  var main = '<a href="#" class="pseudo button"><strong>' + lessonName + '</strong></a>';

  u('[data-headers]').on('click', 'a', function(e){
    u('nav > input').first().checked = false;
    u('body').removeClass('no-scroll');

    if (smoothscroll) {
      e.preventDefault();
      var to = u(u(e.currentTarget).attr('href'));
      if (to.length) {
        to.scroll();
      }
    }
  });

  // Change the title of the section
  var pagesize = u('body').size().height / 2;
  let last;
  function setupSection () {
    var current = u('article h2').filter(function(node){
      return u(node).size().top < pagesize;
    }).last() || u('h1').first();
    var section = u(current).html() || u('h1').html();
    if (u('h1').length && u('h1').size().top > 0 && u('h1').size().top < pagesize) {
      section = u('h1').html();
      var hash = u(current).attr('id');
    }
    if (!last || !current || current != last) {
      last = current;
      u('nav header').html(section);
      dom['[data-headers] [href]'].class.active = false;
      if (current) {
        dom[`[href="#${current.id}"]`].class = 'active';
      }
    }
  }
  u(document).on('scroll', setupSection);
  setupSection();
}

if (dom.aside.length)
  dom.body.class = 'withaside';

dom['article[data-src]'].forEach(article => {
  let url = article.getAttribute('data-src');
  fetch(url).then(res => res.text()).then(md => {
    article.innerHTML = marked(md);
    dom.class.loading.class.loading = false;
    Prism.highlightAll();
    tableofcontents();

    supermenu();
  });
});

dom['common-mark, .common-mark'].forEach(el => {
  let lines = el.innerHTML
    .replace(/\&gt\;/g, '>')
    .replace(/\&lt\;/g, '<')
    .replace(/\&amp\;/g, '&').split('\n');
  let min = parseInt(el.getAttribute('spaces'));
  min = min || Math.min.apply(Math, lines  // Minimum of array
    .filter(n => !n.match(/^\s*$/))  // Only filled lines
    .map(line => line.match(/^\s*/)) // Get each space str
    .map(n => n[0].length)           // Count spaces
  );
  // Set the html as the parsed from markdown
  el.innerHTML = marked(lines.map(l => l.slice(min)).join('\n'));
});

tableofcontents();
