//representation of qr code dom element
const qr_object = {
	dom_element: document.getElementById('qr'),
	url: "",
	alt: "",
	size: "",
	print: function () {
		this.dom_element.src = this.url;
		this.dom_element.alt = this.alt;
		this.dom_element.width = this.size;
		this.dom_element.height = this.size;
	},
	resize: function () {
		//todo: make qr code resizable
	}
}

//attach resize function to onclick event
qr_object.dom_element.addEventListener('click', function() {
	qr_object.resize();
});


//get url of current tab by sending an request to background script
browser.runtime.sendMessage({request: "getCurrentURL"}).then(resolve, onError);

//function that handles positive response for request
function resolve(response) {
	if (!response) {
		qr_object.alt = "missing link";
		return;
	}

	if (response.length > 256) {
		qr_object.alt = "link too long";
		return;
	}

	//define qr code size based on lenght of the url
	const defined_size = defineSize(response);
	const api_url = createURL(response, defined_size);

	qr_object.url = api_url;
	qr_object.alt = "QR code for current tab";
	qr_object.size = defined_size;

	qr_object.print();
}

//function that handles negative response for request
function onError(error) {
	qr_object.alt = "Something went wrong";
	qr_object.print();
	console.log(error);
}


//todo: set size based on the lenght of the link, the longer the link is, the bigger the qr code has to be, 
// therefore it needs to be bigger
function defineSize(url) {
	return 300;
}

//function that creates url for qr code
function createURL(url, size) {
	const api_url = new URL("https://api.qrserver.com/v1/create-qr-code/");
	api_url.searchParams.append("size", size + "x" + size);
	api_url.searchParams.append("format", "svg");
	api_url.searchParams.append("data", url);
	return api_url;
}



