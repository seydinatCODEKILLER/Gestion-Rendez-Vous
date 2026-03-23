import cloudinary from "../config/cloudinary.js";

const uploadResults = new Map();

export const uploadMedia = async (
  file,
  folder = "hackathon/media",
  prefix = "file"
) => {
  if (!file || !file.buffer) return null;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${prefix}_${Date.now()}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });

  uploadResults.set(prefix, {
    public_id: result.public_id,
    url: result.secure_url,
  });

  return result.secure_url;
};

export const rollbackUpload = async (prefix) => {
  const uploadInfo = uploadResults.get(prefix);
  if (!uploadInfo) return;

  await cloudinary.uploader.destroy(uploadInfo.public_id, {
    resource_type: "image",
  });

  uploadResults.delete(prefix);
};

export const deleteMediaByUrl = async (url) => {
  if (!url) return;

  const publicId = url.match(/hackathon\/media\/[^\/]+(?=\.|$)/)?.[0];
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};