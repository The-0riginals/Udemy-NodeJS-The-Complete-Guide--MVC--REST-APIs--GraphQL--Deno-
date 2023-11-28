require('dotenv').config();

module.exports = {
    CSRF_CSRF_SECRET: 'my secret',
    // Other keys or configuration settings...
    USER_GMAIL: process.env.USER_GMAIL,
    PASS_GMAIL: process.env.PASS_GMAIL
};