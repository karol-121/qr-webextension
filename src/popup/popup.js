const qr_img = document.getElementById('qr');
qr_img.addEventListener('click', resize);

//qr placeholder for error
const bad_url = browser.runtime.getURL("assets/qr-error.png");

//get url of current tab by sending an request to background script
browser.runtime.sendMessage({request: "getCurrentURL"}).then(resolve, onError);

//function that handles positive response for request
function resolve(response) {
	const qr_data = generateQRData(response); 
	printQR(qr_data);
}

//function that handles negative response for request
function onError(error) {
	const qr_data = {url: bad_url, alt: "Something went wrong"};
	printQR(qr_data);
	console.log(error);
}


//generates qr code url and alt text for provided url
function generateQRData(url) {
	//todo: add check here, ie if link is empty or if it is to long etc.

	//todo: set size based on the lenght of the link, the longer the link is, the bigger the qr code has to be, 
	// therefore it needs to be bigger
	const api_url = new URL("https://api.qrserver.com/v1/create-qr-code/");
	api_url.searchParams.append("size", "150x150");
	api_url.searchParams.append("format", "svg");
	api_url.searchParams.append("data", url);

	return { url: api_url, alt: "QR code for current tab"};
}

//prints qr data to dom
function printQR(qr_data) {
	qr_img.src = qr_data.url;
	qr_img.alt = qr_data.alt;
}

function resize() {
	if(qr_img.className === "zoom-2x") {
		qr_img.className = "zoom-normal";
	} else {
		qr_img.className = "zoom-2x";
	}
}




