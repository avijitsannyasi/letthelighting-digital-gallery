import { v2 as cloudinary } from "cloudinary";

let configured = false;

function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }
  return cloudinary;
}

export default getCloudinary;

export async function uploadImage(buffer, folder = "general") {
  const cld = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder: `photography-gallery/${folder}`,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId) {
  const cld = getCloudinary();
  return cld.uploader.destroy(publicId);
}

export function generateSignature(folder = "general") {
  const cld = getCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    timestamp,
    folder: `photography-gallery/${folder}`,
  };
  const signature = cld.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  return {
    signature,
    timestamp,
    folder: `photography-gallery/${folder}`,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}
