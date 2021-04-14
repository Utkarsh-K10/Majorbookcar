const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const ejs=require('ejs');
const fs = require('fs');
const path = require('path');
const multer=require('multer') ;


const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true });

// const carDetails=new mongoose.Schema({
//   name:String,
//   number:String,
//   address:String,
//   picture:String
// });
//-------------------- SET STORAGE ENGINE

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname)) ;
    }
});

const upload=multer({
  storage:storage
}).single('img');

const userSchema=new mongoose.Schema({
  name:String,
  number:String,
  email:String,
  password:String,
  address:String,
  image:{
    data:Buffer,
    contentType:String
  },
  Vehicletype:String
});

var flag=0;
// const Car=new mongoose.model("Car",carDetails);
const User=new mongoose.model("User",userSchema);
// const var1=10;
app.get("/",function(req,res){
  res.render("home");
});
app.get("/signup",function(req,res){
  res.render("signup",{val:0});
});
app.get("/login",function(req,res){
  //var val=0;
  res.render("login",{val:0});
});
app.get("/home",function(req,res){
  res.redirect("/");
});
app.get("/VehicleDetails",function(req,res){
  res.render("VehicleDetails");
});
app.get("/VehiclesDisplay",function(req,res){
  res.render("vehiclesdisplay");
});
app.get("/afterlogin",function(req,res){
  // User.findById(req.body.id,function(err,founduser){
  //   if(founduser){
  //     res.render('afterlogin');
  //   }
  //   else
  //     res.redirect('/');
  // });
  if(flag==1){
    res.render('afterlogin');
  }
  else{
    res.redirect('/');
  }
});
app.get("/aboutus",function(req,res){
  res.render('aboutus');
});
app.get("/contact",function(req,res){
  res.render("contact");
})
// app.post("/afterlogin",function(req,res){
//   res.render("login");
// });


app.post("/signup",function(req,res){

  User.findOne({email:req.body.email},function(err,founduser){
    if(founduser){
      // res.render("signup",{val:3});
      res.redirect("/");
    }
    else{
      console.log(req.body);
      const newUser=new User({
        name:req.body.fname,
        number:req.body.number,
        email:req.body.email,
        password:req.body.password
      });
      newUser.save(function(err){
        if(err){
          console.log(err);
        }
        else{
          flag=1;
          res.redirect("/afterlogin");
        }
      });
    }
  });
});
app.post("/afterlogin/dataupdated",function(req,res){
   console.log(req.body);
  upload(req,res,(err) =>{
    if(err){
      console.log(err);
    }
    else{
      // console.log(req.file);
      User.findById(req.body.id,function(err,founduser){
        if(err){
          console.log(err);
        }
        else{
          console.log(req.body);
          const newadd=req.body.add;
          flag=1;
          // if(founduser){
            founduser.address=newadd;
            founduser.save(function(){
              res.redirect('/afterlogin');
            });
          // }
          // flag=1;
          // console.log(req.body);
          // User.updateOne({address:req.body.add},function(err,req){
          //   res.redirect("/afterlogin");
          // });

        }
      });
    }
  });


});

app.post("/afterlogin",function(req,res){
  const username=req.body.email;
  const password=req.body.password;

  User.findOne({email:username},function(err, foundUser){
    if(err){
        console.log(err);
    }
    else{
      if(foundUser){
          if(foundUser.password===password){
            // alert("Successfully logged in");
            res.render("afterlogin");
          }
          else{
            // res.render("login",{val:2});
            res.redirect("/");
          }
      }
      else{
          // res.render("login",{val:1});
          res.redirect("/");
      }
    }
  });
});


app.listen(3000,function(){
  console.log("Server started at port 3000");
});
