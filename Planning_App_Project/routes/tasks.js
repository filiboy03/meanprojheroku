

//Author- Merhawi
//Citation- Developername-Ashcopenhaur 
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
var db = mongojs('mongo dbh73.mlab.com:27737/planapp -u <admin> -p <admin>');   //mongodb://localhost:27017/planapp

// Get All Tasks  
router.get('/tasks', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    var tasks = req.user.tasks;
    console.log("form node ==>"+tasks);
    res.json(tasks);
  });

// Get Single Task
router.get('/task/:id', passport.authenticate('jwt', {session:false}),function(req, res, next){
      var tasks = req.user.tasks;
      console.log("form node ==>"+tasks);
      res.json(tasks);
});

//Save Task
router.post('/task', passport.authenticate('jwt', {session:false}), function(req, res, next){
    var task = req.body;
    //console.log("id==>"+task.task_id);

    if(!task.title || !(task.isDone + '')){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
       
         var id = req.user._id;
       // console.log("==== id ==>"+id);
        db.users.update({_id: id},{$push:{tasks: {task_id: task.task_id,title: task.title,isDone: task.isDone}}}, function(err, done){
            if(err){
                res.send(err);
            }
          // console.log("==== task ==>"+ this.task);
            res.json(task);
        });
    }
});

// Delete Task
router.delete('/tasks/:id', passport.authenticate('jwt', {session:false}),function(req, res, next){
    //var id = req.params.id;
    console.log("==== from delete api==>"+  parseFloat(req.params.id.slice(1)));
      db.users.update({'tasks.task_id': parseFloat(req.params.id.slice(1))},{$pull:{'tasks':{'task_id': parseFloat(req.params.id.slice(1))}}}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

// Update Task
router.put('/tasks/:id', passport.authenticate('jwt', {session:false}),function(req, res, next){
    var task = req.body;
    var updTask = {};
    console.log("==== id ==>"+task.task_id);
    if(task.task_id){
        updTask.task_id = task.task_id;
    }
    
    if(task.isDone){
        updTask.isDone = task.isDone;
    }
    
    if(task.title){
        updTask.title = task.title;
    }
    
    if(!updTask){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        
        db.users.update({'tasks.task_id': task.task_id},{$set:{'tasks.$.isDone': updTask.isDone}}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
    }
});

module.exports = router;