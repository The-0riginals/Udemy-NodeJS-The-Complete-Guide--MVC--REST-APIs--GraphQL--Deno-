const { CSRF_CSRF_SECRET } = require('./keys.dev');
// CSRF_CSRF_SECRET is just a string with random symbols, you can use any string you want
module.exports = {
  options: {
    getSecret: () => CSRF_CSRF_SECRET,
    //get cookie name from session middleware
    cookieName: 'csrf',
    getTokenFromRequest: (req) => {
      console.log(req);
      console.log("getTokenFromRequest:");
      if (req.body.csrfToken) { 
        return req.body.csrfToken;//this is the name of the hidden input field in the form
      }
      return req['x-csrf-token'];
    }
  }
};
//When creating your doubleCsrf, you have a few options available for configuration, the only required option is getSecret, the rest have sensible defaults (shown below).
//this is the csrf-csrfOptions.js file that helps us configure the csrf-csrf package
//https://www.npmjs.com/package/csrf-csrf