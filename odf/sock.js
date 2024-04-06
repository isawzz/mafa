
function sockInit() {
  let server = getServerurl();
  Socket = io(server);
  // Socket.on('deleteTable', onsockDeleteTable); //x => console.log('::SOCK table:', x));
  Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
  Socket.on('event', onsockEvent);
  Socket.on('message', showChatMessage);
  Socket.on('table', onsockTable); //x => console.log('::SOCK table:', x));
  Socket.on('tables', onsockTables); //x => console.log('::SOCK table:', x));
  Socket.on('move', onsockReceiveMove); //onsockMove); //x => console.log('::SOCK move:', x));
  //Socket.on('moveComplete', onsockReceiveMoveComplete); //onsockMove); //x => console.log('::SOCK move:', x));
  //Socket.on('newTable', onsockNewTable); //x => console.log('::SOCK table:', x));
  Socket.on('superdi', onsockSuperdi);
  //Socket.on('turnUpdate', onsockTurnUpdate); //x => console.log('::SOCK table:', x));
  // Socket.on('userChange', x => console.log('::SOCK userChange:', x));
  // Socket.on('update', x => console.log('::SOCK update:', x));
}
function _sockPostMove(id, name, move) {
  assertion(false,'sockPostMove shouldnt be called!!!')
  //Socket.emit('move', { id, name, move });
}
function sockPostUserChange(oldname, newname) {
  Socket.emit('userChange', { oldname, newname });
}
async function onsockTable(x) {
  //console.log('::SOCK table:', 'new',x,'old', Clientdata.curTable);
  let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];

  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts

  //not in turn and no spacific table open: showTables
  let me=getUname();
  let isSameTableOpen = lookup(Clientdata,['curTable','id']) == id;

  if (isSameTableOpen || isNew && turn.includes(me) && !Clientdata.curTable) return await showTable(id); 

  if (!Clientdata.curTable) return await showTables(); 
}
async function onsockTables(x) {
  //console.log('::SOCK tables:', x, Clientdata.curTable); //return;

  if (Clientdata.curMenu == 'play' && !Clientdata.curTable) showTables();
  else if (Clientdata.curMenu == 'play'){
    let id = Clientdata.curTable.id;
    let exists=x.find(t=>t.id == id);
    //console.log('exists',id,exists)
    if (nundef(exists)) await switchToMenu(UI.nav,'play'); 
  } 
}
function _onsockTurnUpdate(turn) {
  //console.log('::SOCK turn:', turn);
  Clientdata.curTable.fen.turn = turn;
  //instructionUpdate();
  //hourglassUpdate();
  //tabtitleUpdate();
}
