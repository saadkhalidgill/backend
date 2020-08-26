process.env.NODE_ENV = 'development';

const config = require('./config/config.js');

const sKey = require('./config/secrectKeys.ts');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const stripe = require('stripe')(sKey.stripeKey);

var firebase = require("firebase/app");

// Add the Firebase services that you want to use
require("firebase/auth");
require("firebase/firestore");

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
firebase.initializeApp(sKey.firebase);

app.post('/signup', async function (req, res) {

  const data = await firebase.auth().createUserWithEmailAndPassword(req.body.username, req.body.password).catch(function (error) {
    console.log(error);
    res.status(400).send({
      message: 'Something Went Wrong tryagain!'
   });
  })
  console.log(data)
  res.send(data)
});
app.post('/signin', async function (req, res) {

  const data = await firebase.auth().signInWithEmailAndPassword(req.body.userName, req.body.password).catch(function (error) {
    console.log(error);
    res.status(400).send({
      message: 'Incorrect User Name Or Password'
   });
    
  })
  console.log(data)
  res.send(data)
});
app.get('/signout', async function (req, res){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
})


app.get('/coupons', async function (req, res) {
  const coupons = await stripe.coupons.list({
  });
  console.log(coupons);
  res.send(coupons)
});
app.delete('/deletecoupon/:id', async function (req, res) {

  const coupons = await stripe.coupons.del(
    req.params.id
  );
  console.log(coupons);
  res.send(coupons)


});
app.post('/createcoupon', async function (req, res) {
  console.log(req.body)

  const coupons = await stripe.coupons.create({
    percent_off:  req.body.offPercentage,
    name:  req.body.name,
    duration: 'repeating',
    duration_in_months: req.body.duration,
  });
  console.log(coupons);
  res.send(coupons)

});
app.listen(process.env.PORT || 7070, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
