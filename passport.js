// Main file for all the configurations using passport
const LocalStrategy = require('passport-local').Strategy;

function initializePassport(passport, getUserByEmail, getUserById){
    const authenticateUser = (email, password, done) => {
        const currentUser = getUserByEmail(email);
        if(currentUser === undefined) {
            done(null, false, { message: 'Given user not exists' });
        } else if(currentUser.password == password){
            done(null, currentUser);
        }else{
            done(null, false, { message: 'Username and Password incorrect'});
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
}

module.exports = initializePassport;