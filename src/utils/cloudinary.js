import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a file
const uploadFileOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // upload in cloudinary
    const fileResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // if file uploaded remove file from server
    fs.unlinkSync(filePath);
    return fileResponse;
  } catch (error) {
    fs.unlinkSync(filePath);
    return null;
  }
};

//NOTE: assignment from tutorial
const deleteCloudinaryFile = async (url) => {
  try {
    if (!url) return;
    let resource_type = "image";
    if (url.includes("mp4")) resource_type = "video";
    const public_id = url.split("/").pop().split(".")[0].trim();

    const deletedFile = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });

    if (deletedFile.result === "not found") return false;
    return deletedFile;
  } catch (error) {
    throw error;
  }
};

export { uploadFileOnCloudinary, deleteCloudinaryFile };
