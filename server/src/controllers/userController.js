const bcrypt = require('bcrypt');
const User = require('../models/User');



exports.getProfile = async(req, res) => {

    try {
        const  userId  = req.user.id;
        
        const user = await User.findById(userId).select('-password ');
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }

}


exports.updaterProfile = async(req, res) => {
    try {
       const userId = req.user.id;
       const {firstName, lastName, email} = req.body;
       const user = await User.findById(userId);
       if(!user){
           return res.status(404).json({
               success: false,
               message: 'User not found'
           });
       }
       const updatedUser = await User.findByIdAndUpdate(userId,{
        firstName:firstName,
        lastName:lastName,
        email:email,
        },{ 
            new: true, 
            runValidators: true 
         }).select('-password');

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            
            user: updatedUser
            
        });

    } catch (error) {
       console.error('Error updating profile:', error);

       if (error.code === 11000) {
            return res.status(400).json({
            success: false,
            message: 'Email already exists'
            });
       }

      res.status(500).json({
            success: false,
            message: 'Server error'
      });
    }
}

exports.changePassword = async(req, res) => {
try {
    const userId = req.user.id;
    const {currentPassword, newPassword} = req.body;

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if(!isMatch){
        return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
        });
    }
    await User.findByIdAndUpdate(userId, {
        password:newPassword,
        updatedAt: new Date()
    });
    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
} catch (error) {
     console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
}


}


