import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js'; // Adjust the path as necessary

passport.use(new GoogleStrategy({
  clientID: "951178339713-u813sl2r7vhnr6qh19a20c5qdkfm7k19.apps.googleusercontent.com", // Ensure this is defined in .env
  clientSecret: "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", // Ensure this is defined in .env
  callbackURL: "https://putko-backend.vercel.app/api/auth/google/callback"
},

async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      return done(null, user);
    }

    // Create a new user if not exists
    user = new User({
      email: profile.emails[0].value,
      name: profile.displayName,
      photo: profile._json.picture,  // Save profile picture URL
      role: 'guest', // Default role for new users
      gender: 'other' // Default gender for new users
      // password field is not used for Google OAuth users
    });
    await user.save();
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
