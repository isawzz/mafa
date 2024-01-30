onload = start;

async function start() { test0(); } 

async function test0(){
	//keep it simple!
	await prelimsFast();

	//showNavbar(); return;

	//jetzt kommt die UI dran!
	//modular waer besser: menuAdd,menuRemove, menuEnable,menuDisable,menuActivate,menuClose
	//eine menubar hat 3 bereiche: r,m,l
	// nav:  dNav, 'dNav', 
	//nav koennte sein {div:mBy('dNav'), }
	//let titles = ['add', 'collections', 'NATIONS', 'plan', 'play', 'colors'];

	let nav = mDom('dNav', { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
  let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
  let [l,m,r] = [mDom(nav, stflex), mDom(nav, stflex), mDom(nav, stflex)];

	menuAdd(l,'home')

	UI.nav={div:nav,dLeft:l,dMiddle:m,dRight:r};

	
 
	//showNavbar();
}

async function prelimsFast(){
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
	for(s of 'Clientdata DA Items M Serverdata Session Socket TO U UI Z'.split(' ')) conslog(s)

	console.log(`session:${Math.round(t2-t1)} \nload:${Math.round(t3-t2)} \nfast load:${Math.round(t4-t3)} \nsock:${Math.round(t5-t4)}`)
	console.log(`total prelims time:${Math.round(t5-t1)}`);

}
