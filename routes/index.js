const express = require('express');
const router = express.Router();
const Story = require('../models/story');
const {ensureAuth, ensureGuest} = require('../middleware/authguard');

//login/homepage
//get /
router.get("/", ensureGuest, (req, res) => {
    res.render("login", {
        layout: 'login'
    });
});

//dashboard
//get /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
    try{
        const stories = await Story.find({user: req.user.id}).lean();
        res.render("dashboard", {
            name: req.user.displayName,
            stories
        });
    }catch(err){
        console.error(err);
        res.render("error/500")
    }
});

module.exports = router;