
function dbQuery(db, q, dParent) {
	try {
		const result = db.exec(q);
		// console.log('result',result)
		// return result;
		const output = result.map(({ columns, values }) => {
			return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
		}).join('\n\n');
		if (isdef(dParent)){
			dParent = toElem(dParent)
			dParent.textContent = output || 'Query executed successfully.';
		}
		return output;
	} catch (error) {
		dParent.textContent = 'Error executing SQL: ' + error.message;
		return null;
	}

}

function sidebarHome() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 });
	let gap = 5;
	UI.commands.showSchema = mCommand(d, 'showSchema', 'DB Structure'); mNewline(d, gap);
}
async function onclickSql(){console.log('hallo')}
async function onclickExecute(){
	dbQuery(DB,UI.ta.value,'dPre');
}
function sidebarSql() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 });
	let gap = 5;
	//UI.commands.showSchema = mCommand(d, 'showSchema', 'DB Structure'); mNewline(d, gap);
}

//stubs
async function updateExtra(){}

