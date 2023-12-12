
function extractTime(input) {
  // Regular expression to match a number between 0 and 23 followed by 'h' or ':' and the word up to the next whitespace
  const regex = /\b([0-9]|1[0-9]|2[0-3])[h:]\S*\b/g;

  // Match the pattern in the input string
  const match = input.match(regex);

  if (match) {
    // Remove the matched word from the input string
    const result = input.replace(regex, '').trim();
    // Return the removed word (including the full word up to the next whitespace) and the modified string
    return [match[0], result];
  } else {
    // Return an empty string and the original input if no match is found
    return ['', input];
  }
}


function showImage(key, dParent, styles = {}) {
  let o = M.superdi[key];
  if (nundef(o)) { console.log('showImage:key not found', key); return; }
  let [w, h] = [valf(styles.w, styles.sz), valf(styles.h, styles.sz)];
  if (nundef(w)) {
    mClear(dParent);
    [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
  } else {
    addKeys({ w: w, h: h }, styles)
    dParent = mDom(dParent, styles);
  }
  let [sz, fz, fg] = [.9 * w, .8 * h, valf(styles.fg, rColor())];
  let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', overflow: 'hidden' });
  mCenterCenterFlex(d1)
  let el = null;
  if (isdef(o.img)) {
    el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
  }
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  assertion(el, 'PROBLEM mit' + key);
  mStyle(el, { cursor: 'pointer' })
  return d1;
}


















