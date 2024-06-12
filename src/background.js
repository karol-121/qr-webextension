browser.runtime.onMessage.addListener(recieveMessage);

function recieveMessage(request) {
	//add check for request
	return getCurrentURL();
}


async function getCurrentURL() {
	const currentTab = await browser.tabs.query({currentWindow: true, active: true});
	return currentTab[0].url;
}


