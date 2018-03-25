const express=require('express');
var exphbs  = require('express-handlebars');

const app =express();

const port=5000;

// handlebars middleware

app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');




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

app.listen(port,()=>{
    console.log(`Server start on port ${port}`);
});