onload = start;

async function start() { test31_colorjs(); }

async function test31_colorjs(){
	await prelims();
	UI.nav.activate('colors');
	onclickColors();
	//onclickSchedule();
	//onclickColors(); //showColors('dExtra');
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
		await userLoad();



	}

}



