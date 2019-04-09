/* jshint esversion: 6 */

const express = require('express');
const request = require('request').defaults({rejectUnauthorized: false});
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//BODY-PARSER MIDDLEWARE TO ACCEPT FORM DATA
app.use(bodyParser.urlencoded({extended: true}));

// DECLARE A STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// SIGNUP ROUTE - HANDLING A POST REQUEST
app.post('/signup', (req, res) => {
  const { firstName, lastName, email} = req.body;

  // Validate form fields
  if(!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  // CONSTRUCT REQUEST DATA.
  const data = {
    members:[
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url:'https://us20.api.mailchimp.com/3.0/lists/79a01fb11f',
    method: 'POST',
    headers: {
      Authorization: 'auth cf699b319614b4be6480be949fec1aa0-us20'
    },
    body: postData
  };
  request(options, (err, response, body) => {
    if(err) {
      console.log(err);
      res.redirect('/fail.html');
    } else {
      if(response.statusCode === 200) {
        res.redirect('/success.html');
      } else {
        res.redirect('/fail.html');
      }
    }
  });
  // console.log(req.body);
  // res.send('hello');
});

app.listen(PORT, console.log(`Server started on ${PORT}`));
