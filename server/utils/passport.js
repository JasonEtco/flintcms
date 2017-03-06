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
    process.nextTick(async () => {
      const foundUser = await User.findOne({ username });
      if (foundUser) return done(null, false);

      const newUser = new User(req.body);

      newUser.password = newUser.generateHash(password);

      const savedUser = await newUser.save();
      if (!savedUser) throw new Error('Could not save the user!');
      return done(null, savedUser);
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
