function calendarOpenDay(date, d, ev) {
  if (isdef(ev) && ev.target != d) return;
  console.log('open event on', typeof date, date)
  let d1 = addEditable(d, { w: 50 }, {
    onEnter: ev => {
      let inp = ev.target;
      
      let o = { date: date.getTime(), text: inp.value, title: firstWord(inp.value) };
      onEventEdited(o, inp);
      //phpPost(o, 'addEvent');
    }
  });
  return d1;
  //const eventForDay = events.find(e => e.date === clicked);
  //console.log('eventForDay', eventForDay);
}
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
function uiTypeCalendar(dParent, month1, year1, events1 = []) {
  const [cellWidth, gap] = [100, 10];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dParent = toElem(dParent);
  const events = events1;
  var container = mDiv(dParent, { bg: 'white' }, 'dCalendar');
  var currentDate = new Date();
  var today = new Date();
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
    currentDate.setMonth(m - 1);
    currentDate.setFullYear(y);
    mClear(dDate);
    dMonth = mDiv(dDate, {}, 'dMonth', `${currentDate.toLocaleDateString('en-us', { month: 'long' })}`);
    dYear = mDiv(dDate, {}, 'dYear', `${currentDate.getFullYear()}`);
    makeContentEditable(dMonth, ev => {
      let d = ev.target;
      if (d != dMonth) return;
      let val = getCorrectMonth(d.innerHTML, months[currentDate.getMonth()]);
      d.innerHTML = val[1];
      currentDate.setMonth(val[0])
    });
    makeContentEditable(dYear, ev => {
      let d = ev.target;
      if (d != dYear) return;
      let val = firstNumber(d.innerHTML);
      currentDate.setFullYear(val);
      d.innerHTML = val;
    });

    mClear(dGrid); dDays.length = 0;
    let outerStyles = {
      rounding: 4, patop: 4, pabottom: 4, weight: 'bold', box: true,
      paleft: gap / 2, w: cellWidth, hmin: cellWidth, fg: 'contrast', bg: rColor('light', .5)
    }
    for (const i of range(42)) {
      let cell = mDiv(dGrid, outerStyles);
      dDays[i] = cell;
    }
    populate(currentDate);
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
    //restliche tage bis month ende sind ok
    let innerStyles = { box: true, align: 'center', bg: 'beige', rounding: 4, w: '95%', hpadding: '2%', hmin: cellWidth - 28 };
    for (let i = paddingDays + 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = dDays[i - 1];
      let date = new Date(year, month, i - paddingDays);
      daySquare.innerText = i - paddingDays + (isSameDate(date,today) ? ' TODAY':'');
      let d = mDom(daySquare, innerStyles, {id:date.getTime()});
      d.addEventListener('click', onclickDay); //ev => calendarOpenDay(date, daySquare.lastChild, ev));
    }
    updateEvents();
  }
  function updateEvents() {
    //console.log('events',events);
    for (const k in events) {
      //console.log('hhhhhhhhhhhhhhhhhhhhhhhh')
      let e = events[k];
      let dt = new Date(Number(e.day));
      //console.log('dt',dt)

      if (dt.getMonth() != currentDate.getMonth() || dt.getFullYear() != currentDate.getFullYear()) {
        //console.log('YES!');
        continue;
      }
      let dDay = dDays[dt.getDate() + info.dayOffset].children[0];
      
      //console.log('add another input to',dt,dDay);
      let d1 = addEditable(dDay, { w: '100%' }, { id:k, onEnter: onEventEdited, value: e.text });
      //console.log(d1);
          
      // let ch = arrChildren(dDay);
      // let d = ch[0]; 
      // let d1 = calendarAddExistingEvent(e, d);
      // e.div = d;
    }
  }

  setDate(valf(month1, currentDate.getMonth() + 1), valf(year1, currentDate.getFullYear()));
  populate();

  return { container, date: currentDate, dDate, dGrid, dMonth, dYear, info, getDay, setDate, populate }
}

