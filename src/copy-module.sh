#!/bin/bash

if [ $# -lt 2 ]; then
    echo ${0} node_modulesName moduleName
    echo "to delete"
    echo ${0} delete moduleName
    exit 0
fi


export fromnamelo=$1;
export fromnameup="$(tr '[:lower:]' '[:upper:]' <<< ${fromnamelo:0:1})${fromnamelo:1}";

export namelo=$2;
export nameup="$(tr '[:lower:]' '[:upper:]' <<< ${namelo:0:1})${namelo:1}";

echo $1 $2

if [ $1 == "delete" ]; then
  # Remove files
  rm -R modules/${namelo}
  exit 0
fi

# Add module
cp -R node_modules/${fromnamelo} modules/${namelo}

cp modules/${namelo}/test.js test/${namelo}.js

echo "Created test case...."
