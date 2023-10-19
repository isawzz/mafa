function displayCalendar(d) {
  let html1 = `
    <div id="container">
      <div id="header">
        <div id="monthDisplay"></div>
        <div>
          <button id="backButton">Back</button>
          <button id="nextButton">Next</button>
        </div>
      </div>
      <div id="weekdays">
        <div>Sunday</div>
        <div>Monday</div>
        <div>Tuesday</div>
        <div>Wednesday</div>
        <div>Thursday</div>
        <div>Friday</div>
        <div>Saturday</div>
      </div>
      <div id="calendar"></div>
    </div>`;
  let html2 = `    
    <div id="newEventModal">
      <h2>New Event</h2>
      <input id="eventTitleInput" placeholder="Event Title" />
      <button id="saveButton">Save</button>
      <button id="cancelButton">Cancel</button>
    </div>`;
  let html3 = `    
    <div id="deleteEventModal">
      <h2>Event</h2>
      <p id="eventText"></p>
      <button id="deleteButton">Delete</button>
      <button id="closeButton">Close</button>
    </div>`;
  let html4 = `    
    <div id="modalBackDrop"></div>
  `;
  //let d = mBy('dMain'); //mDiv('dMain',{h:400,w:400,padding:10,bg:'red'});//mBy('dMain');
  mClear(d);
  [html1, html2, html3, html4].map(html => mAppend(d, mCreateFrom(html)));
  myCalendar();
  //setTimeout(myCalendar,12); //();
  //displayCalendar(7,2023);

}
function myCalendar(){
  let nav = 0;
  let clicked = null;
  let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
  let myEvents = localStorage.getItem('myEvents') ? JSON.parse(localStorage.getItem('myEvents')) : [];
  
  const calendar = document.getElementById('calendar');
  const newEventModal = document.getElementById('newEventModal');
  const deleteEventModal = document.getElementById('deleteEventModal');
  const backDrop = document.getElementById('modalBackDrop');
  const eventTitleInput = document.getElementById('eventTitleInput');
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  function openModal(date,d,ev) {
    if (ev.target != d) return;
    clicked = date;
    console.log('clicked',d,date)

    let d1=addEditable(d); 

    const eventForDay = events.find(e => e.date === clicked);
    console.log('eventForDay',eventForDay);
  }
  
  function load() {
    const dt = new Date();
  
    if (nav !== 0) {
      dt.setMonth(new Date().getMonth() + nav);
    }
  
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
    //console.log('paddingDa 1',day,month,year,paddingDays);
  
    document.getElementById('monthDisplay').innerText = 
      `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;
  
    calendar.innerHTML = '';
  
    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = document.createElement('div');
      daySquare.classList.add('day');
  
      const dayString = `${month + 1}/${i - paddingDays}/${year}`;
  
      if (i > paddingDays) {
        daySquare.innerText = i - paddingDays;
        mDiv100(daySquare,{bg:rColor()})
        const eventForDay = events.find(e => e.date === dayString);
  
        if (i - paddingDays === day && nav === 0) {
          daySquare.id = 'currentDay';
        }
  
        if (eventForDay) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = eventForDay.title;
          daySquare.appendChild(eventDiv);
        }
        daySquare.lastChild.addEventListener('click', ev => openModal(dayString,daySquare.lastChild,ev));
      } else {
        daySquare.classList.add('padding');
      }
  
      calendar.appendChild(daySquare);    
    }
  }
  
  function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
  }
  
  function saveEvent() {
    if (eventTitleInput.value) {
      eventTitleInput.classList.remove('error');
  
      events.push({
        date: clicked,
        title: eventTitleInput.value,
      });
  
      localStorage.setItem('events', JSON.stringify(events));
      closeModal();
    } else {
      eventTitleInput.classList.add('error');
    }
  }
  
  function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  }
  
  function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
      nav++;
      load();
    });
  
    document.getElementById('backButton').addEventListener('click', () => {
      nav--;
      load();
    });
  
    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
  }
  
  initButtons();
  load();
  
}
