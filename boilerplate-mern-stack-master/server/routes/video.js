const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");

//=================================
//             video
//=================================
let stoage = multer.diskStorage({
    destination: (req,file, cb) =>{
        cb(null ,"uploads/");
    },
    filename:(req, file, cb)=>{
        cb(null, `${Data.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) =>{
        const ext =path.extname(file.originalname)
        if(ext !== '.mp4') {
            return cb(res.status(400).end('mp4 파일만 업로드 가능합니다. '), false);
        }
        cb(null,true)
    }
});

const upload = multer({storage: storage }).single("file");

router.post('/uploadfiles', (req, res)=>{

    //비디오 서버에 저장하기
   upload(req, res, err => {
    if(err) {
        return res.json( {success: false, err})
    }
    return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
   })
})


module.exports = router;
