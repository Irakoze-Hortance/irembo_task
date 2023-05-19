const multer = require("multer");

var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, './uploads');    
    }, 
    filename: function (req, file, cb) { 
       cb(null , file.originalname);   
    }
 });

 const docFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpeg|jpg|png|pdf)$/)){
        return cb(new Error('You can only upload picture file!'),false);
    }
    cb(null,true);
}

const upload = multer({ storage: storage })

module.exports={
    upload
}