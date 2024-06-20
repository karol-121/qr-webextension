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
	const qr_data = {url: bad_url, alt: "Something went wrong."};
	printQR(qr_data);
	console.log(error);
}


//generates qr code url and alt text for provided url
function generateQRData(url) {
	const qr_data = {
		url: "",
		alt: "",
		size: "",
	}

	if (!url) {
		qr_data.alt = "missing link";
		return qr_data;
	}

	if (url.length > 256) {
		qr_data.alt = "link too long";
		return qr_data;
	}

	//define qr code size based on lenght of the url
	const defined_size = defineSize(url);

	const api_url = new URL("https://api.qrserver.com/v1/create-qr-code/");
	api_url.searchParams.append("size", defined_size + "x" + defined_size);
	api_url.searchParams.append("format", "svg");
	api_url.searchParams.append("data", url);

	qr_data.url = api_url;
	qr_data.alt = "QR code for current tab";
	qr_data.size = defined_size;

	return qr_data;
}


//todo: set size based on the lenght of the link, the longer the link is, the bigger the qr code has to be, 
// therefore it needs to be bigger
function defineSize(url) {
	return 300;
}

//prints qr data to dom
function printQR(qr_data) {
	qr_img.src = qr_data.url;
	qr_img.alt = qr_data.alt;
	qr_img.width = qr_data.size;
	qr_img.height = qr_data.size;
}

function resize() {
	if(qr_img.width === 150) {
		qr_img.width = "300";
		qr_img.height = "300";
	} else {
		qr_img.width = "150";
		qr_img.height = "150";
	}
}




