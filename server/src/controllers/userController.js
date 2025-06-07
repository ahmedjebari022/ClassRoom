const bcrypt = require('bcrypt');
const User = require('../models/User');
const imageService = require('../services/imageService');


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
       const updateData ={
        firstName,
        lastName,
        email,
        updatedAt: Date.now()
       }
       if(req.file){
        try {
            console.log('📷 Processing avatar upload...');
            
            if (user.avatarPublicId) {
            console.log('🗑️ Deleting old avatar:', user.avatarPublicId);
            await imageService.deleteImage(user.avatarPublicId);
            console.log('⬆️ Uploading new avatar...');
            const uploadResult = await imageService.uploadImage(req.file.buffer, 'avatars');
        
            console.log('✅ Avatar upload result:', uploadResult);
            
            updateData.avatar = uploadResult.secure_url;
            updateData.avatarPublicId = uploadResult.public_id;
            }
        } catch (uploadError) {
            console.error('❌ Avatar upload error:', uploadError);
            return res.status(400).json({
                success: false,
                message: 'Failed to upload avatar image'
            });
        }
       }
       const updatedUser = await User.findByIdAndUpdate(userId,
        updateData,
        { new: true, select: '-password' }
       );

        
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

exports.uploadAvatar = async(req, res) => {
 try {
    if(!req.file){
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }
    const userId = req.user.id;
    const currentUser = await User.findById(userId);

    if(!currentUser){
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    if (currentUser.avatarPublicId) {
      await imageService.deleteImage(currentUser.avatarPublicId);
    }
    const uploadResult = await imageService.uploadImage(req.file.buffer, 'avatars');
    const updatedUser = await User.findByIdAndUpdate(userId,{
        avatar: uploadResult.secure_url,
        avatarPublicId: uploadResult.public_id,
        updatedAt: Date.now()
    },
    { new: true,select: '-password' });
    return res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully',
        user: updatedUser
    });
 } catch (error) {
     console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading avatar'
    });
 }

}




