const multer= require('multer')

const User = require('../models/user.model')

var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, './uploads');    
    }, 
    filename: function (req, file, cb) { 
       cb(null , file.originalname);   
    }
 });

 const docFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
        return cb(new Error('You can only upload picture file!'),false);
    }
    cb(null,true);
}

const upload = multer({ storage: storage })

createUser= async(req,res)=>{
    let body=req.body
    if(!body){
        return res.status(400).json({
            success:false,
            error:'You must provide user details',
        })
    }
    body = {...body,profilePhoto :req.files}
    
    const user=new User(body)

   await user.save()
            return res.status(201).json({
                success:true,
                user:user,
                message:'New user added ...'
            })

}