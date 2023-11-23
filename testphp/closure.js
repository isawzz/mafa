var DA = {};
var dParent;
var Canvas, Ctx, FRESH_START = false, FPS = 200;
onload = start;
function detectSessionType() {
  let loc = window.location.href;
  DA.sessionType =
    loc.includes('telecave') ? 'telecave' : loc.includes('8080') ? 'php'
      : loc.includes(':40') ? 'nodejs'
        : loc.includes(':60') ? 'flask' : 'live';
  return DA.sessionType;
}
function getClientId(){ return  ClientId = valf(sessionStorage.getItem('ClientId'),'guest');}
async function getSession(){
  let type = detectSessionType();
  if (type == 'live'){ // live-server always starts with empty session!
    if (isEmpty(Session))
    return Session;
  }else { 
    return await sendGet('session');
  }  
  if (isEmpty(Session)) {
    console.log('session is empty!');
  }
}
function isdef(x) { return x !== null && x !== undefined; }
function isEmpty(arr) {
  return arr === undefined || !arr
    || (isString(arr) && (arr == 'undefined' || arr == ''))
    || (Array.isArray(arr) && arr.length == 0)
    || Object.entries(arr).length === 0;
}
function isString(param) { return typeof param == 'string'; }
function mBy(id) { return document.getElementById(id); }
async function sendGet(command){
  const response = await fetch('server.php?action='+command);
  const astext = await response.text();
  const data = tryJSONParse(astext);
  return data;
}
async function sendGetReset() { let data = await sendGet('reset'); showJsonInTextarea(data,'textarea1'); return data;}
async function sendPost(o) {
  const start = performance.now();
  const response = await fetch('server.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(o)
  });
  const end = performance.now();
  const latency = end - start;
  showLatency(latency);
  const astext = await response.text();
  const data = tryJSONParse(astext);
  return data;
}
async function sendPostSimple() { let data = await sendPost(U); showJsonInTextarea(data,'textarea1'); return data; }
function setClient(id){
  ClientId = id;
  sessionStorage.setItem('ClientId', ClientId);
}
function showJsonInTextarea(o,dParent){
  const textarea = toElem(dParent);
  textarea.value = JSON.stringify(o, null, 2);
  textarea.scrollTop = textarea.scrollHeight;
}
function showLatency(latency) {
  document.getElementById('latencyOutput').innerText = `Latency: ${latency.toFixed(2)}ms`;
}
async function start() {
  test4_twemoji();
  let result = await test2(); console.log('DONE:',result);
}
async function test2(){
  Canvas = document.getElementById('gameCanvas'); Ctx = Canvas.getContext('2d');
  Session = await getSession();
  ClientId = getClientId();
  if (isdef(Session.users) && Session.users.includes(ClientId)) { setClient(ClientId); }
  return {Session,ClientId};
}
function test4_twemoji(){
  mBy('dUsernames').innerHTML = twemoji.parse('😄');
}
function toElem(d) { return isString(d) ? mBy(d) : d; }
function tryJSONParse(astext) {
  try {
    const data = JSON.parse(astext);
    return data;
  } catch {
    console.log('text', astext)
    return { message: 'ERROR', text: astext }
  }
}
function valf() {
  for (const arg of arguments) if (isdef(arg)) return arg;
  return null;
}
