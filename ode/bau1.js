
function crazu() {
	function setup(table) {

	}

	function stats(table) {  }

	function present(table) { return []; }

	async function activate(table, items) {
		await instructionStandard(table, 'may pick your initial cards'); //browser tab and instruction if any
		for (const item of items) {
			let d = iDiv(item);
			d.onclick = wsOnclickCard;
		}
	}
	return { setup, present, stats, activate };
}

