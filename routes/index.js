
const express = require("express");
const passport = require('passport');
const app = express();
require('./user/passport')
const cookieParser = require("cookie-parser")
const endpoints = require("../endpoints.json")
const cors = require('cors');
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors());

// const userRouter = require("./user");
// const documentRouter = require("./document/document");
const { profile, register, login } = require("./user/user.controller");
const { getDocuments, postDocuments, editDocument, deleteDocument } = require("./document/document.controller");
const upload = require("../middleware/upload")

// app.use("/user", userRouter);
// app.use("/document", documentRouter )
// app.get('/profile',(req, res)=>{
//     console.log("Number")
// res.status(200).send("message")
// })
app.get(endpoints.user.Home, (req, res) => {
    try {
        res.status(200).send("Server is running")
    } catch (err) {
        res.status(404).send("Not Founsds")
    }
})
app.post(endpoints.user.CREATE, register)
app.post(endpoints.user.GET_BY_ID, login)
app.get(endpoints.user.VERIFY, passport.authenticate('jwt', { session: false }), profile)
app.get(endpoints.document.GET_ALL, getDocuments)
app.post(endpoints.document.CREATE, upload.single("file"), postDocuments)
app.put(endpoints.document.UPDATE, upload.single("file"), editDocument)
app.delete(endpoints.document.DELETE, deleteDocument)

// app.get('/profile', passport.authenticate('jwt', {session: false }), profile)


module.exports = app