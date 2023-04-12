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

// app.use(cookieParser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cors());
// console.log(__dirname + "/uploads")


const allowCors = fn => async (req, res) => {
    console.log("Checking Cors")
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }


// const corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   console.log("Server Less Cors")
//     res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app/");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     if (req.method == "OPTIONS") {
//       res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//       return res.status(200).json({});
//     }
  
//     next();
//   });
allowCors(register)
allowCors(login);
allowCors(profile)
allowCors(getDocuments);
allowCors(postDocuments);
allowCors(editDocument)
allowCors(deleteDocument)

app.get("/", allowCors((req, res)=>{
  res.status(200).send("Server is running")
}))

app.post(endpoints.user.CREATE, register)
app.post(endpoints.user.GET_BY_ID, login)
app.get(endpoints.user.VERIFY, passport.authenticate('jwt', { session: false }), profile)
app.get(endpoints.document.GET_ALL, getDocuments)
app.post(endpoints.document.CREATE, upload.single("file"), postDocuments)
app.put(endpoints.document.UPDATE, upload.single("file"), editDocument)
app.delete(endpoints.document.DELETE, deleteDocument)



// app.get("/",(req, res) => {
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//  (req, res) => {
//      res.status(200).send("Server is running")
   
// }})
// app.post(endpoints.user.CREATE, (req, res) => {
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//   register(req, res);
// });

// app.post(endpoints.user.CREATE,  (req, res)=>{
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//   register(req, res)} )
// app.post(endpoints.user.GET_BY_ID, (req, res)=>{
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//   login(req, res)})
// app.get(endpoints.user.VERIFY, passport.authenticate('jwt', { session: false }), (req, res)=>{
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//   profile(req, res)})
// app.get(endpoints.document.GET_ALL,(req, res)=>{
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//   getDocuments(req, res)} )
// app.post(endpoints.document.CREATE, upload.single("file"), (req, res) => {
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//   postDocuments(req, res);
// })
// app.put(endpoints.document.UPDATE, upload.single("file"),(req, res) => {
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//   editDocument(req, res);
// } )
// app.delete(endpoints.document.DELETE,(req, res) => {
//   res.header("Access-Control-Allow-Origin", "https://doc-manager-client.vercel.app");
//   deleteDocument(req, res);
// } )


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