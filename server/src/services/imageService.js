const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const imageService = {
  // Upload image to Cloudinary
  uploadImage: (buffer, folder = 'avatars') => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `classroom/${folder}`,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
};

module.exports = imageService;