const passportJWT = require("passport-jwt");
const { query } = require("./dbconnection");
const config = require("../conf/config.json");
const jwt = require("jsonwebtoken");

var JwtStrategy = passportJWT.Strategy,
  ExtractJwt = passportJWT.ExtractJwt;

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.token.secret,
};

const verifyUser = async (payload, done) => {
  try {
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return done(null, false);
    }

    const user = await query(
      `SELECT ${config.memberField} FROM TB_MEMBER WHERE mid=?;`,
      [payload.mid]
    );

    if (user.length == 1) {
      return done(null, user[0]);
    } else {
      return done(null, false);
    }
  } catch (e) {
    console.log(e);

    return done(null, false);
  }
};

module.exports = {
  passportConfig: (passport) => {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    passport.use(new JwtStrategy(opts, verifyUser));
  },
  passportCreate: (jsondata) => {
    if (!config.token.expire || config.token.expire == "") {
      const token = jwt.sign(jsondata, config.token.secret);

      return token;
    } else {
      const token = jwt.sign(jsondata, config.token.secret, {
        expiresIn: config.token.expire,
      });

      return token;
    }
  },
};
