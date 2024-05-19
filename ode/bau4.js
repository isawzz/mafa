//#region button96 game

function button96() {

	function setup(table) {
		//console.log('setup',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
		}
		fen.cards = [1, 2, 3];
		fen.deck = range(4, table.options.numCards); //[4, 5, 6, 7, 8, 9, 10];
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table) {
		let [fen, players] = [table.fen, table.players];
		let pending = table.pending; delete table.pending;
		let [name, move] = [pending.name, pending.move];

		let best = arrMinMax(fen.cards).min; //check if the card is the best
		if (move == best) {
			players[name].score += 1;
			removeInPlace(fen.cards, move);
			let cardlist = deckDeal(fen.deck, 1); 
			if (isEmpty(cardlist)) {
				table.winners = getPlayersWithMaxScore(table);
				table.status = 'over';
				table.turn = [];
			} else {
				fen.cards.push(cardlist[0]);
				DA.pendingChanges = [['players', name, 'score'], ['fen']];
			}
		} else {
			players[name].score -= 1;
			DA.pendingChanges = [['players', name, 'score']];
		}
	}
	function present(table) {
		let fen = table.fen;
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
			item.feno = card;
		}
		return items;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d);
		}
	}
	async function activate(table, items) {
		let myTurn = isMyTurn(table);

		let styleInstruction = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
		let dinst = mBy('dInstruction'); mClear(dinst);

		if (!myTurn) {
			mDom(dinst, styleInstruction, { html: `waiting for: ${getTurnPlayers(table)}` });
			return;
		}

		styleInstruction.maleft = -30;
		let instruction = 'must click a card';
		html = `
				${get_waiting_html()}
				<span style="color:red;font-weight:bold;max-height:25px">You</span>
				&nbsp;${instruction};
				`;
		mDom(dinst, styleInstruction, { html });

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item);
		}

		if (amIHuman(table)) return;

		//bot move activation
		TO.bot = setInterval(async () => {
			//console.log('BOT!!!',table.step);
			let list = sortBy(items, x => x.feno); //console.log(list);
			let item = list[0]; //rChoose(items);
			await onclickCard(table, item);
		}, rNumber(1000, 4000));

	}

	async function onclickCard(table, item) {
		mShield('dTable', { bg: 'transparent' });

		//highlight clicked card
		let d = iDiv(item);
		let ms = rChoose(range(300, 400));
		mClass(d, 'framedPicture'); TO.hallo = setTimeout(() => mClassRemove(d, 'framedPicture'), ms);
		try { await mSleep(ms); } catch (err) { return; } //console.log("ERR", err); 

		let id = table.id;
		let name = getUname();
		let move = item.feno;
		let step = table.step;
		let olist = [			{ keys: ['pending'], val: { name, move } },		];
		if (isdef(DA.pendingChanges)) {
			for (const klist of DA.pendingChanges) {
				olist.push({ keys: klist, val: lookup(table, klist) });
			}
		}

		let o = { id, name, olist, step };
		let best = arrMinMax(table.fen.cards).min;

		if (move == best) o.stepIfValid = step + 1; // nur 1 kann punkt kriegen pro runde

		let res = await mPostRoute('olist', o); //console.log(res);
	}

	return { setup, resolvePending, present, stats, activate }; 
}

//#endregion


