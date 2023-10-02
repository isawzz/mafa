
function calendarEventToMonth(o){return new Date(o.date).getMonth();}
function calendarEventToYear(o){return new Date(o.date).getFullYear();}
function calendarEventToDate(o){return new Date(o.date);}
function calendarEventToDay(o){return new Date(o.date).getDate();}


function editEvent(ev){
  
  let o = evToEventObject(ev);
  console.log('supposedly have to edit',ev.target,o);
}
function populateDays(cal){
  let dt = date;
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  //console.log('paddingDays', day, month, year, paddingDays);
  //console.log('dDays', dDays);
  for (const i of range(42)){
    if (i<paddingDays || i>=paddingDays + daysInMonth){ mStyle(dDays[i], { opacity: 0 }); }
  }
  // for (const i of range(paddingDays)) { mStyle(dDays[i], { opacity: 0 }); }
  // for (const i of range(paddingDays + daysInMonth,34)) { mStyle(dDays[i], { opacity: 0 }); }

  //restliche tage bis month ende sind ok
  for (let i = paddingDays+1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = dDays[i - 1]; //document.createElement('div');
    const dayString = `${month + 1}/${i - paddingDays}/${year}`;
    daySquare.innerText = i - paddingDays;
    let date = new Date(year, month, i-paddingDays);
    let d = mDiv(daySquare, { box:true, align: 'center', bg: rColor(), w: '95%', hpadding: '2%', hmin: cellWidth - 28}); //,null,null,'padding');
    d.addEventListener('click', ev => openModal(date, dayString, daySquare.lastChild, ev));
    //dDays[i - 1].appendChild(daySquare);
  }


}







