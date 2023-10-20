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
        if(err) return res.status(400).send(err)

        return res.status(200).json({ success: true, subscribeNumber: subscribe.length  })
    })

});


module.exports = router;
