const passport = require('passport');
const { USER } = require('../../models/user');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'mysecretkey';

// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts,async function(jwt_payload, done) {
    
  const user = await USER.findById(jwt_payload.id)
  console.log("payload", jwt_payload)
  try{
    console.log( "err" , "user", user)
    if (user) {
        console.log("1");
        return done(null, user);
    } else {
        console.log("2")
        return done(null, false);
        // or you could create a new account
    }
  }catch(err){
    console.log("3")
    return done(err, false);
  }
        
    
     
}));