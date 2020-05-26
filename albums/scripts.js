// module.exports = {
// 	readTags: function(){
// 		var jsmediatags = require("jsmediatags");

// 		jsmediatags.read("/mass/medix/Music/The Dear Hunter/Act IV_ Rebirth in Reprise/01 Rebirth.flac", {
// 		onSuccess: function(tag) {
// 			return tag
			
// 		},
// 		onError: function(error) {
// 			console.log(':(', error.type, error.info);
// 		}
// 		});
// 	}
// }

async function displayTestImage(){
	var filename = "/mass/medix/Music/The Dear Hunter/Act IV_ Rebirth in Reprise/01 Rebirth.flac"
	var tag = await readTags(filename);
	
	console.log("display");
	console.log(tag);
	console.log("WTF");
	var imageDataString = extractImage(tag);
	console.log("BETWEEN");
	displayImage(imageDataString);
	console.log("END");
}

async function readTags(filename) {
	var jsmediatags = require("jsmediatags");

	return new Promise(function(resolve, reject) {
		jsmediatags.read(filename, {
			onSuccess: function(tag) {
				console.log("read")
				console.log(tag)
				resolve(tag)
				
			},
			onError: function(error) {
				console.log(':(', error.type, error.info);
				reject(null);
			}
			});
	});

	
}

function extractImage(tag) {
	var img = tag.tags.picture
	var datastring = _arrayBufferToBase64(img.data)
	console.log(datastring)
	return datastring
}

function displayImage(datastring) {
	document.getElementById("itemPreview").src = "data:image/jpeg;base64,"+ datastring
}

function _arrayBufferToBase64( buffer ) {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	//return window.btoa( binary );
	return Buffer.from(buffer).toString('base64')
}