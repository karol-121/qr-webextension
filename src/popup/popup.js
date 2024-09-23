const MESSAGES = {
	error_default: "Something went wrong.",
	error_isTooLong: "Link is too long. Shorten it and then try again.",
	warning_isLong: "Link length is not optimal. You may experience difficulties while scanning.",
	default_alt: "QR code for current tab"
}

//representation of qr code dom element
const qr_object = {
	dom_element: document.getElementById('qr'),
	dom_subtitle: document.getElementById('subtitle'),
	url: "",
	alt: "",
	size: "",
	subtitle: "",
	print: function () {
		this.dom_element.src = this.url;
		this.dom_element.alt = this.alt;
		this.dom_element.width = this.size;
		this.dom_element.height = this.size;
		this.dom_subtitle.innerText = this.subtitle;
	}
}

//get url of current tab by sending an request to background script
browser.runtime.sendMessage({request: "getCurrentURL"}).then(resolve, onError);

//function that handles positive response for request
function resolve(response) {
	//verify that link exist or is not empty
	if (!response) {
		onError("Response is either undefined or is an empty string", MESSAGES.error_default);
		return;
	}

	if (response.length >= 280) {
		onError("Response exceeds 280 chars", MESSAGES.error_isTooLong);
		return;
	}

	//match size of the qr code according to link length
	//this is so the qr code is always the right size. (longer link requires bigger qr code size.)
	const defined_size = defineSize(response);

	//at this point the link should be valid and size of the qr code set
	//proceed to create qr code and print it

	const api_url = createURL(response, defined_size);

	qr_object.url = api_url;

	console.log(api_url);

	qr_object.alt = MESSAGES.default_alt //todo: ideally this should inform if there is error on qr api side.
	qr_object.size = defined_size.size;

	//notify user about difficulties related to size being bigger than qr code level 4
	if (defined_size.isLong) {
		qr_object.subtitle = MESSAGES.warning_isLong;
	}

	qr_object.print();
}

//function that handles negative response for request
function onError(error, message) {
	qr_object.alt = (!message) ? MESSAGES.error_default : message;
	qr_object.src = "";
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
		5 - 37 modules, 154 alphanumeric
		6 - 41 modules, 195 alphanumeric
		7 - 45 modules, 224 alphanumeric
		8 - 49 modules, 279 alphanumeric
		*given ecc level low
	*/

	//size chart for qr code based on amount of data
	const sizes = [
		[25, 21], 
		[47, 25], 
		[77, 29], 
		[114, 33], 
		[154, 37], 
		[195, 41], 
		[224, 45], 
		[279, 49]
	];

	const zoom_factor = 7;

	//todo: reverse the logic below to eliminate defining the default response. It should be defining on the fly?

	//defining default response
	const result = {
		//todo: test this below (if the default zoom factor is correct)
		size: sizes[sizes.length -1][1] * zoom_factor, //use last defined size from sizes as default
		isLong: true
	}

	//updating the default response
	for (size of sizes) {
		if (url.length <= size[0]) {
			result.size = size[1] * zoom_factor;
			break;
		}
	}

	//check if resulted size is below qr code level 4
	//if so, update the default response accordingly
	if (result.size < sizes[3][1] * zoom_factor) {
		result.isLong = false;
	}

	return result;
}

//function that creates url for qr code
function createURL(url, sizeData) {
	const api_url = new URL("https://api.qrserver.com/v1/create-qr-code/");
	api_url.searchParams.append("size", sizeData.size + "x" + sizeData.size);
	api_url.searchParams.append("format", "png");
	api_url.searchParams.append("data", url);
	return api_url;
}



