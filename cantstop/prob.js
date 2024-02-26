
function calcp2DiceSum(n) {
	//guenstige / moegliche
	//calc moegliche: 
	//trial: roll 2 dice, outcome: sum is n
	let guenst = 0, moeg = 0;
	for (let d1 = 1; d1 <= 6; d1++) {
		for (let d2 = 1; d2 <= 6; d2++) {
			let sum = d1 + d2;
			if (sum == n) guenst++;
			moeg++;
		}

	}
	return { guenst, moeg, p: guenst / moeg };
}
function calcp3DiceSumOf2(n) {
	//guenstige / moegliche
	//calc moegliche: 
	//trial: roll 3 dice, outcome: sum  of any 2 is n
	let guenst = 0, moeg = 0;

	for (let d1 = 1; d1 <= 6; d1++) {
		for (let d2 = 1; d2 <= 6; d2++) {
			for (let d3 = 1; d3 <= 6; d3++) {
				let sum1 = d1 + d2;
				let sum2 = d1 + d3;
				let sum3 = d2 + d3;
				if (sum1 == n || sum2 == n || sum3 == n) guenst++;
				moeg++;
			}
		}
	}
	return { guenst, moeg, p: guenst / moeg };
}
function calcp4DiceSumOf2(n) {
	//guenstige / moegliche
	//calc moegliche: 
	//trial: roll 3 dice, outcome: sum  of any 2 is n
	let guenst = 0, moeg = 0;

	for (let d1 = 1; d1 <= 6; d1++) {
		for (let d2 = 1; d2 <= 6; d2++) {
			for (let d3 = 1; d3 <= 6; d3++) {
				for (let d4 = 1; d4 <= 6; d4++) {

					let sums = [d1 + d2, d1 + d3, d1 + d4, d2 + d3, d2 + d4, d3 + d4];
					if (sums.includes(n)) guenst++;
					moeg++;
				}
			}
		}
	}
	return { guenst, moeg, p: guenst / moeg };
}
function calcp4DiceSumOf2AnyOf3(a,b,c) {
	//guenstige / moegliche
	//calc moegliche: 
	//trial: roll 3 dice, outcome: sum  of any 2 is n
	let guenst = 0, moeg = 0;

	for (let d1 = 1; d1 <= 6; d1++) {
		for (let d2 = 1; d2 <= 6; d2++) {
			for (let d3 = 1; d3 <= 6; d3++) {
				for (let d4 = 1; d4 <= 6; d4++) {

					let sums = [d1 + d2, d1 + d3, d1 + d4, d2 + d3, d2 + d4, d3 + d4];
					if (sums.includes(a) || sums.includes(b) || sums.includes(c)) guenst++;
					moeg++;
				}
			}
		}
	}
	return { guenst, moeg, p: guenst / moeg };
}












