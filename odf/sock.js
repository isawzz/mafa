async function onsockReceiveMove(o) {
  let [e, mlist] = [o.event, o.moves];
  console.log('___ onsockReceiveMove', e.step, e.name, e.ts, mlist); return;
  let [id, friendly, name, move, type, step, turn, ts] = [e.id, e.friendly, e.name, e.move, e.type, e.step, e.turn, e.ts];
  let table = Clientdata.table;
  if (!table || table.id != id) { console.log(`not playing at table ${id}`); return; }

  let func = DA.funcs[table.game];
  //console.log('...process',type,turn,friendly);
  //somebody moved but fen has not changed

  //checkIfStepComplete
  // if (type == 'r1'){

  // 	table.step=step;
  // 	//stepComplete
  // 	//console.log('game',table.game)
  // 	func.stepComplete(table,o)
  // }

}
async function onsockMerged(x){
  //console.log('merged',x); //x is table
  let me = getUname();
  let isSameTableOpen = lookup(Clientdata, ['table', 'id']) == x.id;
  if (!isSameTableOpen) return;
  INTERRUPT();
  showTable(x);

}
async function onsockTable(x) {
  //console.log('::SOCK table:'); //, 'new',x,'old', Clientdata.table);
  let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];

  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts

  //not in turn and no spacific table open: showTables
  let me = getUname();
  let isSameTableOpen = lookup(Clientdata, ['table', 'id']) == id;
  //console.log('isSameTableOpen',isSameTableOpen,lookup(Clientdata,['table','id']),id)

  if (isSameTableOpen || isNew && turn.includes(me) && !Clientdata.table) return await showTable(id);

  if (!Clientdata.table) return await showTables();
}
async function onsockTables(x) {
  //console.log('::SOCK tables:', x, Clientdata.table); //return;

  if (Clientdata.curMenu == 'play' && !Clientdata.table) showTables();
  else if (Clientdata.curMenu == 'play') {
    let id = Clientdata.table.id;
    let exists = x.find(t => t.id == id);
    //console.log('exists',id,exists)
    if (nundef(exists)) await switchToMenu(UI.nav, 'play');
  }
}
async function sendMyMove(move, type) {
  let name = getUname();
  let table = Clientdata.table;
  let id = table.id;
  let friendly = table.friendly;
  let step = table.step;
  let turn = table.fen.turn;
  //console.log('___ sendMyMove',step,name); //type,move,turn)
  let res = await mPostRoute('move', { id, friendly, name, move, type, step, turn });
  //console.log('result',res)
  // sockPostMove(table, me, o);
}
async function sendMoveComplete(fen) {
  let name = getUname();
  let table = Clientdata.table;
  let id = table.id;
  let friendly = table.friendly;
  let step = table.step;
  let turn = fen.turn;
  //console.log('___ sendMoveComplete',step,name); //type,move,turn)
  let res = await mPostRoute('moveComplete', { id, friendly, name, fen, step, turn });
  //console.log('result',res)
  // sockPostMove(table, me, o);
}
function sockInit() {
  let server = getServerurl();
  Socket = io(server);
  Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
  Socket.on('event', onsockEvent);
  Socket.on('message', showChatMessage);
  Socket.on('merged', onsockMerged);
  Socket.on('table', onsockTable);
  Socket.on('tables', onsockTables);
  Socket.on('move', onsockReceiveMove);
  Socket.on('superdi', onsockSuperdi);
}
function sockPostUserChange(oldname, newname) {
  Socket.emit('userChange', { oldname, newname });
}
