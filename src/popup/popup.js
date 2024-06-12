//here make message an object with parameters
browser.runtime.sendMessage({request: "getCurrentURL"}).then(resolve, onError);


function resolve(msg) {
	console.log(msg);
}

function onError(err) {
	console.log(err);
}



