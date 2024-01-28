onload = start;

async function start() { test0(); } 

async function test0(){
	//keep it simple!
	await prelims();

	console.log('M',M,'\nServerdata',Serverdata,'\nClientdata',Clientdata,'\nDA',DA,Session,TO,window.TO)
	//for(s of ['M Serverdata Clientdata DA TO Session Z UI']) conslog(s)
	//console.log('M',M,'\nServerdata',Serverdata,'\nClientdata',Clientdata,'\nDA',DA)
}

async function prelims(){
	Serverdata = await mGetRoute('session'); //session ist: users,config,
	Info = await mGetYaml('../assets/info.yaml');
	await loadCollections();
	loadPlayerColors();

	//sockInit();


}
