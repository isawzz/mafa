
// function onsockNewTable(x) {
//   let table = x.table;
//   //let tables = x.tables;
//   //Serverdata.tables = tables;
//   console.log('::SOCK new table:', table);
//   showTables();
// }
async function onsockDeleteTable(x) {
  //console.log('x',x)
  Serverdata.tables = x.tables;
  //console.log('::SOCK deleteTable:', tables);
  let [me,table,menu]=[Clientdata.curUser,Clientdata.curTable,Clientdata.curMenu]; console.log('SOCK deleteTable',me,menu,table);
  //if ()
  showTables()
}
async function onsockTable(x) {
  let table = x.table;
  //let tables = x.tables;
  //Serverdata.tables = tables;
  console.log('::SOCK table:', table);
  if (Clientdata.curMenu == 'play'){
    if (table.status == 'started' && table.fen.turn.includes(Clientdata.curUser)) await showTable(table,Clientdata.curUser);
    else await showTables();
  }
}
function onsockTurnUpdate(turn) {
  console.log('::SOCK turn:', turn);
  Clientdata.fen.turn = turn;
  instructionUpdate();
  hourglassUpdate();
  tabtitleUpdate();
}






