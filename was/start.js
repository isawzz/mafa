onload = start;

async function start() { test100_odf(); } //test70_game(); } //natCardsFinalProcessing(); } //test69_event(); } 

async function test100_odf(){
	Serverdata = await mGetRoute('session'); //session ist: users,config,
	Info = await mGetYaml('../assets/info.yaml');
	await loadCollections();
	loadPlayerColors();
	sockInit();

	console.log('M',M,'\nServerdata',Serverdata,'\nClientdata',Clientdata,'\nDA',DA,Session,TO,window.TO)

}







async function prelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session'); //session ist: users,config,
		Info = await mGetYaml('../assets/info.yaml');
		await loadCollections();
		loadPlayerColors();

		showNavbar();

		sockInit();

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })

		await switchToUser(localStorage.getItem('username'));  //danach ist U IMMER gesetzt!!!!
		await switchToMenu('home')

		//showChatWindow();

	}
}



