#!/bin/bash

export namelo="appointments";
export nameup="$(tr '[:lower:]' '[:upper:]' <<< ${namelo:0:1})${namelo:1}";

export fromnamelo="user";
export fromnameup="$(tr '[:lower:]' '[:upper:]' <<< ${fromnamelo:0:1})${fromnamelo:1}";

cp libs/${fromnamelo}.js libs/${namelo}.js
sed -i -e "s/${fromnamelo}/${namelo}/g" libs/${namelo}.js
sed -i -e "s/${fromnameup}/${nameup}/g" libs/${namelo}.js
# sed -i '' does not work with other linux distributions
# MacOs by default creates a file with -e as backup
rm -f libs/${namelo}.js-e
echo "Created libs...."

cp controllers/${fromnamelo}Ctlr.js controllers/${namelo}Ctlr.js
sed -i -e "s/${fromnamelo}/${namelo}/g" controllers/${namelo}Ctlr.js
sed -i -e "s/${fromnameup}/${nameup}/g" controllers/${namelo}Ctlr.js
rm -f controllers/${namelo}Ctlr.js-e
echo "Created controller...."

cp models/${fromnamelo}.js models/${namelo}.js
sed -i -e "s/${fromnamelo}/${namelo}/g" models/${namelo}.js
rm -f models/${namelo}.js-e
echo "Created model...."


# Adding route
echo "objApp.use('/projectname/${namelo}', require('./controllers/${namelo}Ctlr.js'));" >> router.js
echo "Route added...."

# Remove files
rm libs/${namelo}.js
rm controllers/${namelo}Ctlr.js
rm models/${namelo}.js
