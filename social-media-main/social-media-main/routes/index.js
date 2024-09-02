var express = require('express');
var router = express.Router();

const uploads = require("../utils/multer");

const fs = require("fs");
const path = require("path")

const user = require("../models/authdataSchema");
const Post = require("../models/postSchema");

const sendmail = require("../utils/mail");

// --- passport ---

const passport = require('passport');
const LocalStrategy = require('passport-local');
const { send } = require('process');
const { error } = require('console');

passport.use(new LocalStrategy(user.authenticate()));

// ---  passport ---


// --- home ---

router.get('/', function(req, res, next) {
  res.render('index', {user : req.user});
});

// --- home ---



// --- login ---

router.get('/login', function(req, res, next) {
  res.render('login' ,{user : req.user});
});

// router.post("/loginuser" , async (req,res)=> {

//   res.render('profile');
// });



  // -- after passport 

  router.post("/loginuser" ,
  passport.authenticate("local", {
  
     successRedirect :"/profile", 
    failureRedirect :'/login', 
  })
  ,  (req,res,next)=> {

    
 
    });  

 // --- middilway ---


function isLoggedin(req,res,next){
  if (req.isAuthenticated()) {
    next();
   } else {
    res.redirect("/login")
   }

}

 // --- middilway ---



// -- after passport 



// --- login ---



// --- register ---



router.get('/register', function(req, res, next) {
  res.render('register' ,{user : req.user});
});

router.post('/regiteruser', async  function(req, res, next) {

  // after passport -----

  try {

    const {name , username , email , password } = req.body;
    await user.register({name , username , email} , password);
    res.redirect('/login');
    
   } catch (error) {
    res.send(error)
   }

// before passport---------

   
//  try {
//   const newUser = new user(req.body);
//   await newUser.save();
//   res.redirect('/login');
//  } catch (error) {
//   res.send(error)
//  }

});

// --- register ---

// --- timeline ---

router.get("/timeline" ,isLoggedin, async (req,res)=>{
try {
  res.render("timeline" ,{ user : await req.user.populate("posts")});
} catch (error) {
  res.send(error);
}} )

// --- timeline ---



// --- about ---

router.get('/about', function(req, res, next) {
  res.render('about',{user : req.user});
});

// --- about ---


//  --- logout ---

router.get("/logout" ,isLoggedin,function(req,res,next) {
req.logOut(()=>{
  res.redirect("/login")
})
})

//  --- logout ---



// --- profile ----

router.get('/profile',isLoggedin ,async function(req, res, next) {
try {
  const posts = await Post.find().populate("user");
  // console.log(posts); 


  res.render('profile', {user : req.user , posts});
} catch (error) {
  console.log(error)
}
});

// --- profile ---- 


// --- delete post ---

router.get("/delete-post/:id" , isLoggedin , async (req,res)=>{
  try {

    const deletepost = await Post.findByIdAndDelete(req.params.id);

    fs.unlinkSync(path.join(__dirname , ".." , "public" , "images" , deletepost.media)) ;

    res.redirect("/timeline");
    
  } catch (error) {
    res.send(error);
  }
});

// --- delete post ---

// --- update-post --- 

router.get("/update-post/:pid" , isLoggedin , async (req,res)=> {
try {

 const post = await Post.findById(req.params.pid);

  res.render("updatepost" , {
   post , user : req.user 
  })
  
} catch (error) {
  res.send(error);
}
});

router.post("/update-post/:pid" , isLoggedin ,async (req,res)=> {
  try {

    const newPost = await Post.findByIdAndUpdate(req.params.pid , req.body);
    await newPost.save();
    res.redirect(`/update-post/${req.params.pid}`);
    
  } catch (error) {
    res.send(error);
  }
});

router.post('/post-image/:pid' ,isLoggedin ,uploads.single('media'),async (req,res)=>{

  try {
    
    const post = await Post.findById(req.params.pid);

      fs.unlinkSync(path.join(__dirname,".." , "public" , 'images' , post.media))

    

  post.media = req.file.filename ;
    await post.save();

    res.redirect(`/update-post/${req.params.pid}`);
    
  } catch (error) {
    res.send(error);
  }

})



// --- update-post --- 


// --- updata-user ---

router.get("/update-user/:id" ,isLoggedin , function(req,res){
  
  res.render("updateuser",{user : req.user})
})

router.post("/edit/:id" ,isLoggedin , async function(req,res){
  try {

   
    const newUser = await user.findByIdAndUpdate(req.params.id,req.body);
    await newUser.save();
    res.redirect("/update-user/:id");
    
  } catch (error) {
    
  }
 
})


