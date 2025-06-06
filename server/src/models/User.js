const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    password:String,
    email:{
        type:String,
        required:true,
        unique:true,
    }

},{
    timestamps:true

});
userSchema.pre('save', async function(next) {
     if (!this.isModified('password')) return next();
     try {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
     } catch (error) {
        next(error);
     }

});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;