const package = require('../package.json');
const debug = require('debug')(`${package.name}:report`);
let User = require('../libs/user.js');
User = new User();

class Report {
  constructor() {}

  dashboard() {
    const user = User.count({
      type: 'user',
    });

    const admin = User.count({
      type: 'admin',
    });

    return new Promise((resolve, result) => {
      Promise.all([user, admin])
        .then((result) => {
          debug('From Promise All', result);

          const obj = {};
          // since the object sequence is preserverd
          [obj.user, obj.admin] = result;

          resolve(obj);
        }).catch((err) => {
          debug('From catch All', err);
          reject(err);
        });
    });
  }

  aggregate(query, schema) {
    return global.DB.aggregate(schema.schema, query);
  };

  generateQuery(json, operator, schema) {
    const querystring = [];
    const $match = {};
    const $project = {};

    $match['$match'] = {};
    $match['$match'][`$${operator}`] = [];
    $project['$project'] = {};

    const newJson = {};

    for (const q in json) {
      if (json.hasOwnProperty(q)) {
        newJson[`${q}`] = {};
        newJson[[`${q}`]]['$regex'] = `${json[q]}`;
        newJson[[`${q}`]]['$options'] = `i`;
        debug(newJson[`${q}`]);
        $match['$match'][`$${operator}`].push(newJson);
      }
    }

    debug('match', $match);
    /* Uses the data from the schema to display the data*/
    for (const data in schema.schema.obj) {
      if (schema.schema.obj.hasOwnProperty(data)) {
        $project['$project'][`${data}`] = 1;
      }
    }
    debug('match', $project);
    querystring.push($match);
    querystring.push($project);
    /* replaces the last , in the string*/
    return querystring;
  }
}
module.exports = Report;
