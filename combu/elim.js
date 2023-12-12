function calendarOpenDay(date, d, ev) {
  if (isdef(ev) && ev.target != d) return;
  console.log('open event on', typeof date, date)
  let d1 = addEditable(d, { w: 50 }, {
    onEnter: ev => {
      let inp = ev.target;
      let o = { date: date.getTime(), text: inp.value, title: firstWord(inp.value) };
      onEventEdited(o, inp);
    }
  });
  return d1;
}
async function loadUserdata(uname) {
  let data = await mGetRoute('user', uname);
  console.log('data',data)
  if (!data) { data = await postUserChange({ name: uname, color: rChoose(M.playerColors) }); }
  else Serverdata.users[uname] = data;
  return data;
}
