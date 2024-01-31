function showNavbar() {
  let titles = ['add', 'collections', 'NATIONS', 'plan', 'play', 'colors'];
  let funcNames = titles.map(x => `onclick${capitalize(x)}`);
  let nav = UI.nav = mNavbar('dNav');
  let [dl, dr] = [nav.dleft, nav.dright];
  let title = mDom(dl, { fz: 20, cursor:'pointer' }, { onclick:onclickHome, html: 'COMBU', classes: 'title' });
  let d2 = mDom(dl);
  for (let i = 0; i < titles.length; i++) {
    let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
  }
  dUser = mDom(dr, {}, { id: 'dUser' });
  let t2 = toggleAdd('right', 'arrow_down_long', dr, { hpadding: 9, vpadding: 5 }, { w: 0 }, { w: 300 });
}
function mNavbar(dParent, styles, pageTitle, titles, funcNames) {
  let ui = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
  mClass(dParent, 'nav');
  let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
  let [dl, dr] = [mDom(ui, stflex), mDom(ui, stflex)];
  function activate(ev) {
    close();
    let links = document.getElementsByClassName('nav-link');
    let inner = isDict(ev) ? ev.target.innerHTML:ev;
    let el = Array.from(links).find(x => x.innerHTML == inner);
    if (el) mClass(el, 'activeLink');
  }
  function close() {
    closeApps();
    let links = document.getElementsByClassName('nav-link');
    for (const el of links) { mClassRemove(el, 'activeLink'); }
  }
  function disable() {
    let links = Array.from(document.getElementsByClassName('nav-link'));
    for (const w of arguments) {
      let el = Array.from(links).find(x => x.innerHTML == w);
      if (isdef(el)) mClass(el, 'disabled');
    }
  }
  function enable() {
    let links = document.getElementsByClassName('nav-link');
    for (const w of arguments) {
      let el = Array.from(links).find(x => x.innerHTML == w);
      if (isdef(el)) mClassRemove(el, 'disabled');
    }
  }
  return { activate, close, disable, enable, ui, dleft: dl, dright: dr };
}
