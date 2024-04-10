
function createCountdownG(dParent, styles={}, ms=3000, callback=null) {
	removeCountdownG();
	if (isEmpty(styles)) styles = {display:'inline',fz:40,fg:'white',bg:'gray'}; //{ w: 80, maleft: 10, fg: 'red', weight: 'bold' };
  let dCountdown = mDom(dParent, styles, {id:'dCountdown'});
  let cd = DA.countdown = new SimpleTimer(dCountdown, 1000, null, ms, callback);
  cd.start();
  return cd;
}
function removeCountdownG(){if (isdef(DA.countdown)) { DA.countdown.clear(); DA.countdown.elem.remove(); DA.countdown = null; }}














