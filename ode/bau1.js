async function showTable(table) {
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
  let func = DA.funcs[table.game];
  let me = getUname();

  INTERRUPT();

  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
  else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

  showTitle(`${table.friendly}`);
  Clientdata.table = table; //console.log(table);

  TPrev = T; T = func.present('dMain', table); //console.log('TPrev',TPrev,'T',T);
  mRise('dMain');

  if (TESTING) testUpdateTestButtons();

  if (table.status == 'over') return showGameover(table);
  else if (func.checkGameover(table)) return await sendMergeTable(table);
  
  if (!table.fen.turn.includes(me)) return;
  
  let playmode = getPlaymode(table, me); 
  if (playmode == 'bot') return await func.botMove(table, T, me);
  else return await func.activate(table, T, me);
}


