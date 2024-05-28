//import
require('dotenv').config();
const express= require('express');
const session=require('express-session');
const db=require('./db.js');

const app=express();
const PORT=process.env.PORT||3000

//middlewares

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret:'my secret key',
    saveUninitialized:true,
    resave:false,
}));

app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})


app.use(express.static("uploads"));
app.use(express.static("public"));



// set template engine
app.set('view engine', 'ejs');

//route prefix
app.use("",require('./routes/routes.js'));




app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`)
});