const qr_img = document.getElementById('qr');
qr_img.addEventListener('click', resize);

//get url of current tab
browser.runtime.sendMessage({request: "getCurrentURL"}).then(resolve, onError);

function resolve(response) {
	printQR(response);
}

function onError(error) {
	console.log(error);
}

function printQR(url) {
	const api_url = new URL("https://api.qrserver.com/v1/create-qr-code/");

	//todo: set size based on the lenght of the link, the longer the link is, the bigger the qr code has to be, 
	// therefore it needs to be bigger
	api_url.searchParams.append("size", "150x150");
	api_url.searchParams.append("format", "svg");
	api_url.searchParams.append("data", url);

	qr_img.src = api_url;
}

function resize() {
	if(qr_img.className === "zoom-2x") {
		qr_img.className = "zoom-normal";
	} else {
		qr_img.className = "zoom-2x";	
	}
}




