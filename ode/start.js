onload = start;

async function start() { TESTING = true; test53_clearReset(); }

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
}
async function test53_clearReset(){
  await loadAssets();
  let d=clearBodyReset100({bg:'skyblue',overy:'scroll'},{id:'dPage'});
  mClass(d,'wood');

}
async function test52(){
  await loadAssets();
  let d=clearBodyDiv({w:'100vw',h:'100vh'},{id:'dPage'});
  mStyle(d,{'background-blend-mode': 'normal','background-repeat':'repeat'})
  mDom(d,{},{id:'dTitle'});
  mDom(d,{},{id:'dMain'});
  d=mDom(d,{gap:4},{id:'dSamples'});mCenterFlex(d)
  showColors();
  let list='normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
  console.log('list',list.length)
  for(const [i,mode] of list.entries()){
    let id = `dSample${i}`;
    mDom(d,{border:'white',w:100,h:100,'background-blend-mode': mode,'background-repeat':'repeat'},{id});
  }
  // multiply screen overlay darken lighten
}
async function onclickColor(ev) {
  let c = ev.target.style.background; 
  console.log('c',c,typeof(c),isEmpty(c))
  if (!isEmpty(c)) c = colorHex(c);
  if (isEmpty(c)) {console.log('color EMPTY!',ev.target.style);}
  for(const i of range(0,9)){mBy(`dSample${i}`).style.backgroundColor=c;}
  mBy('dPage').style.backgroundColor = c;
}
async function onclickTexture(ev) {
  let texture = ev.target.style.backgroundImage;
  if (isEmpty(texture)) {console.log('color EMPTY!',ev.target.style);}
  for(const i of range(0,9)){
    mBy(`dSample${i}`).style.backgroundImage = texture;
    // mBy(`dSample${i}`).style.backgroundRepeat='repeat';
  }
  mBy('dPage').style.backgroundImage = texture;
}

//#region onclickColor orig
async function onclickColor_(ev) {
  let c = ev.target.style.background;
  c = colorHex(c);
  setColors(c,U.texture);
  U.color = c;
  await postUserChange();
}
async function onclickTexture_(ev) {
  let texture = ev.target.style.backgroundImage;

  let d=mBy('sample');
  d.style.backgroundImage = texture;
  d.style.backgroundRepeat='repeat';

  //setCssVar('--bgTexture',texture);
  //mClass('sample','wood')
  
  
	// console.log('texture',isEmpty(texture),texture);
	// texture = isEmpty(texture)?null:
  // U.texture = isEmpty(texture)?null:texture;
  // setColors(U.color,U.texture);
  // await postUserChange();
}
//#endregion

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
