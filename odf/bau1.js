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
