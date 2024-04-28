//#region showTable
async function showTable(table) {
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];
  let me = getUname();

  clearMain(); 

}
async function ____showTable(table) {
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
  let func = DA.funcs[table.game];
  let me = getUname();

  clearMain(); //INTERRUPT();

  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
  else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

  Clientdata.table = table; //console.log(table);
  TPrev = T; T={table,me};

  let d=T.dMain=mBy('dMain');//mClass(d,'wood')
  let dInstruction = T.dInstruction=mDom(d,{className:'instruction'},{html:`Waiting for ${table.fen.turn.join(', ')}`});  
  mCenterFlex(dInstruction);
  // let dTitle=T.dTitle=mDom(d,{fz:'2em',weight:'bold',padding:'10'},{html:table.friendly,classes:'title'});
  let dTitle=T.dTitle=mDom(d,{},{html:table.friendly});
  let dGameover=T.dGameover=mDom(d);
  let dStats=T.dStats=mDom('dMain');
  let dOpenTable=T.dOpenTable=mDom(d);
  // showRibbon(d,"this is the game!")
  //showMessage('HALLO this is a message');
  let dt=testUpdateTestButtons(dTitle); mStyle(dt,{matop:4});

  func.present(T);
  func.showStats(T);
  mRise(d);

  
}
async function ___showTable_rest(table){
  //showTitle(`${table.friendly}`);
  mStyle('dTitle',{display:'flex',justify:'space-between'})
  mDom('dTitle',{fz:'2em',weight:'bold',maleft:10,display:'inline'},{html:table.friendly,classes: 'title'});
  let dOver=mDom('dMain',{},{id:'dGameover'})


  
  T = func.present('dMain', table, me); //console.log('TPrev',TPrev,'T',T);
  func.showStats(T);
  mRise('dMain');

  if (TESTING) testUpdateTestButtons();

  if (table.status == 'over') return showGameover(table,dOver);
  else if (func.checkGameover(table)) return await sendMergeTable(table);
  
  if (!table.fen.turn.includes(me)) {staticTitle(table); return;}

  animatedTitle();
  
  let playmode = getPlaymode(table, me); 
  if (playmode == 'bot') return await func.botMove(T);
  else return await func.activate(T);
}
//#endregion 

//#region button96
function button96() {
  function setup(table) {
    let fen = {};
    fen.players = {};
    for (const name in table.players) {
      let pl = fen.players[name] = table.players[name];
      pl.color = getUserColor(name)
      pl.score = 0;
    }
    fen.number = 0;
    fen.plorder = jsCopy(table.playerNames);
    fen.turn = jsCopy(table.playerNames);
    delete table.players;
    return fen;
  }
  function checkGameover(table) {
    let score_sum = calcScoreSum(table);
    console.log('___check score sum',score_sum);
    if (score_sum >= 5) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  function present(T) {
    // //assumes that me is player at this table!!!
    // //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    // //mClear(dParent);
    // let dInstruction = mDom(dParent,{className:'instruction'},{html:`Waiting for ${table.fen.turn.join(', ')}`});
    // let dStats = mDom(dParent);
    // let div = mDom(dParent, { margin: 12, align: 'center' }, { id: 'dGameDiv' }); //for shield! 

    // let bYes = mDom(div, { fz: 100, wmin: 200, margin:10, className: 'button' }, { tag: 'button', html: `Step:${table.step}` });
    // let bNo = mDom(div, { fz: 100, wmin: 200, margin:10,className: 'button' }, { tag: 'button', html: `Error!` });

    // if (nundef(name)) name=getUname(); //eingeloggter user perspective is default!

    // return { div, bYes, bNo, dInstruction, dStats, table, name };
  }
  function showStats(T){ button96Stats(T);}
  async function activate(T) {
    dInstruction.innerHTML = "click one of the buttons!"
    T.bYes.onclick = () => button96OnclickYes(T, true);
    T.bNo.onclick = () => button96OnclickNo(T, true);
  }
  async function botMove(T) {
    TO.button = setTimeout(() => button96BotMove(T), rChoose([1000, 2000, 3000]));
  }
  return { setup, activate, checkGameover, present, showStats, botMove };
}
function button96Stats(T){
  let [fen,name,dStats]=[T.table.fen,T.name,T.dStats];
  let layout = 'rowflex';
  let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
  let player_stat_items = uiTypePlayerStats(fen, name, dStats, layout, style)
  for (const plname in fen.players) {
    let pl = fen.players[plname];
    let item = player_stat_items[plname];
    if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
    playerStatCount('star', pl.score, d);
  }
}
async function button96OnclickYes(T, direct = false) {
  let b = T.bYes;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceStepScore(T.table, T.name);
}
async function button96OnclickNo(T, direct = false) {
  let b = T.bNo;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceError(T.table,T.name);
}
async function button96BotMove(T) {
  if (coin(80)) await button96OnclickYes(T); else await button96OnclickNo(T);
} 
//#endregion