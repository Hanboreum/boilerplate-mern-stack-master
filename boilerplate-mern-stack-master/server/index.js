//import { response } from 'express';
const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const {auth} = require('./middleware/auth'); //임의 추가
const {User} = require('./models/User'); //임의추가




 const mongoose = require("mongoose");
 mongoose .connect('mongodb+srv://fullmoon0207_1:uuu11@cluster0.5jl7jc1.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp',{
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
 }) .then(() => console.log("DB connected"))
    .catch(err => console.error(err));

//const mongoose = require("mongoose");
//const connect = mongoose.connect(config.mongoURI,
  //{
   // useNewUrlParser: true, useUnifiedTopology: true 
   //, useCreateIndex: true, useFindAndModify: false
  //})
  //.then(() => console.log('MongoDB Connected...'))
  //.catch(err => console.log(err));

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video'));
app.use('/api/subscribe', require('./routes/subscribe'));

//여기부터 추가
app.get('/',(req, res)=> res.send('hello world'))
app.get('/api/hello',(req, res)=> res.send('Hello'))

app.post('/api/users/register',(req, res)=> {

const user = new User(req.body)

user.save((err, userInfo) =>{
  if (err) return res.json({success: false, err})
  return res.status(200).json({
success:true})
})
})

app.post('/api/users/login',(req,res) => {
  User.findOne({email: req.body.email}, (err, user)=>{
    if(!user) {
      return res.json({
        loginSuccess: false,
        message:'해당 이메일에 해당하는 유저가 없습니다'
      })
    }
    user.comparePassword(req.body.password, (err, isMatch)=>{

      if(!isMatch)  
       return res.json({loginSuccess: false, message:'비밀번호가 틀렸습니다'})

      //비밀번호 맞다면 토큰 생성
      user.generateToken((err,user) =>{
        if(err) return res.status(400).send(err);

        //토큰을 쿠키ㅡ 로컬 스토리지에 저장
        res.cookie("x_auth",user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})

app.get('/api/users/auth',auth,(req,res)=>{
  res.status(200).json({
    _id :req.user._id,
    isAdmin: req.user.role === 0? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.res.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res)=>{
  User.findOneAndUpdate({_id: req.user._id},
    { token: ""}
    , (err, user) =>{
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})
//여기까지 추가


//기존 부분
//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder   
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}
//기존부분


const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});