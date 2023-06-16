require('./config/database')
require('./config/auth.config')
const userRouter= require("./routes/user.routes")
const verificationRouter= require("./routes/verification.routes")
const express= require("express")
const bodyParser= require("body-parser")
const {authenticateToken} = require("./middlewares/authorizeToken")

const cors = require("cors")
const app=express();

var corsOptions = {
    origin: "http://localhost:8081"
  };

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine','ejs')
app.get('/', (req, res) => {
    res.render('login');
  });

app.get('/register',(req,res)=>{
    
    res.render('register')

})

app.get('/verify',(req,res,next)=>{
  res.render('verify')
  next();
})

app.get('/dashboard',(req,res,next)=>{
  const user = req.user;
  res.render('dashboard',{user:user})
  const err = new Error('Not Found');
  err.status = 404; 
  next(err);
})

app.get('/logout',(req,res)=>{
  res.render('login')
})
app.get('/initiate-reset',(req,res)=>{
    res.render('initiate-reset')
})


app.get('/reset-password/:token',(req,res)=>{
  res.render('reset-password')
})
app.use('/api/v1/users/',userRouter)
app.use('/api/v1/verify/',verificationRouter)
const PORT=process.env.PORT||8000;
app.listen(PORT,()=>{
  console.log(`server listening on port ${PORT}`);
});

