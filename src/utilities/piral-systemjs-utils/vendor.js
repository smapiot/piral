const vendor = require('./lib/vendor');
Object.keys(vendor).forEach(key => (exports[key] = vendor[key]));
