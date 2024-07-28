
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
  let dbotswitch = mDom(d, { align: 'right', patop: 10, gap: 6 }, { html: 'BOT' }); mFlexLine(dbotswitch, 'end')
  let oSwitch = mSwitch(dbotswitch, {}, { id: 'bot', val: amIHuman(table) ? '' : 'checked' });
  let inp = oSwitch.inp;
  oSwitch.inp.onchange = onchangeBotSwitch;


}


