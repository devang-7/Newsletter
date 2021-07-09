const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

//To create an instance of express.
const app = express();

//To use static css files in the website.
app.use(express.static("public"));

//To use body parser.
app.use(bodyParser.urlencoded({
    extended: true
}));


//To send the index.html to the server.
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/" + "signup.html");
});

//Include functionality after sending form page.
app.post("/", function (req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    //Using Mailchimp API documentation
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    var jsonData = JSON.stringify(data);

    var options = {
        url: "https://usx.api.mailchimp.com/3.0/lists/xxxx",
        method: "POST",
        headers: {
            "Authorization": "xxx xxxx" //Your name and your API KEY
        },
        body: jsonData
    };

    //include functionality what to do with the information of signup page
    request(options, function (error, response, body) {
        if (error) {
            res.sendFile(__dirname + "/" + "failure.html");
        } else {
            if (response.statusCode == 200) {
                res.sendFile(__dirname + "/" + "success.html");
            } else {
                console.log(response.statusCode);
                res.sendFile(__dirname + "/" + "failure.html");
            }
        }

    });

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});

