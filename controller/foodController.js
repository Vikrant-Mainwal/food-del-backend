import foodModel from "../model/foodModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from "streamifier";

// Upload to Cloudinary from buffer
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "food_images" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// Add food
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Image file is required" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });

    await food.save();
    res.json({ success: true, message: "Food added", data: food });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Food not added" });
  }
};

// Get food
const getFood = async (req, res) => {
  try {
    let foods = await foodModel.find({});
    res.json({
      success: true,
      data: foods,
      message: "Successfully fetched food list",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// Remove food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    if (food.image?.public_id) {
      await cloudinary.uploader.destroy(food.image.public_id);
    }

    // Delete from DB
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

export { addFood, getFood, removeFood };
