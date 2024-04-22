async function onsockMerged(x){
  //console.log('merged',x); //x is table
  //let me = getUname();
  let isSameTableOpen = lookup(Clientdata, ['table', 'id']) == x.id;
  if (!isSameTableOpen) return;
  await showTable(x);

}
async function onsockTable(x) {
  //console.log('::SOCK table:'); //, 'new',x,'old', Clientdata.table);
  let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];

  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts

  //not in turn and no spacific table open: _showTables
  let me = getUname();
  let isSameTableOpen = lookup(Clientdata, ['table', 'id']) == id;
  //console.log('isSameTableOpen',isSameTableOpen,'\nid',id,'\ntable?',isdef(Clientdata.table),'\nisNew',isNew,'\nturn',turn,'\nme',me)

  if (isSameTableOpen || isNew && turn.includes(me) && !Clientdata.table) return await showTable(id);

  if (!Clientdata.table) return await showTables('onsockTable');
}
async function onsockTables(x) {
  //console.log('::SOCK tables:', x, Clientdata.table); //return;

  if (Clientdata.curMenu == 'play' && !Clientdata.table) await showTables('onsockTables');
  else if (Clientdata.curMenu == 'play') {
    let id = Clientdata.table.id;
    let exists = x.find(t => t.id == id);
    //console.log('exists',id,exists)
    if (nundef(exists)) await switchToMenu(UI.nav, 'play');
  }
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
  Socket.on('superdi', onsockSuperdi);
}
function sockPostUserChange(oldname, newname) {
  Socket.emit('userChange', { oldname, newname });
}
