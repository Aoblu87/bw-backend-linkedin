import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

export default multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "cover",
    },
  }),
}).single("cover");
