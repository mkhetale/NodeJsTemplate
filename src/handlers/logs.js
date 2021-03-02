const packageJson = require('../package.json');
const info = require('debug')('info');

/* To format date time to desired format :- 'Date=20 Feb 2013 @ 3:46 PM' */
getlogdate = () => {
  const currentTime = new Date();
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const date = 'Date =' + currentTime.getDate() + ' ' +
    month[currentTime.getMonth()] + ' ' + currentTime.getFullYear();
  let suffix = 'AM';
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();


  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (hours >= 12) {
    suffix = 'PM';
    hours = hours - 12;
  }

  if (hours === 0) {
    hours = 12;
  }

  return date + ' @ ' + hours + ':' + minutes + ' ' + suffix;
};

/* Function to format text which needs to be written in the text file */

enterErrorLog = (errorCode, source, methodName, statement, description, reference) => {
  let serverName = require('os').hostname();
  let appName = packageJson.name;


  if (errorCode === null)
    errorCode = '';
  if (source === null)
    source = '';
  if (methodName === null)
    methodName = '';
  if (statement === null)
    statement = '';
  if (description === null)
    description = '';
  if (reference === null)
    reference = '';
  if (serverName === null)
    serverName = '';
  if (appName === null)
    appName = '';


  let text = '\n\n';
  text += '** ' + getlogdate() + '\n';
  text += 'errorCode= ' + packageJson.name + '-' + errorCode + '\n';
  text += 'Server=' + serverName + '\n';
  text += 'Application=' + appName + '\n';
  text += 'Source=' + source + '\n';
  text += 'Method=' + methodName + '\n';
  text += 'Statement=' + statement + '\n';
  text += 'Description=' + description + '\n';
  text += 'Reference=' + reference + '\n';

  info(text);
};

module.exports.enterErrorLog = enterErrorLog;
