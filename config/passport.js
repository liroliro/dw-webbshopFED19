const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load Admin model
const Admin = require("../model/Admin");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy
        ({usernameField: "employeeId"}, (employeeId, password, done) => {
            //Match admin
            Admin.findOne({
                employeeId: employeeId
            }).then(admin => {
                if (!admin) { 
                    return done(null, false, {
                        message: "This employee id is not registered"
                    });
                }

                //Match password
                bcrypt.compare(password, admin.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, admin);
                    } else {
                        return done(null, false, {
                            message: "Password incorrect"
                        });
                    }
                });
            });
            // .catch(err => console.log(err));
        })
    );

    passport.serializeUser((admin, done) => {
        done(null, admin.id);
    });

    passport.deserializeUser((id, done) => {
        Admin.findById(id, (err, admin) => {
            done(err, admin);
        });
    });

};