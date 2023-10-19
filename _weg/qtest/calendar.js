function calendarOpenDay(date, d, ev) {
  if (isdef(ev) && ev.target != d) return;
  console.log('open event on', typeof date, date)
  let d1 = addEditable(d, { w: 50 }, {
    onEnter: ev => {
      let inp = ev.target;
      let o = { date: date.getTime(), text: inp.value, title: firstWord(inp.value) };
      phpPost(o, 'addEvent');
    }
  });

  return d1;
  //const eventForDay = events.find(e => e.date === clicked);
  //console.log('eventForDay', eventForDay);
}
function calendarGetDayId(dt) { return `d_${dt.getDate()}`; }
function calendarGetEventId(o) { return `inp_${o.id}`; }
function evToEventObject(ev) {
  let inp = ev.target;
  let o = Config.events[firstNumber(inp.id)];
  return o;
}
function calendarAddExistingEvent(o, d) {
  let d1 = addEditable(d, { w: 50 }, {
    id: calendarGetEventId(o),
    onEnter: ev => {

      let o = evToEventObject(ev);
      // let inp = ev.target;
      // let o = Config.events[firstNumber(inp.id)];
      o.text = inp.value;
      o.title = firstWord(inp.value);
      updateEvent(o);
    }
  });
  mStyle(d1, {
    fz: 10, cursor: 'pointer',
    padding: 3, bg: '#58bae4', fg: 'white', rounding: 5, hmax: 55,
    overflow: 'hidden'
  });
  d1.setAttribute('readonly', true);
  d1.value = o.text;
  d1.onclick = editEvent;
  return d1;
  //const eventForDay = events.find(e => e.date === clicked);
  //console.log('eventForDay', eventForDay);
}
function saveEvent(o) {
  let inp = o.div.lastChild;
  //delete o.div;
  console.log('o', o);
  mStyle(inp, {
    fz: 10, cursor: 'pointer',
    padding: 3, bg: '#58bae4', fg: 'white', rounding: 5, hmax: 55,
    overflow: 'hidden'
  });
  inp.setAttribute('readonly', true);
  inp.onclick = ev => editEvent(ev, o)



  // if (DA.sessionType != 'live') {
  // }else{
  //   Config.events.push(o);
  //   localStorage.setItem('events', JSON.stringify(Config.events));
  // }
}
function uiTypeCalendar(dParent, month1, year1, events1) {
  const [cellWidth, gap] = [100, 10];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dParent = toElem(dParent);
  const events = events1;
  var container = mDiv(dParent, { bg: 'white' }, 'dCalendar');
  var date = new Date();
  let dTitle = mDiv(container, { w: 760, padding: gap, fg: '#d36c6c', fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' });
  var dWeekdays = mGrid(1, 7, container, { gap: gap });
  var dDays = [];
  var info = {};
  for (const w of weekdays) { mDiv(dWeekdays, { w: cellWidth, fg: '#247BA0' }, null, w) };
  var dGrid = mGrid(6, 7, container, { gap: gap });
  var dDate = mDiv(dTitle, { display: 'flex', gap: gap });
  var dButtons = mDiv(dTitle, { display: 'flex', gap: gap });
  mButton('Prev',
    () => {
      let m = date.getMonth();
      let y = date.getFullYear();
      if (m == 0) setDate(12, y - 1); else setDate(m, y);
      //setDate(date.getMonth(), date.getFullYear())
    },
    dButtons, { bg: '#92a1d1' });
  mButton('Next',
    () => {
      let m = date.getMonth();
      let y = date.getFullYear();
      if (m == 11) setDate(1, y + 1); else setDate(m + 2, y);
      //setDate(date.getMonth() + 2, date.getFullYear())
    }, dButtons, { bg: '#92a1d1' });
  var dMonth, dYear;
  setDate(valf(month1, date.getMonth() + 1), valf(year1, date.getFullYear()));
  populate();

  function getDay(d) {
    let i = d + info.dayOffset;
    console.log('i', i);
    if (i < 1 || i > info.numDays) return null;
    let ui = dDays[i];
    console.log('ui', ui)
    if (ui.style.opacity === 0) return null;
    return { div: dDays[i], events: [] };
  }
  function setDate(m, y) {
    date.setMonth(m - 1);
    date.setFullYear(y);
    mClear(dDate);
    dMonth = mDiv(dDate, {}, 'dMonth', `${date.toLocaleDateString('en-us', { month: 'long' })}`);
    dYear = mDiv(dDate, {}, 'dYear', `${date.getFullYear()}`);
    makeContentEditable(dMonth, ev => {
      let d = ev.target;
      if (d != dMonth) return;
      let val = getCorrectMonth(d.innerHTML, months[date.getMonth()]);
      d.innerHTML = val[1];
      date.setMonth(val[0])
    });
    makeContentEditable(dYear, ev => {
      let d = ev.target;
      if (d != dYear) return;
      let val = firstNumber(d.innerHTML);
      date.setFullYear(val);
      d.innerHTML = val;
    });

    mClear(dGrid); dDays.length = 0;
    let outerStyles = {
      patop: 4, weight: 'bold', box: true,
      paleft: gap / 2, w: cellWidth, hmin: cellWidth, fg: 'contrast', bg: rColor()
    }
    for (const i of range(42)) {
      let cell = mDiv(dGrid, outerStyles);
      dDays[i] = cell;
    }
    populate(date);
    return { container, date, dDate, dGrid, dMonth, dYear, setDate, populate };
  }
  function populate() {
    let dt = date;
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
    //console.log('paddingDays', day, month, year, paddingDays);
    //console.log('dDays', dDays);
    for (const i of range(42)) {
      if (i < paddingDays || i >= paddingDays + daysInMonth) { mStyle(dDays[i], { opacity: 0 }); }
    }
    // for (const i of range(paddingDays)) { mStyle(dDays[i], { opacity: 0 }); }
    // for (const i of range(paddingDays + daysInMonth,34)) { mStyle(dDays[i], { opacity: 0 }); }

    //restliche tage bis month ende sind ok
    for (let i = paddingDays + 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = dDays[i - 1]; //document.createElement('div');
      //const dayString = `${month + 1}/${i - paddingDays}/${year}`;
      daySquare.innerText = i - paddingDays;
      let date = new Date(year, month, i - paddingDays);
      let d = mDiv(daySquare, { box: true, align: 'center', bg: rColor(), w: '95%', hpadding: '2%', hmin: cellWidth - 28 }, calendarGetDayId(date)); //,null,null,'padding');
      d.addEventListener('click', ev => calendarOpenDay(date, daySquare.lastChild, ev));
      // d.addEventListener('click', ev => calendarOpenDay(date, dayString, daySquare.lastChild, ev));
      //dDays[i - 1].appendChild(daySquare);
    }
    updateEvents();
  }
  function updateEvents() {
    //console.log('events',events);
    //console.log('dDays',dDays);
    for (const e of events) {
      let dt = new Date(e.date);
      if (dt.getMonth() != date.getMonth() || dt.getFullYear() != date.getFullYear()) {
        //console.log('YES!');
        continue;
      }
      // let iday = date.getDate();
      // iday = date.getUTCDay();
      // console.log('date',date)
      // console.log('iday',date.getDay(),date.getUTCDay(),date.getDate(),info.dayOffset)
      let dDay = dDays[dt.getDate() + info.dayOffset];
      //console.log('dDay',dDay)
      let ch = arrChildren(dDay);
      //console.log('children',ch)
      let d = ch[0]; //dDay.firstChild; //arrChildren(dDay)[1];
      let d1 = calendarAddExistingEvent(e, d);
      e.div = d;
      //console.log('d',d)
      //mDiv(d,{bg:'blue'},null,e.title); break;
    }
  }
  return { container, date, dDate, dGrid, dMonth, dYear, info, getDay, setDate, populate }
}



