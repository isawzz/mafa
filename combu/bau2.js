
function closePopup(name='dPopup'){if (isdef(mBy(name))) mBy(name).remove();}
function openPopup(name='dPopup') {
	closePopup();
  let popup = document.createElement('div');
	popup.id=name;

	let defStyle = {padding:25,bg:'white',fg:'black',zIndex:1000,rounding:12,position:'fixed',boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',wmin:300,hmin:100,border: '1px solid #ccc',};
	mStyle(popup,defStyle);
	mButtonX(popup,25,4);
  document.body.appendChild(popup);
	//mStyle(popup,{box:true,top:'50%',left:'50%',transform: 'translate(-50%, -50%)'}); //position centered
	return popup;
}

  // Function to encrypt data using Web Crypto API
  async function encryptData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Replace 'your_public_key_here' with your actual public key
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      { kty: 'RSA', e: 'AQAB', n: 'your_public_key_here' },
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      dataBuffer
    );

    return new Uint8Array(encryptedBuffer).toString();
  }
















