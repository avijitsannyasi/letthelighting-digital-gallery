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
