onload=start;

async function start() { await test1(); }

async function test1(){}
async function test0(){

  //console.log('hhhhhhhhhhhhhhh'); return;
	// let res = await mGetRoute('city'); //,{title:'Vienna'});
  let server = getServerurl();
  server += `/city/vienna`;
  //for (const k in o) { server += `${k}=${o[k]}&`; }
  const response = await fetch(server, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });
  let res = tryJSONParse(await response.text());

  console.log('hallo!!!!!!!!!!!!!!!!!!!')
	console.log(res);
	mBy('result').innerHTML = res.text._;

	
}
