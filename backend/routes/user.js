var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var User = require('../models/user');

module.exports = function(io){
    var onlineUsers = [];
    var token = '';
    io.on('connection', function (socket) {

      socket.on('userActive',function(user){
        if(onlineUsers.indexOf(user.email)==-1){
            onlineUsers.push(user.email);
        }
      });
      socket.on('disconnect', function(){
        console.log('user disconnected ');
        console.log(onlineUsers);
        // jwt.verify(token, 'secret', function (err, decoded) {
        //     User.findOne({email: decoded.user.email}, function(err, user) {
        //         user.isOnline = false;
        //         user.save(function (err, result) {
        //             if (err) {
        //                 console.log('in error while saving');
        //             }
        //             console.log('-------------browser closed out----------------------');
        //             setTimeout(function(){io.sockets.emit('logout')},100);
        //         });
        //     })
        // });
      });
    });
    router.post('/', function (req, res, next) {
        setTimeout(function(){io.sockets.emit('saveUser')},1000);
        var user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: bcrypt.hashSync(req.body.password, 10),
            email: req.body.email
        });
        user.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(201).json({
                message: 'User created',
                obj: {
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email
                }
            });
        });
    });

    router.get('/', function (req, res, next) {

     //console.log(' in get call req : ' , req.headers['token']);
        var decoded = jwt.decode(req.query.token);
        if(!decoded){
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Invalid Token!'}
            });
        }
        User.find({}).where("email").ne(decoded.user.email).select('firstName lastName email isOnline -_id')
            .exec(function (err, users) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                setTimeout(function(){io.sockets.emit('getUserList')},1000);
                res.status(200).json({
                    message: 'Success',
                    obj: users
                });
            });
    });

    router.get('/loggedUser',function(req,res,next){
        var decoded = jwt.decode(req.query.token);
        if(!decoded){
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Invalid Token!'}
            });
        }
        User.findOne({email: decoded.user.email}, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            user.isOnline = true;
            user.save(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                setTimeout(function(){io.sockets.emit('loggedUser')},1000);
                res.status(200).json({
                    message: 'Success',
                    obj: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        isOnline: user.isOnline
                    }
                });
            });
        })
    });

    router.post('/signin', function(req, res, next) {
        User.findOne({email: req.body.email}, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!user) {
                return res.status(401).json({
                    title: 'Login failed',
                    error: {message: 'Invalid login credentials'}
                });
            }
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).json({
                    title: 'Login failed',
                    error: {message: 'Invalid login credentials'}
                });
            }
            user.isOnline = true;
            user.save(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
                console.log('-------------signed in----------------------');
                io.emit('userActive',user);
                setTimeout(function(){io.sockets.emit('signin')},100);
                res.status(200).json({
                    message: 'Successfully logged in',
                    token: token
                });
            });
        });
    });

    router.post('/logout',function(req,res,next){
        var token = req.query.token;
        jwt.verify(req.query.token, 'secret', function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    title: 'Not Authenticated',
                    error: {message: 'Invalid Token!'}
                });
            }
            User.findOne({email: decoded.user.email}, function(err, user) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                user.isOnline = false;
                user.save(function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }
                    console.log('-------------signed out----------------------');
                    setTimeout(function(){io.sockets.emit('logout')},100);
                    res.status(200).json({
                        message: 'Successfully logged out'
                    });
                });
            })
        });
    });

    router.use('/', function (req, res, next) {
        setTimeout(function(){io.sockets.emit('payload')},1000);
        var token = req.query.token;
        if(token){
            jwt.verify(req.query.token, 'secret', function (err, decoded) {
                if (err) {
                    return res.status(401).json({
                        title: 'Not Authenticated',
                        error: {message: 'Invalid Token!'}
                    });
                }
                // console.log('decodeddddddddddddddddddddddddddddddddddddddddddddd');
                // console.log(decoded.user);
                // console.log('ssssssssssssssssssssssssssssssssssssssssssssssssssssss');
            });
        }
        console.log('in extra use');
        next();
        // })
    });
    return router;
}


