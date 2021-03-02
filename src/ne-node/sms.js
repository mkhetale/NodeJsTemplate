const config = require('../config/' + process.env.NODE_ENV + '.json');
const rp = require('request-promise');
const querystring = require('querystring');
const debug = require('debug')('projectname:ne-node:sms');

class SMS {
  send(obj) {
    let objParams = config.sms.params;
    objParams = Object.assign(objParams, obj);
    const url = config.sms.url + querystring.stringify(objParams);

    const options = {
      method: 'GET',
      uri: url,
    };

    debug('URL:', options);

    return rp(options);
  }
}

module.exports = SMS;
