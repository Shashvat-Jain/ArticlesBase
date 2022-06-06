const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');
// const config = require('dotenv').config();
// const connectDB = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check Connection
db.once('open', () => {
    console.log("Connected to Mongodb");
});

// Check for DB errors
db.on('error', (err) => {
    console.log(err);
});

//database connection
// connectDB();

//Init App
const app = express();
//app.use(express.json());

const port = process.env.PORT || 3000;

//Bring in Models
let { Article } = require('./models/article')

//Load View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

//Body Parser Middleware(parse application)
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
  
      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
}));

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

//Home Route
app.get('/', (req,res) => {
    Article.find({}, (err, articles) => {
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                title:'Articles',
                articles: articles
            });
        }
    });
});

//Route Files
let articles = require("./routes/articles");
let users = require("./routes/users");
app.use('/articles',articles);
app.use('/users',users); 

app.listen(port, function(){
    console.log('server started on port 3000...')
});