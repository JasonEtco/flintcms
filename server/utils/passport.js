const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('User');

const strategyOptions = {
  usernameField: 'email',
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

  passport.use('local-signup', new LocalStrategy(strategyOptions, (req, email, password, done) => {
    process.nextTick(async () => {
      const foundUser = await User.findOne({ email });
      if (foundUser) return done(null, false);

      const newUser = new User(req.body);

      newUser.password = newUser.generateHash(password);

      const savedUser = await newUser.save();
      if (!savedUser) throw new Error('Could not save the user!');
      return done(null, savedUser);
    });
  }));

  passport.use('local-login', new LocalStrategy(strategyOptions, (req, email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) return done(null, false);
        if (user.token) return done(null, false);
        if (!user.validateHash(password)) return done(null, false);
        return done(null, user);
      })
      .catch(err => new Error(err));
  }));
};
