const crypto = require('crypto');
const Validator = require('validatorjs');
const debug = require('debug')('projectname:handlers');

hash = (text) => {
  const shasum = crypto.createHash('md5');
  shasum.update(text);
  const d = shasum.digest('hex');
  return d;
};

jsoncomparer = (srcValue, objValue) => {
  const obj = {};
  for (const val in srcValue) {
    if (objValue.hasOwnProperty(val)) {
      obj[val] = objValue[val];
    }
  }
  return obj;
};


matcher = (patt, url) => {
  debug('patt ', patt, ' url: ', url);
  // convert the string to an array
  // split it using forward slash
  if (patt === '*' && patt !== '')
    return true;

  pattArr = patt.split('/');
  urlArr = url.split('/');

  debug('patternLength', pattArr.length);
  debug('urlLength', urlArr.length);
  // Check if the lenth is equal
  // else its does not match
  if (pattArr.length === urlArr.length) {
    // Loop through the pattern array
    // and match each item in the url
    for (let i = 0; i < pattArr.length; i++) {
      // skip the match if its a *
      if (pattArr[i] === '*') continue;
      if (pattArr[i] === urlArr[i]) continue;

      debug('pattern', pattArr[i]);
      debug('url', urlArr[i]);

      return false;
    }
    return true;
  }
  return false;
};

validate = (json, validatorJson, required) => {
  /* Regex Patter to Remove Everything that Follows Required*/
  const pat = /\brequired(\||)/gi;
  const validateJson = validatorJson;
  if (!required) {
    /* Loop Through Json And Remove Required*/
    Object.keys(validateJson).forEach(function(key) {
      validateJson[key] = validateJson[key].replace(pat, '');
      if (validateJson[key] === '') {
        delete validateJson[key];
      }
    });
  }

  let err;
  const validation = new Validator(json, validateJson);
  if (validation.fails()) {
    debug('Error From Validator string', validation.errors.all());

    const errors = validation.errors.all();
    let data = '';

    Object.keys(errors).forEach(function(key) {
      data = data + errors[key][0];
    });
    err = data;
  }

  return err;
};

format = (query) => {
  if (query.password) {
    query.password = hash(query.password);
  }
  if (query.type) {
    query.type = query.type.toLowerCase();
  }
  if (query.emailId) {
    query.emailId = query.emailId.toLowerCase();
  }
  if (query.userId) {
    query.userId = query.userId.toLowerCase();
  }

  return query;
};


customizer = (srcValue, objValue, key) => {
  const retObj = {
    key: key,
    srcValue: srcValue,
    objValue: objValue,
  };

  switch (key) {
    case 'password':
      {
        retObj.srcValue = hash(retObj.srcValue);
      }
      break;
  }

  return retObj;
};

compareObj = (source, object, customizer) => {
  const retObj = {
    status: true,
    text: '',
  };

  for (const prop in source) {
    if (source.hasOwnProperty(prop)) {
      custObj = customizer(source[prop], object[prop], prop);
      // currently checks only the following types
      // string,number,bool,date
      // Need to check arrays and object
      if (custObj.srcValue !== custObj.objValue) {
        retObj.text += `${custObj.key}: source: ${custObj.srcValue} - object: ${custObj.objValue}`;
        retObj.status = false;
      }
    }
  }

  return retObj;
};


module.exports = {
  hash: hash,
  compareObj: compareObj,
  customizer: customizer,
  validate: validate,
  jsoncomparer: jsoncomparer,
  matcher: matcher,
  format: format,
};
