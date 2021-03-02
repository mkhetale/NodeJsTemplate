#!/bin/bash

if [ $# -lt 2 ]; then
    echo ${0} OldRoute NewRoute
    echo "to delete"
    echo ${0} delete OldRoute
    exit 0
fi


export fromnamelo=$1;
export fromnameup="$(tr '[:lower:]' '[:upper:]' <<< ${fromnamelo:0:1})${fromnamelo:1}";

export namelo=$2;
export nameup="$(tr '[:lower:]' '[:upper:]' <<< ${namelo:0:1})${namelo:1}";

echo $1 $2

if [ $1 == "delete" ]; then
  # Remove files
  rm libs/${namelo}.js
  rm controllers/${namelo}Ctlr.js
  rm models/${namelo}.js
  rm test/${namelo}.js
  exit 0
fi

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

cp validators/${fromnamelo}.json validators/${namelo}.json
sed -i -e "s/${fromnamelo}/${namelo}/g" validators/${namelo}.json
rm -f validators/${namelo}.json-e
echo "Created validators...."

cp test/${fromnamelo}.js test/${namelo}.js
sed -i -e "s/${fromnamelo}/${namelo}/g" test/${namelo}.js
rm -f test/${namelo}.js-e
echo "Created test case...."


# Adding route
echo "objApp.use('/projectname/${namelo}', require('./controllers/${namelo}Ctlr.js'));" >> router.js
echo "Route added...."
