const express = require('express');
const router = express.Router();
const Story = require('../models/story');
const {ensureAuth} = require('../middleware/authguard');

//add stories route
router.get("/add", ensureAuth, (req, res) => {
    res.render("story/add");
});

//post stories route
router.post("/", ensureAuth, async (req, res) => {
    try{
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect("/dashboard");
    }catch(err){
        console.error(err);
        res.render('error/500');
    }
});

//show stories route
router.get("/", ensureAuth, async (req, res) => {
   try{
    const stories = await Story.find({status: 'Public'})
    .populate('user')
    .sort({createdAt: "desc"})
    .lean()

    res.render("story/index", {
        stories
    })

   }catch(err){
        console.error(err);
        res.render('error/500')
   }
});

//edit stories
router.get("/edit/:id", async (req, res) => {
    try{
        let story = await Story.findOne({_id : req.params.id}).lean();
    if(!story){
        res.render("error/404")
    }
    if(story.user != req.user.id){
        res.redirect("/stories")
    }else{
        res.render("story/edit", {
            story
        })
    }
    }catch(err){
        console.error(err);
        res.render('error/404')
    }
});

//update stories
router.put('/:id', async (req, res) => {
    try{
        let story = await Story.findById(req.params.id).lean();
    if(!story){
        res.redirect('error/404')
    }
    if(story.user != req.user.id){
        res.redirect("/stories")
    }else{
       await Story.findByIdAndUpdate(req.params.id, req.body, {
           new: true,
           runValidators: true
      })
      res.redirect('/dashboard')
    }
    }catch(err){
        console.error(err);
        res.render('error/500')
    }
});

//delete stories
router.delete('/:id', async (req, res) => {
    try{
        await Story.remove({_id : req.params.id});
        res.redirect('/dashboard');
    }catch(err){
        console.error(err);
        res.render('error/500')
    }
});


module.exports = router;
