
function someOtherPlayerName(table){
	return rChoose(arrWithout(table.playerNames,getUname()));
}
async function correctUsersDeleteKeyImageKey(){
  for(const name in Serverdata.users){
    let u=Serverdata.users[name];
    delete u.key;
    delete u.imageKey;
    await postUserChange(u,true);
  }
}
