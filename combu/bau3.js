function uiTypeCalendar(dParent) {
	const [wcell,hcell, gap] = [140,100, 10];
	let outerStyles = {
		rounding: 4, patop: 4, pabottom: 4, weight: 'bold', box: true,
		paleft: gap / 2, w: wcell, hmin: hcell,
		bg: 'black', fg: 'white', cursor: 'pointer'
	}
	let innerStyles = { box: true, padding: 0, align: 'center', bg: 'beige', rounding: 4};//, w: '95%', hmin: `calc( 100% - 24px )` }; //cellWidth - 28 };
	innerStyles.w=wcell-11.75;
	innerStyles.hmin=`calc( 100% - 23px )`;//hcell-32
	let fz=12;
	let h=measureHeight(dParent,{fz:fz});
	console.log('h',h);
	let eventStyles={fz:fz,hmin:h,w:'100%'};

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var dParent = toElem(dParent);
	var container = mDiv(dParent, {}, 'dCalendar');
	var currentDate = new Date();
	var today = new Date();
	let dTitle = mDiv(container, { w: 760, padding: gap, fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' }, { className: 'title' });
	var dWeekdays = mGrid(1, 7, container, { gap: gap });
	var dDays = [];
	var info = {};
	for (const w of weekdays) { mDiv(dWeekdays, { w: wcell }, null, w, 'subtitle') };
	var dGrid = mGrid(6, 7, container, { gap: gap });
	var dDate = mDiv(dTitle, { display: 'flex', gap: gap }, 'dDate', '', 'title');
	var dButtons = mDiv(dTitle, { display: 'flex', gap: gap });
	mButton('Prev',
		() => {
			let m = currentDate.getMonth();
			let y = currentDate.getFullYear();
			if (m == 0) setDate(12, y - 1); else setDate(m, y);
		},
		dButtons, { w: 70, margin: 0 }, 'input');
	mButton('Next',
		() => {
			let m = currentDate.getMonth();
			let y = currentDate.getFullYear();
			if (m == 11) setDate(1, y + 1); else setDate(m + 2, y);
		}, dButtons, { w: 70, margin: 0 }, 'input');
	var dMonth, dYear;
	function getDayDiv(dt) {
		if (dt.getMonth() != currentDate.getMonth() || dt.getFullYear() != currentDate.getFullYear()) return null;
		let i = dt.getDate() + info.dayOffset;
		if (i < 1 || i > info.numDays) return null;
		let ui = dDays[i];
		if (ui.style.opacity === 0) return null;
		return ui.children[0]; // { div: udDays[i], events: [] };
	}
	function setDate(m, y) {
		currentDate.setMonth(m - 1);
		currentDate.setFullYear(y);
		mClear(dDate);
		dMonth = mDiv(dDate, {}, 'dMonth', `${currentDate.toLocaleDateString('en-us', { month: 'long' })}`);
		dYear = mDiv(dDate, {}, 'dYear', `${currentDate.getFullYear()}`);
		mClear(dGrid);
		dDays.length = 0;
		let c = colorHex(mGetStyle('dNav', 'bg')); //info.seedColor; //info.wheel[m-1];
		let dayColors = mimali(c, 43).map(x => colorHex(x))
		for (const i of range(42)) {
			let cell = mDiv(dGrid, outerStyles);
			mStyle(cell, { bg: dayColors[i], fg: 'contrast' })
			dDays[i] = cell;
		}
		populate(currentDate);
		refreshEvents();
		return { container, date: currentDate, dDate, dGrid, dMonth, dYear, setDate, populate };
	}
	function populate() {
		let dt = currentDate;
		const day = info.day = dt.getDate();
		const month = info.month = dt.getMonth();
		const year = info.year = dt.getFullYear();
		const firstDayOfMonth = info.firstDay = new Date(year, month, 1);
		const daysInMonth = info.numDays = new Date(year, month + 1, 0).getDate();
		const dateString = info.dayString = firstDayOfMonth.toLocaleDateString('en-us', {
			weekday: 'long',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});
		const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
		info.dayOffset = paddingDays - 1;
		for (const i of range(42)) {
			if (i < paddingDays || i >= paddingDays + daysInMonth) { mStyle(dDays[i], { opacity: 0 }); }
		}
		for (let i = paddingDays + 1; i <= paddingDays + daysInMonth; i++) {
			const daySquare = dDays[i - 1];
			let date = new Date(year, month, i - paddingDays);
			daySquare.innerText = i - paddingDays + (isSameDate(date, today) ? ' TODAY' : '');
			let d = mDom(daySquare, innerStyles, { id: date.getTime() });
			daySquare.onclick = ev => { evNoBubble(ev); onclickDay(d,eventStyles); }
		}
	}
	async function refreshEvents() {
		let events = await getEvents();
		//console.log('events', events)
		for (const k in events) {
			let o = events[k];
			let dt = new Date(Number(o.day));
			let dDay = getDayDiv(dt); 
			if (!dDay) continue; //this event is not visible in current view
			uiTypeEvent(dDay,o,eventStyles);
		}
		mDummyFocus();
	}
	setDate(currentDate.getMonth() + 1, currentDate.getFullYear()); //valf(month1, currentDate.getMonth() + 1), valf(year1, currentDate.getFullYear()));
	//populate();
	return { container, date: currentDate, dDate, dGrid, dMonth, dYear, info, getDayDiv, refreshEvents, setDate, populate }
}
