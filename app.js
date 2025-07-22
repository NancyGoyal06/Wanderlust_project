const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


main()
.then(() => console.log("connection Successful"))
.catch((err) => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions ={
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));

app.get("/",(req,res) => {
    res.send("hi! i am root");
});
  
app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res, next) => {
    let { statusCode=500, message= "something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{ message });
});

app.listen(8080, () => {
    console.log("server is listening at port 8080");
});