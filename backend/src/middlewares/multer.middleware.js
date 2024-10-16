import multer from "multer";

// 2 types ke storage provide karta hai multer : disk storage and memory storage, iss tutorial mein disk storage use kia hai , dekho khud doosra aur padho iske baare mein !!!
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // file name unique honi chahiye , abhi ke liye simple rakhra hun !
      // cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ storage })