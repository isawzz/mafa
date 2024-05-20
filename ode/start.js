onload = start;

async function start() { TESTING = true; await prelims(); }
async function start() { TESTING = true; test76_RESTART(); }

async function test78_switch() {
  let d = clearBodyDiv({ padding: 12 });
  let sw = mSwitch(d, 'sBot');
  console.log(sw);
  sw.onchange = onchangeBotSwitch;
}
async function test77_switch() {

  let d = clearBodyDiv({ padding: 12 });

  let html = `
      <label class="switch">
        <input type="checkbox" checked>
        <span class="slider round"></span>
      </label>
      `;
  d.innerHTML = html;
  // let d3=mDom(d,{className:'switch'},{tag:'label'});
  // let inp=mDom(d3,{},{tag:'input',type:'checkbox',checked:true});
  // let sp=mDom(d3,{className:'slider round'},{tag:'span'});
}
async function test76_RESTART() {
  await prelims();

  //await switchToOtherUser('mimi', 'felix');

  //await resetUsers();
  // await switchToUser('mimi');
  // await switchToMenu(UI.nav, 'settings');
  // await onclickSettAddTheme();

  //await switchToMenu(UI.nav, 'play');
  //await clickFirstTable();
  //await onclickSettBlendMode();
  //await switchToMainMenu('plan')

}
async function test75_showColors() {
  let di = await mGetYaml(`../assets/dicolor.yaml`); // alle hex sind unique!!! das ist gut!
  let d = clearBodyDiv({ padding: 12 }); //{ gap: 10 }); mFlexWrap(d);
  for (const bucket in di) {
    let list = dict2list(di[bucket]);
    let clist = [];
    for (const c of list) {
      let o = w3color(c.value);
      //console.log('c',c)
      o.name = c.id;
      o.hex = c.value;
      clist.push(o);
    }

    let sorted = sortByFunc(clist, x => -x.lightness); //(10*x.lightness+x.sat*100));
    //console.log(sorted[0]); return;

    mDom(d, {}, { html: `<br>${bucket}<br>` })
    showPaletteNames(d, sorted);

    //ok jetzt will ich hier onclick attechen das dann die color setzt, erstmal nur die color for simplicity!
    //und zugleich sollen all die anderen colors gesetzt werden in styles!


  }
}

async function prelims() {
  let html = `
    <div style="position:fixed;width:100%;z-index:20000">
      <div id="dNav" class="nav p10"></div>
      <div id="dMessage" style='height:0px;padding-left:10px' class="transh"></div>
    </div>
    <div id="dBuffer" style="height:32px;width:100%"></div>
    <div id="dExtra" class="p10hide nav"></div>
    <div id="dTitle"></div>
    <div id="dPage" style="display:grid;grid-template-columns: auto 1fr auto;">
      <div id="dLeft" class="h100 over0 translow nav">
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
  DA.funcs = { setgame: setgame(), button96: button96() }; //implemented games!
  for (const gname in Serverdata.config.games) {
    if (isdef(DA.funcs[gname])) continue;
    DA.funcs[gname] = defaultGameFunc();
  }
  await switchToUser(localStorage.getItem('username'), localStorage.getItem('menu'));
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

async function updateExtra() {
  mClear('dExtra');
  let d = mDom('dExtra');
  mStyle(d, { display: 'flex', justify: 'space-between' });
  let [left, right] = [mDom(d, { hpadding: 10 }, { id: 'dExtraLeft' }), mDom(d, {}, { id: 'dExtraRight' })];
  if (TESTING) await updateTestButtonsLogin();
}
async function updateTestButtonsLogin(names) {
  if (nundef(names)) names = ['amanda', 'felix', 'lauren', 'mimi', 'gul'];
  let d = mBy('dExtraRight'); mClear(d);
  let me = getUname();
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, async () => await switchToUser(name), d, { maright: 4, hpadding: 3, wmin: 50, className: 'button' });
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }
}
async function updateTestButtonsPlayers(table) {
  if (nundef(table)) table = T;
  assertion(table, "NOT TABLE IN updateTestButtonsPlayers")
  let d = mBy('dExtraRight'); mClear(d); //mFlexWrap(d);
  let me = getUname();
  let names = T.playerNames; //addIf(names,'mimi');
  //addIf(names,me);
  let dplayers = mDom(d);
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, async () => await switchToUser(name), dplayers, { maright: 4, hpadding: 3, wmin: 50, className: 'button' });
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }

  if (!table.playerNames.includes(me)) return;
  let dbotswitch=mDom(d,{align:'right',patop:10,gap:6},{html:'BOT'});mFlexLine(dbotswitch,'end')
  let oSwitch=mSwitch(dbotswitch,{},{id:'bot',val:amIHuman(table)?'':'checked'});
  let inp=oSwitch.inp;
  oSwitch.inp.onchange = onchangeBotSwitch;


}

