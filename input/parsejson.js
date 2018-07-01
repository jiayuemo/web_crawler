let inputjson = require("./inputdata.json");

// create a hashmap to place links
// keys will be the address
// values will be the links to visit on that address page
let myHashMap = new Map();

// track the first address of the json, then place the key value pair into hashmap 
let firstaddress = inputjson["pages"][0]["address"]; // string
let firstlinks = inputjson["pages"][0]["links"]; // arr of strings 
myHashMap.set(firstaddress,firstlinks);

// place the rest of the key value pairs into hashmap
for (let i=1;i<inputjson["pages"].length;i++) {
	let address = inputjson["pages"][i]["address"];
	let links = inputjson["pages"][i]["links"];
	myHashMap.set(address,links);
}

module.exports.mydata = {
	firstaddress : firstaddress,
	hashMapLinks : myHashMap
}

