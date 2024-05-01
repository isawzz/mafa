onload = start;

async function start() { TESTING = true; test54_dynBody(); }

async function test55_cleanUsers(){
  await prelims();
  let users = await mGetRoute('users');
  console.log('users',users);
  for(const name in users){
    let u=users[name];
    //u.texture = 
    //['button','button98','button97'].map(x=>delete u[x]);
    //await 
  }
}

async function test54_dynBody(){
  let html =`
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
  await prelims();
  U=await postUserChange({name:U.name,color:'blue',blend:'multiply'});
  await switchToMenu(UI.nav, 'colors');

  //console.log(U)
  //setTimeout(colorsUpdate,200)

}
async function test53_clearReset(){
  await loadAssets();
  let d=clearBodyReset100({bg:'skyblue',overy:'scroll'},{id:'dPage'});
  mClass(d,'wood');

}
async function test52(){
  await loadAssets();
  let d=clearBodyDiv({w:'100vw',h:'100vh'},{id:'dPage'});
  // mStyle(d,{'background-blend-mode': 'multiply','background-size':'cover'})
  // let d1=mDom(d,{border:'white',position:'absolute',w:500,h:320,left:700,top:100,'background-blend-mode': 'luminosity','background-size':'cover'},{id:'dPos'})
  mDom(d,{},{id:'dTitle'});
  mDom(d,{},{id:'dMain'});
  showColors();
  // d=mDom(d,{gap:4},{id:'dSamples'});mCenterFlex(d)
  // let list='normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
  // console.log('list',list.length)
  // for(const [i,mode] of list.entries()){
  //   let id = `dSample${i}`;
  //   mDom(d,{border:'white',w:100,h:100,'background-blend-mode': mode,'background-repeat':'repeat'},{id});
  // }
  // multiply screen overlay darken lighten
}

async function test51() {
  await prelims(); 
  //await switchToOtherUser('amanda','felix'); // 'diana');
  // await switchToMenu(UI.nav, 'play');
  // await clickFirstTable();
  //showThemeWood();
  console.log(UI.nav)
  await switchToMenu(UI.nav,'colors');
}

async function prelims() {
  ColorThiefObject = new ColorThief();
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
  function present(dParent,table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
  async function activate(table) { console.log('activate for', getUname()) }
  function checkGameover(table) { return false; }
  async function hybridMove(table) { console.log('hybrid moves for', getUname()) }
  async function botMove(table) { console.log('robot moves for', getUname()) }
  async function stepComplete(table, o) { console.log(`integrate if step complete for ${table.friendly}`); }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
