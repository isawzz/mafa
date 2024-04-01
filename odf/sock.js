
function sockInit() {
  let server = getServerurl();
  Socket = io(server);
  Socket.on('deleteTable', onsockDeleteTable); //x => console.log('::SOCK table:', x));
  Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
  Socket.on('event', onsockEvent);
  Socket.on('message', showChatMessage);
  Socket.on('table', onsockTable); //x => console.log('::SOCK table:', x));
  Socket.on('tables', onsockTables); //x => console.log('::SOCK table:', x));
  Socket.on('move', onsockMove); //x => console.log('::SOCK move:', x));
  //Socket.on('newTable', onsockNewTable); //x => console.log('::SOCK table:', x));
  Socket.on('superdi', onsockSuperdi);
  Socket.on('turnUpdate', onsockTurnUpdate); //x => console.log('::SOCK table:', x));
  // Socket.on('userChange', x => console.log('::SOCK userChange:', x));
  // Socket.on('update', x => console.log('::SOCK update:', x));
}
function sockPostMove(id, name, move) {
  Socket.emit('move', { id, name, move });
}
function sockPostUserChange(oldname, newname) {
  Socket.emit('userChange', { oldname, newname });
}
async function onsockDeleteTable(x) {
  //console.log('x',x)
  Serverdata.tables = x.tables;
  //console.log('::SOCK deleteTable:', tables);
  let [me, table, menu] = [getUname(), Clientdata.curTable, Clientdata.curMenu]; 
  console.log('SOCK deleteTable', me, menu, table);
  showTables()
}
async function onsockMove(x) {
  console.log('::SOCK move:', x);
}
async function onsockTable(x) {
  console.log('::SOCK table:', 'new',x,'old', Clientdata.table);
  let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];

  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts

  //not in turn and no spacific table open: showTables
  let me=getUname();
  let isSameTableOpen = lookup(Clientdata,['table','id']) == id;

  if (isSameTableOpen || isNew && turn.includes(me) && !Clientdata.table) return await showTable(id); 

  if (!Clientdata.table) return await showTables(); 
}
async function onsockTables(x) {
  console.log('::SOCK tables:', x, Clientdata); //return;

  if (Clientdata.curMenu == 'play' && !Clientdata.curTable) showTables();
}
function onsockTurnUpdate(turn) {
  console.log('::SOCK turn:', turn);
  Clientdata.table.fen.turn = turn;
  //instructionUpdate();
  //hourglassUpdate();
  //tabtitleUpdate();
}
