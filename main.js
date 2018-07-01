let request = require('request');
let cheerio = require('cheerio');

let mydata = require('./input/parsejson.js');
let firstaddress = mydata["mydata"]["firstaddress"]; // first link to visit
let hashMapLinks = mydata["mydata"]["hashMapLinks"]; // key value pairs of address and links

let toVistLinks = []; // used as a stack to manage sites to visit 
let successLinks = {}; // hashset to track visitied sites 
let skippedLinks = {}; // hashset to track invalid links of duplicate sites
let errorLinks = {}; // hashset to track invalid links of sites that are not a key in hashMapLinks

// place the first address in the toVistLinks data struct
toVistLinks.push(firstaddress);
// call top level webCrawl function
webCrawl();


function webCrawl() {
	if (toVistLinks.length===0) {
		// there are no more links to visit base case
		// print results to console and write output to file
		printResults();
		return;
	}
	// get the next link to visit
	let nextLink = toVistLinks.pop();

	// determine what to do with the link
	if (hashMapLinks.has(nextLink)) {
		// the link is a valid key/address in the hashmap
		if (nextLink in successLinks) {
			// the link was already visitied, skip and continue
			skippedLinks[nextLink] = true;
			webCrawl();
		} else {
			// the link has not been visited
			// visit the Link and callback webCrawl() when done
			successLinks[nextLink] = true;
			visitLink(nextLink,webCrawl);
		}
	} else {
		// the link is an invalid key/address in the hashmap
		errorLinks[nextLink] = true;
		webCrawl();
	}
}

function visitLink (link, callback) {
	// visit the link
	request(link, function(error, response, body) {
		// handle responsecodes that are not 200 OK by just firing webCrawl();
		if (response.statusCode !== 200) {
			console.log("status code not 200");
			callback();
			return;
		}
		// parse the body with cheerio and pass the result and link to helper func
		// once more links have been added to the stack, fire callback again
		let $ = cheerio.load(body);
		addValidLinks(link,$);
		callback();
	});
}

function addValidLinks(link,$) {
	// use jquery convention to select links in the html body
	let allLinks = $("a[href^='http']");

	// there is an associated array of links to visit for each address
	// push links found in the html body that match these links to the stack of links to visit
	let linksToFind = hashMapLinks.get(link);
	allLinks.each(function() {
		let link = $(this).attr('href');
		for (let i=0;i<linksToFind.length;i++) {
			if (link===linksToFind[i]) {
				toVistLinks.push(link);
			}
		}	
	});
}

function printResults() {
	// print out visited, skipped, and error links after crawler is done
	console.log("Succeesfully Visited Links:");
	console.log(successLinks);
	console.log();
	console.log("Skipped Links:");
	console.log(skippedLinks);
	console.log();
	console.log("Error, Links which were not an address in input JSON:");
	console.log(errorLinks);
}