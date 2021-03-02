const nunjucks = require('nunjucks');
const templatePath = __dirname + '/../templates/';

class Template {
  constructor() {}

  generate(template, obj) {
    return new Promise((resolve, reject) => {
      const path = `${templatePath}${template}.tpl`;
      nunjucks.render(path, obj, function(err, rendered) {
        if (err) {
          reject(err);
          return;
        }
        resolve(rendered);
      });
    });
  }
}

module.exports = Template;
