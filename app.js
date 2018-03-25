const express=require('express');
var exphbs  = require('express-handlebars'),
bodyParser=require('body-parser'),
mongoose=require('mongoose');

const app =express();

const port=5000;

//map global promise
mongoose.Promise=global.Promise;

//connect database

mongoose.connect('mongodb://localhost/vidjot-dev',{
    //useMongoClient:true
}).then(()=> console.log('MongoDB Connected...'))
.catch(err=> console.log(err));

// load idea  modal
require('./models/Idea');
const Idea=mongoose.model('ideas');

// handlebars middleware

app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());




// index route
app.get('/',(req,res)=>{
    var title='welcome';
    res.render('index',{
        title:title

    });
});

// about route
app.get('/about',(req,res)=>{
    res.render('about');
});

//Idea index page

app.get('/ideas',(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        });
    })
   
});

// add ideas route
app.get('/ideas/add',(req,res)=>{
    res.render('ideas/add');
});

//process form

app.post('/ideas',(req,res)=>{
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
            details:req.body.details
        };
     new Idea(userNew)
     .save()
     .then(idea=>{
        res.redirect('/ideas');
     });     
    }
   
    
});

app.listen(port,()=>{
    console.log(`Server start on port ${port}`);
});