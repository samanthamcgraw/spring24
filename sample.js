var https = require('https');
var fs = require('fs');
var quotes = [];
quotes.push("first quote");
quotes.push("second quote");
quotes.push("third quote");
quotes.push("fourth quote");
quotes.push("fifth quote");

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt')
};

function respond(theText) {

    theResponse = {
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: theText
            },
            card: {
                type: 'Simple',
                title: 'Sample',
                subtitle: 'Spring 23',
                content: theText
            },
            shouldEndSession: 'false'
        }
    }
    return (theResponse);
}


https.createServer(options, function(req, res) {
    if (req.method == 'POST') {
        //myResponse = JSON.stringify(respond(getRandomQuote()));
        myResponse = JSON.stringify(respond("What is the magic word?"));
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            if (jsonString.length > 0) {
                message = JSON.parse(jsonString);
                console.log(message);
                //console.log("type",message.request.type);
                if (message.request.type == "IntentRequest") {
                    if (!message.request.intent.slots.word.value) {
                        myanswer = "Say somthing like the  word is thank friday";
                    } else {
                        //console.log("word",message.request.intent.word);
                        //console.log("slots",message.request.intent.slots.word.value);
                        word = message.request.intent.slots.word.value;
                        myanswer = "The word I heard was " + word;
                        if (word.toLowerCase() == "friday") {
                            myanswer = "Have a good weekend!"
                        }
                    }
                    myResponse = JSON.stringify(respond(myanswer));
                }
            }
            res.setHeader('Content-Length', myResponse.length);
            res.writeHead(200);
            res.end(myResponse);
            console.log(myResponse);

        });
    }

}).listen(3000); //Use 3000 for testing with echo, and betwwen 3001 to 3020 for testing with web page
