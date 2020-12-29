let s = "";
let sampleData = ["KCSSK","Minta Hallgató","ABC123","Minta Anya","Minta kar","MK","Minta képzés","alapképzés","nappali","állami","5","Felsőmocsolád","Sohaország","4.2"]
let len;
let begin;
let end;

document.getElementsByName('testfile')[0].onchange = () => {
	let file = document.getElementsByName('testfile')[0].files[0];
	if (file) {
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		reader.onload = function (evt) {
			s = evt.target.result;
			len = s.length;
			parser();
		}
		reader.onerror = function (evt) {
		   throw new Error("FILE ERROR - can't reading the file");
		}
	}
}

function parser() {
	if (s == undefined || s.length < 1) { throw new Error("INPUT ERROR - the given input is empty"); }

	for (let i = 0; i < len-1; i++) {
		switch (s.charAt(i)) {
			case '$' :
				if (s.charAt(i+1) == '{') {
					begin = i;
				}
			break;
			case '}' :
				if (begin != -1) {
					end = i;
					let shortcode = s.substring(begin, end+1);
					let type = shortcode.substring(2, shortcode.indexOf(':')).toLowerCase();
					let htmlelement = "";
					switch (type) {
						case 'l':
							htmlelement = makeLabel(shortcode);
						break;
						case 'label':
							htmlelement = makeLabel(shortcode);
						break;
						case 'c':
							htmlelement = makeCheckbox(shortcode);
						break;
						case 'checkbox':
							htmlelement = makeCheckbox(shortcode);
						break;
						case 'g':
							htmlelement = "";
						break;
						case 'group':
							htmlelement = "";
						break;
						case 'd':
							htmlelement = makeDropdown(shortcode);
						break;
						case 'dropdown':
							htmlelement = makeDropdown(shortcode);
						break;
						case 't':
							htmlelement = makeTextInput(shortcode);
						break;
						case 'text':
							htmlelement = makeTextInput(shortcode);
						break;
						default:
							htmlelement = "";
					}

					if (shortcode.indexOf(":doc=") != -1) {
						if (shortcode.indexOf(':',shortcode.indexOf(":doc=")+1) == -1) {
							htmlelement += "<input type='file' name='" + shortcode.substring(shortcode.indexOf(":doc=")+5,shortcode.indexOf('}')) + "'>";
						}
						else {
							htmlelement += "<input type='file' name='" + shortcode.substring(shortcode.indexOf(":doc=")+5,shortcode.indexOf(':',shortcode.indexOf(":doc=")+1)) + "'>";
						}
					}

					s = s.replace(shortcode, htmlelement);
					begin = -1;
					end = -1;
					len = s.length;
					i = i - shortcode.length + htmlelement.length;
				}
			break;
		}
	}

	document.body.innerHTML = s;
}

function makeTextInput(shortcode) {
	let name = "";
	let ret = "";
	if (shortcode.indexOf(":multiline=true") == -1) {
		ret = "<input type='text' id='";
	}
	else {
		ret = "<textarea id='";
	}
	ret += shortcode.substring(shortcode.indexOf(':')+1,shortcode.indexOf(':',shortcode.indexOf(':')+1));
	ret += "' name='";
	if (shortcode.indexOf(":n=") == -1) {
		if (shortcode.indexOf(':',shortcode.indexOf(":name=")+1) == -1) {
			ret += shortcode.substring(shortcode.indexOf(":name=")+6,shortcode.indexOf('}'));
		}
		else {
			ret += shortcode.substring(shortcode.indexOf(":name=")+6,shortcode.indexOf(':',shortcode.indexOf(":name=")+1));
		}
	}
	else {
		if (shortcode.indexOf(':',shortcode.indexOf(":n=")+1) == -1) {
			ret += shortcode.substring(shortcode.indexOf(":n=")+3,shortcode.indexOf('}'));
		}
		else {
			ret += shortcode.substring(shortcode.indexOf(":n=")+3,shortcode.indexOf(':',shortcode.indexOf(":n=")+1));
		}
	}

	if (shortcode.indexOf(":style=") != -1) {
		ret += "' style='" + shortcode.substring(shortcode.indexOf(":style=")+8,shortcode.indexOf('"',shortcode.indexOf(":style=")+8));
	}


	if (shortcode.indexOf(":multiline=true") == -1) {
		ret += "'>";
	}
	else {
		ret += "'></textarea>";
	}	

	// TODO: process opengroup tags here

	return ret;
}

