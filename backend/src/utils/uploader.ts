import multer from "multer";
import sharp from "sharp";
import { Request } from "express";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../config";

// Cloudinary client setup
cloudinary.config({
  cloud_name: config.cloude_name,
  api_key: config.cloude_api_key,
  api_secret: config.cloude_secret_key,
});

export { cloudinary };

// Multer memory storage configuration
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 15, // 15 MB
  },
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png, .webp files are allowed!"));
    }
  },
});

export default upload;

// Upload single image to Cloudinary
export const uploadToCloudinary = async (
  req: Request
): Promise<{ url: string; public_id: string } | null> => {
  const file = req.file as Express.Multer.File;
  const alt = req.body.alt;

  if (!file) return null;

  let imgBuffer = file.buffer;
  const bufferText = imgBuffer.toString();

  // Convert base64 data URL to binary if needed
  if (bufferText.startsWith("data:image")) {
    const base64Data = bufferText.split(";base64,")[1];
    imgBuffer = Buffer.from(base64Data, "base64");
  }

  // Validate image metadata with Sharp
  try {
    await sharp(imgBuffer).metadata();
  } catch (err: any) {
    throw new Error("Invalid or unsupported image file (metadata check failed)");
  }

  // Process & resize image before upload
  let processedBuffer: Buffer;
  try {
    processedBuffer = await sharp(imgBuffer)
      .resize(1024, 1024, { fit: "inside" })
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();
  } catch (err: any) {
    processedBuffer = await sharp(imgBuffer)
      .png()
      .resize(1024, 1024, { fit: "inside" })
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  const sanitizedName = alt?.trim()
    ? alt.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : file.originalname.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const publicId = `${sanitizedName}-${Date.now()}`;

  // Stream upload to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads",
        public_id: publicId,
        resource_type: "auto",
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    uploadStream.end(processedBuffer);
  });
};

// Legacy compatibility alias
export const uploadToS3 = uploadToCloudinary;
