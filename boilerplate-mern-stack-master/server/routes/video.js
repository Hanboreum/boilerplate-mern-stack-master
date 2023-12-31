//import { response } from 'express';
const express = require('express');
const router = express.Router();
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const path = require("path"); // path 모듈 추가

const { Subscriber} = require("../models/Subscriber")
const { auth } = require("../middleware/auth");
const { duration } = require('moment');
const { Video } = require("../models/Video");

//=================================
//             video// let
//=================================
var storage = multer.diskStorage({
    destination: (req,file, cb) =>{
        cb(null ,"uploads/");
    },
    filename:(req, file, cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

var upload = multer({storage: storage }).single("file");//fileFilter추가
//const


router.post('/uploadfiles', (req, res)=>{ //uploads, uploadfiles
    //비디오 서버에 저장하기
   upload(req, res, err => {
    if(err) {
        return res.json( {success: false, err})
    }
    return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
   }); //;
});

router.post("/getVideoDetail", (req, res) => {

    Video.findOne({ "_id" : req.body.videoId })
    .populate('writer')
    .exec((err, videoDetail) => { //video
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, videoDetail }) //video -> videoDetail로 수정
    })
});


router.post("/uploadVideo", (req, res) => {

    const video = new Video(req.body)

    video.save((err, video) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
            success: true 
        })
    })

});

router.post("/getSubscriptionVideos", (req, res) => {

    //자신의 아이디르 가지고 구독하는 사람 찾기
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscriberInfo)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscriberInfo.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })


        //찾은 사람들의 비디오를 가지고 옴
        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })
});


router.get("/getVideos", (req, res) => {

    //비디오를 db에서 가져와 client에 보냄
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })

});




router.post('/thumbnail', (req, res)=>{
//썸네일 생성, 러닝타임 가져오기4

let filePath =""
let fileDuration =""

//비디오정보가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata)
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });



//썸네일 생성
    ffmpeg(req.body.filePath) //비디오저장경로, filepath -> url
    .on('filenames',function( filenames) {
        console.log('will generate' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" +filenames[0]
    })
    .on('end',function () {
        console.log('스크린 샷 생성');
        return res.json({success: true, url: filePath, fileDuration: fileDuration})
    })
    .on('error', function(err) {
        console.log(err);
            return res.json({ success:false, err});
    })
    .screenshots({
        count:3,
        folder:'uploads/thumbnails',
        size:'320x240',
        filename:'thumbnail-%b.png'
    });

});


module.exports = router;
