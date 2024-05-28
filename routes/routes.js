const express= require('express');
const router=express.Router();
const User=require('../models/user');
const multer=require('multer');
const fs=require('fs')
const feed = require('../models/feed');


//image upload
var storage=multer.diskStorage({
 destination:function(req,file,cb) {
    cb(null,'./uploads')
 }  ,
 filename:function(req,file,cb){
    cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
 }
})

var upload=multer({
    storage:storage,
}).single("image");



// Insert a user into the database router
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });

        await user.save(); 

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

//Get all user routes


router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index.ejs', {
            title: 'home page',
            user: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get("/about",(req,res)=>{
   res.render('aboutus.ejs',{title:'ABOUT US🪴'})
})

router.get("/add",(req,res)=>{
    res.render('add_user.ejs',{title:'add user'});
});

router.get("/con",(req,res)=>{
    res.render('contact.ejs',{title:'contact us '});
});





router.post('/feed', async (req, res) => {
    try {
        const newFeed = new feed({
            name: req.body.name,
            email: req.body.email,
            text: req.body.text,
        });

        await newFeed.save(); 

        req.session.message = {
            type: 'success',
            message: "Message sent successfully! We'll get back to you soon.",
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


//Edit an user route

router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();
        if (!user) {
            req.session.message = { type: 'danger', message: 'User not found!' };
            res.redirect('/');
        } else {
            res.render('edit_user.ejs', {
                title: "Edit User",
                user: user,
            });
        }
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


//update user routes

router.post('/update/:id', upload, async (req, res) => {
    try {
        const id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        req.session.message = {
            type: 'success',
            message: 'User updated successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});






// Delete user
router.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            req.session.message = {
                type: 'danger',
                message: 'User not found!',
            };
            return res.redirect('/');
        }

        if (user.image) {
            const imagePath = `./uploads/${user.image}`;
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error('Error while deleting the file:', err);
            }
        }

        req.session.message = {
            type: 'info',
            message: 'User deleted successfully!',
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports=router;