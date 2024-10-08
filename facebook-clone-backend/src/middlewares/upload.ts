import multer, {FileFilterCallback} from 'multer';
import {Request} from 'express';
import fs from 'fs';
import path from 'path';


const mediaDir = 'media/';
if(!fs.existsSync(mediaDir)){
    fs.mkdirSync(mediaDir,{recursive:true});
}
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'media/');
    },
    filename:function(req,file,cb){
        cb(null, `${Date.now()}-${file.originalname}`);
    },
    
});
//file typw filter for image files

const fileFilter = (req:Request,file:Express.Multer.File,cb:FileFilterCallback)=>{
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null,true);
    }else{
        cb(new Error('Only images are allowed'));
    }
};

//initialize the multer upload middleware

export const upload = multer({
    storage,
    limits:{fileSize:10*1024*1024},
    fileFilter,
});