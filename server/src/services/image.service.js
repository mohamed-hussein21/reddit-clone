import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'node:stream';
import { env } from '../config/env.js';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret
});

export const uploadImage = (fileBuffer, folder = 'posts') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `reddit-clone/${folder}`,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId);
};