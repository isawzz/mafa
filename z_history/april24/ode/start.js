onload = start;

async function start() { TESTING = true; await prelims(); }
//async function start() { TESTING = true; test75_showColors(); }

async function test75_showColors(){
  let di = await mGetYaml(`../assets/dicolor.yaml`); // alle hex sind unique!!! das ist gut!
	let d = clearBodyDiv({padding:12}); //{ gap: 10 }); mFlexWrap(d);
  for(const bucket in di){
    let list = dict2list(di[bucket]);
    let clist=[];
    for(const c of list){
      let o=w3color(c.value);
      //console.log('c',c)
      o.name = c.id;
      o.hex = c.value;
      clist.push(o);
    }

    let sorted = sortByFunc(clist,x=>-x.lightness); //(10*x.lightness+x.sat*100));
    //console.log(sorted[0]); return;

    mDom(d,{},{html:`<br>${bucket}<br>`})
    showPaletteNames(d,sorted);
    
  }
}
async function prelims_old() {
  ColorThiefObject = new ColorThief();//console.log(ColorThiefObject);
  let t1 = performance.now();
  Serverdata = await mGetRoute('session'); //session ist: users,config,events
  let t2 = performance.now();
  await loadAssets();
  let t4 = performance.now();
  sockInit();
  UI.nav = showNavbar();
  UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
  UI.dTitle = mBy('dTitle');
  let t5 = performance.now();
  window.onkeydown = keyDownHandler;
  window.onkeyup = keyUpHandler;
  DA.funcs = { button96: button96() }; //implemented games!
  for (const gname in Serverdata.config.games) {
    if (isdef(DA.funcs[gname])) continue;
    DA.funcs[gname] = defaultGameFunc();
  }
  await switchToUser(localStorage.getItem('username'));
}
async function prelims() {
  let html = `
	<div style="position:fixed;width:100%;z-index:20000">
		<div id="dNav" class="nav p10"></div>
		<div id="dMessage" style='height:0px;padding-left:10px' class="transh"></div>
	</div>
	<div id="dBuffer" style="height:32px;width:100%"></div>
	<div id="dExtra" class="p10hide"></div>
	<div id="dTitle"></div>
	<div id="dPage" style="display:grid;grid-template-columns: auto 1fr auto;">
		<div id="dLeft" class="h100 over0 translow">
		</div>
		<div id="dMain"></div>
		<div id="dRight" class="h100 over0 translow"></div>
	</div>
	<d id="dBottom"></d>
  
  `;
  document.body.innerHTML = html;
  ColorThiefObject = new ColorThief();//console.log(ColorThiefObject);
  let t1 = performance.now();
  Serverdata = await mGetRoute('session'); //session ist: users,config,events
  let t2 = performance.now();
  await loadAssets();
  let t4 = performance.now();
  sockInit();
  UI.nav = showNavbar();
  UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
  UI.dTitle = mBy('dTitle');
  let t5 = performance.now();
  window.onkeydown = keyDownHandler;
  window.onkeyup = keyUpHandler;
  DA.funcs = { button96: button96() }; //implemented games!
  for (const gname in Serverdata.config.games) {
    if (isdef(DA.funcs[gname])) continue;
    DA.funcs[gname] = defaultGameFunc();
  }
  await switchToUser(localStorage.getItem('username'));
}
function defaultGameFunc() {
  function setup(table) { let fen = { players: table.players, turn: [table.owner] }; delete table.players; }
  function present(dParent, table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
  async function activate(table) { console.log('activate for', getUname()) }
  function checkGameover(table) { return false; }
  async function hybridMove(table) { console.log('hybrid moves for', getUname()) }
  async function botMove(table) { console.log('robot moves for', getUname()) }
  async function stepComplete(table, o) { console.log(`integrate if step complete for ${table.friendly}`); }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
