function getCheckedRadios(rg) {
  let inputs = rg.getElementsByTagName('INPUT');
  let list = [];
  for (const ch of inputs) {
    if (ch.checked) list.push(ch.value);
  }
  return list;
}
function getNow() { return Date.now(); }
function getWaitingHtml(sz = 30) { return `<img src="../assets/icons/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function getTimestamp() { return Date.now(); }
function measureFieldset(fs) {
  let legend = fs.firstChild;
  let r = getRect(legend);
  let labels = fs.getElementsByTagName('label');
  let wmax = 0;
  for (const l of labels) {
    let r1 = getRect(l);
    wmax = Math.max(wmax, r1.w);
  }
  let wt = r.w;
  let wo = wmax + 24;
  let diff = wt - wo;
  if (diff >= 10) {
    for (const l of labels) { let d = l.parentNode; mStyle(d, { maleft: diff / 2 }); }
  }
  let wneeded = Math.max(wt, wo) + 10;
  mStyle(fs, { wmin: wneeded });
  for (const l of labels) { let d = l.parentNode; mStyle(l, { display: 'inline-block', wmin: 50 }); mStyle(d, { wmin: wneeded - 40 }); }
}
