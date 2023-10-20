onload = start;

async function start(){test1();}

async function test1(){
  html2canvas(document.querySelector("#dTest")).then(canvas => {
    canvas.id = 'canvas1';
    document.body.appendChild(canvas);
});  
}

function onclickButton(){
  let elem = mBy('canvas1');
  console.log('elem',elem);
  saveCanvas();
}

async function saveCanvas() {
  const canvas = document.getElementById('canvas1');
  const dataURL = canvas.toDataURL('image/png');
  
  const response = await fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataURL }),
  });

  const result = await response.json();
  console.log(result);
}









