function calcScoreSum(table){
  let res=0;
  for(const name in table.fen.players){
    res+=table.fen.players[name].score;
  }
  return res;
}
function clearMain() { clearEvents(); mClear('dMain'); mClear('dTitle'); }
function disableButton(b){mClass(b,'disabled')}
function disableUI(){mShield('dGameDiv');}
function INTERRUPT() {
	//console.log('new table!',getNow())
  clearEvents();

  // DA.Tprev = T; T = null;
  // delete DA.stopAutobot;
}
async function sendMergeTable(o,cond='merge') { 
  if (nundef(o)) {
    let table = Cliendata.table;
    let name = getUname();
    let id = table.id;
    o={name,id,table};
  }else if (nundef(o.name)){
    let table = o;
    let name = getUname();
    let id = table.id;
    o={name,id,table};
  }
  let table =  await mPostRoute(`${cond}Table`, o); 
  if (!isDict(table)) {console.log('from server',table); return;}
  await showTable(table);
}
async function sendRaceError(table,name,errors=1){

  let data = {
    id: table.id,
    name,
    errors,
    olist: [
      { keys: ['fen', 'players', name, 'score'], val: table.fen.players[name].score - errors },
      { keys: ['fen', 'players', name, 'errors'], val: valf(table.fen.players[name].errors, 0) + errors }
    ]
  }
  let res = await sendMergeTable(data, 'race');
}
async function sendRaceStepScore(table, name, score = 1, olist = []) {
  let step = table.step + 1;

  olist.push({ keys: ['step'], val: step });
  olist.push({ keys: ['fen', 'players', name, 'score'], val: table.fen.players[name].score + score });

  let data = { id: table.id, name, step, olist };
  let res = await sendMergeTable(data, 'race');
}


