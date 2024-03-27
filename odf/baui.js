
function cBlank(dParent, styles = {}, opts={}) {
  if (nundef(styles.h)) styles.h = 100;
  if (nundef(styles.w)) styles.w = styles.h * .7;
  if (nundef(styles.bg)) styles.bg = 'white';
  styles.position = 'relative';
  let [w, h, sz] = [styles.w, styles.h, Math.min(styles.w, styles.h)];
  if (nundef(styles.rounding)) styles.rounding = sz * .05;
	addKeys({className:'card'},opts);
  let d = mDom(dParent, styles, opts);
  let item = mItem(null, { div: d }, { type: 'card', sz: sz, rounding: styles.rounding });
  copyKeys(styles, item);
	addKeys(opts,item);
  return item;
}
function cLandscape(dParent, styles = {}, opts={}) {
  if (nundef(styles.w)) styles.w = 100;
  if (nundef(styles.h)) styles.h = styles.w * .65;
  return cBlank(dParent, styles, opts);
}
function cPortrait(dParent, styles = {}, opts={}) {
  if (nundef(styles.h)) styles.h = 100;
  if (nundef(styles.w)) styles.w = styles.h * .7;
  return cBlank(dParent, styles, opts);
}
function cRound(dParent, styles = {}, opts={}) {
  styles.w = valf(styles.w, 100);
  styles.h = valf(styles.h, 100);
  styles.rounding = '50%';
  return cBlank(dParent, styles, opts);
}













