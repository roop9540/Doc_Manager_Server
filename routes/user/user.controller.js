const router = require("express").Router();
const { USER } = require("../../models/user")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const passport = require('passport');

// const cookieParser = require("cookie-parser")
// app.use(cookieParser());
// async function getRegister

 const JWT_SECRET = "mysecretkey";
 
 


async function register(req, res) {
    try {
        console.log(req.body)
        // const emailCheck = await User.findOne({ username: req.body.username })
        const emailCheck = await USER.findOne({ username: req.body.username });
        const Password = await bcrypt.hash(req.body.password, 10)

        if (emailCheck) {
            res.status(409).send("User Already registered")
        } else {
            const user = new USER({
                name: req.body.name,
                username: req.body.username,
                password: Password

            })
            const savedUser = await user.save(user);

            res.status(200).send({
                user: { user: user.name, user: user.username }
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Server Error" });

    }
}

async function login(req, res) {
   
    console.log("came")
    try {
        const emailCheck = await USER.findOne({ username: req.body.username });
        console.log(emailCheck)
        console.log({ newpasssword: req.body.password, hashedpassword: emailCheck.password })
        const validPass = await bcrypt.compare(req.body.password, emailCheck.password);
        if (!emailCheck || !validPass) {
            console.log("Data didn't match");
            return res.status(401).send("Invalid login Credentials");
        }
        // const token = jwt.sign({ username: emailCheck.username }, JWT_SECRET, { expiresIn: '24h' });

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000,
        //     // secure: process.env.NODE_ENV === 'production'
        //     sameSite: 'strict's

        //})
        // const token = jwt.sign({ username: req.body.username }, JWT_SECRET);
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     maxAge: 3600000 // 1 hour
        //   });
        const payload = {
            name: emailCheck.username,
            user: emailCheck.username,
            id: emailCheck.id

        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        console.log("logged in", token)
        return res.status(200).send({
            success: true,
            message: "logged in successfully",
            token: "Bearer "+ token
        })
        // res.send("login succesfull");

    } catch (err) {
        console.log(err);
        res.status(404).send("Data not found")
    }
}

async function profile(req, res) {
 
    // console.log("request", req.headers.authorization)

    try{
        console.log("req", req.user)
    return res.status(200).send({
        success: true,
        user: {
            id:req.user.id,
            name:req.user.name,
            username:req.user.username

        },
        token:req.headers.authorization
    })
}catch(err){
    console.log(err)
    res.status(404).send("Data not Found")
}

}

async function protected(req, res) {

    const authHeader = req.headers.authorization;
    const tokens = req.cookies.token;
    console.log(tokens, "reques header", req.headers.authorization)

    if (!authHeader) {
        return res.status(401).send('Unauthorized', res.status);
    }

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decodedToken = jwt.verify(token, secretKey);
        const username = decodedToken.username;

        // Access the protected resource
        res.send(`Hello, ${username}`);
    } catch (err) {
        console.log(err)
        res.status(401).send('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    console.log("token", token)
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const username = payload.username;
        // const getUser = await USER.findOne({username:req.body.username})
        res.send(`Hello, ${username}`);
    } catch (err) {
        console.log(err)
        res.status(401).send("Unauthorized")
    }
     }

    module.exports = { register, login, protected, profile }



