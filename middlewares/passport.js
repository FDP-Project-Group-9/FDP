const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const passport = require('passport');
const { throwError } = require('../utils/utilFunctions');



const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY



exports.passportMiddleware = (passport, next) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findUserById(jwt_payload.id)
        .then(user => {

          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(
            err=>{
                next(err);
            }
        );
    })
  );
  next();
};


exports.authenticateJWT = async (req, res, next) => {
  await new Promise((resolve, reject) => {
    passport.authenticate('jwt', (err, user) => {
      if(err){
        next(err);
      }
      if(!user){
        next({msg: "Authentication failed, User not found", status: 401});
      }
      resolve(user);
    })(req, res, next);
  });
  next();
};