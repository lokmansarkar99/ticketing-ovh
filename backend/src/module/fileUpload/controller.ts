import { NextFunction, Request, Response } from "express";
import { cloudinary, uploadToCloudinary } from "../../utils/uploader";

export const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedFile = await uploadToCloudinary(req);

    res.status(200).json({
      success: true,
      data: uploadedFile?.url,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFromCloudinary = async (req: Request, res: Response) => {
  try {
    const { key, public_id } = req.query;
    const targetKey = (public_id || key) as string;

    if (!targetKey) {
      return res.status(400).json({ success: false, message: "File URL or public_id key is required" });
    }

    const result = await cloudinary.uploader.destroy(targetKey);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

// Compatibility export
export const deleteFromS3 = deleteFromCloudinary;

export const getAllImagesFromCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "uploads/",
      max_results: 100,
    });

    const images =
      result.resources?.map((obj: any) => ({
        key: obj.public_id,
        url: obj.secure_url,
      })) || [];

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (err) {
    next(err);
  }
};

// Compatibility export
export const getAllImageFromS3 = getAllImagesFromCloudinary;