// --- updata-user ---


// --- reset password --- 

router.get("/reset-password/:id" ,isLoggedin , async function(req,res){
//   try {
//     await req.user.changePassword(
//         req.body.oldpassword,
//         req.body.newpassword
//     );
//     await req.user.save();
//     res.redirect("/profile");
// } catch (error) {
//     res.send(error);
// }
  res.render("resetipassword" ,{user : req.user})
})


router.post("/reset-password/:id" ,isLoggedin , async function(req,res){
  try {
    await req.user.changePassword(
      req.body.oldpassword, 
      req.body.newpassword
    )
    await req.user.save();
    res.redirect(`/update-user/${req.user._id}`)
  } catch (error) {
    res.send(error)
  }
  //   try {
  //     await req.user.changePassword(
  //         req.body.oldpassword,
  //         req.body.newpassword
  //     );
  //     await req.user.save();
  // res.redirect(`/update-user/${req.user._id}`)
  //     // res.redirect("/profile");
  // } catch (error) {
  //     res.send(error);
  // }
  })

// --- reset password --- 


// --- delete account --- 



router.get("/delete-account/:id" ,isLoggedin,async (req,res)=>{

  try {

    const deleteuser = await user.findByIdAndDelete(req.params.id);
    if (deleteuser.profileimage !== "default.jpg" ){

      fs.unlinkSync(path.join(__dirname,".." , "public" , 'images' , deleteuser.profileimage

      ));

    }

    deleteuser.posts.forEach(async (postid) => {
      const deletepost = await Post.findByIdAndDelete(postid);
      console.log(deletepost);
      fs.unlinkSync(
        path.join(__dirname , ".." ,"public" , "images" , deletepost.media

        )
      )
    })


    res.redirect("/login")
    
  } catch (error) {
    console.log(error)
  }

})


// --- delete account --- 

// --- forget password ---

router.get("/forget" ,  function(req,res){

 res.render("forget" , {user : req.user});

});

router.post("/forgetpassword" , async function(req,res){
  try {

    
        const User = await user.findOne({ email: req.body.email });

        if(User){
        
          // res.redirect(`/forget-password/${User._id}`);
          sendmail(res , req.body.email , User);

        }else{
          res.redirect("/forget")
        }
       
      
    } catch (error) {
        res.send(error);
    }
})


router.get("/forget-password/:id" , function(req,res){
  res.render("forgetpassward" , {user : req.user , id : req.params.id});
})


router.post("/forget-password/:id" , async function(req,res){
  try {
    const User = await user.findById( req.params.id);

    if (User.resetPasswordToken == 1) {
      
      await User.setPassword(req.body.password);
      User.resetPasswordToken = 0 ;
      await User.save();
      
    } else {
      res.send("Link Expired Try Again!");
    }
   
    res.redirect("/login")  
} catch (error) {
    res.send(error);
}
})

// --- forget password ---

// --- change profile image ---

router.post("/change-image/:id" ,isLoggedin, uploads.single("profileimage"), async (req,res)=>{

  // res.json(req.body);
  try {
    if (req.user.profileimage !== "default.jpg" ){

      fs.unlinkSync(path.join(__dirname,".." , "public" , 'images' , req.user.profileimage))

    }

  req.user.profileimage = req.file.filename ;
    await req.user.save();

    res.redirect(`/update-user/${req.params.id}`);
    
  } catch (error) {
    console.log(error)
  }

})

// --- change profile image ---

// --- likes --- 

router.get("/likes/:postid" ,isLoggedin, async (req,res)=>{
  try {

    const post = await Post.findById(req.params.postid);

    if(post.likes.includes(req.user._id)){
      post.likes = post.likes.filter(
        (udi)=> {
          udi != req.user.id
        });
    } else{
      post.likes.push(req.user._id);
    }

    await post.save();
    res.redirect("/profile")
    
  } catch (error) {
    res.send(error);
  }
})

// --- likes ---




// --- add post ---

router.get("/Add_Post" , isLoggedin,async  (req,res)=>{


   res.render("Addpost",{user : req.user});
    
  
})

router.post("/Add_post/", isLoggedin ,uploads.single("media"), async (req,res)=>{
  try {
    const newPost = new Post({
      title : req.body.title ,
      media : req.file.filename ,
      user : req.user._id ,
    });

    req.user.posts.push(newPost._id);

    await newPost.save();
    await req.user.save();

    res.redirect("/profile");

  } catch (error) {
    res.send(error);
  }
})

// --- add post ---


module.exports = router;