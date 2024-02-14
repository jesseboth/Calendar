const http = require('http');
const path = require('path');
const fs = require('fs');
const cron = require("cron").CronJob;
const ical = require("node-ical");
const fsPromises = require('fs').promises;
const timezone = require('timezones-ical-library');

var jsonEvents1 = {};
var jsonEvents2 = {};

var jsonEventsi = 1;
var jsonEvents = jsonEvents1

var toServe;

var url = "";
var timeZone = "";
timezones = {};

// Read the manifest.json file
fs.readFile('secrets.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading secrets.json:', err);
      return;
    }
  
    try {
        // Parse the JSON data
        const secrets = JSON.parse(data);
  
        url = secrets.ical;
        timeZone = secrets.timezone;
        timezones = secrets.timezones;
        parseIcal();
        // You can use the version variable here in your server code
        // For example, you can send it as a response to an HTTP request
    } catch (error) {
      console.error('Error parsing secrets.json:', error);
    }
});

async function parseIcal(){
    // events = ical.sync.parseFile('data/cal.ical');
    if(jsonEventsi == 1){
        jsonEvents1 = {};
        jsonEvents = jsonEvents1;
        jsonEventsi = 0;
    }
    else {
        jsonEvents2 = {}
        jsonEvents = jsonEvents2;
        jsonEventsi = 1;
    }
    today = new Date()
    year_start = today.getFullYear();
    year_end =  today.getFullYear();
    month_start = today.getMonth() - 5;
    month_end = today.getMonth() + 5;

    if( month_start < 0){
        month_start+=12;
        year_start -=1;
    }
    else if(mont_end > 11){
        month_end -= 12;
        year_start += 1;
    }

    if(url != ""){
        events = await ical.async.fromURL(url);
        for (const event of Object.values(events)) {

            if(event.rrule){
                const dates = event.rrule.between(new Date(year_start, month_start, 0, 0, 0, 0, 0), new Date(year_end, month_end, 31, 0, 0, 0, 0))
                for(i = 0; i < dates.length; i++){
                    parseEvent(event, dates[i])
                }
            }
            else {
                parseEvent(event, event.start);
            }
        };
        toServe = jsonEvents
    }
}

new cron("*/10 * * * *", function () {
    parseIcal();
}, null, true);

const logEvents = require('./logEvents');
const EventEmitter = require('events');
const { formatDistanceToNow } = require('date-fns');
class Emitter extends EventEmitter { };
// initialize object 
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 8000;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    // console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const extension = path.extname(req.url);

    let contentType;

    if (req.url === '/data' && req.method === 'GET') {
        const jsonData = JSON.stringify(jsonEvents); // Your JSON data
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(jsonData);
        return;
    }

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        case '.otf':
            contentType = 'application/x-font-opentype';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function parseEvent(event, rawDate){
    if(valiDate(rawDate)){
        jsonEvent = {
            "summary": "",
            "all_day":false,
            "start": 0,
            "end": 0,
            "location": "",
            "description": undefined,
            "date": ""
        }
        jsonEvent["summary"] = event.summary;
        jsonEvent["date"] = formatDate(rawDate)[0];
        if(jsonEvent["date"] == 0){
            return;
        }
        jsonEvent["start"] = formatDate(event.start)[1];
        jsonEvent["start"] = parseInt(jsonEvent["start"]);
        jsonEvent["end"] = parseInt(formatDate(event.end)[1]);
        jsonEvent["location"] = event.location;
        if(event.description != undefined){
            jsonEvent["description"] = String(event.description).trimStart();
            if(jsonEvent["description"] == ""){
                jsonEvent["description"] = undefined;
            }
        }
        else{
            jsonEvent["description"] = undefined;
        }

        if(jsonEvent["start"] == jsonEvent["end"]){
            jsonEvent["start"] = '-1'
            jsonEvent["end"] = '-1'
            jsonEvent["all_day"] = true;
        }

        if(event.summary != undefined){
            console.log(jsonEvent, event.start, event.end);
            addEventToDate(jsonEvent["date"], jsonEvent);
        }
    }
}

function formatDate(inputDate) {

    //FIXME:
    if(inputDate.tz != undefined && inputDate.tz != timeZone && timezones[inputDate.tz] != timeZone){
        console.log(inputDate, inputDate.tz)
        return [0,0]
    }

    if(inputDate == undefined){
        return [0, 0]
    }
    
    const dateObj = new Date(inputDate);
    const month = dateObj.getUTCMonth() + 1; // Month is zero-based, so we add 1
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    
    // Format the time as an integer in the format HHMM
    const time = hours * 100 + minutes;
    
    // Pad single digit month, day, and minutes with leading zeros
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedTime = time < 1000 ? '0' + time : time;

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;



    var zone = inputDate.tz == "Etc/UTC" || inputDate.tz == undefined ? timeZone : inputDate.tz;
    if(timezones.hasOwnProperty(zone)){
        zone = timeZone;
    }

    var offset = 0;
    if(inputDate.tz != undefined){
        offset = parseInt(timezone.tzlib_get_offset(zone, `${year}-${formattedMonth}-${formattedDay}`, `${formattedHours}:${formattedMinutes}`))
    }

    // Return the formatted date string in the format MM/DD/YYYY and the time as an integer
    final_time = time + offset > 0 ?  time+offset : time + offset + 2400;

    return [`${formattedMonth}/${formattedDay}/${year}`, `${final_time}`];
}

// Function to add an event to a specific date
function addEventToDate(date, event) {
    // Check if the date already exists in the eventsByDate object
    if (!jsonEvents[date]) {
        // If the date doesn't exist, initialize an empty array for it
        jsonEvents[date] = [];
    }

    let insertIndex = jsonEvents[date].findIndex(item => item["start"] > event["start"]);

    // If the insertIndex is -1, it means the new item should be inserted at the end
    if (insertIndex === -1) {
        jsonEvents[date].push(event);
    } else {
    // Insert the new item at the found index
        jsonEvents[date].splice(insertIndex, 0, event);
    }

    // Add the event to the array corresponding to the date
    // jsonEvents[date].push(event);
}

function valiDate(inputDate){
    if(inputDate == undefined){
        return false;
    }

    const dateObj = new Date(inputDate);
    const todayDateObj = new Date();
    
    // Get the difference in months between the input date and today's date
    const diffMonths = (dateObj.getFullYear() - todayDateObj.getFullYear()) * 12 +
                       (dateObj.getMonth() - todayDateObj.getMonth());

    // Check if the difference is between -5 and 5 (inclusive) months
    return Math.abs(diffMonths) <= 5;
}