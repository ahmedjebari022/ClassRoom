var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = require('../models/User');
const { info } = require('console');

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: info.message || 'Invalid credentials' 
            });
        }

        
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Login error' 
                });
            }
            
           
            return res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });
        });
    })(req, res, next); 
};
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Logout error' 
            });
        }
         req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Session destruction error' 
                });
            }
            
            res.clearCookie('classroom.sid'); 
            res.json({ 
                success: true, 
                message: 'Logged out successfully' 
            });
        });
       
    });
};
exports.getMe = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: req.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
};



exports.register = async (req, res) => {
try {
        const { firstName, lastName, email, password ,role} = req.body;
        
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role
        });
        
        await newUser.save();
        
         req.logIn(newUser, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Registration successful but login failed'
                });
            }
            
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    role: newUser.role
                }
             })
            });
        
        
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

