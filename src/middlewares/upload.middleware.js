import multer from "multer";

// Configuration générale pour l'upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées"), false);
  }
};

const limits = {
  fileSize: 3 * 1024 * 1024,
};

// Export d'une instance Multer réutilisable
const upload = multer({ storage, fileFilter, limits });

export default upload;
