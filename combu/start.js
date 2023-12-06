onload = start;

async function start() { test35_light(); }

async function test35_light(){
	await prelims();
	UI.nav.activate('schedule'); onclickSchedule();

	//wie krieg ich das erste event?
	let evs=getEvents();
	let n=Object.values(evs).length;
	console.log('events for',U.name,evs,n)
	if (n<2) return;
	let e=Object.values(evs)[1];
	console.log('e',e)
	showEventOpen(e.id);
	// Example usage
	//onclick=openPopup;
	//let d=mPopup('Hallo','dMain',{})
	//M.playerColors.map(x=>console.log(x,colorHSL(x,true).l * 100,colorLum(x,true)))
}
async function test34_colorjs_YES(){
	await prelims();
	UI.nav.activate('schedule'); onclickSchedule();
}
async function prelims() {
	if (nundef(M.superdi)) {

		Serverdata = await mGetRoute('load', { config: true, session: true }); //console.log('Serverdata', Serverdata);
		await loadCollections();
		loadPlayerColors();

		let nav = UI.nav = mNavbar('dNav',{},'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
		nav.disable('play');

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		//mInsert(document.body, dTitle, 1);

		dUser = mDom(nav.ui, {}, { id: 'dUser' });
		//console.log('alles ok!')
		await userLoad();
	}
}



