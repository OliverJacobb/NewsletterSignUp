const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/signup.html');
});

//post request routes for home route

app.post('/', function(req, res){
var firstName = req.body.fName;
var lastName = req.body.lName;
var email = req.body.email;

var data = {
    members: [
        {email_address: email, 
            status: 'subscribed', 
        merge_fields: {
FNAME: firstName,
LNAME: lastName
        }
    }
    ]
};

var jsonData = JSON.stringify(data);

//request for data from mailchimp API

var options = {
url: 'process.env.endpoint',
method: 'POST',
headers: {
    'Authorization': process.env.Auth
},
body: jsonData 
};

//checks if call to API was a success or error

request(options, function(error, response, body){
if (error) {
    res.sendFile(__dirname + '/failure.html');
} else {
    if (response.statusCode === 200){
res.sendFile(__dirname + '/success.html');
    } else {
        res.sendFile(__dirname + '/failure.html');
    }
}

});

});

//post request route for failure route

app.post('/failure', function(req, res) {
    res.redirect('/');
});

//checks for Heroku port status

app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on port 3000');
});


