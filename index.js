var express = require('express');
var app = express();
var csvtojson = require('csvtojson');
var http = require('https');
var fs = require('fs');
var unzip = require("unzip");
app.set('port', (process.env.PORT || 7000));
app.use(express.static(__dirname + '/public'));
var test = false;
var prepareURL = function (selectedDate) {
    var formattedDate = "";
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    formattedDate = selectedDate.getDate() < 10 ? "0" + selectedDate.getDate() : selectedDate.getDate();
    formattedDate += months[selectedDate.getMonth()];
    formattedDate += selectedDate.getFullYear();
    return "https://www.nseindia.com/content/historical/EQUITIES/" + selectedDate.getFullYear() + "/" + months[selectedDate.getMonth()] + "/cm" + formattedDate + "bhav.csv.zip";
};
var getFormattedDate = function (selectedDate) {
    var formattedDate = "";
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    formattedDate = selectedDate.getDate() < 10 ? "0" + selectedDate.getDate() : selectedDate.getDate();
    formattedDate += months[selectedDate.getMonth()];
    formattedDate += selectedDate.getFullYear();
    return formattedDate;
};
app.listen(app.get('port'), function () {
    console.log("Node is running at localhost:" + app.get('port'));
})

app.get('/api/:date', function (req, res) {
    var date = req.params['date'];
    console.log(req.params);
    var rows = [];
    var formattedDate = getFormattedDate(new Date(date));
    var ifFileExists = fs.existsSync(formattedDate + '.csv');
    if (ifFileExists) {
        csvtojson()
        .fromFile(formattedDate + ".csv")
        .on('json', function (data) {
            rows.push(data);
        })
        .on('done', function () {
            res.json(rows.slice(0, 10));
            console.log('File Found!');
        });
    } else {
        var url = prepareURL(new Date(date));
        var file = fs.createWriteStream(formattedDate + ".zip");
        var request = http.request(url);
        request.setHeader('Content-Type', 'text/zip');
        request.setHeader('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/12.0');
        request.end();
        request.once('response', function (response) {
            response.pipe(file).on('close', function () {
                fs.createReadStream(formattedDate + '.zip')
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
                entry.pipe(fs.createWriteStream(formattedDate + '.csv'));
                entry.autodrain();
            })
            .on('close', function () {
                csvtojson()
                .fromFile(formattedDate + ".csv")
                .on('json', function (data) {
                    rows.push(data);
                })
                .on('done', function () {
                    res.json(rows.slice(0, 10));
                    console.log('end');
                });
            });
            });
        });
    }
});
