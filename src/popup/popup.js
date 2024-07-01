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
	}
}

//get url of current tab by sending an request to background script
browser.runtime.sendMessage({request: "getCurrentURL"}).then(resolve, onError);

//function that handles positive response for request
function resolve(response) {
	//verify that link exist or is not empty
	if (!response) {
		onError("Response is either undefined or is empty string", "Something went wrong :(");
		return;
	}

	//match size of the qr code according to link length
	const defined_size = defineSize(response);

	//check if link length does not exceed maximum
	if (defined_size === -1) {
		onError("Link is too long", "Link is too long :(");
		return;
	}

	//at this point the link should be valid and size of the qr code set
	//proceed to create qr code and print it

	const api_url = createURL(response, defined_size);

	qr_object.url = api_url;
	qr_object.alt = "QR code for current tab";
	qr_object.size = defined_size;

	qr_object.print();
}

//function that handles negative response for request
function onError(error, message) {
	qr_object.alt = (!message) ? "Something went wrong" : message;
	qr_object.print();
	console.log(error);
}

function defineSize(url) {
	//good practice: keep size of the qr code up to level 4
	//any bigger qr code may be difficult for the phones to scan

	/*qr code levels:
		1 = 21 modules, 25 alphanumeric
		2 - 25 modules, 47 alphanumeric
		3 - 29 modules, 77 alphanumeric
		4 - 33 modules, 114 alphanumeric
		*given ecc level low
	*/

	//size chart for qr code based on amount of data
	//the size of qr code level 2 and 4 are adjusted to look better
	const sizes = [[25, 21],[47, 29],[77, 29],[114, 37]];

	for (size of sizes) {
		if (url.length <= size[0]) {
			return size[1] * 10;
		}
	}

	//here we have to address links that are longer than 114 chars
	//we could try to trim it and then try to define size again
	//if this fail then we can print error about link being too long

	return -1;
}

//function that creates url for qr code
function createURL(url, size) {
	const api_url = new URL("https://api.qrserver.com/v1/create-qr-code/");
	api_url.searchParams.append("size", size + "x" + size);
	api_url.searchParams.append("format", "svg");
	api_url.searchParams.append("data", url);
	return api_url;
}



