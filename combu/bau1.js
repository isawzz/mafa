async function onclickNATIONS() {
	
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml'); 
	showTitle('NATIONS!!!');
	await loadImageAsync('../assets/games/nations/civs/civ_japan.png', mDom('dMain', {}, { tag: 'img' }));



}
