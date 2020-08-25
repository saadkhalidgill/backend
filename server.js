process.env.NODE_ENV = 'development';
const config = require('./config/config.js');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const stripe = require('stripe')('sk_test_51HJlYuJiqo2OhSfST7nhsyusFaDYjR2GDNRynMLWhxWFWwwHIFib7HQ3n2V1C5Q35vdciShfZskDNJIhYAPzSSEb00o7zi0RNx');

var firebase = require("firebase/app");

// Add the Firebase services that you want to use
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyA2h0O7BL75d3XpJMt7-IPUtH3JykI7Q_o",
  authDomain: "cloudtek-7ccc9.firebaseapp.com",
  databaseURL: "https://cloudtek-7ccc9.firebaseio.com",
  projectId: "cloudtek-7ccc9",
  storageBucket: "cloudtek-7ccc9.appspot.com",
  messagingSenderId: "750194432642",
  appId: "1:750194432642:web:5ec569adb50189da1c729b",
  measurementId: "G-DMTYQ88MHD"
};

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
firebase.initializeApp(firebaseConfig);
app.all("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  next();
});
app.post('/signup', async function (req, res) {

  const data = await firebase.auth().createUserWithEmailAndPassword(req.body.username, req.body.password).catch(function (error) {
    console.log(error);
    res.error(error)
  })
  console.log(data)
  res.send(data)
});
app.post('/signin', async function (req, res) {

  const data = await firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password).catch(function (error) {
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
app.listen(global.gConfig.node_port, function () {
  console.log(global.gConfig);
})