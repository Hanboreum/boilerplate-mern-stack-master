//import { response } from 'express';
const express = require('express');
const router = express.Router();


const { auth } = require("../middleware/auth");
const { duration } = require('moment');
const { Subscriber } = require("../models/Subscriber");

//=================================
//             구독자
//=================================



router.post("/subscribeNumber", (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);

        return res.status(200).json({ success: true, subscribeNumber: subscribe.length  })
    })

});

router.post("/subscribed", (req, res) => {

    Subscriber.find({ "userTo": req.body.userTo , "userFrom": req.body.userFrom })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        let result = false;
        if(subscribe.length !== 0) {
            result = true //구독하고있음
        }

        res.status(200).json({ success: true, subcribed: result  })
    })

});
router.post("/subscribe", (req, res) => {

    const subscribe = new Subscriber(req.body);

    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err })
         res.status(200).json({ success: true }) //return res
    })

});


router.post("/unSubscribe", (req, res) => {

    console.log(req.body)

    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc)=>{
            if(err) return res.status(400).json({ success: false, err});
            res.status(200).json({ success: true, doc })
        })
});



module.exports = router;
