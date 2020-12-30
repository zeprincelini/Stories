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
module.exports = router;