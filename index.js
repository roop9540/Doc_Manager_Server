require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose");
const endpoints = require("./endpoints.json")
const cors = require('cors')
const passport = require('passport');
const cookieParser = require("cookie-parser");
const { register ,profile, login} = require("./routes/user/user.controller");
const { getDocuments, postDocuments, editDocument, deleteDocument } = require("./routes/document/document.controller");
const upload = require("./middleware/upload")
require("./routes/user/passport")

// const passport = require('passport');

//==================== MiddleWares ====================
const app = express();
app.use(cors());
// app.use(cookieParser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(__dirname + "/uploads"));
// console.log(__dirname + "/uploads")





app.get("/", (req, res) => {
    
        res.status(200).send("Server is running")
   
})
app.post(endpoints.user.CREATE, register)
app.post(endpoints.user.GET_BY_ID, login)
app.get(endpoints.user.VERIFY, passport.authenticate('jwt', { session: false }), profile)
app.get(endpoints.document.GET_ALL, getDocuments)
app.post(endpoints.document.CREATE, upload.single("file"), postDocuments)
app.put(endpoints.document.UPDATE, upload.single("file"), editDocument)
app.delete(endpoints.document.DELETE, deleteDocument)

// DB Connection && Starting Server
const PORT = process.env.PORT || 2100;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then((e) => {
    console.log("connect to mongodb")
}).catch((err) => {
    console.log("Error While Connection to MongoDB", err);
});


app.listen(PORT, () => {
    console.log("Connect to port" + PORT)
})
module.exports = app;