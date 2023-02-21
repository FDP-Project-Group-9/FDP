const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const passport = require('passport');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY

exports.passportMiddleware = (passport, next) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findUserById(jwt_payload.id)
        .then(user => {

          if (user.recordset.length > 0) {
            return done(null, user.recordset[0]);
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
  const user = await new Promise((resolve, reject) => {
    passport.authenticate('jwt', (err, user) => {
      if(err){
        next(err);
      }

      //check if there is no user for the user id extracted from jwt token
      if(!user){
        next({msg: "Authentication failed, User not found or token has expired!", status: 401});
      }
      
      resolve(user);
    })(req, res, next);
  });
  res.locals.user = user;
  next();
};