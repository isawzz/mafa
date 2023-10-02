function addEditable(dParent, styles = {}, opts = {}) {
  //let html= `<p contenteditable="true">hallo</p>`; let x=mDom(dParent,{},{html:html});
  let x = mDom(dParent, { w: '90%' }, { tag: 'input', classes: 'plain' });
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
function _detectSessionType() {

  //console.log('window.location', window.location.href);
  let loc = window.location.href;
  DA.sessionType = loc.includes('telecave') ? 'telecave' : loc.includes('8080') ? 'php' : 'live';
}
function getCorrectMonth(s,val){
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
  let n=firstNumber(s); 
  if (n>=1 && n<=12) return [n-1,months[n-1]];
  s=s.substring(0,3).toLowerCase();
  for(const m of months){
    let m1=m.substring(0,3).toLowerCase();
    if (s == m1) return [months.indexOf(m),m];
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
function getUIDRelativeTo(arr){
  let max = isEmpty(arr)?0:arrMax(arr,x=>x.id);
  //console.log('max',max,typeof max)
  return Number(max)+1;
}
function handleAddEvent(obj){
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
function isCorrectMonth(s){
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
  let n=firstNumber(s);

  if (n>=1 && n<=12) return months[n-1];
  s=s.substring(0,3).toLowerCase();
  for(const m of months){
    let m1=m.substring(0,3).toLowerCase();
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
function loadAssetsPhp(obj) {
  console.log('obj', obj)
  Config = jsyaml.load(obj.config);
  Config.events = obj.events;
  Config.users = obj.users;
  Config.subscribed = obj.subscribed;
  console.log('Config',Config)
  Syms = jsyaml.load(obj.syms);
  SymKeys = Object.keys(Syms);
  ByGroupSubgroup = jsyaml.load(obj.symGSG);
  C52 = jsyaml.load(obj.c52);
  Cinno = jsyaml.load(obj.cinno);
  Info = jsyaml.load(obj.info);
  Sayings = jsyaml.load(obj.sayings);
  create_card_assets_c52();
  KeySets = getKeySets();
  //console.log('Sayings',Sayings);
  // assertion(isdef(Config), 'NO Config!!!!!!!!!!!!!!!!!!!!!!!!');
}
function maButton(caption, handler, dParent, styles, classes) {
  let a = mLink("javascript:void(0)", dParent, styles, null, caption, classes);
  a.onclick = handler;
  if (isdef(styles)) mStyle(a, styles);
  return a;
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
function phpPost(data, cmd) { if (DA.sessionType != 'live') { _phpPost(data, cmd); } else { phpSim(data, cmd); } }
function _phpPost(data, cmd) {
  var o = {};
  o.data = valf(data, {});
  o.cmd = cmd;
  o = JSON.stringify(o);

  var xml = new XMLHttpRequest();
  xml.onload = function () {
    if (xml.readyState == 4 || xml.status == 200) {
      handleResult(xml.responseText, cmd);
    } else { console.log('WTF?????') }
  }
  xml.open("POST", "php/api.php", true);
  xml.send(o);
}
function phpSim(data,cmd){
  //der macht genau das was normal der phpServer macht und verwendet als
  //SESSION die global Session var
  var o = {};
  o.data = valf(data, {});
  o.cmd = cmd;
  //o = JSON.stringify(o);

  let result = {};
  if (cmd == 'addEvent') {
    //find max id in existing events, add 1 to it
    let ev=jsCopy(data);
    ev.id = getUIDRelativeTo(Config.events);
    result.event = ev;
    console.log(result)
  }

  handleResult(JSON.stringify(result), cmd);
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









