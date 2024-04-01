function sendMyMove(o) {
  let me = getUname(); 
  let table = Clientdata.table.id;
	console.log('sendMyMove',me,Clientdata)
  sockPostMove(table, me, o);
}


















