const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('User');

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

passport.use('local-signup', new LocalStrategy((req, username, password, done) => {
  process.nextTick(() => {
    // Verify that user with that email doesn't already exist
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (user) {
        return done('It appears that email address has already been used to sign up!', null);
      }

      const newUser = new User({ username, name });

      // Generate password hash
      newUser.password = newUser.generateHash(password);

      // Save the user
      return newUser.save((newUserErr, newSavedUser) => {
        if (err) return done(err);
        return done(null, newSavedUser);
      });
    });
  });
}));


passport.use('local-login', new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validateHash(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));