function makeDropdown(shortcode) {
	let val = "";
	let name = "";
	let ret = "<select id='"
	ret += shortcode.substring(shortcode.indexOf(':')+1,shortcode.indexOf(':',shortcode.indexOf(':')+1));
	ret += "' name='";
	if (shortcode.indexOf(":n=") == -1) {
		if (shortcode.indexOf(':',shortcode.indexOf(":name=")+1) == -1) {
			ret += shortcode.substring(shortcode.indexOf(":name=")+6,shortcode.indexOf('}'));
		}
		else {
			ret += shortcode.substring(shortcode.indexOf(":name=")+6,shortcode.indexOf(':',shortcode.indexOf(":name=")+1));
		}
	}
	else {
		if (shortcode.indexOf(':',shortcode.indexOf(":n=")+1) == -1) {
			ret += shortcode.substring(shortcode.indexOf(":n=")+3,shortcode.indexOf('}'));
		}
		else {
			ret += shortcode.substring(shortcode.indexOf(":n=")+3,shortcode.indexOf(':',shortcode.indexOf(":n=")+1));
		}
	}
	
	if (shortcode.indexOf(":style=") != -1) {
		ret += "' style='" + shortcode.substring(shortcode.indexOf(":style=")+8,shortcode.indexOf('"',shortcode.indexOf(":style=")+8));
	}

	ret += "'>";

	if (shortcode.indexOf(":v=") == -1) {
		if (shortcode.indexOf(':',shortcode.indexOf(":value=")+1) == -1) {
			val = shortcode.substring(shortcode.indexOf(":value=")+7,shortcode.indexOf('}')).split(',');
		}
		else {
			val = shortcode.substring(shortcode.indexOf(":value=")+7,shortcode.indexOf(':',shortcode.indexOf(":value=")+1)).split(',');
		}
	}
	else {
		if (shortcode.indexOf(':',shortcode.indexOf(":v=")+1) == -1) {
			val = shortcode.substring(shortcode.indexOf(":v=")+3,shortcode.indexOf('}')).split(',');
		}
		else {
			val = shortcode.substring(shortcode.indexOf(":v=")+3,shortcode.indexOf(':',shortcode.indexOf(":v=")+1)).split(',');
		}
	}

	for (var i = 0; i < val.length; i++) {
		ret += "<option value='" + val[i] + "'>" + val[i] + "</option>";
	}
	ret += "</select>"
	// TODO: process opengroup tags here

	return ret;
}

function makeCheckbox(shortcode) {
	let name = "";
	let ret = "<input type='checkbox' id='";
	ret += shortcode.substring(shortcode.indexOf(':')+1,shortcode.indexOf(':',shortcode.indexOf(':')+1));
	ret += "' name='";
	if (shortcode.indexOf(":n=") == -1) {
		if (shortcode.indexOf(':',shortcode.indexOf(":name=")+1) == -1) {
			ret += shortcode.substring(shortcode.indexOf(":name=")+6,shortcode.indexOf('}'));
		}
		else {
			ret += shortcode.substring(shortcode.indexOf(":name=")+6,shortcode.indexOf(':',shortcode.indexOf(":name=")+1));
		}
	}
	else {
		if (shortcode.indexOf(':',shortcode.indexOf(":n=")+1) == -1) {
			ret += shortcode.substring(shortcode.indexOf(":n=")+3,shortcode.indexOf('}'));
		}
		else {
			ret += shortcode.substring(shortcode.indexOf(":n=")+3,shortcode.indexOf(':',shortcode.indexOf(":n=")+1));
		}
	}
	ret += "'>";

	// TODO: process opengroup tags here

	return ret;
}

function makeLabel(shortcode) {
	let val = "";
	let ret = "<label id='";
	ret += shortcode.substring(shortcode.indexOf(':')+1,shortcode.indexOf(':',shortcode.indexOf(':')+1));
	ret += "'>";
	if (shortcode.indexOf(":v=") == -1) {
		if (shortcode.indexOf(':',shortcode.indexOf(":value=")+1) == -1) {
			val = shortcode.substring(shortcode.indexOf(":value=")+7,shortcode.indexOf('}'));
		}
		else {
			val = shortcode.substring(shortcode.indexOf(":value=")+7,shortcode.indexOf(':',shortcode.indexOf(":value=")+1));
		}
	}
	else {
		if (shortcode.indexOf(':',shortcode.indexOf(":v=")+1) == -1) {
			val = shortcode.substring(shortcode.indexOf(":v=")+3,shortcode.indexOf('}'));
		}
		else {
			val = shortcode.substring(shortcode.indexOf(":v=")+3,shortcode.indexOf(':',shortcode.indexOf(":v=")+1));
		}
	}
	switch (val) {
		case ".$KO2":
			ret += '.'+sampleData[0];
		break;
		case "$H1":
			ret += sampleData[1];
		break;
		case "$H22":
			ret += sampleData[2];
		break;
		case "$H5":
			ret += sampleData[3];
		break;
		case "$I3":
			ret += sampleData[4];
		break;
		case "$I14":
			ret += sampleData[5];
		break;
		case "$I4":
			ret += sampleData[6];
		break;
		case "$K33":
			ret += sampleData[7];
		break;
		case "$I5":
			ret += sampleData[8];
		break;
		case "$K13":
			ret += sampleData[9];
		break;
		case "$K20":
			ret += sampleData[10];
		break;
		case "$H6":
			ret += sampleData[11];
		break;
		case "$H9":
			ret += sampleData[12];
		break;
		case "$FELEV(2019/20/1,KorrigaltKreditIndex)":
			ret += sampleData[13];
		break;
		default:
			ret += "";
	}
	ret += "</label>";
	return ret;
}