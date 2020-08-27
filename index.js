process.env.NODE_ENV = 'development';
const config = require('./config/config.js');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var FormData = require('form-data');
var request = require('request');
const sKey = require('./config/secrectKeys.ts');
const stripe = require('stripe')('sk_test_51HJlYuJiqo2OhSfST7nhsyusFaDYjR2GDNRynMLWhxWFWwwHIFib7HQ3n2V1C5Q35vdciShfZskDNJIhYAPzSSEb00o7zi0RNx');

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
firebase.initializeApp({
    apiKey: "AIzaSyA2h0O7BL75d3XpJMt7-IPUtH3JykI7Q_o",
    authDomain: "cloudtek-7ccc9.firebaseapp.com",
    databaseURL: "https://cloudtek-7ccc9.firebaseio.com",
    projectId: "cloudtek-7ccc9",
    storageBucket: "cloudtek-7ccc9.appspot.com",
    messagingSenderId: "750194432642",
    appId: "1:750194432642:web:5ec569adb50189da1c729b",
    measurementId: "G-DMTYQ88MHD"
});

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

app.all("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});
app.post('/signup', async (req, res) => {

    console.log('signup',req.body.userName, req.body.password)
    try{
        const data = await firebase.auth()
    .createUserWithEmailAndPassword(req.body.userName, req.body.password)}
    catch(e){
        res.json({message:'cannot fetch user data'})
            console.log(e);
            res.status(400).send({
              message: 'Something Went Wrong try again!'
           }); 
      }
    
    console.log(data)
    res.send(data)
  });

  app.post('/signin', async function (req, res) {
    console.log('signin')
  
    const data =  await firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password).catch(function (error) {
      console.log(error);
      res.status(400).send({
        message: 'Incorrect User Name Or Password'
     });
    });
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
  console.log(global.gConfig.node_port);
})