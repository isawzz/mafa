onload = start;

async function start() { test0(); }

async function test0() {
	await prelimsFast();

	showNavbar();

	//jetzt brauch ich einen user!!!!
	await switchToUser('felix')




}


async function prelimsFast() {
	let t1 = performance.now();
	Serverdata = await mGetRoute('session'); //session ist: users,config,

	let t2 = performance.now();

	// *** in prelims, uncomment the following lines and comment the line after t3 line! ***
	// await loadCollections();
	// loadPlayerColors();
	// let info = await mGetYaml('../assets/info.yaml');
	// addKeys(info,M);
	// M.c52 = await mGetYaml('../assets/c52.yaml');

	let t3 = performance.now();

	M = await mGetYaml('../odf/mnew.yaml'); //mnew includes natLoadAssets and c52!

	let t4 = performance.now();
	sockInit();
	let t5 = performance.now();

	//downloadAsYaml(M,'mnew');
	// for (s of 'Clientdata DA Items M Serverdata Session Socket TO U UI Z'.split(' ')) conslog(s)

	// console.log(`session:${Math.round(t2 - t1)} \nload:${Math.round(t3 - t2)} \nfast load:${Math.round(t4 - t3)} \nsock:${Math.round(t5 - t4)}`)
	// console.log(`total prelims time:${Math.round(t5 - t1)}`);

}
