
function clearMain() { staticTitle(); clearEvents(); mClear('dMain'); mClear('dTitle'); clearMessage(); }


async function instructionStandard(table,instruction){
	let myTurn = isMyTurn(table);

	let styleInstruction = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
	let dinst = mBy('dInstruction'); mClear(dinst);

	if (!myTurn) {
		mDom(dinst, styleInstruction, { html: `waiting for: ${getTurnPlayers(table)}` });
		staticTitle(table);
		return;
	} else animatedTitle();

	if (nundef(instruction)) return;

	styleInstruction.maleft = -30;
	//let instruction = 'must click a card';
	html = `
			${get_waiting_html()}
			<span style="color:red;font-weight:bold;max-height:25px">You</span>
			&nbsp;${instruction};
			`;
	mDom(dinst, styleInstruction, { html });

}
function lastWord(s){return arrLast(toWords(s));}
















