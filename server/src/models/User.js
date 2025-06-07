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
    },
    role:{
        type:String,
        enum:['student','instructor','admin'],
        
    },
    phone: {
    type: String,
    trim: true,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    location: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    
    avatar: {
        type: String, 
        default: null,
    },
    avatarPublicId: {
        type: String, 
        default: null,
    },

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
userSchema.pre(['findOneAndUpdate', 'updateOne'], async function(next) {
    try {
        // Check if password is being updated
        const update = this.getUpdate();
        
        if (update.password) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(update.password, 12);
            this.setUpdate({ ...update, password: hashedPassword });
        }
        
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