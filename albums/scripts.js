
function readTags() {
	var jsmediatags = require("jsmediatags");

	jsmediatags.read("/mass/medix/Music/The Dear Hunter/Act IV_ Rebirth in Reprise/01 Rebirth.flac", {
	onSuccess: function(tag) {
		console.log(tag);
		img = tag.tags.picture
		console.log(img)
		//datastring = btoa(String.fromCharCode(img.data))
		datastring = _arrayBufferToBase64(img.data)
		console.log(datastring)
		document.getElementById("itemPreview").src = "data:image/jpeg;base64,"+ datastring
	},
	onError: function(error) {
		console.log(':(', error.type, error.info);
	}
	});

}



function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}