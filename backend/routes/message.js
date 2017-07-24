var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var Message = require('../models/message');

module.exports = function(io){

	var count = 0;
    io.on('connection', function (socket) {
    	socket.on('messagesSeen',function(obj){
    		Message.find({sender:obj.sender,receiver:[obj.receiver],seen:false})
    		.exec(function(err,messages){
    			count = 0;
    			for(var i = 0;i<messages.length;i++){
    				(function(message,total){
    					message.seen = true;
    					message.save(function(err,result){
    						if(err){
    							console.log('err occured : ' , err);
    						}
    						else{
    							count++;
    							if(count === total){
	                    			setTimeout(function(){io.sockets.emit('readMessage'+obj.receiver)},100);  
	                    		}
    						}
    					})
    				})(messages[i],messages.length);
    			}
    		});
    	});
    });

	router.post('/', function(req, res, next) {
        var token = req.query.token;
        if(token){
            jwt.verify(req.query.token, 'secret', function (err, decoded) {
            	if(err){            		
                    return res.status(401).json({
                        title: 'Not Authenticated',
                        error: {message: 'Invalid Token!'}
                    });
            	}
            	else{
            		var message = new Message({
					    message: req.body.message,
					    sender: req.body.sender,
					    receiver: req.body.receiver,
					    type: req.body.type,
					    date: req.body.date
			        });
			        message.save(function(err, result) {
			            if (err) {
			                return res.status(500).json({
			                    title: 'An error occurred',
			                    error: err
			                });
			            }
			            setTimeout(function(){
			            	io.sockets.emit('messageSaved'+req.body.sender+'->'+req.body.receiver[0]);
			            	io.sockets.emit('hello:'+req.body.receiver[0],req.body.sender);
			            },100);
			            res.status(201).json({
			                message: 'Message saved',
			                obj: result
			            });
			        });
            	}
            })
        }
        else{
        	return res.status(401).json({
                title: 'An error occurred',
                error: {message: 'Need Authenticated Token!'}
            });
        }
	});

	router.get('/',function(req,res,next){
		var token = req.query.token;
		if(token){
			jwt.verify(req.query.token, 'secret', function (err, decoded) {
				if(err){					           		
                    return res.status(401).json({
                        title: 'Not Authenticated',
                        error: {message: 'Invalid Token!'}
                    });
				}
				Message.find({sender:decoded.user.email,receiver:{ $in : [req.query.email] }}, function(err, messages1) {
					if(err){
						return res.status(500).json({
	                        title: 'An error occurred',
	                        error: err
	                    });
					}
					var messages1 = messages1;
					Message.find({
						sender: req.query.email,
						receiver:{ $in : [decoded.user.email]}
					}, function(err, messages2) {
						if(err){
							return res.status(500).json({
		                        title: 'An error occurred',
		                        error: err
		                    });
						}
						var messages2 = messages2;
						var messages = messages1.concat(messages2);
						messages.sort(function(a, b) {
						    return a.date.getTime() - b.date.getTime();
						});
						return res.status(200).json({
	                        title: 'Success',
	                        obj: messages
	                    });
					});

				});
			});
		}
        else{
        	return res.status(401).json({
                title: 'An error occurred',
                error: {message: 'Need Authenticated Token!'}
            });
        }
	});

	router.get('/unseenMessages',function(req,res,next){
		var token = req.query.token;
		var sender = req.query.email;
		if(token){
			jwt.verify(req.query.token, 'secret', function (err, decoded) {
				if(err){
                    return res.status(401).json({
                        title: 'Not Authenticated',
                        error: {message: 'Invalid Token!'}
                    });
				}
				else{
					Message.find({sender:sender,receiver:[decoded.user.email],seen:false}).count(function(err, count){
					    console.log("Number of docs: ", count );
					    return res.status(200).json({
	                        title: 'Got Count!!',
	                        obj: {count: count}
	                    });
					});					
				}
			});
		}
	});
	
	return router;
};