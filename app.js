const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
    apiKey: "d496307f5b9a820da9105356c94489ed-us17",
    server: "us17"
});


app.post("/", function (req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;

    const subscribingUser = {
        firstName: firstname,
        lastName: lastname,
        email: email
    };
    const listId = "e01889b1ee";
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        res.sendFile(__dirname + "/success.html")
        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at port 3000")
});

// API
// d496307f5b9a820da9105356c94489ed-us17
// e01889b1ee