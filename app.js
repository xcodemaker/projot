const express=require('express'),
path=require('path');
var exphbs  = require('express-handlebars'),
methodOverride = require('method-override'),
flash=require('connect-flash'),
session=require('express-session'),
bodyParser=require('body-parser'),
mongoose=require('mongoose'),
passport=require('passport')

const app =express();

//load routes
const ideas=require('./routes/ideas');
const users=require('./routes/users');

//pasport config
require('./config/passport')(passport);
//DB config

const db=require('./config/database');

const port=process.env.PORT  || 5000;

//map global promise
mongoose.Promise=global.Promise;

//connect database

mongoose.connect(db.mongoURI,{
    //useMongoClient:true
}).then(()=> console.log('MongoDB Connected...'))
.catch(err=> console.log(err));



// handlebars middleware

app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname,'public')));

//Method override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next(); 
});




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



 

 //use routes
 app.use('/ideas',ideas);
 app.use('/users',users);

   


app.listen(port,()=>{
    console.log(`Server start on port ${port}`);
});