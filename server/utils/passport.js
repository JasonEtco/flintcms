const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('User');

const strategyOptions = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
  failureRedirect: '/admin/login',
};

module.exports = (passport) => {
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser((id, done) => {
    User.findById(id, { password: 0 }, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy(strategyOptions, (req, username, password, done) => {
    process.nextTick(() => {
      User.findOne({ username }).then((user) => {
        if (user) return done(null, false);
        const newUser = new User();

        newUser.username = username;
        newUser.password = newUser.generateHash(password);

        return newUser.save().then(u => done(null, u));
      })
      .catch(err => new Error(err));
    });
  }));

  passport.use('local-login', new LocalStrategy(strategyOptions, (req, username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        if (!user) return done(null, false);
        if (!user.validateHash(password)) return done(null, false);
        return done(null, user);
      })
      .catch(err => new Error(err));
  }));
};
