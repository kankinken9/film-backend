const passport = require('koa-passport');
const adminAuth = require('../strategies/admin');

passport.use(adminAuth);

module.exports = passport.authenticate(['admin'], { session: false });
