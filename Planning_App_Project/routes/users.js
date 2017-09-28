

//Author-Merhawi
//Citation - Developername-Ashcopenhaur
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/planapp')  //mongodb://localhost:27017/planapp');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});
// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  //console.log("mera")
//  res.json({user: req.user});
  res.json(req.user);
});

//Edit Profile
router.put('/profile/edit',passport.authenticate('jwt', {session:false}), (req, res, next) => {
  var old_UserId = req.user._id;

  var newUpdate = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  x(req.body.username);

  function x (data) {
   
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(data, salt, (err, hash) => {
        if(err) throw err;
        console.log('hash===>'+ hash);
        db.users.update({'_id': old_UserId},{$set:{'name': newUpdate.name,'email': newUpdate.email,'username': newUpdate.username,'password': hash}}, function(err, task){
          if(err){
              res.send(err);
          }
          res.json(req.user);
      });
        
      })
    })
  }



     

  });


module.exports = router;
