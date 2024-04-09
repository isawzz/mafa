async function onsockTable(x) {
  //console.log('::SOCK table:'); //, 'new',x,'old', Clientdata.table);
  let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];

  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts

  //not in turn and no spacific table open: showTables
  let me=getUname();
  let isSameTableOpen = lookup(Clientdata,['table','id']) == id;
	//console.log('isSameTableOpen',isSameTableOpen,lookup(Clientdata,['table','id']),id)

  if (isSameTableOpen || isNew && turn.includes(me) && !Clientdata.table) return await showTable(id); 

  if (!Clientdata.table) return await showTables(); 
}


function sockInit() {
  let server = getServerurl();
  Socket = io(server);
  Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
  Socket.on('event', onsockEvent);
  Socket.on('message', showChatMessage);
  Socket.on('table', onsockTable); 
  Socket.on('tables', onsockTables); 
  Socket.on('move', onsockReceiveMove); 
  Socket.on('superdi', onsockSuperdi);
}
function sockPostUserChange(oldname, newname) {
  Socket.emit('userChange', { oldname, newname });
}
async function onsockTables(x) {
  //console.log('::SOCK tables:', x, Clientdata.table); //return;

  if (Clientdata.curMenu == 'play' && !Clientdata.table) showTables();
  else if (Clientdata.curMenu == 'play'){
    let id = Clientdata.table.id;
    let exists=x.find(t=>t.id == id);
    //console.log('exists',id,exists)
    if (nundef(exists)) await switchToMenu(UI.nav,'play'); 
  } 
}
