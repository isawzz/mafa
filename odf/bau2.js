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
