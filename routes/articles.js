const express = require('express');
const router = express.Router();

//Bring in Article Model
// let Article= require('../models/article');
const { Article } = require('../models/article');

//Bring in User Model
// let User = require('../models/user');
const { User } = require('../models/user');

//Add Routes
router.get('/add', ensureAuthenticated, async (req,res) => {
    res.render('add_article',{
        title:'Add Article'
    });
});

//Add Submit POST Route
router.post('/add', async (req,res) => {
    try{
    req.checkBody('title','Title is Required').notEmpty();
    // req.checkBody('author', 'Author is Required').notEmpty();
    req.checkBody('body','Body is Required').notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_article',{
            title:'Add Article',
            errors: errors
        });
    }
    
    else{
        //console.log(req.User.name)
        //console.log(user.name)
        let article = await Article.create({
            title : req.body.title,
            author : req.user._id,
            body : req.body.body
        });
        article.save();
        req.flash('success', 'Article Added');
        res.redirect('/');
    }
    }
    catch(e){
        res.send(e);
    }
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, async (req,res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article.author != req.user._id) {
            req.flash('danger', 'Not Authorized');
            return res.redirect('/');
        }
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
      } 
      catch (e) {
        res.send(e);
      }
});

//Update Submit POST Route
router.post('/edit/:id', async (req,res) => {
    try {
        const article = {
          title: req.body.title,
          author: req.body.name,
          body: req.body.body
        };
        let query = {_id: req.params.id}

        const update = await Article.update(query, article);
        if (update) {
          req.flash('success', 'Article Updated');
          res.redirect('/');
        } return;
    
      } catch (e) {
        res.send(e);
      }
});

//Delete Article with jQuery
router.delete('/:id', async (req,res) => {
    try{
        if (!req.user._id) {
          res.status(500).send();
        }
        let query = { _id: req.params.id }
        const article = await Article.findById(req.params.id);
    
        if (article.author != req.user._id) {
          res.status(500).send();
        } else {
          remove = await Article.findByIdAndRemove(query);
          if (remove) {
            res.send('Success');
          }
        };
      } 
      catch (e) {
        res.send(e);
      }
});

//Get Single Article
router.get('/:id', async (req,res) => {
    const article = await Article.findById(req.params.id);
    const user = await User.findById(article.author);
    if (user) {
      res.render('article', {
        article: article,
        author: user.name
      });
    }
});

//Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
}

// Delete Article without AJAX(Add href in article.pug)
//
// router.get('/delete/:id', function(req, res){
//     Article.findByIdAndRemove(req.params.id, function(err, article){
//       res.redirect('/');
//     });
//   });
  
module.exports = router;