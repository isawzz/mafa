async function showGameMenuPlayerDialog__(name,shift=false){
	let lastname = DA.lastName;
	DA.lastName = name;

	if (DA.playerList.includes(lastname)) collectPlayerOptions('dPlayerOptions', lastname, gamename);
	if (!DA.playerList.includes(name)) setPlayerNotPlaying(da, name, gamename);
	else setPlayerPlaying(da, name, gamename);
}















