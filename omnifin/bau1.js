async function menuOpenOverview() {
	let side = UI.sidebar = mSidebar();
	let gap = 5;
	UI.commands.showSchema = mCommand(side.d, 'showSchema', 'DB Structure'); mNewline(side.d, gap);
	UI.commands.transactions = mCommand(side.d, 'transactions', 'transactions'); mNewline(side.d, gap);
	UI.commands.transactions1 = mCommand(side.d, 'transactions1', 'transactions1'); mNewline(side.d, gap);
	UI.commands.flex = mCommand(side.d, 'flex', 'flex-perks'); mNewline(side.d, gap);
	mDom('dMain', { }, { id: 'dT' });
	mDom('dMain', { wmax: '1000' }, { tag: 'pre', id: 'dPre' });
}
function onclickShowSchema() {
	dbQuery(DB, `SELECT sql FROM sqlite_master WHERE type='table';`, 'dPre')
}
function onclickFlex() { let q = get_q3(); let res = dboutput(q); mBy('dPre').textContent = res; }
function onclickTransactions() { let q = get_q2(); let res = dboutput(q); mBy('dPre').textContent = res; }
function onclickTransactions1() { 
	let q = get_q2(); 
	mClear('dPre');

	let res = dbtable(q,mBy('dT')); 
}

async function menuOpenSql() {
	let side = UI.sidebar = mSidebar();

	let d = mDom('dMain', { w: window.innerWidth - side.wmin - 20, box: true, padding: 10 });

	let ta = UI.ta = mDom(d, { 'white-space': 'pre-wrap', w100: true, 'border-color': 'transparent' }, { tag: 'textarea', id: 'taSql', rows: 4, value: 'select * from transactions' });
	ta.addEventListener('keydown', function (event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			onclickExecute();
		}
	});
}
async function onclickExecute() {
	let res = dbq(UI.ta.value);
	console.log(res)
}

