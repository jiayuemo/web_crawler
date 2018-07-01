# web_crawler
A web crawler written in JS, running in the NodeJS enviornment.
## Project Requirements
Project requirements can be found in web-crawler-project.md
## Running the Project
Install Project Dependencies
```
npm install

```
Run the web crawler
```
npm start
```
### Project Discussion
#### Project Assumptions
I assumed that links could take us away from a specific domain, so my code checks and works with absolute url paths.
For project testing purposes, I set up a flask web application to serve static HTML files. The source code for that can be found here https://github.com/jiayuemo/flask_testserver. I configured the HTML pages to be very basic, a title indicating which page of the project it is and links to other pages of the project. \
Example HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page 1 of App</title>
</head>
<body>

<p>This is page 1 of App</p>

<a href="http://127.0.0.1:5000/p1">Link to Page 1</a> <br>
<a href="http://127.0.0.1:5000/p2">Link to Page 2</a> <br>
<a href="http://127.0.0.1:5000/p3">Link to Page 3</a> <br>
<a href="http://127.0.0.1:5000/p4">Link to Page 4</a> <br>
<a href="http://127.0.0.1:5000/p5">Link to Page 5</a> <br>
<a href="http://127.0.0.1:5000/p6">Link to Page 6</a> <br>
<a href="http://127.0.0.1:5000/p7">Link to Page 7</a> <br>
<a href="http://127.0.0.1:5000/p8">Link to Page 8</a> <br>


</body>
</html>
```
Because every page could visit every other page, the complexity of which link to visit on every page is handled with the input json data. In the following example, on p1 we only want to navigate to p2,p3, and p4 even though we see in the above HTML that all 8 links are available.\
Example input snippet 
```json
	{
      "address":"http://127.0.0.1:5000/p1",
      "links": ["http://127.0.0.1:5000/p2", "http://127.0.0.1:5000/p3", "http://127.0.0.1:5000/p4"]
    }
```
On my personal machine, flask set up the web application on my local domain http://127.0.0.1:5000. This address will show up in the later sample input output section where I test my program. 
#### Project Design Choices
##### High Level Approach and Functions in main.js
My solution/high level approach to this problem is recursive rather than iterative as a web crawler moves through links as if they were in a tree structure. In addtion to being easier to maintain, the recursive approach allows for the program to more easily explore the tree or in this case the internet. \
The recursive function is webCrawl() which handles all the logic of whether to visit or skip a link, or if a link is invalid. \
The helper functions visitLink(), and addValidLinks() manage the processes of visiting valid links/addresses, and checking the body of that html page for links on that page to visit based on our inputjson. If there is a match, the link is pushed to the stack of sites to visit.\
The final helper function printResults() prints the results to the terminal, additional steps in the project could be made to have the output be written to a consumable file or json to be used by another application or service. 
##### Data Structures in main.js
A hashmap (hashMapLinks) was my structure of choice to hold the data from the input json file. Every address was a key and its associated value was the array of links that needed to be visited from that address. Supports O(1) lookup time to check if a given link was "valid" as an address key. \
A hashset (successLinks,skippedLinks,errorLinks) was used to hold links that were successfully visited, skipped or had an error. Supported O(1) lookup time to check if a given link was already visited to place in the skipped hashset. In addition, using a hashset prevents multiple records of a skipped link as we are only interested in which links were skipped and not how many times they were skipped. \
A stack (toVistLinks) was used to keep track of which sites were staged for the crawler to visit. Every time a site was visited, it would pop the link off and every time an unvisited valid address was found it was pushed.
##### Seperate location to hold and process input data
The input directory is used to manage data. It holds input json data and parsejson.js file to process data into consumable data for our main application. 
### Sample Input Output
Project input is located in ./input/inputdata.json
#### Example 1
Input 1 Located in inputdata.json
```json
{
  "pages": [
    {
      "address":"http://127.0.0.1:5000/p1",
      "links": ["http://127.0.0.1:5000/p2", "http://127.0.0.1:5000/p3", "http://127.0.0.1:5000/p4"]
    },
    {
      "address":"http://127.0.0.1:5000/p2",
      "links": ["http://127.0.0.1:5000/p2", "http://127.0.0.1:5000/p4"]
    },
    {
      "address":"http://127.0.0.1:5000/p4",
      "links": ["http://127.0.0.1:5000/p5", "http://127.0.0.1:5000/p1", "http://127.0.0.1:5000/p6"]
    },
    {
      "address":"http://127.0.0.1:5000/p5",
      "links": []
    },
    {
      "address":"http://127.0.0.1:5000/p6",
      "links": ["http://127.0.0.1:5000/p7", "http://127.0.0.1:5000/p4", "http://127.0.0.1:5000/p5"]
    }
  ]
}
```
Output 1 as seen in terminal
```
Succeesfully Visited Links:
{ 'http://127.0.0.1:5000/p1': true,
  'http://127.0.0.1:5000/p4': true,
  'http://127.0.0.1:5000/p6': true,
  'http://127.0.0.1:5000/p5': true,
  'http://127.0.0.1:5000/p2': true }

Skipped Links:
{ 'http://127.0.0.1:5000/p4': true,
  'http://127.0.0.1:5000/p5': true,
  'http://127.0.0.1:5000/p1': true,
  'http://127.0.0.1:5000/p2': true }

Error, Links which were not an address in input JSON:
{ 'http://127.0.0.1:5000/p7': true,
  'http://127.0.0.1:5000/p3': true }
```
#### Example 2
Input 2 
```json
{
  "pages": [
      {
      "address":"http://127.0.0.1:5000/p1",
      "links": ["http://127.0.0.1:5000/p2"]
    },
    {
      "address":"http://127.0.0.1:5000/p2",
      "links": ["http://127.0.0.1:5000/p3"]
    },
    {
      "address":"http://127.0.0.1:5000/p3",
      "links": ["http://127.0.0.1:5000/p4"]
    },
    {
      "address":"http://127.0.0.1:5000/p4",
      "links": ["http://127.0.0.1:5000/p5"]
    },
    {
      "address":"http://127.0.0.1:5000/p5",
      "links": ["http://127.0.0.1:5000/p1"]
    },
    {
      "address":"http://127.0.0.1:5000/p6",
      "links": ["http://127.0.0.1:5000/p1"]
    }
  ]
}
```
Output 2 as seen in terminal
```
Succeesfully Visited Links:
{ 'http://127.0.0.1:5000/p1': true,
  'http://127.0.0.1:5000/p2': true,
  'http://127.0.0.1:5000/p3': true,
  'http://127.0.0.1:5000/p4': true,
  'http://127.0.0.1:5000/p5': true }

Skipped Links:
{ 'http://127.0.0.1:5000/p1': true }

Error, Links which were not an address in input JSON:
{}
```
