const config = require('./lib/config');
Object.keys(config).forEach(key => (exports[key] = config[key]));
