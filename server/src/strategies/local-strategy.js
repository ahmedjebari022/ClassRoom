var passport = require('passport');
var LocalStrategy = require('passport-local');
const User = require('../models/User');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},async function verify(email,password, cb) {
    try {
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return cb(null, false, { message: 'Incorrect email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return cb(null, false, { message: 'Invalid credentials.' });
            }
            
            return cb(null, user);
            
    } catch (error) {
         return cb(error);
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await User.findById(id).select('-password');
        cb(null, user);
    } catch (err) {
        cb(err);
    }
});

module.exports = passport;