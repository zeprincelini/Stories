const express = require('express');
const router = express.Router();
const passport = require('passport')

//auth with google
//get /auth/google
router.get("/google", passport.authenticate('google', { scope: ['profile'] }));

//google auth callback
//get auth/google/callback
router.get("/google/callback", passport.authenticate('google', {failureRedirect: '/'}),
(req, res) => {
    res.redirect("/dashboard");
});

//fb auth
router.get('/facebook', passport.authenticate('facebook'));
//auth/fb/callback
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

  //logoout
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/")
  });

module.exports = router;