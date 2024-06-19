
function extractSpecies(s){
	//console.log(s)
	s = s.toLowerCase();
	let words = toWords(s);
	if (words.length <= 2) {s=s.replace('suborder','');s=s.replace('genus','');return s.trim(); }

	s=s.replace(' x ',', ');
	if (s.includes('hybrid')) return s;

	if (s.includes('including')) return arrTake(toWords(stringAfter(s,'including')),2).join(' ');

	if (s.includes('suborder')) return wordAfter(s,'suborder');

	//if (slower.includes('(')) return 

	let firstTwo = arrTake(words,2).join(' '); //console.log(slower);
	return firstTwo;
}

