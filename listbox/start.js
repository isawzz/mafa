onload = start;

async function start() { test2(); }

async function test2(){
	let dParent = clearBodyDiv({bg:rColor(),fg:'contrast',hmax:500,wmax:200,pabottom:10,box:true});
	let d1=mDom(dParent,{},{html:'title'})
	let lst = generateRandomWords(4); //arrRepeat(30, 'hallo');
	let ui=uiTypeCheckList(lst,dParent);
	mButton('done',onclickCatListDone,dParent,{classes:'input',margin:10}); //da muss noch ein button dazu
}

async function test1_sidebar(){
	dTitle = mDom('dTitle',{bg:'orange'},{html:'Title'});
	mStyle('dLeft', { wmin: 155 });
	let matop=0;
	let d = mDom('dLeft', { margin: 10, matop: matop,h:window.innerHeight-getRect('dLeft').y-(matop+2) , bg:'#00000080'  }); 

	//d ist die sidebar
	mDom(d,{},{html:'hallo'})
	mDom(d,{},{html:'hallo'})
	let d1=mDom(d,{bg:'yellow'},{html:'hallo'});
	let r1=getRect(d1); console.log('r1',r1);

	//moechte ein mGather aufmachen das maximale height hat within 100vh



	//jetzt die liste die soll eine maxheight von 

}

async function test0() {
	let dtop = clearBodyDiv({ h: 500, wmax: 200, bg: rColor(), fg:'contrast' });//mFlexWrap(dtop);
	let d1=mDom(dtop,{},{html:`<h1>Dinge</h1>`})
	let d2 = mDom(dtop,{bg:'red',h:500});
	let listOfStrings = arrRepeat(100, 'hallo');
	const container = mDom(d2); //document.createElement('div');
	// Style the container to be scrollable
	//container.style.maxHeight = '400px'; // Adjust the height as needed
	container.style.overflowY = 'auto'; // Enable vertical scrolling
	container.style.width = '200px'; // Adjust the width as needed
	container.style.border = '1px solid #ccc'; // Optional: adds a border
	container.style.padding = '10px'; // Optional: adds some padding inside the container
	container.style.boxSizing = 'border-box'; // Ensures padding does not affect the overall width

	// Function to adjust the container's max height
	const adjustMaxHeight = () => {
		const parentHeight = d2.clientHeight;
		const containerTop = container.offsetTop;
		const maxHeight = parentHeight - containerTop; // Adjust this value as needed
		container.style.maxHeight = `${maxHeight}px`;
	};
	adjustMaxHeight();
	window.addEventListener('resize', adjustMaxHeight);



	// // Temporarily append the container to calculate the height
	// const tempContainer = container.cloneNode();
	// document.body.appendChild(tempContainer);
	// const viewportHeight = window.innerHeight;
	// const containerTopPosition = tempContainer.getBoundingClientRect().top;
	// var maxHeight = viewportHeight - containerTopPosition - 20; // 20px for margin
	// container.style.maxHeight = `${maxHeight}px`;
	// document.body.removeChild(tempContainer);

	// // Calculate the max height based on the parent div's height
	// const parentHeight = parentDiv.clientHeight;
	// const paddingSpace = 20; // Adjust based on your actual padding/margin needs
	// let h = parentHeight - paddingSpace;
	// if (h < maxHeight) maxHeight = h;

	// // Set the dynamically calculated max height
	// container.style.maxHeight = `${maxHeight}px`;



	// Loop through the list of strings
	listOfStrings.forEach((text, index) => {
		// Create a checkbox for each string
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = `checkbox-${index}`;
		checkbox.name = text;
		checkbox.value = text;

		// Create a label for the checkbox
		const label = document.createElement('label');
		label.htmlFor = checkbox.id;
		label.appendChild(document.createTextNode(text));

		// Append the checkbox and label to the container
		container.appendChild(checkbox);
		container.appendChild(label);
		container.appendChild(document.createElement('br')); // Adds a line break for spacing
	});

	// Append the container to the designated place in the document
	//mAppend(d, container)
	//document.getElementById('checkboxListContainer').appendChild(container);
}