function makeContentEditable(elem, setter) {
  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  elem.contentEditable = true;
  elem.addEventListener('keydown', ev => {
    if (ev.key == 'Enter') {
      ev.preventDefault();
      mBy('dummy').focus();
      if (setter) setter(ev);
    }
  });
}
function mFlexLine(d, bg = 'white', fg = 'contrast') {
  //console.log('h',d.clientHeight,d.innerHTML,d.offsetHeight);
  mStyle(d, { bg: bg, fg: fg, display: 'flex', valign: 'center', hmin: measureHeight(d) });
  mDiv(d, { fg: 'transparent' }, null, '|')
}
function measureHeight(d) {
  let d2 = mDiv(d, { opacity: 0 }, null, 'HALLO');
  return d2.clientHeight;
}
function addEditable(dParent, styles = {}, opts = {}) {
  //let html= `<p contenteditable="true">hallo</p>`; let x=mDom(dParent,{},{html:html});
  addKeys({ tag: 'input', classes: 'plain' },opts)
  addKeys({ w: '90%' },styles);
  let x = mDom(dParent, styles, opts); // { tag: 'input', classes: 'plain' });
  x.focus();
  x.addEventListener('keyup', ev => {
    if (ev.key == 'Enter') {
      mBy('dummy').focus();
      // let text=x.value;
      // let d=mDiv(dParent,{},null,x.value);
      // x.remove();
      if (isdef(opts.onEnter)) opts.onEnter(ev)
    }
  }); //console.log('HALLO'); });
  //mPlace(x,'cc'); //(x,0,20)
  return x;
}


