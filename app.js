const express = require('express')
const session = require("express-session")

const app = express()
require('dotenv').config();
const userRouter = require("./routes/userRouter")
const adminRouter=require("./routes/adminRouter")
require("./config/passport");

const path = require('path');
const db = require("./config/db");
const morgan = require('morgan');
db();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000
  }
}))

app.use((req, res, next) => {
  res.set('cache-control', 'no-store');
  next();
})

app.use(morgan("dev"));

app.set('view engine', 'ejs')
app.set('views', [path.join(__dirname, 'views/user'), path.join(__dirname, 'views/admin')])
app.use(express.static(path.join(__dirname, 'public')))

app.use("/", userRouter)
app.use("/admin",adminRouter)

app.listen(process.env.PORT, () => {
  console.log(`server is running  http://localhost:${process.env.PORT}`)
});



module.exports = app;



