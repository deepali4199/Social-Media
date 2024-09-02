const multer = require("multer") ;

const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       
      cb(null, './public/images');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

      const updatefilename = uniqueSuffix + path.extname(file.originalname);

      cb(null, updatefilename );
    }
  })

  const upload = multer({ storage : storage }) 

  module.exports = upload ; 