//******** */
function _detectSessionType() {

  //console.log('window.location', window.location.href);
  let loc = window.location.href;
  DA.sessionType = loc.includes('telecave') ? 'telecave' : loc.includes('8080') ? 'php' : 'live';
}
function getCorrectMonth(s, val) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let n = firstNumber(s);
  if (n >= 1 && n <= 12) return [n - 1, months[n - 1]];
  s = s.substring(0, 3).toLowerCase();
  for (const m of months) {
    let m1 = m.substring(0, 3).toLowerCase();
    if (s == m1) return [months.indexOf(m), m];
  }
  return val;
}
function getQuerystring(key) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == key) {
      return pair[1];
    }
  }
  return null;
}
function getUIDRelativeTo(arr) {
  let max = isEmpty(arr) ? 0 : arrMax(arr, x => x.id);
  //console.log('max',max,typeof max)
  return Number(max) + 1;
}
function handleAddEvent(obj) {
  //erst hier hat das event ein id!
  //dieses id muss jetzt id von seinem input object sein
  //inp ist lastChild vom children[0] vom dDays
  //diese children[0] koennt ich nennen: d_[month]_[day]
  Config.events.push(obj.event);
  //console.log('event',obj)
  localStorage.setItem('events', JSON.stringify(Config.events));
  //console.log('storage:',JSON.parse(localStorage.getItem('events')));

  //modify event input
  //woher bekomm ich das input?












  //downloadAsYaml(Config.events,'events'); //testing

}
function handleLogin(o) {
  if (o.status == 'loggedin') {
    //console.log('o',o)
    showSuccessMessage('login successful!');
    showLoggedin(o);
    startLoggedIn(o);
  } else if (o.status == 'wrong_pwd') {
    showError('wrong password!!!');
  } else if (o.status == 'not_registered') {
    showError(`user ${o.id} not registered!!!`);
    showPopupRegister();
  }
}
function handleLogout(o) {
  //console.log('handleLogout',o)
  showLogin();
}
function handleRegister(o) {
  //console.log('got register result!!!',o)
  if (o.status == 'registered') {
    showSuccessMessage('new registration successful!');
    mBy('dRegister').remove();

  } else if (o.status == 'duplicate') {
    showError('username already registered!!!');
  } else if (o.status == 'pwds_dont_match') {
    showError(`passwords do not match!!!`);
  }

}
function handleResult(result, cmd) {
  //console.log('result',result);//return;
  let obj = isEmptyOrWhiteSpace(result) ? { a: 1 } : JSON.parse(result);
  //dates should be converted to dates, numbers should be converted to numbers
  DA.result = jsCopy(obj);
  switch (cmd) {
    case "login": handleLogin(obj); break;
    case "logout": handleLogout(obj); break;
    case "register": handleRegister(obj); break;
    case "assets": loadAssetsPhp(obj); startWithAssets(); break;
    case "addEvent": handleAddEvent(obj); break;
    default:
      for (const k in obj) {
        console.log(k, obj[k], typeof obj[k])
      }
  }
}
function isCorrectMonth(s) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let n = firstNumber(s);

  if (n >= 1 && n <= 12) return months[n - 1];
  s = s.substring(0, 3).toLowerCase();
  for (const m of months) {
    let m1 = m.substring(0, 3).toLowerCase();
    if (s == m1) return m;
  }
  return false;
}
async function loadAll() {
  DA.sessionType = detectSessionType();
  if (DA.sessionType == 'live') {
    //load assets the live way form localhost
    await loadAssetsLive('../qtest/');
    //let events = DB.events = DB.events.map(x => x.date = new Date(x.date));
    //console.log('users', DB.users)
    //console.log('events', events)
    //console.log('subscribed', DB.subscribed)
    startWithAssets();
  } else {
    phpPost({}, 'assets');
  }
}
async function loadAssetsLive(projectPath, basepath = '../base/') {
  let path = basepath + 'assets/';
  Config = DB = await route_path_yaml_dict(projectPath + 'config.yaml');
  //console.log('from config',Config.events)

  //localStorage.clear();
  let events = localStorage.getItem('events');
  // console.log('___*\nevents in loc:', events);
  Config.events = isdef(events) ? JSON.parse(events) : [];
  // console.log('events',Config.events)
  //console.log('storage:',JSON.parse(localStorage.getItem('events')));
  // Config.events1 = JSON.parse(localStorage.getItem('events'));
  // console.log('events',Config.events1)
  // console.log(typeof Config.events);
  let users = localStorage.getItem('users');
  Config.users = users ? JSON.parse(users) : [];
  let subscribed = localStorage.getItem('subscribed');
  Config.subscribed = subscribed ? JSON.parse(subscribed) : [];
  Syms = await route_path_yaml_dict(path + 'allSyms.yaml');
  SymKeys = Object.keys(Syms);
  ByGroupSubgroup = await route_path_yaml_dict(path + 'symGSG.yaml');
  C52 = await route_path_yaml_dict(path + 'c52.yaml');
  Cinno = await route_path_yaml_dict(path + 'fe/inno.yaml');
  Info = await route_path_yaml_dict(path + 'lists/info.yaml');
  create_card_assets_c52();
  KeySets = getKeySets();
  // console.assert(isdef(Config), 'NO Config!!!!!!!!!!!!!!!!!!!!!!!!');
  // return { users: dict2list(DB.users, 'name'), games: dict2list(Config.games, 'name'), tables: [] };
}
function makeContentEditable(elem, setter) {
  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  elem.contentEditable = true;
  elem.addEventListener('keydown', ev => {
    if (ev.key == 'Enter') {
      ev.preventDefault();
      mBy('dummy').focus();
      if (setter) setter(ev);
    }
  });
}
function mFlexLine(d, bg = 'white', fg = 'contrast') {
  //console.log('h',d.clientHeight,d.innerHTML,d.offsetHeight);
  mStyle(d, { bg: bg, fg: fg, display: 'flex', valign: 'center', hmin: measureHeight(d) });
  mDiv(d, { fg: 'transparent' }, null, '|')
}
function measureHeight(d) {
  let d2 = mDiv(d, { opacity: 0 }, null, 'HALLO');
  return d2.clientHeight;
}
function queryDict() {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  let di = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (isdef(pair[1])) di[pair[0]] = pair[1];
  }
  return di;
}
