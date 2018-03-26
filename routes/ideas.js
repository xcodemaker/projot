const express=require('express');
const router=express.Router(),
mongoose=require('mongoose');
const {ensureAuthenticated}=require('../helpers/auth');

// load idea  modal
require('../models/Idea');
const Idea=mongoose.model('ideas');

//Idea index page

router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        });
    })
   
});

// add ideas route
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add');
});

//edit ideas route
// add ideas route
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea=>{
        if(idea.user!=req.user.id){
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas/edit');
        }else{
            res.render('ideas/edit',{
                idea:idea
            });
        }
       
    });
   
});

//process form

router.post('',ensureAuthenticated,(req,res)=>{
    let errors =[];
    if(!req.body.title){
        errors.push({text:'Please add a title.'}); //server side validation
    }
    if(!req.body.details){
        errors.push({text:'Please add dome details.'}); //server side validation
    }
    
    if(errors.length>0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        });
    }else{
        const userNew={
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
        };
     new Idea(userNew)
     .save()
     .then(idea=>{
         req.flash('success_msg','Video idea added.');
        res.redirect('/ideas');
     });     
    }
   
    
});

//edit process form
router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea=>{
        idea.title=req.body.title;
        idea.details=req.body.details;

        idea.save()
        .then(idea=>{
            req.flash('success_msg','Video idea updated.')
            res.redirect('/ideas');
        })

    });
   
});


//delete process form
router.delete('/:id',ensureAuthenticated,(req,res)=>{
    Idea.remove({
        _id: req.params.id
    })
        .then(()=>{ 
            req.flash('success_msg','Video idea removed');
            res.redirect('/ideas');
        });

 });


module.exports=router;