
async function mOnclick(menu) {
	UI.nav.activate(menu);
	if (isdef(menu)) await window[`onclick${capitalize(menu)}`](); //eval(`onclick${capitalize(menu)}()`);}
}
async function onclickHome() { UI.nav.activate(); await showDashboard(); }
async function onclickPlay() { 	showTables(); }
async function onclickTable(id) { await switchToTable(id); }
