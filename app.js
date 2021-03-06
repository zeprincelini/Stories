const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const connectDB = require("./config/db");
//const routes = require('./routes/index')

//load config
dotenv.config({path: "./config/config.env"});

//passport google config
require('./config/passport strategies/google.js')(passport);
require('./config/passport strategies/facebook.js')(passport);


//db
connectDB();

const app = express();
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

//hbs helpers
const {formatDate, truncate, stripTags, editIcon, select} = require('./helpers/helper');

//handlebars
app.engine('.hbs', hbs({helpers: {formatDate, truncate, stripTags, editIcon, select}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
  }))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//bodyparser middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//method-override middleware
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}));

//express set global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
});

//routes
app.use("/", require('./routes/index'));
app.use("/auth", require('./routes/auth'));
app.use("/stories", require('./routes/stories'));

//port
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`server running in ${process.env.NODE_ENV} mode on port ${port}`));